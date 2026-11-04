# Evidence, Provenance, and Claim Audit

## Audit principle

A visually convincing project card is not evidence. Every public assertion must be classified as **VERIFIED_CURRENT**, **VERIFIED_NEEDS_REFRESH**, **INFERENCE**, **ROADMAP**, or **UNSUPPORTED**. Where an authority is unresolved, the public site should use the smallest truthful framing or remove the assertion. [1]

## Evidence register

| Claim / category | Observed presentation | Classification | Required action |
|---|---|---|---|
| Melodyfire live public experience exists at `melodyfire-studio.vercel.app`. | Directly loaded and captured. | **VERIFIED_CURRENT** | Retain as current baseline URL; reconcile against canonical production/domain ledger before using as final v4 authority. |
| Repository `MelodicBloom/melodyfire`, default `master`, contains React/Vite/TypeScript application. | Public repository inspection and local build. | **VERIFIED_CURRENT** | Retain for current-code evidence; do not infer deployment or database authority. |
| Master snapshot type-checks and builds locally. | `npm run check` and `npm run build` completed in isolated clone. | **VERIFIED_CURRENT** | State only as local build health at the reviewed commit. |
| PR #3 is a route-safety workstream. | Public PR inspection; open at review time. | **VERIFIED_CURRENT** | Keep separate from redesign; require browser/keyboard/axe/reduced-motion evidence before treating it as complete. |
| ChromaFlora, AETHER, Neumorphism, other projects exist as current Work cards. | Direct live Work observation. | **VERIFIED_NEEDS_REFRESH** | Validate canonical repo/deployment, contribution, scope, status, media rights, and public proof before flagship claims. |
| “Live,” “Vercel,” “Deployed,” “Published,” “Active,” “Available” project status labels. | Direct live Work observation. | **VERIFIED_NEEDS_REFRESH** | Convert to human-approved phase records with source/evidence/date. |
| ChromaFlora feature accurately represents its project. | Current feature uses Beats & Boxes image/alt with ChromaFlora text/modal. | **UNSUPPORTED / conflicting** | Fix identity conflict; block as proof until one canonical media/project record renders consistently. |
| Current production Supabase project and security policy. | Handoff states mismatch/unresolved authority. | **UNSUPPORTED** | Record canonical project reference, auth, RLS, storage, backups, and editor roles before migration. |
| AURELITH, Kinexus, DLCOS, Image Analyzer, Particle Simulator, soil-health work, Mandala Laser. | Handoff explicitly marks authority unresolved. | **UNSUPPORTED** | Do not publish detailed canonical claims/links until source resolution. |
| Specific business results, users, clients, conversion lift, or Fortune 500 usage. | No approved evidence supplied. | **UNSUPPORTED** | Do not state or allow AI Guide to infer. |
| Future spatial field, Live Specimen Lab, AI guide, Project State Compiler. | Present in planning source. | **ROADMAP** | Use future-tense and project-gated language only. |
| Optional spatial role after comparison testing. | Reviewer recommendation. | **INFERENCE** | Clearly label as recommendation, not current fact. |

## High-risk claim patterns

| Pattern | Why it is risky | Safe public alternative |
|---|---|---|
| “Live” | Can imply ongoing maintenance, general availability, and production readiness. | “Public prototype available at [canonical URL], last verified [date].” |
| “Pilot” | Can imply external users/partners and observed outcomes. | “Validation phase” until a named, approved pilot boundary exists. |
| “Deployed” | May hide whether deployment is a preview, demo, or canonical production. | “Public demonstration” with source/deployment role. |
| “Used by” | Implies client/user adoption and endorsement. | “Designed to explore” or omit until source-backed. |
| “Improved conversion” | Requires a metric, method, window, and approval. | “Designed to support [behaviour]”; show no result unless verified. |
| “Private repo” | Risks confidentiality and access disclosure. | “Private implementation; approved public summary available.” |
| “Patented” | Legal assertion needs authoritative source. | Omit unless public patent evidence is approved. |

## Claim-control model

Each public project field should carry: `claimText`, `claimClass`, `sourceRefs`, `visibility`, `approvedBy`, `approvedAt`, `lastVerifiedAt`, `expiresAt` where relevant, and `forbiddenClaims`. An editor should not be able to publish a `LIVE`/`PILOT` label, client outcome, canonical repo/deployment, or price promise without the required source and approval fields.

## Recommendation

### E-01 — Make claim class and source references mandatory publishing data

| Field | Decision |
|---|---|
| **Source class** | NEW_INFERENCE based on PROJECT_SPECIFIC evidence gaps. |
| **Problem** | Current presentation combines various project states and assertions without a visible authority model, leaving public credibility vulnerable to drift. |
| **Recommendation** | Attach a claim class and source reference to externally meaningful project fields. Block publishing for claims that require an absent source or approval. Show user-facing limitations/phase rather than internal claim metadata unless it adds value. |
| **Alternative** | Rely on individual editors to remember source boundaries in free-form copy. |
| **Chosen against** | A visually polished portfolio that becomes less trustworthy as it grows. |
| **Expected effect** | Consistent evidence boundaries across pages, metadata, AI context, offers, and spatial representations. |
| **Test** | Try to publish unverified LIVE status, client outcome, private repo, and unsupported price; verify the editor blocks or requires approved source evidence. |
| **Confidence / reversibility** | 0.96 / MODERATE |
| **Affected specification** | `references_portfolio_priorities.txt` §§2, 7–8, 19–20, 27–28. |

## References

[1]: ../../melodyfire_handoff/melodyfire_manus_handoff_v4_2026-08-18/13_EVIDENCE_PROVENANCE_CLAIM_AUDIT.md "Evidence and claim audit protocol"
[2]: ../EVIDENCE_LOG.md "Verified baseline evidence"
[3]: ../../melodyfire_handoff/melodyfire_manus_handoff_v4_2026-08-18/references/CURRENT_REPO_CONTEXT_LAST_VERIFIED.md "Authority gaps and repository context"
