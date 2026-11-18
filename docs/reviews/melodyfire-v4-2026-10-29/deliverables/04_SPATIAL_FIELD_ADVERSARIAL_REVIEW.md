# Spatial Field Adversarial Review

## Decision

**Spatial role decision: OPTIONAL — conditionally approved for prototype only.**

The field should not be the primary Work browser in V1. The verified current baseline already has difficulty with project identity, evidence retrieval, durable detail destinations, and mobile wayfinding. A spatial interface cannot repair those defects and may deepen them if it becomes the sole index. The appropriate role is an optional **Explore Work** or collection-specific mode alongside a semantic editorial index and direct project routes. [1] [2]

## Falsification result

The working question was: *Can a visitor find a known project faster than with a grid, identify its contribution and evidence, and return to the same context without friction?* No Melodyfire spatial prototype, task data, or interaction captures were supplied. Therefore the field does **not** survive falsification as a primary navigator; it survives only as a conditional exploration hypothesis.

| Criterion | What the spatial proposal must prove | Present evidence | Review result |
|---|---|---|---|
| Candidate before selection | A clear nearby-item preview improves recognition without accidental navigation. | FORMALIZED reference only. | Unproven for Melodyfire. |
| Edge clipping | Clipped objects communicate a bounded continuation rather than accidental overflow. | FORMALIZED reference only. | Unproven; do not use as a default layout cue. |
| Atlas topology | Overview preserves positions and filters after free browsing. | FORMALIZED reference only. | Valuable invariant if a field is built. |
| Rapid snap | An atlas transition improves orientation rather than performing visual drama. | Planning hypothesis only. | Defer until task-tested. |
| Focus then detail | First action supplies relevant summary; second action enters semantic detail. | Planning hypothesis only. | Required if a field is built; must not slow recruiter tasks. |
| Exact return | Detail back restores camera, zoom, filter, selection/candidate, and collection. | FORMALIZED reference only. | Required acceptance criterion. |
| Motion preview on focus | Media movement reveals actual project behavior. | No approved project media mapping. | Restrict to genuine motion/realtime specimens. |
| Neighbor recession | Recession directs attention without hiding evidence. | No prototype. | Optional visual behavior, not a product requirement. |
| Keyboard access | Equivalent browse, selection, detail, overview, and return path exists. | No proof. | Required before public launch. |
| Reduced motion | Same hierarchy and semantics with immediate/fade state transitions. | No proof. | Required before public launch. |
| Mobile gesture ownership | Pan/pinch never traps native scroll; all functions have explicit controls. | No prototype; observed v3 Work mobile control issue. | Blocker for a spatial mobile release. |

## Comparison: editorial index versus spatial browse

| Task | Editorial/grid access | Spatial access | Decision |
|---|---|---|---|
| Find a known project by name, capability, or status | Strong when filter/search/URLs are clear. | Potentially slower because spatial memory must be learned. | **Editorial wins.** |
| Scan project type, maturity, contribution, and proof | Strong with concise card metadata. | Risk of hiding text until focus. | **Editorial wins.** |
| Read a case-study narrative and examine evidence | Semantic route and normal scroll are optimal. | Spatial depth adds no intrinsic value. | **Editorial wins.** |
| Browse related work and form a memory of the collection | Can become repetitive. | Spatial topology may create memorable relationships. | **Spatial may win.** |
| Explore art or true realtime/material specimens | A grid is functional but flat. | Field/focus behavior may demonstrate actual experiential qualities. | **Spatial may win, selectively.** |
| Mobile social/search arrival | Direct route is reliable. | Requires deep-link context and explicit controls. | **Editorial is mandatory.** |

## Conditions of conditional approval

A field may proceed beyond prototype only when all conditions below are verified.

1. **Canonical data:** Every object has one approved `ProjectRecord`, semantic label, public status, media fallback, detail route, and evidence path.
2. **Dual access:** Editorial index and direct semantic project URLs remain complete and equal in information value.
3. **Control semantics:** Candidate, Focus, Detail, Overview, Back, and reduced-motion states have specified keyboard and touch equivalents.
4. **Mobile safety:** Vertical page scroll wins by default. A field owns a gesture only after an unmistakable affordance/region and must offer explicit Overview/Back/Detail controls.
5. **Measured benefit:** Hybrid must meet or exceed editorial on known-item retrieval and evidence access, while improving memory or exploratory enjoyment.
6. **Performance:** A DOM/CSS implementation is preferred for ordinary media. WebGL is allowed only for a true procedural/realtime specimen, with poster/static fallback.

## Recommendations

### SP-01 — Define spatial navigation as an optional collection representation

| Field | Decision |
|---|---|
| **Source class** | NEW_INFERENCE informed by FORMALIZED BSOF. |
| **Problem** | Treating space as information architecture may trade professional retrieval for spectacle. |
| **Recommendation** | Place **Explore spatially** behind the editorial Selected Work index and enable it only for collections that have meaningful visual/relational browse value. |
| **Alternative** | Make the spatial field the default Work landing surface. |
| **Chosen against** | Requiring camera interaction before evidence access. |
| **Expected effect** | Preserves distinctive exploration without degrading qualification. |
| **Test** | Compare identical records in editorial and hybrid contexts with known-item, evidence, and return tasks. |
| **Confidence / reversibility** | 0.94 / MODERATE |
| **Affected specification** | `references_portfolio_priorities.txt` §§5, 13–17. |

### SP-02 — Use two-stage Focus/Detail only when Focus reduces explanation cost

| Field | Decision |
|---|---|
| **Source class** | NEW_INFERENCE. |
| **Problem** | A two-step model can become an extra tap that slows hiring/recruiter behavior. |
| **Recommendation** | Focus must reveal title, functional descriptor, phase, one evidence cue, and clear actions. Detail must be reachable via an explicit control and direct route. Skip or collapse Focus for known-item deep links. |
| **Alternative** | Require every visitor to perform Focus then Detail. |
| **Chosen against** | Interaction ceremony that hides basic content. |
| **Expected effect** | Spatial discovery stays optional; direct intent stays fast. |
| **Test** | Measure time-to-evidence from spatial focus, direct link, and editorial card. |
| **Confidence / reversibility** | 0.90 / MODERATE |
| **Affected specification** | `references_portfolio_priorities.txt` §14. |

### SP-03 — Quarantine particle/shader cross-pollination to a later Live Specimen Spatial Lab

| Field | Decision |
|---|---|
| **Source class** | SYNTHESIZED / NEW_INFERENCE. |
| **Problem** | Dynamic particle/shader research may be visually compelling but does not organize portfolio evidence. |
| **Recommendation** | Restrict Projection Leap, local fields, observer volumes, and shader-specific experimentation to an opt-in Live Specimen or Spatial Lab for verified compatible work. |
| **Alternative** | Apply these mechanics to the main Work gallery. |
| **Chosen against** | Making every portfolio object behave like a live simulation. |
| **Expected effect** | Preserves experimentation without degrading clarity or accessibility. |
| **Test** | Validate one genuine realtime specimen against static fallback, performance budget, and user comprehension. |
| **Confidence / reversibility** | 0.92 / MODERATE |
| **Affected specification** | `references_portfolio_priorities.txt` §§16–17. |

## Explicit rejection conditions

Reject the primary field if any of the following occurs: known-project retrieval is slower than editorial; cards lack semantic route equivalents; a visitor cannot complete all actions without pointer/hover; mobile scroll is trapped; reduced-motion removes meaning; the field hides source/phase/evidence; or performance causes degraded initial-page usefulness.

## References

[1]: ../../melodyfire_handoff/melodyfire_manus_handoff_v4_2026-08-18/04_SPATIAL_FIELD_ADVERSARIAL_REVIEW_PROTOCOL.md "Spatial Field Adversarial Review Protocol"
[2]: ../EVIDENCE_LOG.md "Verified baseline evidence"
[3]: ../../melodyfire_handoff/melodyfire_manus_handoff_v4_2026-08-18/references_portfolio_priorities.txt "V4 planning source and spatial profile"
