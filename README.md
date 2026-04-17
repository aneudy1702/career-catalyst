# Career Catalyst — Unified Engineering Mindset Platform

> **Scaling Staff-level mentorship through AI. For Software Engineers, SREs, QA Engineers, and Security practitioners.**

Career Catalyst is a private AI thinking partner that lives in your IDE. It audits your architectural mindset, identifies the gap between your current level and the next, and generates promotion-ready evidence — across repositories, across roles, over your entire career.

---

## See the Catalyst in Action

We used Career Catalyst to audit its own installer script. Instead of just writing code, the agent identified a critical **Thinking Shift** required to move from Senior to Staff level.

*Demo screenshot intentionally omitted until the repository includes a committed image asset for this section.*

---

## The Growth Loop

| Phase | What happens | The Result |
| :--- | :--- | :--- |
| **1. Audit** | The agent benchmarks your prompt against the `DEFAULT_RUBRIC.md`. | A "Staff vs. Senior Staff" mindset comparison. |
| **2. Implement** | Code is delivered with observability and scale baked in. | A "Paved Path" solution approved by the agent. |
| **3. Archive** | The agent summarizes the "Thinking Shift" from the session. | A structured entry for your `GROWTH_LOG.md`. |

---

## Quick Start — Conversational Onboarding

Run this once in any project root:

```bash
npx career-catalyst
```

The installer will:

1. Ask you where to store your **Master Growth Log** — a single file that follows you across every repository you work in.
2. Save your preference to `~/.career-catalyst/config.json` so you never have to answer this again.
3. Install the agent files into the current project.

**Your first IDE session** is the rest of the onboarding. When you open `@CareerCatalyst` in Copilot Chat, the agent will greet you:

> *"Hey, I'm your Catalyst. It looks like we're just getting started. Do you prefer feedback that's direct and challenging, or supportive and validating? You can change this anytime."*

That's it. No manual config files. No README spelunking.

---

## Private & Persistent

Your growth follows you from project to project — privately.

- **Cross-repo memory:** Your Master Growth Log and feedback style preference are stored in `~/.career-catalyst/config.json`, not inside any project. Switch repos, your context comes with you.
- **Private mentorship:** Level assessments and growth tracking stay in your IDE. Nothing is posted publicly to PRs.
- **Local logs:** Your `GROWTH_LOG.md` is for you and your manager. You control what you share.
- **Zero surveillance:** Career Catalyst is an advocate for the engineer, not a report for the organization.

---

## Multi-Role Support

Career Catalyst v2.0 is a **Technical Leadership Framework** — not just for developers.

| Role | Senior Shift |
| :--- | :--- |
| **Software Engineering** | From "feature complete" to "system health and evolution" |
| **SRE / Infrastructure** | From "fixing the incident" to "deleting the incident type" |
| **QA / Quality Engineering** | From "executing test cases" to "building quality observability the whole team owns" |
| **Networking / Security** | From "configuring rules" to "Policy as Code and Zero-Trust at the platform level" |

The agent detects your role from context and applies the right track from `docs/DEFAULT_RUBRIC.md` automatically.

---

## Scope & Caveats

### Repository-scoped agent files, global growth memory

The agent files (`.github/agents/`, `.github/copilot-instructions.md`, `.cursor/rules/`) live inside each project. The **growth memory** (`~/.career-catalyst/config.json` and your Master Growth Log) is global — it follows you everywhere.

### Alternatives for broader editor coverage

| Goal | Approach |
| :--- | :--- |
| Install the CLI globally | `npm install -g career-catalyst` — run `career-catalyst` from any project root without `npx`. |
| VS Code mentor in all workspaces | Add `.github/copilot-instructions.md` contents to **Settings → Extensions → GitHub Copilot → Chat → Code Generation: Instructions**. The agent file still needs to be present per-repo for `@CareerCatalyst` by name. |
| Cursor mentor in all projects | Paste `.cursor/rules/catalyst.mdc` into **Cursor Settings → General → Rules for AI**. |

---

## Private Rubric Protocol (BYOR)

**Bring Your Own Rubric** — use your company's internal engineering ladder without committing it to version control.

1. Create `docs/PRIVATE_RUBRIC.md` (already in `.gitignore`).
2. Paste your company's level definitions.
3. Include the file in your chat context. The Catalyst uses it as the primary rubric; otherwise falls back to `docs/DEFAULT_RUBRIC.md`.

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
│   ├── DEFAULT_RUBRIC.md        # E1 → PR framework + SRE / QA / Security tracks
│   ├── GROWTH_LOG_TEMPLATE.md   # Template installed by the CLI
│   └── GROWTH_LOG.md            # Your private log — gitignored, user-created
└── bin/
    └── catalyst.js      # The NPX installer logic
```

---

## FAQ

**Do I need to install this on every repo?**
Run `npx career-catalyst` once per project to drop the agent files (`.github/agents/`, `.github/copilot-instructions.md`, `.cursor/rules/`) into that repo. Your global config and Growth Log live in `~/.career-catalyst/` and carry over automatically — you won't be re-prompted for your preferences in the next project.

**Will my level assessments or growth notes ever appear in public PRs?**
No. Level codes, rubric grades, and Growth Log entries stay in your IDE. The agent is configured to act as a collegial Staff peer in any public-facing context — it never posts leveling feedback to PR comments.

**Can I use my company's internal engineering ladder instead of the default rubric?**
Yes. Create `docs/PRIVATE_RUBRIC.md` (already in `.gitignore`) and paste your company's level definitions. The agent automatically uses it as the primary benchmark and falls back to `docs/DEFAULT_RUBRIC.md` when the private file isn't present.

**How does the agent know which role track to apply?**
The agent infers your role from the context of your prompt (e.g., incident postmortems → SRE track, test-automation work → QA track). You can also state your role explicitly at the start of a session and it will lock to that track.

**Where is my Growth Log stored?**
By default, `~/career-catalyst/GROWTH_LOG.md`. You set the path during the conversational onboarding (`npx career-catalyst`) and it's saved to `~/.career-catalyst/config.json`. You can change it at any time by editing that config file.

**Can I change my feedback style after onboarding?**
Yes. Tell the agent directly — *"Switch to Direct mode"* or *"Switch to Supportive mode"* — and it will update for the rest of the session. To make the change permanent, edit `feedbackStyle` in `~/.career-catalyst/config.json`.

---

*Built with the philosophy that every engineer deserves a Staff-level mentor.*

