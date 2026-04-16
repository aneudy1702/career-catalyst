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

## Directory Structure

```
career-catalyst/
├── .github/
│   ├── agents/
│   │   └── Catalyst.agent.md           # VS Code Copilot agent definition
│   ├── scripts/
│   │   └── pr_review.py                # Ghost PR Reviewer — AI Level-Up critique script
│   └── workflows/
│       └── career-catalyst-review.yml  # GitHub Action: runs on every PR
├── .cursor/
│   └── rules/
│       └── catalyst.mdc                # Cursor-specific MDC rules
├── .vscode/
│   └── extensions.json                 # Recommended extensions (Copilot, Error Lens, etc.)
├── docs/
│   ├── DEFAULT_RUBRIC.md               # Engineer 1 → Principal leveling rubric
│   └── GROWTH_LOG_TEMPLATE.md          # Growth milestone tracking template
└── README.md
```

---

## How to Use

### VS Code (GitHub Copilot Agents)

1. **Open this repository** in VS Code with the GitHub Copilot extension installed (v1.200+).
2. Open the **Copilot Chat** panel (`Ctrl+Shift+I` / `Cmd+Shift+I`).
3. Select the **CareerCatalyst** agent from the agent picker (`@CareerCatalyst`) — VS Code will auto-detect `.github/agents/Catalyst.agent.md`.
4. Start a session:
   - **Audit mode:** Paste a problem statement or describe a system you're designing. The agent will benchmark your thinking against the rubric.
   - **Implementation mode:** Ask for a solution. The agent delivers it with built-in observability and scalability notes.
   - **Archivist mode (opt-in):** After Phase 2, the agent will ask if you'd like to record this as a growth milestone. Say yes, or type `@CareerCatalyst /archive` at any point, to receive a Growth Log entry you can paste into your local `GROWTH_LOG.md`. Say no and nothing is recorded.

### Cursor

1. **Open this repository** in Cursor. The `.cursor/rules/catalyst.mdc` file is auto-loaded as an active rule.
2. Open any file and start a Composer or Chat session.
3. The Catalyst rules activate automatically — no `@mention` required.
4. Workflow:
   - Describe your problem or paste your current solution.
   - Cursor will apply the audit → implement flow inline.
   - At the end of the session, the agent will offer to generate a **Growth Log Summary** block. Accept to receive it, or decline to skip.

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

- **GitHub Copilot / Copilot Chat** — in-editor AI pair programmer and the `@CareerCatalyst` agent host.
- **Error Lens** — renders warnings inline next to the code, making "Yellow Squiggly" mindset hints immediately visible without opening the Problems panel.

When VS Code prompts you to install recommended extensions, accept — this activates the full passive-observation workflow.

## Growth Log (Opt-In)

After a session, the `@CareerCatalyst` agent will **offer** to generate a Growth Log entry. You choose whether to accept — nothing is recorded automatically. When you accept, the agent produces a structured evidence block you can paste into your local `GROWTH_LOG.md`.

See [`docs/GROWTH_LOG_TEMPLATE.md`](docs/GROWTH_LOG_TEMPLATE.md) for the template. This file is intentionally kept local; never commit entries containing internal system names or confidential context.

---

## Contributing

This project is intentionally minimal by design — a sharp tool, not a sprawling platform. Contributions that sharpen the agent prompts, improve the rubric, or add new template formats are welcome. Open an issue first to align on direction before submitting a PR.

---

*Built with the philosophy that every engineer deserves a Staff-level mentor.*
