library(DBI)
library(RSQLite)
library(quanteda)
library(sentimentr)
library(glmnet)
library(Matrix)
library(dplyr)
library(readr)
library(stringr)

# ── Configure this path to point at mindfulness.db in your web app repo ────────
SCRIPT_DIR <- dirname(normalizePath("run_analytics.R", mustWork = FALSE))
DB_PATH    <- normalizePath(
  file.path(SCRIPT_DIR, "..", "student", "backend", "mindfulness.db"),
  mustWork = FALSE
)
SUICIDAL_THRESH <- 0.15
LABEL_ORDER     <- c("Normal", "Anxiety", "Depression", "Suicidal")

# ── Load model artifacts ───────────────────────────────────────────────────────
message("Loading model artifacts...")
model     <- readRDS(file.path(SCRIPT_DIR, "MH_model.rds"))
train_dfm <- readRDS(file.path(SCRIPT_DIR, "train_dfm.rds"))

# Recompute scaling stats from training data (were not saved separately)
train_raw <- read_csv(file.path(SCRIPT_DIR, "train_data.csv"), show_col_types = FALSE)
train_raw <- train_raw %>%
  mutate(
    word_count      = str_count(text, "\\S+"),
    sentiment_score = sentiment_by(text)$ave_sentiment
  )

train_means <- c(
  sentiment_score = mean(train_raw$sentiment_score, na.rm = TRUE),
  word_count      = mean(train_raw$word_count,      na.rm = TRUE)
)
train_sds <- c(
  sentiment_score = sd(train_raw$sentiment_score, na.rm = TRUE),
  word_count      = sd(train_raw$word_count,      na.rm = TRUE)
)
train_sds[train_sds == 0] <- 1

# ── Connect to DB ──────────────────────────────────────────────────────────────
message("Connecting to database: ", DB_PATH)
con <- dbConnect(SQLite(), DB_PATH, timeout = 30)
on.exit(dbDisconnect(con), add = TRUE)

students <- dbGetQuery(con, "SELECT id FROM students")
if (nrow(students) == 0) stop("No students found in database.")

# ── Collect one combined text per student ──────────────────────────────────────
message("Reading journal entries...")
student_data <- list()

for (sid in students$id) {
  entries <- dbGetQuery(con,
    sprintf("SELECT text, word_count FROM journal_entries WHERE student_id = %d", sid)
  )
  if (nrow(entries) == 0) {
    message(sprintf("  Student %d: no journal entries, skipping.", sid))
    next
  }
  student_data[[as.character(sid)]] <- list(
    text       = paste(entries$text, collapse = " "),
    word_count = sum(entries$word_count, na.rm = TRUE)
  )
}

if (length(student_data) == 0) stop("No students have journal entries.")

# ── Build features for all students as a batch ────────────────────────────────
# (TF-IDF requires multiple documents to compute meaningful IDF weights)
message("Computing features for ", length(student_data), " student(s)...")

all_texts <- sapply(student_data, `[[`, "text")
all_wc    <- sapply(student_data, `[[`, "word_count")
all_sent  <- sentiment_by(all_texts)$ave_sentiment

# Replicate the same preprocessing used during training
toks <- tokens(all_texts, remove_punct = TRUE) %>%
  tokens_tolower() %>%
  tokens_remove(stopwords("en")) %>%
  tokens_wordstem() %>%
  tokens_ngrams(n = 1)

inference_dfm <- dfm(toks) %>%
  dfm_tfidf() %>%
  dfm_match(featnames(train_dfm))   # align to training vocabulary

X_text <- as(inference_dfm, "dgCMatrix")

# Scale numeric features using training distribution
num_mat <- matrix(
  c(all_sent, all_wc),
  ncol = 2,
  dimnames = list(NULL, c("sentiment_score", "word_count"))
)
num_scaled <- scale(num_mat, center = train_means, scale = train_sds)

X <- cbind(X_text, Matrix(num_scaled, sparse = TRUE))

# ── Predict ────────────────────────────────────────────────────────────────────
message("Running predictions...")
prob_arr <- predict(model, newx = X, s = "lambda.min", type = "response")
prob_df  <- as.data.frame(prob_arr[, , 1])
colnames(prob_df) <- LABEL_ORDER

# ── Write risk scores to DB ────────────────────────────────────────────────────
message("Writing risk scores...")
now_utc <- format(Sys.time(), "%Y-%m-%d %H:%M:%S", tz = "UTC")

student_ids <- names(student_data)
for (i in seq_along(student_ids)) {
  sid   <- as.integer(student_ids[i])
  probs <- prob_df[i, ]

  status <- if (probs$Suicidal >= SUICIDAL_THRESH) {
    "Suicidal"
  } else {
    LABEL_ORDER[which.max(probs[c("Normal", "Anxiety", "Depression")])]
  }

  phq9_score     <- as.integer(round(27  * probs$Depression))
  gad7_score     <- as.integer(round(21  * probs$Anxiety))
  suicidal_score <- as.integer(round(100 * probs$Suicidal))

  dbExecute(con, "
    INSERT INTO risk_scores
      (student_id, phq9_score, gad7_score, suicidal_score, overall_status, computed_at)
    VALUES (?, ?, ?, ?, ?, ?)",
    params = list(sid, phq9_score, gad7_score, suicidal_score, status, now_utc)
  )

  message(sprintf("  Student %d → %s  (PHQ-9: %d, GAD-7: %d, Suicidal: %d)",
    sid, status, phq9_score, gad7_score, suicidal_score))
}

message("Done.")
