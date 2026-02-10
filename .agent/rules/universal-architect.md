---
trigger: always_on
---

# Universal Coding Standards

## 1. Contextual Awareness
- Always check for existing patterns in the codebase before suggesting new libraries.
- If a `package.json`, `go.mod`, `requirements.txt`, or `Cargo.toml` exists, respect the versions listed.

## 2. Logic & Clean Code
- **DRY (Don't Repeat Yourself):** If you see repetitive logic across files, suggest a utility function.
- **Error Handling:** Never provide "happy path" code only. Always include basic error handling/try-catch blocks.
- **Complexity:** Prefer readability over clever "one-liners" unless performance is critical.

## 3. Documentation & Type Safety
- If the language supports types (TS, Go, Rust, Python Type Hints), **always** use them.
- Provide docstrings for every new function added.

## 4. Interaction Style
- Be concise. Don't explain what a `for` loop is; explain *why* you chose this specific implementation.
- If a task is high-risk (e.g., deleting files, modifying `.env`), ask for confirmation first.