# Motion and Effects Grammar Review

## Baseline assessment

Melodyfire’s current aurora/mandala atmosphere creates strong distinction. The live home hero uses a visual field, gradient typography, and a large wordmark; the current implementation includes a global scroll-reveal hook and cursor glow. These effects support identity when they remain subordinate to readable content. They do not by themselves establish product evidence, professional clarity, or accessibility. [1] [2]

The v4 planning source proposes a responsive experience grammar with verbs such as enter, gather, lift, recede, canonicalize, snap, reveal, handoff, restore, acknowledge, bind, compile, project, morph, pulse, and ambient. This can reduce drift only if each verb maps to a consistent state transition and if every effect has a content purpose and reduced-motion/static equivalent. [3]

## Semantic grammar decision

| Motion / effect | Meaning | Recommended use | Reject when |
|---|---|---|---|
| **Enter** | A route or content block becomes available. | Short reveal of a page section after HTML is readable. | It delays primary heading or CTA comprehension. |
| **Gather** | Selected related items draw into a focus state. | Spatial collection focus or comparison context. | It hides other items before selection is clear. |
| **Lift** | An item becomes a candidate or active control. | Candidate state, focus-visible control, approved featured item. | It substitutes for a label or semantic state. |
| **Recede / blur** | Non-selected neighbours lose prominence. | Optional spatial focus only. | Evidence becomes unreadable or keyboard focus disappears. |
| **Canonicalize** | A draft/preview becomes an approved public document. | Publishing/editorial state, not ornamental animation. | It implies human approval that has not occurred. |
| **Snap** | Atlas/overview normalizes known topology. | Short spatial overview transition with an explicit control. | It reorders content for drama or delays retrieval. |
| **Reveal** | Supporting evidence becomes available. | Expand a caption/source panel after an explicit action. | It makes basic essential information hover-only. |
| **Handoff** | Visitor moves from proof to an offer/CTA. | Project-to-engagement transition. | It looks like a forced sales transition. |
| **Restore** | Return reconstitutes previous context. | Detail Back to collection with preserved state. | It does not restore filters/camera/selection. |
| **Pulse / ambient** | Live or atmospheric quality. | Subtle status/brand atmosphere only. | It consumes attention, motion budget, or battery without meaning. |
| **Glow** | Focus, active/living state, or a genuine procedural surface. | Buttons, focus ring, selected item, live specimen. | It decorates every component equally. |
| **Grain** | Materiality or print texture. | Approved art/material contexts. | It impairs text contrast or becomes universal noise. |
| **Parallax** | Meaningful depth. | Genuine layered scene or spatial specimen. | It is a generic scroll effect. |
| **Refraction / shader** | Material/brand atmosphere or actual realtime proof. | AETHER-like material work, selected hero surface. | It replaces semantic media or becomes the default gallery renderer. |

## System requirements

1. **One meaning per effect.** The same glow, blur, and motion profile should not communicate unrelated things across pages.
2. **No navigational delay.** Known-item retrieval, direct routes, contact, and case-study reading must be faster or equal with motion off.
3. **Static equivalence.** Every state should still be intelligible as a screenshot, on weak GPU, and with reduced motion.
4. **Media truthfulness.** A static image may crossfade into a real motion preview; it must not perform fake 3D rotation that implies nonexistent object depth.
5. **Performance containment.** Heavy visual work is lazy-loaded and isolated from the first route’s essential HTML.
6. **Accessibility.** Motion is never the only indicator of candidate, focus, active, published, error, or completion state.

## Recommendation

### V-01 — Adopt a small semantic motion token set and forbid decorative route blockers

| Field | Decision |
|---|---|
| **Source class** | NEW_INFERENCE informed by PROJECT_SPECIFIC baseline and FORMALIZED planning grammar. |
| **Problem** | A future experience grammar can become a library of aesthetic effects rather than a reusable language. |
| **Recommendation** | Define a limited motion-token system where `enter`, `lift`, `recede`, `reveal`, `restore`, and `handoff` have documented triggers, durations, reduced-motion equivalents, and acceptance tests. Keep `snap`, procedural shaders, and spatial-camera behaviours collection-specific. |
| **Alternative** | Allow page-level custom animations and use the full verb set everywhere. |
| **Chosen against** | Unbounded visual drift, mobile jank, and meaning that exists only in motion. |
| **Expected effect** | More coherent distinctiveness with less implementation and accessibility risk. |
| **Test** | Storybook/component tests or equivalent visual fixtures for default, focus-visible, active, reduced-motion, and low-capability states; task test with motion disabled. |
| **Confidence / reversibility** | 0.90 / MODERATE |
| **Affected specification** | `references_portfolio_priorities.txt` §§14–18; v4 Responsive Experience Grammar section not separately supplied. |

### V-02 — Keep shader/particle work as evidence-bearing specimens, not portfolio chrome

| Field | Decision |
|---|---|
| **Source class** | NEW_INFERENCE / SYNTHESIZED. |
| **Problem** | Expressive realtime effects risk becoming decorative page backgrounds that increase cost without proving real capability. |
| **Recommendation** | Use a bounded, lazy-loaded live specimen only where it demonstrates actual material/realtime work. Every specimen has a poster, HTML explanation, fallback image, and explicit launch control. |
| **Alternative** | Apply WebGL or particle fields to ordinary project browsing. |
| **Chosen against** | Visual spectacle that masks missing public proof and excludes weak devices. |
| **Expected effect** | Stronger technical credibility and safer performance. |
| **Test** | Compare initial route performance and comprehension with/without specimen load; verify fallback and reduced-motion. |
| **Confidence / reversibility** | 0.92 / MODERATE |
| **Affected specification** | `references_portfolio_priorities.txt` §§16–18. |

## References

[1]: https://melodyfire-studio.vercel.app/ "Live home visual baseline"
[2]: ../EVIDENCE_LOG.md "Repository and live-site motion observations"
[3]: ../../melodyfire_handoff/melodyfire_manus_handoff_v4_2026-08-18/12_MOTION_VISUAL_EFFECTS_GRAMMAR_REVIEW.md "Motion and effects grammar protocol"
