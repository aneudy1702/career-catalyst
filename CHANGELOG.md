# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versions follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [Unreleased]



## [v1.0.3] - 2026-04-17

- ci: add push tags trigger to npm-publish workflow
- fix: resolve YAML syntax error in npm-publish.yml line 44

## [v1.0.2] - 2026-04-17

- ci: fix issue title/body — accurate messaging and unindented markdown table
- ci: replace SMTP alert with GitHub issue on publish failure
- ci: add email alert on npm publish failure
- chore: normalize repository.url via npm pkg fix

## [v1.0.1] - 2026-04-17

- Replace demo screenshot placeholder with actual image in README
- docs: add FAQ section to README
- revert: restore version to 1.0.0 — package not yet published, all changes are part of v1 first release
- feat: Career Catalyst v2.0 — multi-role platform, global config, adaptive feedback, conversational onboarding
- Update CHANGELOG.md
- fix: gate release workflow to main branch only; add Unreleased section to CHANGELOG
- fix: sync installer version with release bump
- fix: use ::error:: prefix for workflow annotations in sync step
- fix: apply PR review suggestions - bin alias, README, release workflow guards
- chore: add repository key to package.json for GitHub Packages linking
- fix: apply PR review suggestions to release workflow
- feat: add release workflow (tag, version bump, changelog)
- fix: gitignore, offline tests, workflow hardening, files allowlist
- feat: add installer tests and gate publish on npm test
- Potential fix for pull request finding
- fix: address all four npm-publish.yml review issues
- docs(readme): add Scope & Caveats section with global install alternatives
- fix: rename bin to career-catalyst and simplify npx invocation
- Create npm-publish.yml
- docs: apply PR #5 review comment fixes to README and installer
- Remove GitHub Action workflow and PR review scripts
- Replace README with streamlined mentorship-focused content
- feat: add robust bin/catalyst.js installer with staff-level operational standards
- fix: update Getting Started steps — automatic activation, agent rename, opt-in Phase 3, extensions table
- docs: rewrite README with step-by-step Getting Started guide (fork → first session)
- fix: improve type hint for build_diff_summary (list[Any])
- fix: address review thread — dedup get_files, sanitize exceptions, handle fork write errors, switch to pull_request_target
- Update .github/scripts/pr_review.py
- refactor: stealth mentor PR bot, opt-in archivist, public/private separation
- fix: address code review feedback — pin deps, specific exception types, document limits
- feat: global engineering rubric, Ghost PR Reviewer workflow, and Mindset Linter config
- Initialize career-catalyst Automated Mentorship Engine repository structure
- Initial plan
- Initial commit
