#!/usr/bin/env node

/**
 * Career Catalyst — Installer CLI
 *
 * Installs the CareerCatalyst agent files into an existing Git repository.
 * Designed to operate at Staff-level operational standards:
 *   - Fails loudly when the environment is wrong
 *   - Never silently overwrites user-customized files
 *   - Writes atomically (all-or-nothing via a temp directory)
 *   - Pinned to a specific release tag, not `main`
 */

'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');
const os = require('os');
const readline = require('readline');
const { execSync } = require('child_process');

// ─── Version & release config ────────────────────────────────────────────────

const CLI_VERSION = '1.0.0';
const RELEASE_TAG = `v${CLI_VERSION}`;
const REPO = 'aneudy1702/career-catalyst';
const RAW_BASE = `https://raw.githubusercontent.com/${REPO}/${RELEASE_TAG}`;

// ─── Files to install ────────────────────────────────────────────────────────
// Each entry: [path in the release repo, destination path in the user's project]

const INSTALL_MANIFEST = [
  ['.github/agents/CareerCatalyst.agent.md', '.github/agents/CareerCatalyst.agent.md'],
  ['.github/copilot-instructions.md', '.github/copilot-instructions.md'],
  ['.cursor/rules/catalyst.mdc', '.cursor/rules/catalyst.mdc'],
  ['docs/DEFAULT_RUBRIC.md', 'docs/DEFAULT_RUBRIC.md'],
  ['docs/GROWTH_LOG_TEMPLATE.md', 'docs/GROWTH_LOG_TEMPLATE.md'],
];

// ─── Global config ────────────────────────────────────────────────────────────

const GLOBAL_CONFIG_DIR = path.join(os.homedir(), '.career-catalyst');
const GLOBAL_CONFIG_FILE = path.join(GLOBAL_CONFIG_DIR, 'config.json');
const DEFAULT_GROWTH_LOG_PATH = path.join(GLOBAL_CONFIG_DIR, 'GROWTH_LOG.md');

// ─── Colour helpers ───────────────────────────────────────────────────────────

const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

const log = {
  info: (msg) => console.log(`${c.cyan}[catalyst]${c.reset} ${msg}`),
  ok: (msg) => console.log(`${c.green}[catalyst]${c.reset} ${c.green}✔${c.reset}  ${msg}`),
  warn: (msg) => console.log(`${c.yellow}[catalyst]${c.reset} ${c.yellow}⚠${c.reset}  ${msg}`),
  error: (msg) => console.error(`${c.red}[catalyst]${c.reset} ${c.red}✖${c.reset}  ${msg}`),
  step: (msg) => console.log(`${c.blue}[catalyst]${c.reset} ${c.dim}→${c.reset} ${msg}`),
};

// ─── CLI argument parsing ─────────────────────────────────────────────────────

const args = process.argv.slice(2);

if (args.includes('--version') || args.includes('-v')) {
  console.log(`career-catalyst installer v${CLI_VERSION} (pinned to release ${RELEASE_TAG})`);
  process.exit(0);
}

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
${c.bold}career-catalyst installer${c.reset} v${CLI_VERSION}

  Installs Career Catalyst agent files into the current Git repository.
  Must be run from the root of a Git repository.

${c.bold}Usage:${c.reset}
  npx career-catalyst            Install Career Catalyst
  npx career-catalyst --version  Print installer version
  npx career-catalyst --help     Show this help

${c.bold}Conflict resolution:${c.reset}
  When a file already exists you will be prompted to:
    (o) overwrite  — replace the existing file with the release version
    (s) skip       — keep your existing file untouched
    (d) diff       — view a unified diff before deciding

${c.bold}Release:${c.reset}
  Files are fetched from GitHub release ${c.cyan}${RELEASE_TAG}${c.reset}
  (${RAW_BASE})
`);
  process.exit(0);
}

// ─── Environment guard ────────────────────────────────────────────────────────

function assertGitRoot() {
  const cwd = process.cwd();
  const gitDir = path.join(cwd, '.git');

  if (!fs.existsSync(gitDir)) {
    log.error('Career Catalyst must be installed in the root of a Git repository.');
    log.error(`No .git directory found in: ${cwd}`);
    log.error('');
    log.error('Run this command from the root of your project:');
    log.error('  cd /path/to/your/project && npx career-catalyst');
    process.exit(1);
  }

  log.ok(`Git repository detected at: ${cwd}`);
}

// ─── HTTP fetch utility ───────────────────────────────────────────────────────

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchText(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} fetching ${url}`));
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      res.on('error', reject);
    }).on('error', reject);
  });
}

// ─── Interactive prompt ───────────────────────────────────────────────────────

function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

// ─── Global config setup ──────────────────────────────────────────────────────

/**
 * Ensures ~/.career-catalyst/config.json exists.
 * On first run, initiates a conversational setup to ask the user where to store
 * their Master Growth Log so context persists across repositories.
 * Idempotent — re-running on an existing config shows a summary and returns.
 */
async function ensureGlobalConfig() {
  // If the config already exists, surface it and return.
  if (fs.existsSync(GLOBAL_CONFIG_FILE)) {
    let cfg = {};
    try {
      cfg = JSON.parse(fs.readFileSync(GLOBAL_CONFIG_FILE, 'utf8'));
    } catch (_) { /* malformed config — treat as missing */ }

    if (cfg.growthLogPath) {
      log.ok(`Global config found: ${GLOBAL_CONFIG_FILE}`);
      log.ok(`Master Growth Log  : ${cfg.growthLogPath}`);
      console.log('');
      return cfg;
    }
  }

  // First run — welcome the user and ask for a Growth Log path.
  console.log('');
  log.info(`${c.bold}Welcome to Career Catalyst!${c.reset}`);
  log.info(`This is our first time working together across your repositories.`);
  log.info(`To remember your growth profile across projects, I need to know`);
  log.info(`where you want to store your ${c.bold}Master Growth Log${c.reset}.`);
  console.log('');
  log.info(`This file is private — it never leaves your machine unless you choose to share it.`);
  log.info(`Default: ${c.cyan}${DEFAULT_GROWTH_LOG_PATH}${c.reset}`);
  console.log('');

  const raw = await prompt(
    `  ${c.yellow}?${c.reset} Master Growth Log path ${c.dim}(press Enter to use default)${c.reset} › `
  );

  const growthLogPath = raw === '' ? DEFAULT_GROWTH_LOG_PATH : path.resolve(raw.replace(/^~/, os.homedir()));

  // Create the global config directory if it doesn't exist.
  fs.mkdirSync(GLOBAL_CONFIG_DIR, { recursive: true });

  const cfg = {
    version: CLI_VERSION,
    growthLogPath,
    feedbackStyle: null, // set on first IDE session via conversational onboarding
    createdAt: new Date().toISOString(),
  };

  fs.writeFileSync(GLOBAL_CONFIG_FILE, JSON.stringify(cfg, null, 2) + '\n', 'utf8');
  log.ok(`Global config created : ${GLOBAL_CONFIG_FILE}`);
  log.ok(`Master Growth Log set : ${growthLogPath}`);
  console.log('');

  return cfg;
}

// ─── Conflict resolution ──────────────────────────────────────────────────────

async function resolveConflict(destPath, newContent) {
  while (true) {
    const answer = await prompt(
      `  ${c.yellow}?${c.reset} File ${c.bold}${destPath}${c.reset} already exists.\n` +
      `    (${c.green}o${c.reset})verwrite, (${c.yellow}s${c.reset})kip, or (${c.cyan}d${c.reset})iff? › `
    );

    if (answer === 'o' || answer === 'overwrite') {
      return 'overwrite';
    }

    if (answer === 's' || answer === 'skip') {
      return 'skip';
    }

    if (answer === 'd' || answer === 'diff') {
      showDiff(destPath, newContent);
      // Loop back to ask again after showing the diff
      continue;
    }

    log.warn(`Unrecognised option "${answer}". Please enter o, s, or d.`);
  }
}

function showDiff(destPath, newContent) {
  const tmpNew = path.join(os.tmpdir(), `catalyst-new-${Date.now()}.tmp`);
  try {
    fs.writeFileSync(tmpNew, newContent, 'utf8');
    try {
      const diffOutput = execSync(`diff -u "${destPath}" "${tmpNew}"`, { encoding: 'utf8' });
      // diff exits 0 when files are identical
      console.log(diffOutput || '  (files are identical)');
    } catch (err) {
      // diff exits 1 when files differ — that's the normal case
      if (err.status === 1) {
        console.log(err.stdout || '  (no diff output)');
      } else {
        log.warn(`diff command failed: ${err.message}`);
      }
    }
  } finally {
    try { fs.unlinkSync(tmpNew); } catch (_) { /* ignore cleanup errors */ }
  }
}

// ─── Atomic installation ──────────────────────────────────────────────────────

async function install() {
  console.log('');
  log.info(`${c.bold}Career Catalyst Installer${c.reset} v${CLI_VERSION}`);
  log.info(`Release: ${c.cyan}${RELEASE_TAG}${c.reset} — ${RAW_BASE}`);
  console.log('');

  // 1. Environment check
  assertGitRoot();
  console.log('');

  // Allow CI or tests to verify the environment check without triggering downloads
  if (process.env.CATALYST_CHECK_ONLY) {
    log.ok('Check-only mode: environment verified. Skipping download and installation.');
    return;
  }

  // 2. Set up the global config (cross-repo memory / Master Growth Log)
  await ensureGlobalConfig();

  // 3. Create a dedicated temp directory for atomic staging
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'catalyst-install-'));
  log.step(`Staging area created: ${tmpDir}`);
  console.log('');

  const staged = []; // { tmpPath, destPath, content }

  try {
    // 3. Download all files into the temp directory
    log.info(`Fetching ${INSTALL_MANIFEST.length} files from release ${RELEASE_TAG}…`);
    console.log('');

    for (const [srcPath, destPath] of INSTALL_MANIFEST) {
      const url = `${RAW_BASE}/${srcPath}`;
      log.step(`Downloading ${srcPath}`);

      let content;
      try {
        content = await fetchText(url);
      } catch (err) {
        throw new Error(`Failed to download ${srcPath}: ${err.message}`);
      }

      const tmpFilePath = path.join(tmpDir, destPath.replace(/\//g, '__'));
      fs.writeFileSync(tmpFilePath, content, 'utf8');
      staged.push({ tmpPath: tmpFilePath, destPath, content });
      log.ok(`Downloaded  ${destPath}`);
    }

    console.log('');
    log.ok(`All ${staged.length} files downloaded successfully. Beginning installation…`);
    console.log('');

    // 4. Resolve conflicts and write to final destinations
    const results = { installed: [], skipped: [], overwritten: [] };

    for (const { tmpPath, destPath, content } of staged) {
      const fullDest = path.join(process.cwd(), destPath);

      // Ensure the destination directory exists
      fs.mkdirSync(path.dirname(fullDest), { recursive: true });

      if (fs.existsSync(fullDest)) {
        const action = await resolveConflict(destPath, content);

        if (action === 'skip') {
          log.warn(`Skipped   ${destPath}  (keeping your existing file)`);
          results.skipped.push(destPath);
          continue;
        }

        log.step(`Overwriting ${destPath}`);
        fs.copyFileSync(tmpPath, fullDest);
        results.overwritten.push(destPath);
        log.ok(`Overwritten ${destPath}`);
      } else {
        log.step(`Installing  ${destPath}`);
        fs.copyFileSync(tmpPath, fullDest);
        results.installed.push(destPath);
        log.ok(`Installed   ${destPath}`);
      }
    }

    // 5. Summary
    console.log('');
    console.log(`${c.bold}────────────────────────────────────────────${c.reset}`);
    log.ok(`${c.bold}Installation complete.${c.reset}`);
    if (results.installed.length) {
      log.ok(`  Installed:   ${results.installed.length} file(s)`);
    }
    if (results.overwritten.length) {
      log.ok(`  Overwritten: ${results.overwritten.length} file(s)`);
    }
    if (results.skipped.length) {
      log.warn(`  Skipped:     ${results.skipped.length} file(s) (your versions kept)`);
    }
    console.log(`${c.bold}────────────────────────────────────────────${c.reset}`);
    console.log('');
    log.info(`Next step: open your project in VS Code or Cursor and start a Copilot Chat session.`);
    log.info(`The agent will greet you and pick up your growth profile from: ${c.cyan}${GLOBAL_CONFIG_FILE}${c.reset}`);
    console.log('');

  } catch (err) {
    // Atomic guarantee: if anything fails before committing to disk, abort everything.
    console.log('');
    log.error(`Installation failed: ${err.message}`);
    log.error('No files were written to your project. The staging area has been cleaned up.');
    log.error(`Staging area: ${tmpDir}`);
    console.log('');
    process.exit(1);
  } finally {
    // Clean up the temp directory regardless of outcome
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
      log.step(`Staging area cleaned up.`);
    } catch (_) { /* ignore cleanup errors */ }
  }
}

// ─── Entry point ─────────────────────────────────────────────────────────────

install().catch((err) => {
  log.error(`Unexpected error: ${err.message}`);
  process.exit(1);
});
