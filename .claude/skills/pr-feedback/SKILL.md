---
name: pr-feedback
description: Read active review threads on a GitHub pull request and address each one — by replying with explanations (for questions) or by making code changes + replying (for change requests). Use /pr-feedback to invoke. Optional argument is the PR number; if omitted, the PR is inferred from the current branch.
disable-model-invocation: true
---

# /pr-feedback — Address PR Comments and Change Requests

## What This Does

Walks every **unresolved** review thread on a GitHub pull request and addresses it:

- **Question** → write a thorough, educational answer and post it as a reply on the same thread.
- **Change request** → make the code change first, commit it on the PR's source branch, push, then post a reply summarising what was done and referencing the new commit.
- **Suggestion / discussion** → if the right answer is obvious and low-blast-radius, implement it. Otherwise pause and ask the operator.
- **Approval / non-actionable** → skip without replying.

The skill never resolves threads itself — that decision stays with the operator.

## The marker-based loop guard

Replies posted via the API may appear under the operator's identity, so authorship cannot distinguish "Claude's prior reply" from "operator's new comment." The skill appends a fixed marker to every reply it posts, and scans incoming comments for that marker to decide whether a thread already has a Claude response. Treat the marker as a contract.

```
PR_FEEDBACK_MARKER = "<!-- claude:/pr-feedback -->"
```

Wrapped in an HTML comment so it is invisible in rendered Markdown but present in the raw comment body. Every reply must end with a blank line followed by the marker on its own line.

## Inputs

- `$1` (optional): PR number. If omitted, infer from `git branch --show-current` by querying GitHub for the open PR whose head branch matches.
- `$2` (optional): `--all` to include resolved threads too. Default considers only unresolved threads.

## API access

Repo: `isharjeeldd/portfolio-dd-v2`. Use `gh` CLI if installed, otherwise the GitHub REST/GraphQL API with the stored git credential:

- List PRs: `GET /repos/{owner}/{repo}/pulls?head={owner}:{branch}&state=open`
- Review comments: `GET /repos/{owner}/{repo}/pulls/{n}/comments` (thread structure via `in_reply_to_id`; resolution state requires the GraphQL `reviewThreads` API)
- Reply: `POST /repos/{owner}/{repo}/pulls/{n}/comments/{comment_id}/replies`
- Issue-level comments: `GET/POST /repos/{owner}/{repo}/issues/{n}/comments`

## Execution Steps

### Step 1: Identify the PR

From `$1`, or from the current branch. Zero results → report "no open PR for branch `<branch>`" and exit. Multiple → list with IDs/titles, ask the operator to pick.

### Step 2: List threads

Collect unresolved review threads (and top-level issue comments that ask for action). For each capture the file path + line range and the full comment chain. Zero threads → report and exit cleanly.

### Step 3: Triage each thread (marker-aware)

1. Sort comments by date ascending; take the latest.
2. **Loop guard:** if the latest comment contains `PR_FEEDBACK_MARKER`, skip — already addressed with no operator follow-up.
3. Otherwise treat the latest comment as the live request; read the full thread for context.
4. Classify: Question / Change request / Suggestion / Acknowledgement / Unclear (flag and skip — don't guess).

### Step 4a: Replying to a question

- Read the relevant code (file + line range) so the answer is grounded in the actual implementation.
- Lead with the direct answer, then explain *why* and *what alternatives exist if the constraint changes*. Use `path:line` references.
- Post the reply. **End with a blank line then `PR_FEEDBACK_MARKER`.**

### Step 4b: Acting on a change request

- Make the change. Follow project rules:
  - Read each file before editing.
  - For features: TDD applies — update tests first if behaviour changes.
  - Run the project's test and build scripts after the change.
  - Group changes addressing one comment into a single coherent commit.
- Commit message:

  ```
  fix: address PR #<N> — <short summary>

  Resolves PR #<N> thread on <file>.

  [Claude Co-Authored-By trailer]
  ```

- Stage explicit files only — never `git add -A`; never stage `.env*`.
- Reply with: what changed, the commit SHA, caveats. End with the marker.

### Step 4c: Suggestion / discussion

If concrete and low-risk, implement as in 4b. If open-ended or unclear blast radius, **do not implement** — reply naming the trade-off and ask the operator to decide. Reply ends with the marker.

### Step 4d: Acknowledgement / off-topic

Skip silently unless a direct yes/no follow-up was asked, then reply briefly + marker.

### Step 5: Push code changes

If any commits were made: `git push origin <current-branch>` once at the end; re-run tests + build; surface any failure in the summary. The Vercel preview redeploys automatically — link it.

### Step 6: Summary

```
## PR #<N> — feedback addressed
| Thread | File:Line | Action | Commit |
|---|---|---|---|
Skipped: [needs operator decision / already addressed]
Tests + build → result. Branch pushed. Preview: <vercel url>
```

## Edge Cases

- **PR doesn't exist / is closed:** report and exit.
- **Multiple open PRs for the branch:** list and prompt; don't auto-pick.
- **Comment on a deleted file/line:** include the literal comment in the summary so the operator can re-anchor.
- **Operator commented multiple times without a Claude reply between:** treat the latest as authoritative; note conflicts.
- **Change request conflicts with project rules** (skip tests, stage `.env`, force-push, amend pushed commits, merge `main` down into `develop` outside a hotfix back-merge): do not implement; reply explaining the rule (link `AGENTS.md`); mark "needs operator decision."
- **Tool/API failure:** report which thread couldn't be reached; proceed with the rest.
- **Force-push is never appropriate** as a result of this skill. Surface to the operator and stop.
