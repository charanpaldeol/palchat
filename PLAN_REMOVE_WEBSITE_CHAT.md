# Plan: Remove All Chat-Related Code from Website

This document outlines how to remove the “chat on website” feature end-to-end: frontend UI, API, schemas, and backend AI chat logic, while keeping the floating widget, feedback, and voting intact.

---

## 1. Scope

**Remove:**
- Website chat UI (AI Assistant modal, quick “Ask AI Assistant” button, chat form, chat history)
- Backend `POST /api/chat` endpoint and its handler
- Request/response schemas used only for chat
- AI agent code used only for chat (message processing, knowledge base, conversation patterns)

**Keep:**
- Floating widget and panel (Digital Sovereignty AI)
- “Submit Feedback” and “Community Vote” quick actions and their modals/APIs
- System status loading and display
- All proposal-related endpoints and `ai_agent` usage for proposals
- `UserInteraction` model and table (still used for `interaction_type="feedback"` and possible future types; only stop creating `interaction_type="chat"`)

---

## 2. Frontend: `myastosite/src/components/InteractiveSystem.astro`

### 2.1 Remove Chat Modal (HTML)
- **Lines ~88–138:** Delete the entire `#chat-modal` block (modal overlay, header “AI Assistant”, `#chat-messages` with welcome message, `#chat-form` with `#chat-input` and Send button).

### 2.2 Remove Chat Quick Action (HTML)
- **Lines ~56–62:** Delete the “Ask AI Assistant” button (`#quick-chat`) and its icon/label from the Quick Actions section. Keep “Submit Feedback” and “Community Vote”.

### 2.3 Script: Variables and DOM refs
- Remove `chatHistory = []`.
- Remove DOM refs: `chatModal`, `closeChat`, `quickChat`, `chatForm` (and any refs that exist only for chat, e.g. `chat-input`, `chat-messages` if still referenced).

### 2.4 Script: Chat-only logic
- **restoreChatHistory()** – remove function and all calls (e.g. in `showModal('chat-modal')`).
- **saveChatMessage()** – remove function and all calls.
- **Quick Chat button** – remove the `quickChat` click handler that calls `showModal('chat-modal')` and `hideModal('feedback-modal')`.
- **Feedback button** – in the `quickFeedback` handler, remove only `hideModal('chat-modal')` (keep `showModal('feedback-modal')`).
- **Close Chat** – remove the `closeChat` click handler.
- **Chat modal click-outside** – remove the `chatModal` listener that calls `hideModal('chat-modal')` when clicking the overlay.
- **showModal** – remove the branch that runs `restoreChatHistory()` when `modalId === 'chat-modal'`.
- **Chat form submit** – remove the entire `chatForm` submit handler (user message append, `fetch` to `POST ${API_BASE}/api/chat`, AI response append, `saveChatMessage`, `loadSystemStatus()` on success, error handling). Do not remove `loadSystemStatus()` from the feedback form handler.

### 2.5 What stays in InteractiveSystem.astro
- Floating widget toggle, panel, close widget, drag.
- System status section and `loadSystemStatus()`.
- “Submit Feedback” and “Community Vote” buttons and their handlers.
- Feedback modal (HTML + form submit to `/api/feedback`).
- `showResponse()`, response-messages area.
- Close feedback button and feedback modal click-outside.
- All non-chat `getElement` refs and init.

---

## 3. Backend: `backend/app/main.py`

### 3.1 Imports
- Remove `ChatMessage` from `app.schemas.requests`.
- Remove `ChatResponse` from `app.schemas.responses`.

### 3.2 Endpoint
- Remove the entire `POST /api/chat` endpoint: `@app.post("/api/chat", response_model=ChatResponse)`, `async def chat_with_ai(...)`, including `ai_agent.process_message`, `UserInteraction(..., interaction_type="chat", ...)`, and `return ChatResponse(...)`.

### 3.3 Root HTML
- In the root `HTMLResponse` template, remove the list item that links to `/api/chat` (e.g. `<li><a href="/api/chat">Chat</a></li>`).

### 3.4 Do not remove
- `ai_agent` import and usage in proposal endpoints (`create_*_proposal`, `get_proposal_statistics`, `perform_system_scan`, `get_proposal_status`, `execute_validated_proposal`, `reject_proposal`, `get_all_proposals`).

---

## 4. Backend: `backend/app/schemas/requests.py`

- Remove the **ChatMessage** Pydantic model (fields: `session_id`, `message`, `context`). Keep all other request models (FeedbackSubmission, VoteSubmission, etc.).

---

## 5. Backend: `backend/app/schemas/responses.py`

- Remove the **ChatResponse** Pydantic model (fields: `message`, `mission_alignment`, `suggested_actions`, `confidence`, `topics`, `intent`). Keep all other response models.

---

## 6. Backend: `backend/app/services/ai_agent.py`

### 6.1 Remove chat-only public API
- Remove **process_message(self, message, session_id, context)** (entire method).

### 6.2 Remove chat-only private helpers
Remove these methods (used only by `process_message` or by each other for chat):
- **_analyze_topics**
- **_determine_intent**
- **_generate_response**
- **_generate_mission_aligned_response**
- **_suggest_actions**
- **_calculate_confidence**
- **_log_interaction**

### 6.3 Remove chat-only instance data
In **__init__**, remove:
- **self.knowledge_base** (dict with digital_sovereignty, surveillance_capitalism, collective_ownership, privacy_protection).
- **self.conversation_patterns** (greeting and topic-specific reply lists).

Keep:
- `self.mission_guardian`, `self.proposal_service`.
- All proposal-related methods (e.g. `create_code_proposal`, `create_content_proposal`, `create_config_proposal`, `create_social_proposal`, `get_proposal_statistics`, `perform_system_scan`, `get_proposal_status`, `execute_validated_proposal`, `get_all_proposals`, and any helpers they use).

---

## 7. Database and other backend

- **No schema or migration changes.** `UserInteraction` stays; it is still used for feedback (and possibly other types). Only the creation of rows with `interaction_type="chat"` stops when the chat endpoint is removed.
- **config.py** – no chat-specific config to remove; leave as is unless you have chat-only keys (none found).
- **daily_scan_scheduler.py** – uses `ai_agent.perform_system_scan` only; no change needed.

---

## 8. Docs and references

- **README.md / DEPLOYMENT_INFO.md** – no explicit “chat” API docs found; optional: add a short note that the website chat feature has been removed.
- **MIGRATION_CHECKLIST.md** – contains “Create chat endpoint”; update or remove that checklist item so it doesn’t imply chat is still part of the plan.
- **Root welcome page** – already covered by removing the `/api/chat` link from the root HTML in `main.py`.

---

## 9. Order of implementation (recommended)

1. **Frontend:** Remove chat UI and JS in `InteractiveSystem.astro` (modal, button, refs, handlers, history). This stops users from opening chat or sending messages; old `/api/chat` calls will 404 after backend change.
2. **Backend:** Remove `POST /api/chat`, `ChatMessage`, `ChatResponse`, and chat usage in root HTML in `main.py` and schemas.
3. **AI agent:** Remove `process_message`, the seven private chat helpers, and `knowledge_base` + `conversation_patterns` from `ai_agent.py`.
4. **Docs:** Update MIGRATION_CHECKLIST.md (and optionally README/DEPLOYMENT_INFO) as above.

---

## 10. Verification

- Build frontend: `cd myastosite && npm run build` (no errors).
- Run backend: `cd backend && uvicorn app.main:app --reload`; open `/docs` and confirm there is no `POST /api/chat`.
- Click floating widget: “Ask AI Assistant” is gone; “Submit Feedback” and “Community Vote” still work.
- Submit feedback from the site and confirm it still hits `/api/feedback` and works.
- Run any existing tests; fix or remove tests that target `/api/chat` or chat-only AI agent methods.

After this, all code paths that implement “chat on website” are removed while the rest of the site and backend (feedback, voting, proposals, system status) remain intact.
