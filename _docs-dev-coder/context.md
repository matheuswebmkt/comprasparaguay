\_docs-dev-coder\context.md

# CONTEXT.MD — EXECUTION PROTOCOL FOR AI CODE AGENTS

> **This file is the root directive.** It governs how AI agents operate in this project.
> Every session, every sprint, every decision starts here.
> **NEVER EDIT THIS FILE WITHOUT EXPLICIT USER REQUEST AND APPROVAL.**
> If any instruction conflicts with this file, **this file overrides.**

**context.md is a control protocol, not a project summary or knowledge base.**

---

## 1 · SESSION ENTRY (mandatory — run on every new session)

### 1.1 Required reading order

Before any reasoning, planning or coding, read these files **in this exact order**:

1. `README.md`
2. `_docs-dev-coder/architecture.md` — **INDEX** of the structural snapshot (single source of truth for paths, modules and boundaries). The content lives in `_docs-dev-coder/architecture/*.md`, split by theme.
3. `_docs-dev-coder/conventions.md` — **INDEX** of the non-negotiable constraints; do NOT re-propose rejected decisions. The content lives in `_docs-dev-coder/conventions/*.md`, split by theme.
4. `_docs-dev-coder/plan.md` — execution backlog and progress tracking (when it exists)

> `_docs-dev-coder/design-system.md` is **NOT** part of unconditional session entry. It is authoritative
> (see the conventions design section) but only applies to work that touches UI/visual output — load it **on
> demand**, per §1.1-bis, together with the relevant file under `design-system/`. Loading hundreds of lines of
> palette and shadows to edit a SQL query or a routing rule is pure waste.

> ⚠️ **`plan.md` is OPTIONAL, EPHEMERAL and TASK-SCOPED — its absence is NORMAL, not a broken state.**
> It is created only when a specific effort (a feature, a refactor) needs to be broken into sprints, and
> it is archived to a backup folder once that effort ends. A fresh one is created for the next effort.
> Absent → say so plainly, skip it, and follow §3.4 (confirm context and **wait for instruction**).
> Never treat its absence as an error, and never recreate it on your own initiative.
>
> ⚠️ **HARD RULE — what `plan.md` must NEVER hold.** It carries the context of ITS OWN TASK only, never
> project-level directives, architecture or constraints. Those belong to `context.md` (protocol),
> `architecture/*.md` (structure) and `conventions/*.md` (locked decisions). Anything durable produced
> during a sprint must be written to `architecture/` or `conventions/` — **that is what they exist for.**
> A `plan.md` holding project knowledge is a bug: when it is archived, that knowledge disappears with it.

After reading the files above (plan.md only if present), confirm in **one sentence**:

> "I have loaded README, the architecture and conventions indices, and plan."
> — or, when there is no plan: "I have loaded README and the architecture and conventions indices;
> there is no plan.md."

**Do NOT proceed without this confirmation.**

### 1.1-bis Thematic files (mandatory — the index is NOT enough)

> ⚠️ **HARD RULE.** `architecture.md` and `conventions.md` are **maps, not content**. Having read the
> index means you know WHERE the rules are — it does **NOT** mean you know WHAT they are.
> **Executing from the index alone is INVALID**, exactly as executing from `plan.md` alone is (§5.3).

Therefore, **before any edit, plan or technical decision**:

1. Identify the theme(s) of the task at hand.
2. Open the corresponding file(s) in `_docs-dev-coder/conventions/` **and** `_docs-dev-coder/architecture/`
   (the index maps theme → file).
3. **If — and only if — the task touches UI/visual output** (new page, component, section, styling,
   e-mail): also open `_docs-dev-coder/design-system.md` (core: identity, palette, typography, and the
   new-page checklist) plus the relevant file under `design-system/` — `componentes.md` (building a
   component), `layout-secoes.md` (assembling a page/section) or `extras.md` (motion, icons, e-mail,
   brand voice). Task does not touch UI → skip this step entirely.
4. **Declare explicitly which thematic files you opened**, e.g.:
   > "For this task I loaded `conventions/<theme-A>.md` and `architecture/<theme-B>.md`."
5. In doubt about which theme applies, open **more** files, not fewer. Under-reading a constraint is a
   protocol violation; reading an extra thematic file is merely a minor cost.

**Rationale (do not remove):** the split exists to cut context cost — session entry drops from thousands of
lines (the full conventions + architecture) to a lean index of a few dozen. That saving is only legitimate if
the rules of the ACTIVE theme are actually loaded on demand. Skipping step 2 converts a cost optimization into
silent constraint loss.

### 1.2 Personas

| Persona | File | Activation |
|---|---|---|
| Software Architect | `_docs-dev-coder/agents/personas/software-architect.md` | **Always implicitly active** for technical decisions and code |
| Offer Architect | `_docs-dev-coder/agents/personas/offer-architect.md` | Only when explicitly requested |

### 1.3 Build a mental model

After loading, internalize:

- The **thematic map** of the system architecture from the `architecture.md` index — i.e. what exists and
  WHERE it is documented, so you can reach for the right file the moment a task names a theme
- The same map of historical constraints from the `conventions.md` index
- ⚠️ At session entry you hold the MAP, not the territory. The atomic summary of a given area and its
  hard constraints only enter memory when you open that area's thematic file (§1.1-bis).

---

## 2 · OPERATIONAL RULES (how to behave during execution)

### 2.1 File access discipline

- **DO NOT scan the project files blindly.**
- Only open source files when:
  - explicitly instructed, OR
  - strictly necessary to fulfill the approved plan
- Assume the `architecture.md` index + its thematic files are the single source of truth for structure and paths.
- ⚠️ **Opening files under `conventions/` and `architecture/` is NOT "blind scanning".** It is the
  intended access pattern (§1.1-bis) and is always allowed, at any point of the session.
  This rule restricts reading **source code**, never the project's own documentation.

### 2.2 Architecture reading rules

- The `architecture.md` **index** MUST be read at session entry (§1.1).
- During execution, do NOT re-read the **index** unless:
  - the file itself changed, OR
  - an architectural decision is explicitly required
- ⚠️ **This restriction applies to the INDEX ONLY.** The thematic files in `architecture/` and
  `conventions/` are meant to be opened **on demand, mid-execution**, whenever the task touches
  their theme (§1.1-bis). Never refuse to open a thematic file on the grounds that "the architecture
  was already read at session entry" — reading the index is not reading the content.

### 2.3 Conventions as hard constraints

- Treat the constraints in `conventions/*.md` as **non-negotiable**.
- Any deviation requires explicit justification.
- Do NOT re-propose previously rejected decisions.

### 2.4 Current code is maximum truth

- The current state of the codebase always overrides assumptions, memory, or prior reasoning.
- When in doubt, read the actual file before editing.

---

## 3 · SPRINT EXECUTION (when running steps from plan.md)

### 3.1 One step at a time

- Run **only the NEXT unmarked step** in `plan.md`.
- After completing a sprint: execute the **SPRINT CLOSURE PROTOCOL (§3.5)** in full, then **wait for instructions**.

### 3.2 Pre-step micro-revalidation

Before each step, confirm:

1. `context.md` still reflects the current state.
2. The active step in `plan.md` is correctly identified.
3. Current code matches expectations before editing.

### 3.3 During execution

- If any questions arise, **STOP and request clarification**.
- Do NOT perform speculative or unapproved work.

### 3.4 If no plan exists

If `plan.md` has no action plan defined, confirm you understood the context and **wait for the user's instruction**.

### 3.5 SPRINT CLOSURE PROTOCOL (mandatory — execute IMMEDIATELY after code changes)

> **This protocol is NOT optional.** The sprint is NOT complete until every step below has been executed AND its output is visible in the conversation. Writing "Post-sprint checklist completed" without executing these steps is a PROTOCOL VIOLATION.

**Step 1 — Synchronize documentation (before reporting to user):**

1a. Check: were any files created, moved, renamed or deleted?
→ If YES: update the matching **thematic file** in `architecture/` NOW, before proceeding
  (and `architecture.md` itself only if a NEW theme was created — see §4).
→ If NO: skip.

1b. Check: were any non-obvious decisions, constraints or strategies adopted?
→ If YES: update the matching **thematic file** in `conventions/` NOW, keeping the original section
  numbering (and `conventions.md` itself only if a NEW theme was created).
→ If NO: skip.

1c. Update `plan.md`: mark sprint as completed, update execution report, findings, problems, tests, critical files table.
→ **If `plan.md` does not exist** (normal — see §1.1): skip, and record the outcome in your reply to the
  user instead. Do NOT create a `plan.md` just to satisfy this step; the user creates it when a
  multi-step effort warrants one.

**Step 2 — Verify context memory (output MUST be visible in conversation):**

Print the following checklist with actual status. Do NOT assume — if uncertain, re-read the file first:

```
CONTEXT MEMORY STATUS:
- [x/!] README.md
- [x/!] _docs-dev-coder/context.md
- [x/!] _docs-dev-coder/architecture.md (index)
- [x/!] _docs-dev-coder/conventions.md (index)
- [x/!] _docs-dev-coder/plan.md (or: N/A — file does not exist, which is normal)
- [x/!] Active persona: software-architect.md
- [x/!] Thematic files loaded for this sprint: <LIST THEM BY NAME — never write "all" or leave blank>
```

Use `[x]` = confirmed in memory. Use `[!]` = re-read required (and then re-read it).

⚠️ The last line must **name** the files (e.g. `conventions/<theme>.md`, `architecture/<theme>.md`).
An empty or generic answer means §1.1-bis was skipped → the sprint is **INVALID**; go back and load them.

**Step 3 — Verify synchronization (output MUST be visible in conversation):**

Print the following with actual status:

```
SYNC STATUS:
- [x/!] architecture/<file>.md reflects all file changes from this sprint
- [x/!] conventions/<file>.md reflects any new decisions (original numbering preserved)
- [x/!] Indices updated ONLY if a new theme was created (otherwise: N/A, and that is correct)
- [x/!] plan.md updated with completion, findings, next steps (or: N/A — no plan.md, reported to the user instead)
- [x/!] No structural change was left undocumented
```

**Step 4 — Reload safety confirmation:**

Answer this question explicitly: "If a new session starts NOW, will re-reading the mandatory files reproduce the exact current state?" → YES or NO. If NO, fix what is missing before proceeding.

**Step 5 — Final confirmation (ONLY after Steps 1-4 are done):**

> "Post-sprint checklist completed. Context synchronized and safe for reload."

**HALT RULE: If Steps 2, 3, and 4 were not printed with visible output in the conversation, the final confirmation is INVALID. Go back and execute them.**

---

## 4 · SYNCHRONIZATION RULES (keeping docs aligned with reality)

These are the **dynamic sources of truth** and must always reflect the actual project state:

- `_docs-dev-coder/architecture.md` (index) + `_docs-dev-coder/architecture/*.md` (content)
- `_docs-dev-coder/conventions.md` (index) + `_docs-dev-coder/conventions/*.md` (content)
- `_docs-dev-coder/plan.md` — **optional/ephemeral**: exists only while a multi-step effort is in flight.
  Its absence is normal and never blocks execution (§1.1, §3.4).
- `_docs-dev-coder/design-system.md` + `_docs-dev-coder/design-system/*.md` — authoritative for UI,
  loaded on demand (§1.1-bis step 3)

> ⚠️ **Where to write (hard rule).** New content goes into the **thematic file**, never into the index.
> The index only changes when a **new theme** is created (a new file in `architecture/` or `conventions/`)
> or when a file's description no longer matches what it holds. Writing rules/snapshots directly into the
> index silently undoes the split and brings back the context cost it was created to remove.
> Preserve each section's original number once assigned (e.g. §1, §2 … including any suffixed ones like
> §13-bis): cross-references elsewhere cite "conventions §N" and must keep resolving. **Never renumber sections.**

> ℹ️ **Growing the structure on a fresh project.** When `conventions/`/`architecture/` are still empty, the
> FIRST time a theme appears: create its thematic file (e.g. `conventions/<theme>.md`), give its sections
> numbers, and add one row to the index's map table pointing to it. Subsequent decisions on the same theme
> extend that file in place. This is how the fragmented structure builds up organically from zero.

> ⚠️⚠️ **Editorial rule — docs are current state, not a timeline (hard rule, explicit user directive).**
> These files exist to hand an accurate, up-to-date picture of the project to whichever agent opens the
> next session — never a changelog or a history of how a decision was reached.
>
> - **Editing an existing topic means REPLACING the text in place**, never appending a new subsection
>   (`§N-bis`, `§N-ter`, `§N-quater`, "v2 of this decision") to record what changed. A reader should never
>   have to mentally apply a sequence of revocations to figure out what is true now — the section should
>   just say what's true now. If a new decision on a topic supersedes an old one, the OLD text is deleted
>   and replaced; it does not stay alongside the new text "for history."
> - **No timeline language in the prose itself**: no `(jul/2026)`, no `pós-Sprint N`, no "this session",
>   no "found violated N times", no "already fixed / corrected on DATE". State the rule and — when it
>   genuinely helps a future agent avoid repeating a mistake — the concrete failure mode it prevents,
>   without dating it or narrating the session in which it was discovered.
> - **No references to the project's origin or any prior/legacy project it was inherited from.** Only
>   this project's current reality matters here. If a piece of legacy content is found (e.g. a stray
>   reference to a different product name), fix it and remove the reference — do not document that the
>   reference existed.
> - This applies to `architecture/*.md`, `conventions/*.md`, `design-system/*.md` and their indices.
>   `plan.md` is the one exception (§1.1): it is inherently a progress log for a single in-flight effort
>   and is archived when that effort ends — timeline language there is expected, not a violation.

### 4.1 When to update architecture.md

**Immediately after** any change that affects:

- File or folder structure (creation, removal, relocation)
- Paths, modules, domains or boundaries
- Architectural responsibilities or flow
- Import paths or module boundaries

> "Small", "local" or "temporary" structural changes are **NOT exempt**.
> If the corresponding file under `architecture/` is not updated after a structural change, future context reloads are **INVALID** and execution must **STOP** until synchronization is restored.
> `architecture/*.md` represents the **latest known structural reality**, not an aspirational design.
> Update the **thematic file** that owns the affected area (e.g. routes → `architecture/rotas.md`, components →
> `architecture/componentes.md`); touch `architecture.md` only to add/describe a **new** thematic file.

### 4.2 When to update conventions.md

After any change in:

- Execution strategy or constraints
- Irreversible decisions
- Non-obvious rules discovered during implementation
- New information relevant to project history

Write it into the **thematic file** that owns the subject (see the map in `conventions.md`). If the decision
belongs to an existing section, extend that section **in place**, keeping its original number.

### 4.3 When to update plan.md

After any:

- Step completion (mark as checked)
- Blockage, deviation or decision during execution
- New observations about implementation evolution

> ⚠️ **Scope (see §1.1):** record here only what belongs to THIS task — progress, findings, blockers.
> The moment something turns out to be a durable project rule, structural fact or locked decision, it
> goes to `conventions/*.md` or `architecture/*.md` **instead**, not here. `plan.md` is archived when the
> effort ends; anything left only inside it is lost.

Update the following sections in `plan.md`: roadmap, verification checklist, critical files, and the **current execution report**:

```
### 🗓️ Date:
### 👤 Executed by:
### ✅ Progress: (e.g., 16/21 items completed — ~76%)
### 📊 Detailed status:
### 🔍 Relevant findings:
### ⚠️ Problems identified:
### 📋 Immediate next steps:
### ✅ Recommended tests:
```

---

## 5 · CONTEXT PROTECTION (preventing memory loss)

This section consolidates all safeguards against context loss — whether from compaction, session reset, or token pressure.

### 5.1 Protected files (NEVER discard)

The following files are **persistent context** and must remain in active memory at all times:

- `README.md`
- `_docs-dev-coder/context.md`
- `_docs-dev-coder/architecture.md` (index)
- `_docs-dev-coder/conventions.md` (index)
- `_docs-dev-coder/plan.md` (when it exists — often absent, and that is normal)
- Active persona: `software-architect.md`
- Any other file explicitly marked as mandatory context
- **Plus:** every thematic file (`architecture/*.md`, `conventions/*.md`) opened for the CURRENT task —
  persistent for as long as that task is active

These files must **NOT** be summarized, compacted, abstracted or discarded.

> ⚠️ Thematic files **not** related to the current task are deliberately **out** of context — that is the
> point of the split, not an oversight. They are reloaded on demand when a task touches their theme.

### 5.2 Disposable context (allowed to compact)

Only the following may be compacted or removed:

- Obsolete versions of files already updated on disk
- Superseded diffs or previous implementations
- Prior reasoning steps no longer relevant
- Historical conversation content that does NOT represent the current truth

The current project state + the `architecture/*.md` snapshot **always override** past context.

### 5.3 After any compaction or context reset

Any automatic or implicit context event (auto-compact, summarization, truncation, memory cleanup, token pressure reset) is a **critical context event** and must be treated as a partial session restart.

**Immediately after**, before any further reasoning or execution:

1. Re-read all files from §1.1 (mandatory reading order) and the active persona.
2. **Re-open the thematic files of the task in flight** (§1.1-bis) — compaction discards them like anything
   else, and the indices do NOT carry their content.
3. Confirm with one sentence, **naming the thematic files reloaded**:
   > "Context reloaded after compaction: README, indices, plan, and `conventions/<x>.md` +
   > `architecture/<y>.md` for the current task are active."
4. If this confirmation cannot be made with certainty: **STOP**, re-read all mandatory files, do NOT proceed until confirmation is possible.

**Critical rules:**
- `context.md` is a derived summary and must **NEVER** replace re-reading `README.md`, the indices or the relevant thematic files after compaction.
- Reading `plan.md` or `context.md` alone is **NOT** sufficient to resume execution.
- Reading the **indices** alone is **NOT** sufficient either (§1.1-bis) — they contain no rules, only a map.
- Compaction does NOT preserve authoritative context. Only file reloading restores execution validity.
- Any action taken after compaction without revalidation is considered **INVALID**.

---

## 6 · REFERENCE: FULL VERIFICATION CHECKLIST

> This section is the expanded reference for §3.5. The Sprint Closure Protocol (§3.5) is the **authoritative trigger** — this section exists only as a detailed reference for edge cases and audits.

### 6.1 Context memory — protected files

The following must be in active memory at all times. If any is missing after a sprint or compaction, re-read immediately:

- `README.md`
- `_docs-dev-coder/context.md`
- `_docs-dev-coder/architecture.md` (index)
- `_docs-dev-coder/conventions.md` (index)
- `_docs-dev-coder/plan.md` (when it exists — often absent, and that is normal)
- Active persona: `software-architect.md`
- Any other file explicitly required by the current sprint
- The thematic files (`architecture/*.md`, `conventions/*.md`) covering the theme of the current sprint

### 6.2 Synchronization — expanded checks

- `architecture/*.md` reflects the **current** file/folder structure and responsibilities
- `conventions/*.md` reflects all new constraints, decisions or non-obvious rules
- Both indices still describe accurately what each thematic file holds
- `plan.md` has completed steps checked, observations documented, next step identifiable
- No files or folders were created, moved or removed without updating the matching `architecture/*.md`
- No import paths, module boundaries or domains diverge from `architecture/*.md`

### 6.3 Execution discipline

- Only the next planned step was executed
- No speculative or unapproved work was performed
- Current codebase was treated as the single source of truth

### 6.4 Reload safety

- If a new session starts now, re-reading the mandatory files will reproduce the exact same understanding
- No critical information exists only in transient conversation memory
- `README.md` is still accurate and reflects the current project intent
