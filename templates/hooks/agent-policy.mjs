// Re-injects a short policy at session start, on every prompt and when a subagent starts,
// so the rules survive long sessions and reach subagents. Edit POLICY for your setup.
const POLICY =
  'Policy for every agent and subagent: for live-system facts or actions, discover and call the owning MCP tool or API first; ' +
  'memory is background, not verification. Explain any fallback. Never guess success or print secrets. ' +
  'Never add Co-authored-by trailers or AI attribution to commits or tags; never bypass Git hooks. Shared writes need user approval.';

const event = process.argv[2];
if (!['SessionStart', 'UserPromptSubmit', 'SubagentStart'].includes(event)) process.exit(1);
console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: event, additionalContext: POLICY } }));
