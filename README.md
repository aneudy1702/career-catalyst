# Career Catalyst — Automated Mentorship Engine

> *Scaling Senior Staff mentorship through AI. Stop guessing your level. Start proving it.*

---

## Project Vision

Career Catalyst is an AI-powered mentorship engine built for engineers who are serious about leveling up. It pairs every coding session with a Staff-level thinking partner that audits your approach, elevates your solutions, and generates promotion-ready evidence — automatically.

The core belief: **great engineers aren't just born at Staff level, they're coached there.** This project brings that coaching to every developer, at any hour, without gatekeeping.

### Guiding Principles

| Principle | What it means in practice |
|---|---|
| **Think at the next level** | Every response models Staff or above reasoning — not just "how," but "why at scale." |
| **Evidence over opinions** | Growth is measurable. Every session ends with copy-pasteable proof of your thinking shift. |
| **Rubric-driven clarity** | No mystery about what "senior" looks like. The rubric defines it; the agent holds you to it. |
| **Private by design** | Your company's internal rubrics never leave your machine. See [Private Rubric Protocol](#private-rubric-protocol-byor) below. |

---

## Getting Started

Everything below — the IDE agent, the PR reviewer, and the mindset linter — comes pre-configured. There are no build steps. Follow this path and you will be in a live session within minutes.

### ⚡ Quickstart (Recommended)

The fastest way to add Career Catalyst to any existing project is with `npx`:

```bash
npx career-catalyst install
```

This installs the agent files directly into your current project — no cloning, no forking required. You'll be prompted before any file is overwritten.

> **Privacy:** The installer only writes files to your local filesystem. It does not transmit your code, project structure, or any other data to external servers.

**Want the absolute latest (potentially unstable) features?**

```bash
npx github:aneudy1702/career-catalyst install
```

This runs directly from the `main` branch of the source repository. Suitable for early adopters — expect rough edges.

---

### Prerequisites

| Tool | Minimum version | Notes |
|---|---|---|
| [Node.js](https://nodejs.org/) | >=18.0.0 | Required for `npx career-catalyst` |
| [VS Code](https://code.visualstudio.com/) | latest stable | or use [Cursor](https://www.cursor.com/) — both are supported |
| [GitHub Copilot](https://github.com/features/copilot) | v1.200+ extension | requires an active Copilot subscription |
| Git | any recent version | to fork / clone the repo |

> **Using Cursor instead of VS Code?** Skip to [Step 4b](#step-4b--cursor-start-your-first-session) below — everything else is the same.

---

### Step 1 — Fork (or clone) the repository

**Option A — Fork (recommended for personal use)**

1. Click **Fork** in the top-right corner of this page.
2. Choose your personal GitHub account as the destination.
3. Clone your fork locally:
   ```bash
   git clone https://github.com/<your-username>/career-catalyst.git
   cd career-catalyst
   ```

**Option B — Clone directly (read-only / team evaluation)**

```bash
git clone https://github.com/aneudy1702/career-catalyst.git
cd career-catalyst
```

> **Why fork?** The Ghost PR Reviewer workflow needs `pull-requests: write` access. On your own fork, GitHub Actions has this automatically — no configuration needed. If you're evaluating from a direct clone you can still use the IDE features; the PR reviewer just won't auto-post without a fork.

---

### Step 2 — Open in VS Code

```bash
code .
```

VS Code will detect the `.vscode/extensions.json` file and immediately show a **"Do you want to install the recommended extensions?"** prompt in the bottom-right corner.

---

### Step 3 — Install recommended extensions

Click **Install** on the notification (or open the Extensions panel → *Show Recommended Extensions*). This installs:

| Extension | What it does in Career Catalyst |
|---|---|
| **GitHub Copilot** | Hosts the `@CareerCatalyst` agent |
| **GitHub Copilot Chat** | Powers the interactive audit/implement session |
| **GitLens** | Enriches blame/history context the agent sees |
| **Error Lens** | Renders mindset hints as inline "Yellow Squiggly" warnings |
| **Code Spell Checker** | Keeps documentation and comments professional |

Wait for all five to finish installing, then reload VS Code when prompted.

---

### Step 4a — VS Code: Start your first session

Career Catalyst activates **automatically** for every Copilot Chat session via `.github/copilot-instructions.md` — no `@mention` required. Just open the Copilot Chat panel and start talking.

You can also invoke the agent explicitly for a dedicated session:

1. Open the **Copilot Chat** panel (`Ctrl+Shift+I` / `Cmd+Shift+I`).
2. In the agent picker, select **`@CareerCatalyst`** (VS Code auto-discovers it from `.github/agents/CareerCatalyst.agent.md`).
3. Start with either mode:

   | Mode | What to type | What happens |
   |---|---|---|
   | **Audit** | Paste a problem statement or design brief | The agent benchmarks your thinking and surfaces the "next-level" perspective |
   | **Implement** | Ask for a solution to a concrete task | The agent delivers code with observability, scalability, and ownership notes baked in |

4. At the end of Phase 2 the agent will ask: *"Would you like to record this as a growth milestone?"* Reply **yes** (or type `/archive`) to receive a structured evidence block for your local `GROWTH_LOG.md`. Decline and nothing is recorded.

---

### Step 4b — Cursor: Start your first session

1. Open the project in Cursor (`cursor .` or **File → Open Folder**).
2. Open any file and start a **Composer** or **Chat** session.
3. The Catalyst rules load automatically from `.cursor/rules/catalyst.mdc` — no `@mention` required.
4. Describe your problem or paste your current solution and the audit → implement flow begins immediately.
5. At the end of the session the agent offers to generate a **Growth Log Summary** block. Accept to receive it; decline to skip.

---

### Step 5 — Open a Pull Request (PR Reviewer activates automatically)

When you (or any contributor) opens a PR against your fork, the **Ghost PR Reviewer** workflow fires with zero configuration:

1. GitHub Actions runs `.github/workflows/career-catalyst-review.yml`.
2. The script reads the PR diff, reasons privately against the rubric, and posts an **Architectural Peer Review** comment.
3. The comment acts as a collegial Staff-level peer — it points to architectural observations and "Paved Path" alternatives. It **never** mentions levels, grades, or rubric codes publicly.

> **No extra secrets required.** The workflow uses `GITHUB_TOKEN` (auto-provided by GitHub Actions) and GitHub Models by default. The reviewer starts working the moment you push your first PR.

---

### Step 6 (optional) — Switch to a custom AI provider

If you want to use a different model (OpenAI, Anthropic, Azure OpenAI, etc.), add these three secrets to your repository (**Settings → Secrets and variables → Actions → New repository secret**):

| Secret | Example value | Description |
|---|---|---|
| `AI_API_KEY` | `sk-...` | Your API key from the provider |
| `AI_BASE_URL` | `https://api.openai.com/v1` | Provider's OpenAI-compatible endpoint |
| `AI_MODEL` | `gpt-4o` | Model identifier |

Leave these unset and the reviewer falls back to GitHub Models (`gpt-4o-mini`) — no action needed for the default experience.

---

### Step 7 (optional) — Add your company's private rubric

Replace the default rubric with your company's internal engineering ladder:

1. Create `docs/PRIVATE_RUBRIC.md` (this filename is already in `.gitignore` — it will never be committed).
2. Copy the structure from [`docs/DEFAULT_RUBRIC.md`](docs/DEFAULT_RUBRIC.md) and fill in your company's level definitions.
3. In VS Code, open the file and include it in context with `#file:docs/PRIVATE_RUBRIC.md` in your prompt — the agent will use it as the primary benchmark.

See [Private Rubric Protocol](#private-rubric-protocol-byor) for full details.

---

## Directory Structure

```
career-catalyst/
├── bin/
│   └── catalyst.js                     # npx installer — sets up agent files in any project
├── .github/
│   ├── agents/
│   │   └── CareerCatalyst.agent.md         # VS Code Copilot agent definition (explicit @CareerCatalyst)
│   ├── copilot-instructions.md             # VS Code: auto-applies CareerCatalyst to every chat session
│   ├── scripts/
│   │   └── pr_review.py                # Ghost PR Reviewer — Stealth Mentor script
│   └── workflows/
│       └── career-catalyst-review.yml  # GitHub Action: runs on every PR
├── .cursor/
│   └── rules/
│       └── catalyst.mdc                # Cursor-specific MDC rules (alwaysApply: true)
├── .vscode/
│   └── extensions.json                 # Recommended extensions (Copilot, Error Lens, etc.)
├── docs/
│   ├── DEFAULT_RUBRIC.md               # Engineer 1 → Principal leveling rubric
│   └── GROWTH_LOG_TEMPLATE.md          # Growth milestone tracking template
├── package.json                        # npm package — enables npx career-catalyst install
└── README.md
```

---

## Private Rubric Protocol (BYOR)

> **Bring Your Own Rubric** — use your company's internal leveling framework without ever committing it to version control.

Most companies have a proprietary engineering ladder. Career Catalyst is designed to work with it — privately.

### How it works

1. **Create a local-only rubric file.** Place your internal rubric at:
   ```
   docs/PRIVATE_RUBRIC.md
   ```
   This filename is included in `.gitignore` by convention and **will never be committed**.

2. **Reference it in your session.**
   - *VS Code:* Include the file in your Copilot context by opening it before starting a session, or by using `#file:docs/PRIVATE_RUBRIC.md` in your prompt.
   - *Cursor:* Add `@docs/PRIVATE_RUBRIC.md` to your Composer context, or paste the relevant sections directly into the chat.

3. **The agent adapts.** When a private rubric is present in context, the agent uses it as the primary benchmark instead of `DEFAULT_RUBRIC.md`. All growth evidence generated during the session will be calibrated to your company's actual bar.

### What to put in your private rubric

Use `docs/DEFAULT_RUBRIC.md` as a structural template. Replace or extend the level definitions with your company's exact language — scope expectations, behavioral anchors, and promotion criteria.

> **Security note:** Never commit credentials, internal system names, or proprietary architecture diagrams. The rubric should contain leveling *criteria*, not company secrets.

---

## Leveling Rubric (Default)

See [`docs/DEFAULT_RUBRIC.md`](docs/DEFAULT_RUBRIC.md) for the full **Engineer 1 → Principal** framework (8 levels, anchored by Scope and Ambiguity Tolerance).

## Ghost PR Reviewer (Stealth Mentor)

Every time a Pull Request is opened or updated, the Career Catalyst agent automatically posts an **architectural peer-review comment** — no manual invocation needed.

**Privacy design:** The PR comment is a permanent, public record. It therefore **never** mentions engineer levels, rubric codes, or career-ladder assessments. Instead, the agent acts as a collegial Staff-level peer: it surfaces architectural observations and suggests "Paved Path" alternatives focused entirely on the code, not the author. Level coaching lives exclusively in the private IDE session.

See [`.github/workflows/career-catalyst-review.yml`](.github/workflows/career-catalyst-review.yml) for setup. The workflow uses GitHub Models by default (no extra secrets needed in most GitHub repositories). To use a custom AI provider, add `AI_API_KEY`, `AI_BASE_URL`, and `AI_MODEL` as repository secrets.

## Mindset Linter (VS Code)

The [`.vscode/extensions.json`](.vscode/extensions.json) file recommends the extensions that surface Career Catalyst insights directly in the IDE Problems tab:

- **GitHub Copilot** — AI pair programmer and the host for the `@CareerCatalyst` agent.
- **GitHub Copilot Chat** — interactive chat panel that powers the audit → implement session.
- **Error Lens** — renders warnings inline next to the code, making "Yellow Squiggly" mindset hints immediately visible without opening the Problems panel.
- **GitLens** — enriches Git blame and history so the agent sees the evolution of decisions.
- **Code Spell Checker** — keeps documentation and comments professional.

When VS Code prompts you to install recommended extensions, accept — this activates the full passive-observation workflow.

## Growth Log (Opt-In)

After a session, the `@CareerCatalyst` agent will **offer** to generate a Growth Log entry. You choose whether to accept — nothing is recorded automatically. When you accept, the agent produces a structured evidence block you can paste into your local `GROWTH_LOG.md`.

See [`docs/GROWTH_LOG_TEMPLATE.md`](docs/GROWTH_LOG_TEMPLATE.md) for the template. This file is intentionally kept local; never commit entries containing internal system names or confidential context.

---

## Contributing

This project is intentionally minimal by design — a sharp tool, not a sprawling platform. Contributions that sharpen the agent prompts, improve the rubric, or add new template formats are welcome. Open an issue first to align on direction before submitting a PR.

---

*Built with the philosophy that every engineer deserves a Staff-level mentor.*
