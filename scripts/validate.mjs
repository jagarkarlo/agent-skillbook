#!/usr/bin/env node
// Validates skills, templates and local Markdown links. No dependencies.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';

const root = resolve(dirname(new URL(import.meta.url).pathname), '..');
const errors = [];

function walk(directory, found = []) {
  for (const entry of readdirSync(directory)) {
    if (entry.startsWith('.') || entry === 'node_modules') continue;
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) walk(path, found);
    else found.push(path);
  }
  return found;
}

function frontmatter(path) {
  const match = /^---\n([\s\S]*?)\n---\n/.exec(readFileSync(path, 'utf8'));
  if (!match) return undefined;
  const fields = {};
  for (const line of match[1].split('\n')) {
    const pair = /^([A-Za-z][\w-]*):\s*(.*)$/.exec(line);
    if (pair) fields[pair[1]] = pair[2].replace(/^(['"])(.*)\1$/, '$2');
  }
  return fields;
}

const files = walk(root);
const fail = (path, message) => errors.push(`${relative(root, path)}: ${message}`);

for (const path of files.filter((file) => basename(file) === 'SKILL.md')) {
  const meta = frontmatter(path);
  if (!meta) { fail(path, 'missing frontmatter'); continue; }
  if (meta.name !== basename(dirname(path))) fail(path, `name "${meta.name}" must match its folder`);
  if (!meta.description || meta.description.length < 40) fail(path, 'description must say when to use the skill');
  if (meta.description && meta.description.length > 1024) fail(path, 'description exceeds 1024 characters');
  if (readFileSync(path, 'utf8').length > 6000) fail(path, 'skill exceeds 6000 characters; split or trim it');
}

for (const path of files.filter((file) => file.endsWith('.instructions.md'))) {
  const meta = frontmatter(path);
  if (!meta?.description) fail(path, 'instructions need a description');
  if (!meta?.applyTo) fail(path, 'instructions need applyTo');
}

for (const path of files.filter((file) => file.endsWith('.md'))) {
  const text = readFileSync(path, 'utf8').replace(/```[\s\S]*?```/g, '');
  for (const [, target] of text.matchAll(/\]\(([^)\s]+)\)/g)) {
    if (/^(?:https?:|mailto:|#)/.test(target)) continue;
    const local = resolve(dirname(path), decodeURIComponent(target.split('#')[0]));
    if (!existsSync(local)) fail(path, `broken link ${target}`);
  }
}

for (const path of files.filter((file) => file.endsWith('.json'))) {
  try { JSON.parse(readFileSync(path, 'utf8')); } catch { fail(path, 'invalid JSON'); }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Validated ${files.length} files.`);
