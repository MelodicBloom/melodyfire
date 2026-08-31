# Hovercraft evidence route receipt

Status: local working-tree evidence only. Nothing was pushed, merged, deployed, or submitted.

## Review URLs

- Local route: `http://127.0.0.1:5000/#/hovercraft`
- Forced fallback QA: `http://127.0.0.1:5000/?shader=fallback#/hovercraft`
- Candidate public route: `https://melodyfire.space/#/hovercraft` — **not deployed**
- Official role: `https://job-boards.greenhouse.io/hovercraft/jobs/4281732009`

## Preflight receipt

| Field | Verified value |
|---|---|
| Repository authority | `https://github.com/MelodicBloom/melodyfire.git` |
| Canonical production authority | Vercel project `melodyfire-studio`; `melodyfire.space` |
| Base branch | `master` |
| Base SHA | `2b3dba8fecb425fb83637518bb304ab7b208c16a` |
| Working branch | `test/melodyfire-ui-safety-net` |
| Working HEAD | `e7904e04e20c7caa80fb146cabad31a260162c5d` |
| Base relationship | Base SHA exists locally and is the merge-base of working HEAD |
| Package manager | npm (`package-lock.json`) |
| Build commands | `npm run build`; `npm run check`; `npm run test:routes` |
| Routing model | Wouter with `useHashLocation`; application URL is `/#/hovercraft` |
| Applicable `AGENTS.md` | None in the target repo or its ancestors |
| Initial dirty state | 21 modified tracked files plus 4 untracked paths; preserved |
| Required secret | None |

The clone contains only the remote tracking ref for the current test branch, not `origin/master`. The base SHA and authority are also recorded in the pre-existing `docs/design-gate/2026-08-21/01_AUTHORITY_LEDGER.md` and `04_DEPLOYMENT_AUTHORITY.md`.

## Selected evidence

| Project | Defensible artifact | Selection boundary |
|---|---|---|
| AURELITH / Melodyfire | Canonical Melodyfire repo, production authority ledger, and live portfolio | Melodyfire production is verified. AURELITH's standalone canonical repo/deployment is unresolved. |
| NACRE//OS | Public `MelodicBloom/nacre-orchid-atelier` README and source tree | Integration-stage design system; no release or production claim. |
| Observation Ad Pipeline | Verified `qt314wink/observation-ad-pipeline` repo, compiler, campaign contracts, tests, and receipts | Private, integration-stage work; access and public-safe case evidence remain gated. |

The live proof additionally reuses Shader Gallery's existing `spectral.mid.frag` and worker renderer from local artifact SHA `9735f0cf0fc1a004a3be083cb4f5fecc77714114`. Shader Gallery is explicitly labeled in development.

## Exact contribution and claim ledger

| Surface | Exact contribution stated on route | Provenance | Claim boundary |
|---|---|---|---|
| AURELITH / Melodyfire | Creative direction, information architecture, visual system, React/TypeScript implementation, and interactive canvas presentation | Target repo source, README, design-gate authority ledger | No standalone AURELITH authority or new deployment claim |
| NACRE//OS | Semantic profiles, token pipeline, GLSL surface library, React MaterialSurface, docs atlas, and five governance gates | Public NACRE README and local project registry | Integration-stage; no finished-product claim |
| Observation Ad Pipeline | Semantic creative contract, task compiler, provider adapters, motion directives, validation, and immutable run receipts | Private repo README, schemas, campaign files, tests, receipts | Private/integration-stage; deterministic provider receipt still gated |
| Live GLSL proof | Existing spectral specimen integrated in a worker-owned WebGL surface with pointer/touch/keyboard input, idle drift, DPR cap, visibility pause, loading status, and still fallback | Local Shader Gallery source plus this diff | Raw WebGL/GLSL evidence only; no R3F, Three.js, TouchDesigner, or hardware claim |
| Hovercraft fit | WebGL/GLSL, React/TypeScript, media pipelines, source control, QA, and receipts | Official Greenhouse role and the artifacts above | No invented experience length, metrics, work authorization, deployment, or submission status |

No metrics were added.

## Files changed by this task

Shared files touched carefully on top of pre-existing dirty changes:

- `client/src/App.tsx` — lazy route registration
- `client/src/components/Footer.tsx` — one internal evidence link

New implementation and evidence files:

- `client/src/pages/HovercraftEvidencePage.tsx`
- `client/src/components/hovercraft/HovercraftShaderProof.tsx`
- `client/src/workers/hovercraftShader.worker.ts`
- `client/src/styles/hovercraft-evidence.css`
- `script/verify-hovercraft-evidence.mjs`
- `docs/hovercraft-evidence/README.md`
- `docs/hovercraft-evidence/captures/desktop.png`
- `docs/hovercraft-evidence/captures/mobile.png`
- `docs/hovercraft-evidence/captures/interaction.png`

## Commands and results

The desktop shell did not expose npm on `PATH`. A pnpm fallback attempted to reconcile the npm installation and was stopped before changing dependencies. The installed npm entry points were then invoked directly with the bundled Node runtime.

| Command | Result |
|---|---|
| `node node_modules/typescript/bin/tsc` | PASS, before and after implementation |
| `node script/verify-route-safe-sections.mjs` | PASS: `route-safety:ok` |
| `node script/verify-accessibility-structure.mjs` | PASS: `accessibility-structure:ok` |
| `node script/verify-hovercraft-evidence.mjs` | PASS: `hovercraft-evidence:ok` |
| `node script/build.ts` | PASS: Vite client and esbuild server production build |

Build output confirms a lazy route chunk (~10.62 kB JS), route CSS (~7.99 kB), and a separate shader worker (~5.98 kB), before gzip where reported.

## Rendered QA

Flow under test: direct `/#/hovercraft` load or footer navigation → route-safe live-proof jump → pointer/keyboard shader response → evidence cards and contact links.

| Check | Result |
|---|---|
| Page identity / direct hash load | PASS at `http://127.0.0.1:5000/#/hovercraft` |
| Internal footer navigation | PASS; semantic link changed `/#/` to `/#/hovercraft` |
| Route-safe section navigation | PASS; URL remained `/#/hovercraft`, focus moved to `#live-proof` |
| Blank page / framework overlay | PASS; complete meaningful DOM, no overlay |
| Console health | PASS; no relevant errors or warnings |
| Live shader | PASS; worker reported ready |
| Keyboard input | PASS; canvas accepted ArrowRight and ArrowUp and retained focus |
| DPR cap | PASS; 643.6×518.4 CSS px rendered at 806×650 px (~1.25 DPR, below 1.5 cap) |
| Idle / visibility behavior | PASS structurally; worker defines idle drift and pause/resume messages |
| Non-WebGL/load fallback | PASS through `?shader=fallback`; still visible, canvas absent, no console errors |
| Reduced motion | PASS structurally; `prefers-reduced-motion` selects the same static fallback path; runtime lacked media emulation |
| Mobile 390×844 | PASS; no horizontal overflow, mobile menu present, primary action visible |
| Desktop 1440×1000 | PASS; fit statement and primary actions visible in first viewport |

Rendered QA used the Codex in-app Browser. The built static client was served from `dist/public` at `127.0.0.1:5000` because this Windows sandbox does not support the production server's hard-coded `0.0.0.0` bind. The production client and server build still passed.

## Fidelity ledger

There was no new concept image: this was a bounded route inside the existing Melodyfire design system. The accepted reference is therefore the deployed v3 token/component system and the existing Shader Gallery specimen.

| Comparison point | Evidence | Result |
|---|---|---|
| Existing palette and type | Melodyfire CSS variables and font tokens | Preserved |
| Global container/navigation | Existing `Nav`, `Footer`, and max-width conventions | Preserved; no nav redesign |
| Section order | Positioning → live proof → three cards → contact | Matches handoff |
| Live asset treatment | Existing spectral GLSL; existing abalone still fallback | Reused, not regenerated |
| Responsive layout | 1440×1000 and 390×844 viewport captures | No overflow or clipped primary action |
| Motion/accessibility | Worker/ref transient state; keyboard; reduced-motion fallback | Gates represented |
| Above-the-fold copy | H1, fit statement, claim boundary, two requested actions | No added metrics, pills, or decorative claims |

The first full-page animated-canvas screenshot produced Browser stitching artifacts, so the evidence uses stable viewport captures. This is a capture limitation, not a page layout defect.

## Captures

- `captures/desktop.png` — 1440×1000 first viewport
- `captures/mobile.png` — 390×844 first viewport
- `captures/interaction.png` — live shader after route-safe navigation and keyboard input

## Known limitations and unresolved fields

- Route is not deployed; `https://melodyfire.space/#/hovercraft` is only the candidate URL.
- Working branch is a protected preview/test branch, not `master`.
- The pre-existing dirty worktree remains mixed with this local diff; no unrelated changes were rewritten.
- AURELITH canonical repository and deployment URL remain unresolved.
- Shader Gallery canonical public URL remains unresolved; the reused source is pinned locally by SHA.
- Observation Ad Pipeline is private and has no public-safe case-study URL.
- Preferred application email needs owner confirmation: the current site uses `jennipher@melodicbloom.com`, while an older public README exposes a different address.
- Work authorization, years of professional experience, TouchDesigner, game-engine, hardware, fabrication, lighting/AV, travel, and on-site installation claims were intentionally not added.
- No video was captured because desktop/mobile screenshots and the interaction screenshot satisfied the evidence gate.
