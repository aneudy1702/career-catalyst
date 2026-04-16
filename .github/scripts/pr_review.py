"""
Career Catalyst — Ghost PR Reviewer (Stealth Mentor)
=====================================================
Runs on every Pull Request via GitHub Actions.
Reads the PR diff + DEFAULT_RUBRIC.md, calls an AI model using the
CareerCatalyst agent persona, and posts an architectural peer-review comment.

PRIVACY PRINCIPLE: This comment is PUBLIC. It NEVER mentions engineer levels,
rubric codes, or career-ladder grades. It acts as a supportive Staff-level peer
offering architectural alternatives — not an evaluator assigning scores.
Leveling feedback lives only in the private IDE session (Catalyst.agent.md Phase 1).

Environment variables (set by the workflow):
  GITHUB_TOKEN       – GitHub Actions token (required for PR comment + GitHub Models fallback)
  PR_NUMBER          – Pull request number
  GITHUB_REPOSITORY  – "owner/repo" string
  AI_API_KEY         – Optional. Custom AI provider key (OpenAI, Anthropic, etc.)
                       Falls back to GITHUB_TOKEN for GitHub Models if unset.
  AI_BASE_URL        – Optional. Custom API base URL.
                       Defaults to GitHub Models: https://models.inference.ai.azure.com
  AI_MODEL           – Optional. Model identifier.
                       Defaults to "gpt-4o-mini".

Dependencies: see .github/scripts/requirements.txt (openai, PyGithub)
"""

from __future__ import annotations

import os
import sys
import textwrap

from github import Github, GithubException
from openai import APIError as OpenAIAPIError
from openai import OpenAI

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

GITHUB_TOKEN = os.environ["GITHUB_TOKEN"]
PR_NUMBER = int(os.environ["PR_NUMBER"])
REPO_NAME = os.environ["GITHUB_REPOSITORY"]

AI_API_KEY = os.environ.get("AI_API_KEY") or GITHUB_TOKEN
AI_BASE_URL = os.environ.get("AI_BASE_URL") or "https://models.inference.ai.azure.com"
AI_MODEL = os.environ.get("AI_MODEL") or "gpt-4o-mini"

MAX_DIFF_CHARS = 8_000   # ~2k tokens at ~4 chars/token — keeps the prompt well within
MAX_RUBRIC_CHARS = 6_000  # gpt-4o-mini's 128k-token context while controlling API cost

# ---------------------------------------------------------------------------
# Load rubric (used internally by the AI — never exposed verbatim in comments)
# ---------------------------------------------------------------------------

RUBRIC_PATH = "docs/DEFAULT_RUBRIC.md"

def load_rubric() -> str:
    try:
        with open(RUBRIC_PATH, encoding="utf-8") as fh:
            content = fh.read()
        return content[:MAX_RUBRIC_CHARS]
    except FileNotFoundError:
        return "(Rubric file not found.)"

# ---------------------------------------------------------------------------
# Build PR diff summary
# ---------------------------------------------------------------------------

def build_diff_summary(files: list) -> str:
    parts: list[str] = []
    for f in files[:25]:  # Cap at 25 files to stay within limits
        patch = f.patch or "(binary or no diff)"
        parts.append(
            f"=== {f.filename}  [+{f.additions} / -{f.deletions}] ===\n{patch}"
        )
    return "\n\n".join(parts)[:MAX_DIFF_CHARS]

# ---------------------------------------------------------------------------
# Prompts
# ---------------------------------------------------------------------------

SYSTEM_PROMPT = textwrap.dedent("""\
    You are an AI Catalyst acting as a supportive Staff-level peer reviewer.
    You have deep knowledge of engineering best practices, architectural patterns,
    and the following internal rubric (for your reasoning only — NEVER quote it
    or mention level codes/names in your response):

    {rubric}

    YOUR STRICT OUTPUT RULES — violating any of these is a critical failure:
    1. NEVER mention engineer levels, rubric codes (E1, E2, S1, ST, etc.), career
       ladders, or any evaluation of the author's seniority. Zero exceptions.
    2. NEVER frame feedback as a grade, score, or assessment of the person.
    3. Focus exclusively on the CODE and ARCHITECTURE, not the author.
    4. Act as a thoughtful Staff peer who noticed something interesting, not as
       a mentor assigning homework.

    WHAT YOUR RESPONSE SHOULD DO:
    - Identify 1–2 concrete, specific architectural observations (e.g., repeated
      logic, missing abstraction boundary, untested edge case, missing observability).
    - For each observation, offer a "Paved Path" — a brief, specific alternative that
      reduces future maintenance, improves resilience, or clarifies ownership.
    - If something is especially well-designed, say so briefly (1 sentence max).
    - Reference actual file names and code patterns from the diff.
    - Use "we" / "this code" / "this pattern" — never "you" in an evaluative sense.
    - Keep the total response under 350 words. Format as Markdown.

    TONE: Collegial and constructive. Think: "Here's something I noticed — worth a
    quick look?" not "Here's what you should have done."
""")

USER_TEMPLATE = textwrap.dedent("""\
    ## Pull Request: {title}

    **Files changed:** {file_count}  |  **+{additions} / -{deletions}**

    ### Diff (truncated to {max_chars} chars)

    {diff}
""")

COMMENT_TEMPLATE = textwrap.dedent("""\
    ## 🔍 AI Catalyst — Architectural Peer Review

    {critique}

    ---
    *[Career Catalyst](https://github.com/aneudy1702/career-catalyst) · \
    Automated peer review powered by the engineering rubric*
""")

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    gh = Github(GITHUB_TOKEN)
    repo = gh.get_repo(REPO_NAME)
    pr = repo.get_pull(PR_NUMBER)

    rubric = load_rubric()
    files = list(pr.get_files())          # Fetch once — reused for diff and file_count
    diff_summary = build_diff_summary(files)

    user_message = USER_TEMPLATE.format(
        title=pr.title,
        file_count=len(files),
        additions=pr.additions,
        deletions=pr.deletions,
        max_chars=MAX_DIFF_CHARS,
        diff=diff_summary,
    )

    client = OpenAI(base_url=AI_BASE_URL, api_key=AI_API_KEY)

    try:
        completion = client.chat.completions.create(
            model=AI_MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT.format(rubric=rubric)},
                {"role": "user", "content": user_message},
            ],
            max_tokens=1_200,
            temperature=0.4,
        )
        critique = completion.choices[0].message.content or "(No critique generated.)"
    except (OpenAIAPIError, OSError) as exc:
        exc_type = type(exc).__name__
        # Log the full exception to Actions stderr for debugging; never echo it publicly.
        print(f"WARNING: AI API call failed ({exc_type}: {exc}). Posting fallback comment.", file=sys.stderr)
        critique = textwrap.dedent(f"""\
            > ⚠️ The Career Catalyst automated review could not be completed.
            >
            > **Error type:** `{exc_type}`
            >
            > Check the workflow run logs for details. To enable the review, ensure
            > `AI_API_KEY` (or GitHub Models access) is configured in your repository
            > secrets, then re-run the workflow.
        """)

    comment_body = COMMENT_TEMPLATE.format(critique=critique)
    try:
        pr.create_issue_comment(comment_body)
    except GithubException as exc:
        print(
            f"WARNING: Failed to post Career Catalyst comment to PR #{PR_NUMBER} "
            f"({type(exc).__name__}). This commonly happens when the workflow token "
            "does not have write access to pull requests (e.g., PRs from forks).",
            file=sys.stderr,
        )
        return
    print(f"✅ Career Catalyst comment posted to PR #{PR_NUMBER}.")


if __name__ == "__main__":
    main()

