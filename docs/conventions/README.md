# Conventions

Folded engineering standards. Populated once the stack is chosen (tech discovery → ADRs); the load-bearing summaries live in `AGENTS.md`, the detail lives here.

Expected docs:

| File | Covers |
|---|---|
| `coding-standards.md` | Readability, naming, immutability, error handling, typing |
| `testing-practices.md` | TDD flow, test structure, what to test at which layer |
| `content-and-seo.md` | Content authoring conventions, metadata, OG/social cards, accessibility bars |

Universal rules that apply regardless of stack (already in force via `AGENTS.md`):

- Readability first; KISS / DRY / YAGNI. Descriptive `verb-noun` function names.
- Immutability default: build new objects/arrays; never mutate inputs without a documented reason.
- Comprehensive error handling around I/O; never swallow errors silently.
- Avoid `any`; use precise types or `unknown` + narrowing. Comments explain **why**, not **what**.
