# CMS Scope Challenge

## Decision

**Extend the existing Studio; do not build a second CMS.** The present Studio already manages Projects, Artworks, Blog Posts, Products, and Inquiries through browser-side Supabase CRUD. Its current project shape is much thinner than a governed v4 portfolio record and does not provide the evidence, phase, media, presentation, source, or metadata controls proposed in the planning source. Migration is therefore a deliberate product/data-model project, not a front-end configuration exercise. [1] [2]

## Current gap

| Current Studio project capability | Missing for governed v4 public portfolio |
|---|---|
| Title, category, status, year, description, image, link, featured order. | Stable slug/canonical route, multiple capabilities/technologies, long narrative, contribution, evidence/source refs, phase approval, limitation, next gate, offers, metadata, public visibility policy. |
| Browser-side CRUD against an unresolved production Supabase authority. | Verified environment mapping, RLS/auth/storage audit, draft/publish protections, immutable media source policy, rollback. |
| Single projects panel. | Canonical `ProjectRecord` adapter and constrained associated entities for media, sources, offers, relations, SEO, and public AI context. |
| Minimal presentation data. | Bounded renderer preset, crop/focal point, text placement, interaction, motion profile, video behavior, accessibility fallback. |

## Presentation-mode decision

| Presentation mode | Decision | Rationale | Minimum condition |
|---|---|---|---|
| **Editorial Sequence** | **MUST-HAVE V1** | Best default for case studies, evidence, long-form reading, SEO, accessibility, and direct links. | Canonical project route and content sections. |
| **Spatial Showcase** | **V1.5 prototype** | May distinguish selected collections but must compete against editorial retrieval. | Data contract, dual access, keyboard, reduced motion, mobile controls, performance proof. |
| **Live Specimen** | **V1.5, selective** | Valuable where realtime behavior is the proof. | Explicit allowlist, lazy load, poster/static fallback, origin policy. |
| **Before/After** | **DEFER** | Valuable only where real paired evidence exists. | Two approved, truthful states and keyboard control. |
| **StorySlide** | **DEFER** | Could help visual narrative but is not necessary to establish v1 public evidence. | Reusable renderer and static reading path. |
| **Scrollytelling** | **DEFER** | High implementation and accessibility risk without an evidence story that needs it. | Native scroll, static/reduced-motion equivalence. |
| **Carousel** | **DEFER** | Generic sequential media can be introduced when content needs it. | Real user need and accessible control. |
| **Tri-View** | **REJECT by default** | Requires real multi-angle assets or a genuine 3D source. | Approved multi-view/3D evidence; no synthetic false angles. |

## Renderer/data contract

The public system should use **one canonical record plus bounded presentation configuration**, not arbitrary page-level CSS. The renderer may consume controlled enum values such as `editorial_sequence`, `spatial_showcase`, `live_specimen`, `before_after`, ratios, crop mode, text placement, motion profile, and click action. It may not accept unbounded styles, arbitrary embeds, fabricated quality options, or private URLs.

> The CMS should control **content and declared behaviour**, while the design system controls **how those choices render**.

## Publication architecture decision

| Model | Benefits | Risks | Decision |
|---|---|---|---|
| Direct-live CMS | Simple freshness. | Draft leakage, content drift, query coupling, unstable crawl output. | **REJECT for V1 public evidence.** |
| Public snapshot | Predictable, reviewable, cacheable, crawl-friendly. | Requires publish process and rebuild/snapshot mechanism. | **KEEP as public contract.** |
| Hybrid | Draft/live Studio plus approved public snapshot. | Adds publication workflow. | **RECOMMENDED.** |

The hybrid model gives Studio editors a draftable content surface while the public portfolio consumes an approved, versioned snapshot. This supports rollback, metadata generation, AI-context revisioning, staged deployment, and predictable discoverability.

## Recommendations

### CMS-01 — Establish the authority/security ledger before schema work

| Field | Decision |
|---|---|
| **Source class** | PROJECT_SPECIFIC / NEW_INFERENCE. |
| **Problem** | The handoff records a disagreement between repository Supabase configuration and the connected project; current Studio writes browser-side data. |
| **Recommendation** | Document and verify repo, branch, Vercel project, public domain, Supabase project ref, RLS, auth, storage, backups, and rollback before a migration or editor expansion. |
| **Alternative** | Begin schema changes against the currently reachable Supabase configuration. |
| **Chosen against** | Changing an unverified database or exposing draft data. |
| **Expected effect** | Safer migration and auditable content ownership. |
| **Test** | Environment ledger, least-privilege role review, RLS integration tests, draft/publish path, rollback drill. |
| **Confidence / reversibility** | 0.98 / MODERATE |
| **Affected specification** | `references_portfolio_priorities.txt` §§2, 8; existing `lib/supabase.ts`, `StudioPage.tsx`. |

### CMS-02 — Deliver editorial sequence and approved-public snapshot before presentation flexibility

| Field | Decision |
|---|---|
| **Source class** | NEW_INFERENCE. |
| **Problem** | Eight simultaneous presentation engines and direct-live publishing would create a broad, lightly governed surface. |
| **Recommendation** | Make V1 a typed project record, Studio draft/publish workflow, approved snapshot, semantic project route, metadata, and editorial sequence. Add one selected prototype only after that works. |
| **Alternative** | Build visual-mode controls first. |
| **Chosen against** | A presentation-rich CMS that retains today’s evidence and source drift. |
| **Expected effect** | One trustworthy public pipeline and a usable basis for later modes. |
| **Test** | Create, review, publish, render, rollback, and crawl one flagship without manual page-specific code. |
| **Confidence / reversibility** | 0.94 / EXPENSIVE |
| **Affected specification** | `references_portfolio_priorities.txt` §§7–13. |

## References

[1]: ../../melodyfire_handoff/melodyfire_manus_handoff_v4_2026-08-18/08_CMS_SCOPE_CHALLENGE.md "CMS Scope Challenge Protocol"
[2]: ../../melodyfire_handoff/melodyfire_manus_handoff_v4_2026-08-18/references/CURRENT_REPO_CONTEXT_LAST_VERIFIED.md "Current repository context"
[3]: ../EVIDENCE_LOG.md "Repository implementation observations"
