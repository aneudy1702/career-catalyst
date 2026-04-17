#!/usr/bin/env node

/**
 * Career Catalyst Installer
 *
 * Installs the CareerCatalyst agent files into the current project so that
 * VS Code Copilot Chat and Cursor pick up the Staff-level mentor automatically.
 *
 * Usage:
 *   npx career-catalyst install
 *
 * This script only writes files to the local filesystem.
 * It does NOT transmit your code or any project data to external servers.
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

// ─── Constants ────────────────────────────────────────────────────────────────

const REPO_RAW_BASE =
  'https://raw.githubusercontent.com/aneudy1702/career-catalyst/main';

const FILES_TO_INSTALL = [
  {
    remote: `${REPO_RAW_BASE}/.github/agents/CareerCatalyst.agent.md`,
    local: '.github/agents/CareerCatalyst.agent.md',
    label: 'VS Code Copilot agent definition',
  },
  {
    remote: `${REPO_RAW_BASE}/.cursor/rules/catalyst.mdc`,
    local: '.cursor/rules/catalyst.mdc',
    label: 'Cursor MDC rules',
  },
  {
    remote: `${REPO_RAW_BASE}/docs/DEFAULT_RUBRIC.md`,
    local: 'docs/DEFAULT_RUBRIC.md',
    label: 'Default leveling rubric (E1 → Principal)',
  },
];

const GROWTH_LOG_TEMPLATE_URL = `${REPO_RAW_BASE}/docs/GROWTH_LOG_TEMPLATE.md`;
const GROWTH_LOG_LOCAL = 'docs/GROWTH_LOG.md';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function log(msg) {
  process.stdout.write(msg + '\n');
}

function warn(msg) {
  process.stderr.write(`⚠️  ${msg}\n`);
}

function bold(str) {
  return `\x1b[1m${str}\x1b[0m`;
}

function green(str) {
  return `\x1b[32m${str}\x1b[0m`;
}

function dim(str) {
  return `\x1b[2m${str}\x1b[0m`;
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching ${url}`);
  }
  return res.text();
}

/**
 * Write content to a local path, creating parent directories as needed.
 * If the file already exists, prompt the user before overwriting unless
 * --force was passed.
 *
 * Returns true if the file was written, false if skipped.
 */
async function writeFile(localPath, content, force, rl) {
  const abs = path.resolve(process.cwd(), localPath);
  fs.mkdirSync(path.dirname(abs), { recursive: true });

  if (fs.existsSync(abs) && !force) {
    const answer = await prompt(
      rl,
      `  ${dim(localPath)} already exists. Overwrite? (y/N) `,
    );
    if (!answer.trim().toLowerCase().startsWith('y')) {
      log(`  ${dim('→ skipped')}`);
      return false;
    }
  }

  fs.writeFileSync(abs, content, 'utf8');
  return true;
}

function prompt(rl, question) {
  return new Promise((resolve) => {
    if (rl.closed) {
      resolve('');
      return;
    }
    rl.question(question, (answer) => resolve(answer ?? ''));
    rl.once('close', () => resolve(''));
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const force = args.includes('--force');

  if (command === '--version' || command === '-v') {
    const pkgPath = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      '../package.json',
    );
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    log(pkg.version);
    process.exit(0);
  }

  if (command !== 'install') {
    log('');
    log(bold('Career Catalyst'));
    log('');
    log('Usage:');
    log('  npx career-catalyst install          Install agent files into this project');
    log('  npx career-catalyst install --force  Overwrite existing files without prompting');
    log('  npx career-catalyst --version        Print version');
    log('');
    process.exit(command ? 1 : 0);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  log('');
  log(bold('  🚀 Career Catalyst — Staff-Level Mentorship Installer'));
  log(dim('  ─────────────────────────────────────────────────────'));
  log('');
  log('  Installing agent files into: ' + bold(process.cwd()));
  log('');

  // ── Download and write each file ──────────────────────────────────────────

  let installedCount = 0;
  let skippedCount = 0;
  const errors = [];

  for (const file of FILES_TO_INSTALL) {
    process.stdout.write(`  Fetching ${dim(file.label)} …`);

    let content;
    try {
      content = await fetchText(file.remote);
    } catch (err) {
      process.stdout.write(' ✗\n');
      warn(`Failed to download ${file.remote}: ${err.message}`);
      errors.push(file.local);
      continue;
    }

    process.stdout.write(' ✓\n');

    log(`  Writing  ${dim(file.local)}`);
    const written = await writeFile(file.local, content, force, rl);
    if (written) {
      installedCount++;
    } else {
      skippedCount++;
    }
  }

  // ── GROWTH_LOG.md (opt-in) ────────────────────────────────────────────────

  log('');
  const growthAnswer = await prompt(
    rl,
    '  Would you like to initialize a GROWTH_LOG.md to track your promotion evidence? (y/N) ',
  );

  if (growthAnswer.trim().toLowerCase().startsWith('y')) {
    if (fs.existsSync(path.resolve(process.cwd(), GROWTH_LOG_LOCAL)) && !force) {
      log(`  ${dim('→ docs/GROWTH_LOG.md already exists, skipping')}`);
      skippedCount++;
    } else {
      process.stdout.write(`  Fetching growth log template …`);
      try {
        const template = await fetchText(GROWTH_LOG_TEMPLATE_URL);
        process.stdout.write(' ✓\n');
        const header =
          '# My Growth Log\n\n' +
          '> This file is yours — keep it private or in a private repo.\n' +
          '> Never commit entries that contain internal system names, metrics, or\n' +
          '> confidential business context to a public repository.\n\n' +
          '---\n\n' +
          template;
        fs.mkdirSync(path.resolve(process.cwd(), 'docs'), { recursive: true });
        fs.writeFileSync(
          path.resolve(process.cwd(), GROWTH_LOG_LOCAL),
          header,
          'utf8',
        );
        log(`  ${green('✓')} Created ${bold(GROWTH_LOG_LOCAL)}`);
        installedCount++;
      } catch (err) {
        process.stdout.write(' ✗\n');
        warn(`Failed to initialize GROWTH_LOG.md: ${err.message}`);
        errors.push(GROWTH_LOG_LOCAL);
      }
    }
  }

  rl.close();

  // ── Summary ───────────────────────────────────────────────────────────────

  log('');
  log(dim('  ─────────────────────────────────────────────────────'));

  if (errors.length > 0) {
    log('');
    warn(`${errors.length} file(s) could not be installed. Check your network connection and retry.`);
    log('  Failed: ' + errors.map((f) => dim(f)).join(', '));
  }

  if (installedCount === 0 && skippedCount === 0 && errors.length > 0) {
    log('');
    process.exit(1);
  }

  log('');
  log(green(bold('  ✅ Career Catalyst is ready.')));
  log('');
  log('  ' + bold('What was installed:'));
  log('  • ' + bold('.github/agents/CareerCatalyst.agent.md') + '  →  VS Code Copilot agent');
  log('  • ' + bold('.cursor/rules/catalyst.mdc') + '             →  Cursor MDC rules');
  log('  • ' + bold('docs/DEFAULT_RUBRIC.md') + '                 →  E1 → Principal leveling rubric');
  log('');
  log('  ' + bold('Start your first session:'));
  log('');
  log('  VS Code  →  Open Copilot Chat and select ' + bold('@CareerCatalyst') + ' in the agent picker.');
  log('             Or just start chatting — the mentor activates automatically.');
  log('');
  log('  Cursor   →  Open a Composer or Chat session.');
  log('             The Catalyst rules load from ' + dim('.cursor/rules/catalyst.mdc') + ' automatically.');
  log('');
  log('  ' + bold('How it works:'));
  log('  Every session runs three phases — Audit → Implement → Archive.');
  log('  The agent benchmarks your thinking level, delivers a solution one level');
  log('  above where you are, and offers (opt-in) to generate promotion evidence.');
  log('');
  log(dim('  Privacy: this installer wrote files only to your local filesystem.'));
  log(dim('  No code, context, or project data was transmitted to external servers.'));
  log('');

  if (skippedCount > 0) {
    log(dim(`  (${skippedCount} file(s) skipped — already up to date)`));
    log('');
  }
}

main().catch((err) => {
  process.stderr.write(`\n  Fatal error: ${err.message}\n\n`);
  process.exit(1);
});
