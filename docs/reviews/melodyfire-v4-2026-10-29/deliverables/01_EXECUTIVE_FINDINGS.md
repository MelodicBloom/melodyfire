# Melodyfire v4 — Executive Findings

**Review date:** 2026-08-20  
**Reviewer:** Manus AI  
**Scope:** Read-only independent product, narrative, interaction, mobile, discoverability, conversion, and evidence review.

## Decision summary

The verified v3 baseline is visually distinctive and technically buildable, but its professional value is obscured by an over-dense information architecture, duplicated project registries, unshareable project-detail patterns, and unresolved evidence authority. The current site succeeds at identity and atmosphere; it does not yet consistently let a prospective client or hiring manager answer **what Jennipher does, which work proves it, what is currently real, and how to engage**. [1] [2]

The supplied planning source describes a credible direction: a semantic public portfolio shell, a constrained Studio CMS, a canonical project registry, and an optional spatial exploration layer. The right strategic direction is therefore **editorial-first public evidence with optional spatial exploration**. The spatial field should **not** be approved as the primary Work browser at this stage. It may become a valuable secondary “Explore” mode only after project records, semantic detail routes, mobile controls, accessibility, and evidence contracts are proven. [3]

> **Core conclusion:** The next work should be an authority-and-information-architecture release, not a visual-redesign release. Resolve project identity, proof, public detail routes, and mobile navigation first. Then test a bounded hybrid spatial prototype against an editorial control.

| Priority | Finding | Source class | Consequence |
|---|---|---|---|
| P0 | The v3 Work page displays a Beats & Boxes image and alt text beside ChromaFlora metadata, and presents project details in a modal rather than a shareable route. | **OBSERVED / PROJECT_SPECIFIC** | Do not add a spatial layer or SEO work on top of unstable project identity. |
| P0 | At a 390×844 mobile capture, Work has no visible hamburger control; only the “All” filter is initially visible. | **OBSERVED** | Fix mobile navigation and filtering before judging v4 mobile ergonomics. |
| P0 | No verified A/B/C design outputs, fresh authority ledger, deployment audit, or production-Supabase audit were supplied. | **PROJECT_SPECIFIC** | Current design can be scored; v4 alternatives cannot be approved or ranked. |
| P1 | The live site has 13 primary destinations, and project content is duplicated across Home, Work, cards, and Studio-adjacent models. | **OBSERVED / PROJECT_SPECIFIC** | Establish one typed `ProjectRecord` and simplify top-level intent. |
| P1 | Public project pages, per-route metadata, sitemap, and canonical non-hash URLs are absent from the inspected implementation. | **PROJECT_SPECIFIC** | Treat public semantic routes as a prerequisite to spatial browsing and discoverability claims. |
| P2 | The v3 build and type check completed successfully, yet initial page identity uses large media and lazy-screen fallbacks. | **PROJECT_SPECIFIC** | Preserve the existing stack for the first delivery, while introducing performance budgets and fallback tests. |

## Major recommendations

### R-01 — Establish a canonical public project record before any new browsing mode

| Field | Decision |
|---|---|
| **Source class** | NEW_INFERENCE, grounded in PROJECT_SPECIFIC repository and live-site observations. |
| **Problem** | Work identity, state, media, CTA, and evidence are duplicated and can conflict. The current featured module visibly does conflict. |
| **Recommendation** | Introduce a validated canonical `ProjectRecord` and adapters for Home, Work, project detail, Studio, metadata, offers, and the future guide. Migrate one flagship end-to-end before broad conversion. |
| **Alternative** | Patch individual arrays and keep separate homepage/work/card/studio records. |
| **Chosen against** | More hard-coded registries and one-off detail modals. |
| **Why** | A spatial browser would otherwise make navigation visually novel without fixing its underlying source-of-truth defect. |
| **Expected effect** | Stable identity, fewer false claims, reusable semantic routes, and one evidence path per flagship. |
| **Test** | An automated fixture must render the same title, phase, primary media, source link, and CTA from all representations; a content reviewer must approve public fields. |
| **Confidence** | 0.96 |
| **Reversibility** | EXPENSIVE |
| **Affected specification** | `references_portfolio_priorities.txt` §§7–8; current `PortfolioPage.tsx`, `HomePage.tsx`, `ProjectCard.tsx`, `StudioPage.tsx`. |

### R-02 — Approve only an editorial-first shell with an optional spatial “Explore” mode

| Field | Decision |
|---|---|
| **Source class** | NEW_INFERENCE, informed by OBSERVED v3 browsing and FORMALIZED BSOF rules. |
| **Problem** | The spatial approach is proposed as a differentiator, but the package lacks tested A/B/C concepts and current evidence does not show it will outperform editorial scanning for known-item retrieval, evidence access, or mobile usability. |
| **Recommendation** | Make **Selected Work** an editorial grid/list with semantic project routes. Offer a clearly optional spatial layer for collections where relationship and memory add value; retain the editorial index and direct project pages as the canonical path. |
| **Alternative** | Immersive-first Work browser with the field as the principal gateway. |
| **Chosen against** | Requiring recruiters or clients to learn a camera/selection model before locating proof. |
| **Why** | The current baseline already has weak proof retrieval; spatial novelty should not mask that gap. |
| **Expected effect** | Faster qualification, stable crawlability, and a measurable role for spatial delight. |
| **Test** | Compare editorial, hybrid, and immersive prototypes with five personas on known-project retrieval, evidence discovery, task completion, motion preference, and mobile scroll ownership. |
| **Confidence** | 0.91 |
| **Reversibility** | MODERATE |
| **Affected specification** | `references_portfolio_priorities.txt` §§5, 13–17; no separate Codex design file was supplied. |

### R-03 — Resolve authority gates before CMS, database, AI, or deployment changes

| Field | Decision |
|---|---|
| **Source class** | PROJECT_SPECIFIC / NEW_INFERENCE. |
| **Problem** | The handoff identifies unresolved production Supabase and deployment authority. The repository contains browser-side Studio CRUD, while its public project state is not verified against the actual production database. |
| **Recommendation** | Freeze schema migration, public claim expansion, and AI context publication until the canonical repository, branch, Vercel project, production custom domain, Supabase project reference, RLS, auth, and storage policy are recorded in an authority ledger. |
| **Alternative** | Build the editor and migrate data against the presently reachable configuration. |
| **Chosen against** | A schema or content migration that could alter the wrong environment or publish unreviewed fields. |
| **Why** | Authority is a security and provenance constraint, not implementation overhead. |
| **Expected effect** | Safer migration, auditable ownership, and trustworthy public claims. |
| **Test** | A signed-off ledger maps each environment to repo/branch/deployment/database and verifies RLS, roles, storage, backup, and rollback. |
| **Confidence** | 0.98 |
| **Reversibility** | MODERATE |
| **Affected specification** | `references_portfolio_priorities.txt` §§2, 8, 20, 23; handoff current-context §§3–4. |

### R-04 — Fix mobile navigation, filter discoverability, and semantic card controls before v4 visual work

| Field | Decision |
|---|---|
| **Source class** | OBSERVED / PROJECT_SPECIFIC / NEW_INFERENCE. |
| **Problem** | The Work mobile capture lacks a visible menu control, reveals only one filter initially, and the current Work cards are implemented as click-handled `div` elements. |
| **Recommendation** | Add a mobile route test suite and correct the v3 baseline: a visible 44px menu control, accessible category-filter overflow/wrap behavior, semantic links/buttons for each card, keyboard progression, and a reduced-motion equivalent. |
| **Alternative** | Defer baseline defects until the spatial field is implemented. |
| **Chosen against** | Treating a mobile experience as a compressed desktop or expecting the spatial layer to absorb navigation failures. |
| **Why** | Mobile is a primary arrival path, and its defects confound any v4 comparison. |
| **Expected effect** | A valid control experience against which v4 can be measured. |
| **Test** | 320px, 390px, and 768px visual tests; keyboard-only walkthrough; automated accessibility scan; touch-scroll and filter tests. |
| **Confidence** | 0.95 |
| **Reversibility** | MODERATE |
| **Affected specification** | `references_portfolio_priorities.txt` §§5, 14, 18; current `Nav.tsx`, `PortfolioPage.tsx`. |

### R-05 — Defer global AI Guide and broad presentation modes until one flagship has approved public evidence

| Field | Decision |
|---|---|
| **Source class** | NEW_INFERENCE, constrained by PROJECT_SPECIFIC authority gaps. |
| **Problem** | A global guide and multiple presentation engines would multiply claim, safety, and maintenance surface before the data/evidence contract exists. |
| **Recommendation** | Pilot a project-specific, source-cited guide on one approved flagship only. Limit V1 presentation to **editorial sequence** plus a validated **spatial showcase** experiment for an appropriate collection; defer the remaining modes. |
| **Alternative** | Launch a global chat bubble and eight configurable presentation modes at once. |
| **Chosen against** | Broad, low-governance interactivity with no public source record. |
| **Why** | A controlled pilot reveals whether evidence visibility and refusal behavior create user value. |
| **Expected effect** | Reduced invention risk and a smaller operational surface. |
| **Test** | Source citation coverage, unsupported-claim refusal tests, private-repo refusal, accessibility review, and qualitative buyer usefulness study. |
| **Confidence** | 0.89 |
| **Reversibility** | MODERATE |
| **Affected specification** | `references_portfolio_priorities.txt` §§13, 19–21. |

## Required decision gates

The following inputs are absent and therefore block approval of the target design, rather than merely delaying polish.

| Gate | Missing or unresolved input | Owner | Exit evidence |
|---|---|---|---|
| G1 | Fresh baseline screenshots, current production URL/domain map, and performance/accessibility checks. | Codex | Verified capture set and test record. |
| G2 | A/B/C Figma concepts and interaction states for desktop, mobile, reduced motion, and keyboard. | Jennipher / design authority | Approved comparison package. |
| G3 | Canonical project/source ledger with public-safe claims, evidence links, status, and owner approval. | Jennipher + Codex | Reviewed ledger per flagship. |
| G4 | Deployment/Supabase authority, RLS/auth/storage audit, and rollback plan. | Technical owner | Signed authority ledger. |
| G5 | Editorial control versus hybrid spatial usability results. | Codex + reviewer | Persona task results and decision log. |

## Verification performed

The public repository was cloned without modification. `npm ci --no-audit --no-fund`, `npm run check`, and `npm run build` completed successfully on the reviewed `master` snapshot; this only verifies local type/build health, not production correctness, performance, accessibility, or data authority. [2]

## References

[1]: https://melodyfire-studio.vercel.app/ "Melodyfire live deployment"
[2]: https://github.com/MelodicBloom/melodyfire "MelodicBloom/melodyfire repository"
[3]: ../EVIDENCE_LOG.md "Review evidence log"
[4]: ../../melodyfire_handoff/melodyfire_manus_handoff_v4_2026-08-18/references_portfolio_priorities.txt "User-supplied portfolio priorities"
[5]: ../../melodyfire_handoff/melodyfire_manus_handoff_v4_2026-08-18/00_MANUS_MASTER_HANDOFF.md "Master handoff"
