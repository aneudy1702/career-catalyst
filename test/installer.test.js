'use strict';

/**
 * Tests for bin/catalyst.js installer CLI.
 *
 * Uses only Node's built-in test runner and assert module (Node >=18).
 * All tests exercise offline code paths — no network requests are made.
 */

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const INSTALLER = path.resolve(__dirname, '..', 'bin', 'catalyst.js');

// ─── Helpers ──────────────────────────────────────────────────────────────────

// extraEnv merges additional env vars into the subprocess environment.
// Only use for test-specific flags (e.g. CATALYST_CHECK_ONLY).
// PATH and other critical variables are inherited from process.env.
function runCLI(args = [], cwd = process.cwd(), timeout = 2_000, extraEnv = {}) {
  return spawnSync(process.execPath, [INSTALLER, ...args], {
    cwd,
    encoding: 'utf8',
    timeout,
    env: { ...process.env, ...extraEnv },
  });
}

function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'catalyst-test-'));
}

// ─── --version flag ───────────────────────────────────────────────────────────

test('--version exits 0 and prints version string', () => {
  const result = runCLI(['--version']);
  assert.strictEqual(result.status, 0, `expected exit 0, got ${result.status}\n${result.stderr}`);
  assert.match(result.stdout, /career-catalyst installer v\d+\.\d+\.\d+/);
});

test('-v exits 0 and prints version string', () => {
  const result = runCLI(['-v']);
  assert.strictEqual(result.status, 0, `expected exit 0, got ${result.status}\n${result.stderr}`);
  assert.match(result.stdout, /career-catalyst installer v\d+\.\d+\.\d+/);
});

// ─── --help flag ──────────────────────────────────────────────────────────────

test('--help exits 0 and prints usage information', () => {
  const result = runCLI(['--help']);
  assert.strictEqual(result.status, 0, `expected exit 0, got ${result.status}\n${result.stderr}`);
  assert.match(result.stdout, /Usage:/);
  assert.match(result.stdout, /npx career-catalyst/);
});

test('-h exits 0 and prints usage information', () => {
  const result = runCLI(['-h']);
  assert.strictEqual(result.status, 0, `expected exit 0, got ${result.status}\n${result.stderr}`);
  assert.match(result.stdout, /Usage:/);
  assert.match(result.stdout, /npx career-catalyst/);
});

// ─── Git root guard ───────────────────────────────────────────────────────────

test('exits 1 with a clear error when run outside a git repository', () => {
  const tmpDir = makeTempDir();
  try {
    const result = runCLI([], tmpDir, 5_000);
    assert.strictEqual(result.status, 1, `expected exit 1, got ${result.status}`);
    // Error should be written to stderr and mention git
    const combined = result.stdout + result.stderr;
    assert.match(combined, /Git repository/i);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('proceeds past git check when run inside a git repository', () => {
  // Make a minimal fake git repo (just a .git dir) so the guard passes.
  // CATALYST_CHECK_ONLY=1 makes the installer exit after the git check
  // without making any network requests, keeping this test fast and reliable.
  const tmpDir = makeTempDir();
  try {
    fs.mkdirSync(path.join(tmpDir, '.git'));

    const result = runCLI([], tmpDir, 5_000, { CATALYST_CHECK_ONLY: '1' });
    assert.strictEqual(result.status, 0, `expected exit 0, got ${result.status}\n${result.stderr}`);

    const combined = result.stdout + result.stderr;
    // The git guard should have logged success
    assert.match(combined, /Git repository detected/i);
    // Check-only mode should have confirmed the early exit
    assert.match(combined, /Check-only mode/i);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});
