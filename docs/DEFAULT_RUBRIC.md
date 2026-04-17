# Default Engineering Leveling Rubric

> This rubric defines the default career ladder for Career Catalyst. Replace or supplement it with your company's internal framework using the [Private Rubric Protocol](../README.md#private-rubric-protocol-byor).

---

## Philosophy

The two primary anchors that differentiate levels are **Scope** and **Ambiguity Tolerance** — not years of experience, not lines of code, not the number of systems touched.

- **Scope** answers: *how far does your thinking, your decisions, and your work reach?*
- **Ambiguity Tolerance** answers: *how well-defined does a problem need to be before you can act on it?*

The progression is:

**Task → Feature → Component → System → Cross-System → Platform → Strategy → Industry**

Each level up requires you to carry the *full weight* of the previous scope while extending your thinking to the next. The "Level Up Trigger" marks the specific mindset shift that signals readiness for the next level — it is the thing your work must reliably demonstrate, not just occasionally show.

---

## Leveling Table

| Level | Title | Primary Focus | Scope | Ambiguity Tolerance | Thinking Pattern | "Level Up" Trigger |
|-------|-------|---------------|-------|---------------------|------------------|--------------------|
| **E1** | Engineer 1 | Task Execution | Single function / file | Low — needs well-defined tickets | "How do I implement this specific function?" | From "Does it work?" to "Is it readable?" |
| **E2** | Engineer 2 | Feature Ownership | End-to-end feature | Medium — understands the feature's edges | "How do I build this feature within the existing patterns?" | From "Is it readable?" to "Is it tested and robust?" |
| **E3** | Engineer 3 | Component Design | One component / service boundary | Medium-high — can decompose a vague requirement | "How do I ensure this component handles all edge cases?" | From "Does it work for me?" to "Does it work for the service?" |
| **S1** | Senior Engineer 1 | System Robustness | One or more owned systems | High — drives ambiguous problems to clarity | "How do I make this system observable and fault-tolerant?" | From "Feature complete" to "System health." |
| **S2** | Senior Engineer 2 | Cross-Component Design | Multiple systems / service boundaries | High — navigates unknowns across teams | "How do these services interact and where are the failure points?" | From "System health" to "System evolution." |
| **ST** | Staff Engineer | Guardrails & Platform | Platform-wide, multi-team | Very high — defines the problem for others | "How do I prevent this entire class of errors for all teams?" | From "Solving problems" to "Building frameworks." |
| **SS** | Senior Staff Engineer | Decentralization | Org-wide domain or capability | Extreme — sets direction under deep uncertainty | "How do I enable teams to make the right decisions without me?" | From "Building frameworks" to "Defining strategy." |
| **PR** | Principal Engineer | Industry Vision | Company-wide + external ecosystem | Extreme — shapes the possible | "How does our tech stack shape our business 3 years from now?" | From "Company strategy" to "Industry leadership." |

---

## Level-by-Level Deep Dive

### E1 — Engineer 1 (Task)
- **Input:** A ticket with clear acceptance criteria.
- **Output:** A correct, working implementation.
- **Thinking horizon:** Hours to days.
- **Risk horizon:** "Does this break my change?"
- **Observable signal:** Asks good clarifying questions before starting. Improves readability unprompted.

### E2 — Engineer 2 (Feature)
- **Input:** A product requirement or user story.
- **Output:** A shippable, tested feature with edge cases handled.
- **Thinking horizon:** Days to weeks.
- **Risk horizon:** "Does this break the user journey?"
- **Observable signal:** Writes tests without being asked. Reviews peers' code with meaningful feedback.

### E3 — Engineer 3 (Component)
- **Input:** A vague product or engineering need scoped to one area.
- **Output:** A designed, reviewed, component-level solution.
- **Thinking horizon:** Weeks.
- **Risk horizon:** "Does this create operational or integration debt for adjacent teams?"
- **Observable signal:** Identifies edge cases beyond the ticket scope. Documents component contracts.

### S1 — Senior Engineer 1 (System)
- **Input:** A business problem or architectural gap.
- **Output:** A designed, reviewed, and deployed system improvement.
- **Thinking horizon:** Weeks to months.
- **Risk horizon:** "Does this create reliability, security, or observability debt?"
- **Observable signal:** Adds structured logging, metrics, and circuit-breaking before being asked. Leads incident reviews to root cause.

### S2 — Senior Engineer 2 (Cross-System)
- **Input:** A recurring failure pattern or integration challenge spanning multiple systems.
- **Output:** A cross-team technical design that improves the whole interaction surface.
- **Thinking horizon:** Months.
- **Risk horizon:** "Does this constrain or unlock the evolution of both systems?"
- **Observable signal:** Hosts design reviews with multiple teams. Surfaces systemic failure modes others haven't spotted.

### ST — Staff Engineer (Platform)
- **Input:** A recurring pain point across multiple teams or a strategic capability gap.
- **Output:** A platform-level abstraction, standard, or service that teams build on.
- **Thinking horizon:** Quarters.
- **Risk horizon:** "Does this constrain or unlock the organization's ability to move?"
- **Observable signal:** Writes RFCs and drives adoption across teams. Multiplies team effectiveness through systems and process, not heroics.
- **Operational Rigor:** Prioritizes idempotency, failure modes, and migration paths. Asks *"what happens when this is run a second time?"* rather than just *"does it work once?"*

### SS — Senior Staff Engineer (Strategy)
- **Input:** Business goals, org constraints, competitive pressures.
- **Output:** A multi-year technical roadmap and the organizational alignment behind it.
- **Thinking horizon:** 1–3 years.
- **Risk horizon:** "Are we building the right things to win?"
- **Observable signal:** Influences hiring, org design, and build-vs-buy decisions. Enables teams to self-navigate without escalating to them.

### PR — Principal Engineer (Industry)
- **Input:** Emerging technology landscape, company strategy, ecosystem shifts.
- **Output:** Technical vision that positions the company ahead of industry curves.
- **Thinking horizon:** 3–5 years.
- **Risk horizon:** "Are we defining the future or reacting to it?"
- **Observable signal:** Recognized externally as a domain authority. Shapes standards, ecosystems, or industry practice.

---

## Behavioral Anchors: The Most Misunderstood Jumps

### E3 → S1 (The Observability Jump)

| Dimension | Engineer 3 (E3) | Senior 1 (S1) |
|-----------|----------------|---------------|
| **Definition of done** | Feature works and is tested | Feature works, is tested, *and is operable* |
| **Failure handling** | Handles known errors | Designs for unknown failures with graceful degradation |
| **Metrics** | Optional | Non-negotiable — names the signals that matter |
| **Incident stance** | Fixes the issue | Prevents the class of issue |

### S2 → ST (The Guardrails Jump)

| Dimension | Senior 2 (S2) | Staff (ST) |
|-----------|--------------|------------|
| **Problem framing** | Solves the problem as given | Questions whether it's the right problem |
| **Solution scope** | Best solution for their systems | Best solution for the platform / adjacent teams |
| **Influence method** | Code + docs | Code + docs + standards + org patterns |
| **Incident response** | Fixes the thing that broke | Asks why the class of problem exists at all |
| **Success metric** | My systems are healthy | Teams I interact with ship faster and safer |

### ST → SS (The Decentralization Jump)

| Dimension | Staff (ST) | Senior Staff (SS) |
|-----------|-----------|-------------------|
| **Goal** | Build the framework | Make the framework unnecessary |
| **Presence required?** | Yes — teams pull them in | No — teams navigate independently |
| **Influence horizon** | Cross-team | Org-wide + external |
| **Output** | Standards, libraries, platforms | Strategy, culture, hiring bar |

---

## Level Mapping (Backward Compatibility)

For teams using the previous L1–L5 notation:

| Previous | New | Title |
|----------|-----|-------|
| L1 | E1–E2 | Engineer 1 / Engineer 2 |
| L2 | E3 | Engineer 3 |
| L3 | S1–S2 | Senior Engineer 1 / 2 |
| L4 | ST | Staff Engineer |
| L5 | SS–PR | Senior Staff / Principal |

---

## Using This Rubric with Career Catalyst

The CareerCatalyst agent uses this rubric in **Phase 1 (Audit)** to:
1. Detect the level of thinking demonstrated in your current approach.
2. Identify the *gap* between your current level and the next.
3. Name the specific "Level Up Trigger" — the mindset shift you must demonstrate to advance.
4. Provide a concrete behavioral comparison anchored in the Scope and Ambiguity dimensions.

> **To bring your own rubric:** See [Private Rubric Protocol](../README.md#private-rubric-protocol-byor).
