---
name: feedback-twofactor-focus
description: How to test OTP input focus advancement in jsdom without userEvent
metadata:
  type: feedback
---

For TwoFactor components, jsdom does not support real browser focus from userEvent interactions with input arrays. The working pattern is:

- Query numeric inputs via `document.querySelectorAll('input[inputmode="numeric"]')` (not by role, since they have no accessible role label)
- Fire `fireEvent.change(inputs[i], { target: { value: '3' } })` to trigger digit entry
- Assert `document.activeElement === inputs[i + 1]` for forward focus
- For backspace: ensure `inputs[i].value === ''` (default), then `fireEvent.keyDown(inputs[i], { key: 'Backspace' })`, assert `document.activeElement === inputs[i - 1]`

**Why:** `userEvent.type` does not reliably move `document.activeElement` in jsdom for this ref-based focus pattern. `fireEvent.change` triggers the React onChange which calls `refs.current[i+1]?.focus()` directly, which jsdom does track in `document.activeElement`.

**How to apply:** Whenever testing OTP / pin-code input components that use a ref array + manual `.focus()` calls.
