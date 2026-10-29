# Mobile Discoverability Audit

## Scope

Mobile has been assessed as a separate arrival path at **390×844**, using live desktop/mobile observations and source inspection. This audit does not claim touch-device, screen-reader, reduced-motion, GPU, or network performance verification; those are required follow-up tests. [1]

## Observed baseline

| Area | Observation | Assessment |
|---|---|---|
| Home navigation | Brand, theme control, and hamburger are visible in the tested 390px capture. | **Pass at sampled width.** |
| Home first screen | Role descriptor, identity, positioning statement, and three CTAs are readable. | **Partial pass.** Professional value remains broad and CTA priorities compete. |
| Work navigation | Brand and theme control are visible, but no hamburger control appears inside the tested 390px frame. | **Fail.** A direct Work arrival lacks obvious route navigation. |
| Work filtering | Only “All” is visible at the start of the filter row. | **Fail.** Categories have no visible wrapping/overflow/discovery control at the sampled state. |
| Work hierarchy | Hero precedes filters and featured card by roughly 500px. | **Partial.** Identity is clear; project retrieval is delayed. |
| Project details | Current detail uses a modal from a generic project action. | **Partial.** Detail exists but lacks direct, shareable, search-friendly mobile landing. |
| Motion / fallback | No verified mobile motion or low-capability/reduced-motion test output supplied. | **AUTHORITY_BLOCKED.** |

## Required mobile content contract

For every approved flagship, mobile must communicate the project’s actual mechanism through a **single proof moment**. A proof moment can be a short captioned media loop, interactive sample, annotated still, before/after control, or a compact evidence summary. It must never depend on hover, unexpected audio, WebGL availability, or a spatial gesture that traps page scroll.

| Requirement | Minimum v4 behavior |
|---|---|
| Thumb reach / target size | Important primary controls are reachable, labelled, and at least 44×44 CSS pixels. |
| Navigation | Visible menu control on every direct route; a short intent-based menu rather than the current long flat list. |
| Direct arrival | Every flagship opens by semantic URL with title, visible descriptor, proof, phase, and CTA before immersive behavior. |
| Filtering | Accessible chips, select, or disclosure with visible overflow. Search/category state is URL-addressable when material. |
| Spatial gesture ownership | Native vertical scroll retains priority outside a consciously entered field. Explicit Overview, Detail, and Back controls are always present. |
| Media | Poster-first image/video; no audio autoplay; captions and fallback. Motion only demonstrates an actual mechanism. |
| Performance | No dependency on a large shader field for initial document usefulness; static poster/HTML fallback available. |
| Reduced motion | State changes become immediate or concise fades, without losing hierarchy or essential information. |
| Accessibility | No hover-only labels; semantic links/buttons; focus order and visible focus; keyboard equivalent. |
| Social/search | Open Graph preview and the semantic page both contain accurate, approved context. |

## Recommendation

### M-01 — Repair the direct Work arrival before measuring any v4 spatial interaction

| Field | Decision |
|---|---|
| **Source class** | OBSERVED / NEW_INFERENCE. |
| **Problem** | A 390px direct Work visit lacks a visible navigation control and exposes only the first filter option, invalidating the baseline as a fair mobile comparator. |
| **Recommendation** | Correct nav visibility, category control overflow/wrapping, target sizing, semantic card controls, and direct project routes before approving a new mobile browsing layer. |
| **Alternative** | Treat the existing mobile path as sufficient and focus investment on a new field. |
| **Chosen against** | Moving visual complexity upstream of basic wayfinding. |
| **Expected effect** | Valid mobile baseline and reduced abandonment for search/social arrivals. |
| **Test** | Screenshot and functional checks at 320px, 390px, 430px, and 768px. Exercise menu, filters, card-to-detail, direct route, back, reduced motion, keyboard, and no-WebGL state. |
| **Confidence / reversibility** | 0.97 / MODERATE |
| **Affected specification** | `references_portfolio_priorities.txt` §§5, 14–15, 18; current `Nav.tsx` and `PortfolioPage.tsx`. |

### M-02 — Use one mobile proof moment per flagship, not a generic interactive flourish

| Field | Decision |
|---|---|
| **Source class** | NEW_INFERENCE. |
| **Problem** | A uniform effect language risks showing touch APIs rather than explaining the work. |
| **Recommendation** | Author one truthful mobile proof moment in the canonical project record; use a static annotated fallback when no genuine interactive mechanism exists. |
| **Alternative** | Apply the same 3D tilt, parallax, spatial zoom, or animation to all cards. |
| **Chosen against** | Decorative interaction that increases cognitive or battery cost. |
| **Expected effect** | Faster understanding and a content-relevant reason to interact. |
| **Test** | Ask a mobile visitor what the project does after viewing the proof moment with animation enabled and reduced. |
| **Confidence / reversibility** | 0.88 / MODERATE |
| **Affected specification** | `references_portfolio_priorities.txt` §§11–16. |

## V4 mobile release gates

Do not publish a mobile spatial mode until direct path navigation, exact return state, native scroll boundary, explicit controls, one-handed reach, static fallback, reduced motion, and low-capability performance all pass. Any spatial field must retain a normal project route as the canonical answer to a search or social link.

## References

[1]: ../EVIDENCE_LOG.md "Desktop and 390×844 mobile evidence log"
[2]: ../../melodyfire_handoff/melodyfire_manus_handoff_v4_2026-08-18/07_MOBILE_INTERACTION_DISCOVERABILITY_REVIEW.md "Mobile interaction protocol"
[3]: https://melodyfire-studio.vercel.app/#/work "Current Work route"
