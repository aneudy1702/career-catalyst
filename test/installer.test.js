'use strict';

/**
 * Tests for bin/catalyst.js installer CLI.
 *
 * Uses only Node's built-in test runner and assert module (Node >=18).
 * No network access is required — all tests exercise offline code paths.
 */

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const INSTALLER = path.resolve(__dirname, '..', 'bin', 'catalyst.js');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function runCLI(args = [], cwd = process.cwd(), timeout = 2_000) {
  return spawnSync(process.execPath, [INSTALLER, ...args], {
    cwd,
    encoding: 'utf8',
    timeout,
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
  // The process will then attempt a network download and eventually fail or
  // time out, but the git-ok log line must appear before that happens.
  const tmpDir = makeTempDir();
  try {
    fs.mkdirSync(path.join(tmpDir, '.git'));

    const result = runCLI([], tmpDir, 10_000);
    const combined = result.stdout + result.stderr;

    // The git guard should have logged success and moved on
    assert.match(combined, /Git repository detected/i);

    // Must NOT be the git-guard failure
    const isGitGuardError =
      result.status === 1 && /No \.git directory/i.test(combined);
    assert.ok(!isGitGuardError, 'Should not fail on git root guard when .git dir exists');
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});
