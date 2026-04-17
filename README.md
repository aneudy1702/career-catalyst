# Career Catalyst — Automated Mentorship Engine

> **Scaling Senior Staff mentorship through AI. Stop guessing your level. Start proving it.**

Career Catalyst is a private AI thinking partner that lives in your IDE. It doesn't just help you write code; it audits your architectural mindset, identifies the gap between your current level and the next, and generates promotion-ready evidence for every session.

---

## See the Catalyst in Action

We used Career Catalyst to audit its own installer script. Instead of just writing code, the agent identified a critical **Thinking Shift** required to move from Senior to Staff level.

*Demo screenshot intentionally omitted until the repository includes a committed image asset for this section.*

---

## The Growth Loop

The agent operates in three distinct phases designed to shift your mindset while you work.

| Phase | What happens | The Result |
| :--- | :--- | :--- |
| **1. Audit** | The agent benchmarks your prompt against the `DEFAULT_RUBRIC.md`. | A "Staff vs. Senior Staff" mindset comparison. |
| **2. Implement** | Code is delivered with observability and scale baked in. | A "Paved Path" solution approved by the agent. |
| **3. Archive** | The agent summarizes the "Thinking Shift" from the session. | A structured entry for your `GROWTH_LOG.md`. |

---

## Quick Start (The Easy Way)

The fastest way to get a Staff-level mentor in your IDE is via the one-liner installer. Open your project root in your terminal:

```bash
npx career-catalyst
```

**What this does:**

1. Installs the Career Catalyst agent files for supported editor setups.
2. Installs the `@CareerCatalyst` agent instructions.
3. Downloads `docs/GROWTH_LOG_TEMPLATE.md` for you to copy into your private growth log.

---

## Manual Installation

If you prefer to set things up yourself or are using a restricted environment:

### 1. The Agents

Copy the following files into your repository root:

- **VS Code:** `.github/agents/CareerCatalyst.agent.md` and `.github/copilot-instructions.md`
- **Cursor:** `.cursor/rules/catalyst.mdc`

### 2. The Rubrics

Ensure `docs/DEFAULT_RUBRIC.md` is present. The agent uses this as the "Source of Truth" for your career progression.

### 3. Start a Session

- **VS Code:** Open Copilot Chat and type `@CareerCatalyst [your problem]`.
- **Cursor:** Open Composer (`Cmd+I`) and the rules will apply automatically.

---

## Private Rubric Protocol (BYOR)

**Bring Your Own Rubric** — use your company's internal engineering ladder without ever committing it to version control.

1. **Create a local-only file:** Create `docs/PRIVATE_RUBRIC.md`. (This is already in `.gitignore`).
2. **Paste your ladder:** Fill it with your company's specific level definitions.
3. **Put it in context:** Open or include `docs/PRIVATE_RUBRIC.md` in your chat/session context when you start a session. When that file is in context, the Catalyst will use it as the primary rubric; otherwise it falls back to `docs/DEFAULT_RUBRIC.md`, ensuring your "Growth Log" is calibrated to your actual promotion criteria.

---

## Directory Structure

```text
career-catalyst/
├── .github/
│   ├── agents/                  # VS Code Copilot agent definition
│   └── copilot-instructions.md  # Global instructions for every chat
├── .cursor/
│   └── rules/           # Cursor-specific MDC rules
├── docs/
│   ├── DEFAULT_RUBRIC.md  # Engineer 1 → Principal framework
│   └── GROWTH_LOG.md      # Your private promotion evidence
└── bin/
    └── catalyst.js      # The NPX installer logic
```

---

## Privacy & Safety

- **Private Mentorship:** Leveling feedback stays in your IDE. It is never posted publicly to PRs.
- **Local Logs:** Your `GROWTH_LOG.md` is for you and your manager. You choose what to share.
- **Zero Surveillance:** This tool is an advocate for the engineer, not a report for the organization.

---

*Built with the philosophy that every engineer deserves a Staff-level mentor.*
