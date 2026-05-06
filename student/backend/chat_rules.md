# Mia Chat — Keyword Response Rules

When a student's message contains certain keywords, the backend appends a deterministic resource block to Mia's Gemini-generated reply. This guarantees critical support information always reaches the student, regardless of what Gemini chooses to say.

Detection is **case-insensitive** and runs as a substring match on the incoming user message.

---

## Rules

### 1. Crisis (highest priority)

**Trigger keywords:** `die`, `suicide`, `kill myself`, `end it all`, `not worth living`, `want to die`, `hang`

**Appended response:**

> ☎️ **Need urgent support?** If you would like to speak to someone on the telephone about a referral to the Student Counselling & Mental Health Advice Service, please call **020 7594 3224**.

---

### 2. Stress

**Trigger keywords:** `stressed`, `stress`, `overwhelmed`, `burnt out`, `burned out`, `burnout`

**Appended response:**

> 💜 Imperial's Counselling Service has guides and self-help tools that may help — [visit the counselling website](https://www.imperial.ac.uk/counselling/).

---

## Priority

If a single message matches multiple categories, **Crisis** wins — only the Crisis block is appended. Stress is only appended when no crisis keyword is found.

## Implementation

Implemented in `student/backend/routes/chat.py` via the `_match_resources()` helper, which is called after Gemini generates its reply. The block is concatenated to the reply with two newlines so Markdown renders it as a separate paragraph.

To add a new rule:
1. Add the entry here for documentation.
2. Add a matching tuple in the `RESOURCE_RULES` list in `chat.py`, in priority order (highest first).
