import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, realpathSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = dirname(fileURLToPath(import.meta.url));
const assistant = /\b(?:(?:github[ -]*)?copilot|claude(?: code)?|chatgpt|openai|codex|gemini|cursor|anthropic|ai(?: assistant| agent)?)\b/i;

export function violation(message) {
  for (const line of message.split(/\r?\n/)) {
    if (/^\s*co[- ]?authored[- ]by\s*:/i.test(line)) return 'Co-authored-by trailer';
    if (assistant.test(line) && (
      /^\s*(?:signed-off-by|authored-by|generated-by|created-by|assisted-by)\s*:/i.test(line) ||
      /\b(?:generated|authored|written|created|assisted|co-authored)\s+(?:by|with|using)\b/i.test(line)
    )) return 'AI attribution';
  }
  return null;
}

function git(args, input) {
  const result = spawnSync('git', args, {
    input, encoding: 'utf8', timeout: 60_000, maxBuffer: 64 * 1024 * 1024,
    env: { ...process.env, GIT_NO_REPLACE_OBJECTS: '1' },
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  if (result.error || result.status !== 0) throw new Error('Git inspection failed; nothing was approved. Check connectivity and repository state.');
  return result.stdout.trimEnd();
}

function requireClean(message, label) {
  const reason = violation(message);
  if (reason) throw new Error(`${label}: forbidden ${reason}. Remove it from authorized unpublished history; do not bypass this guard.`);
}

function requireHuman(identity, label) {
  if (assistant.test(identity)) throw new Error(`${label}: AI author/committer identity is forbidden. Preserve the user identity.`);
}

function commitMessage(path) {
  requireClean(readFileSync(path, 'utf8'), 'Commit message');
  requireHuman(git(['var', 'GIT_AUTHOR_IDENT']), 'Author');
  requireHuman(git(['var', 'GIT_COMMITTER_IDENT']), 'Committer');
}

function peelTag(object) {
  for (let depth = 0; depth < 32; depth++) {
    const type = git(['cat-file', '-t', object]);
    if (type !== 'tag') return type === 'commit' ? object : null;
    const tag = git(['cat-file', 'tag', object]);
    const separator = tag.indexOf('\n\n');
    requireClean(separator < 0 ? '' : tag.slice(separator + 2), `Tag ${object.slice(0, 12)}`);
    const tagger = /^tagger (.+)$/m.exec(tag)?.[1];
    if (tagger) requireHuman(tagger, `Tagger ${object.slice(0, 12)}`);
    const target = /^object ([a-f0-9]{40,64})$/m.exec(tag)?.[1];
    if (!target) throw new Error('Cannot inspect tag target.');
    object = target;
  }
  throw new Error('Tag nesting exceeds the inspection limit.');
}

function outgoing(input, remote) {
  const tips = new Set();
  for (const line of input.trim().split('\n').filter(Boolean)) {
    const fields = line.trim().split(/\s+/);
    if (fields.length !== 4 || !/^[a-f0-9]{40,64}$/.test(fields[1])) throw new Error('Cannot parse push references.');
    if (/^0+$/.test(fields[1])) continue;
    const commit = peelTag(fields[1]);
    if (commit) tips.add(commit);
  }
  if (!tips.size) return;
  if (!remote || remote.startsWith('-')) throw new Error('Cannot safely inspect the push destination.');
  const advertised = git(['ls-remote', '--refs', remote]).split('\n')
    .map(line => line.split(/\s+/)[0]).filter(value => /^[a-f0-9]{40,64}$/.test(value));
  const known = advertised.length ? git(['cat-file', '--batch-check=%(objectname) %(objecttype)'], advertised.join('\n') + '\n')
    .split('\n').filter(line => line.endsWith(' commit')).map(line => line.split(' ')[0]) : [];
  const revisions = [...tips, ...known.map(object => `^${object}`)].join('\n') + '\n';
  const commits = git(['rev-list', '--stdin'], revisions).split('\n').filter(Boolean);
  if (!commits.length) return;
  const records = git(['log', '--no-walk=unsorted', '--format=%H%x00%an%x00%ae%x00%cn%x00%ce%x00%B%x00', '--stdin'], commits.join('\n') + '\n').split('\0');
  for (let offset = 0; offset + 5 < records.length; offset += 6) {
    const object = records[offset].trim().slice(0, 12);
    requireHuman(`${records[offset + 1]} <${records[offset + 2]}>`, `Author of ${object}`);
    requireHuman(`${records[offset + 3]} <${records[offset + 4]}>`, `Committer of ${object}`);
    requireClean(records[offset + 5], `Outgoing commit ${object}`);
  }
}

function delegate(hook, args, input) {
  const common = resolve(git(['rev-parse', '--git-common-dir']));
  const path = join(common, 'hooks', hook);
  if (!existsSync(path) || !(statSync(path).mode & 0o111)) return;
  if (realpathSync(path) === realpathSync(join(directory, 'run-hook'))) return;
  const result = spawnSync(path, args, { stdio: input === undefined ? 'inherit' : ['pipe', 'inherit', 'inherit'], input });
  if (result.error || result.status !== 0) throw new Error(`Existing repository ${hook} hook failed.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const [hook, ...args] = process.argv.slice(2);
    if (!hook || !/^[a-z-]+$/.test(hook)) throw new Error('Invalid hook invocation.');
    const input = hook === 'pre-push' ? readFileSync(0) : undefined;
    if (hook === 'pre-push') outgoing(input.toString('utf8'), args[1]);
    delegate(hook, args, input);
    if (hook === 'commit-msg') commitMessage(args[0]);
  } catch (error) {
    console.error(`[git-attribution] ${error instanceof Error ? error.message : 'Inspection failed.'}`);
    process.exitCode = 1;
  }
}