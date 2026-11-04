# Design Option Scorecard

## Evidence boundary

The handoff requires a weighted comparison of current Melodyfire with **A Editorial-first**, **B Hybrid Spatial**, and **C Immersive-first**. The supplied materials contain a v4 planning hypothesis but do not contain comparable A/B/C design outputs, approved first-screen copy, mobile variants, interaction prototypes, or testing results. This scorecard therefore reports a **current baseline** and an **authority block** for all three v4 concepts. [1] [2]

> A numerical result for absent concepts would create false precision. The decision available now is only whether to fund comparable concept testing; it is not which concept wins.

## Fixed weighting model

| Criterion | Weight | Current score | Rationale |
|---|---:|---:|---|
| Professional clarity | 20% | 3 | The role and visual point of view are clear, but professional value and priority capability families remain broad. |
| Evidence credibility | 18% | 2 | Visible project mismatch, mixed maturity labels, external/modular proof paths, and absence of public project pages reduce confidence. |
| Memorability / distinction | 15% | 4 | The aurora/mandala identity and expressive language are distinctive. |
| Ease of exploration | 12% | 2 | 13 primary routes, a mixed 18-project archive, modal detail, and generic controls increase scanning cost. |
| Conversion / hiring path | 12% | 2 | The site provides a contact link, but not consistently project-to-offer proof paths. |
| Narrative coherence | 10% | 3 | Regenerative thinking creates a recognizable through-line but does not reliably organize heterogeneous work for different buyers. |
| Mobile ergonomics | 6% | 2 | Home is legible; observed Work mobile navigation/filter behavior is materially weak. |
| Accessibility resilience | 4% | 2 | The inspected Work cards are click-handled `div`s, current hash anchors are a known safety concern, and no fresh keyboard/axe/reduced-motion evidence exists. |
| Technical / performance plausibility | 3% | 3 | The reviewed master snapshot type-checks and builds; large media and complex interactive surfaces require measured budgets. |
| **Weighted total** | **100%** | **2.63 / 5** | Reproducible calculation: `3×.20 + 2×.18 + 4×.15 + 2×.12 + 2×.12 + 3×.10 + 2×.06 + 2×.04 + 3×.03`. |

## Current baseline interpretation

A **2.63/5** score is not a rejection of Melodyfire’s identity. It indicates an experience whose distinctiveness outperforms its evidence, retrieval, and conversion infrastructure. The low score should drive sequencing: build semantic and evidentiary foundations before increasing interaction complexity. [3]

## V4 concept status

| Option | Required evidence absent | Current decision | What must be compared |
|---|---|---|---|
| **A — Editorial-first** | Desktop and mobile concept, project route/detail sample, IA, metadata model, motion/reduced-motion states. | **AUTHORITY_BLOCKED** | Comprehension, known-item retrieval, qualification speed, content density, conversion. |
| **B — Hybrid Spatial** | All A artifacts plus browser field states, controls, exact return, keyboard path, mobile gestures, fallback, performance budget. | **AUTHORITY_BLOCKED** | Whether optional exploration measurably improves memorability without harming retrieval/evidence. |
| **C — Immersive-first** | All B artifacts plus proof that spatial navigation is at least as fast and accessible as editorial access. | **AUTHORITY_BLOCKED** | Whether primary spatial browsing improves the critical client/recruiter tasks rather than only delight. |

## Conditional recommendation

The planning document’s **B Hybrid Spatial** direction is the most defensible **hypothesis to prototype**, not a selected design. It preserves conventional public routes and lets spatial behavior compete on the task where it may add value: memorable exploratory browsing. A should be the formal control, and C should face the strictest burden of proof. [2]

### S-01 — Run an editorial control and hybrid prototype before approving a spatial primary role

| Field | Decision |
|---|---|
| **Source class** | NEW_INFERENCE; FORMALIZED BSOF rules may inform implementation, not outcome. |
| **Problem** | The value of spatial browsing is assumed instead of demonstrated for Melodyfire’s buyer tasks. |
| **Recommendation** | Produce one equivalent editorial control and one hybrid prototype using the same 8–12 approved records. Treat C as a falsification candidate, not the default. |
| **Alternative** | Approve the spatial field as principal Work navigation from the planning document. |
| **Chosen against** | A visual-first conclusion unsupported by persona performance data. |
| **Expected effect** | Evidence-based selection of the interaction role. |
| **Test** | Five personas; measure time to find a known project, identify contribution/phase, open evidence, return to context, and reach an engagement CTA. Add motion preference, keyboard, 390px touch, and low-capability paths. |
| **Confidence** | 0.93 |
| **Reversibility** | MODERATE |
| **Affected specification** | `references_portfolio_priorities.txt` §5 and §§13–14. |

## Scorecard completion gate

An option is scorable only when reviewers receive its exact content inputs, responsive frames, state transition specification, project/evidence data, and an equivalent test plan. Weights must remain unchanged; a missing criterion is separately reported, not silently omitted.

## References

[1]: ../../melodyfire_handoff/melodyfire_manus_handoff_v4_2026-08-18/03_DESIGN_OPTION_SCORECARD_PROTOCOL.md "Design Option Scorecard Protocol"
[2]: ../../melodyfire_handoff/melodyfire_manus_handoff_v4_2026-08-18/references_portfolio_priorities.txt "User-supplied v4 planning source"
[3]: ../EVIDENCE_LOG.md "Verified baseline evidence"
