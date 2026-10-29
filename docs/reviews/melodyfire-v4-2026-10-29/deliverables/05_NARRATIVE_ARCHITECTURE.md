# Narrative Architecture Review

## Narrative decision

Melodyfire should be presented as a **professional practice with a distinct method**, not as a doctrine-led collection of unrelated experiments. The current site’s regenerative language is memorable and valuable, but the first screen must first answer what Jennipher does professionally, what proof exists, and how a visitor can engage. [1]

> **Working thesis:** Jennipher Troup is a creative technologist who builds governed AI systems, realtime experiences, and executable design languages for organizations that need both differentiation and accountability.

This is working copy, not a claim that any named system is deployed or commercially proven. It should be validated with Jennipher’s design approval and the authority ledger.

## Recommended capability architecture

| Capability family | Buyer-readable meaning | Appropriate proof format | What it must not imply |
|---|---|---|---|
| **Creative Technology** | Realtime graphics, interactive systems, motion, audio-reactive and experiential prototypes. | Live specimen, annotated build, performance/fallback note. | That all work is production deployed or uses WebGL. |
| **Governed AI + Creative Systems** | Controlled AI workflows, provenance, decision boundaries, and creative tooling. | Source-led case study, policy/constraint summary, public-safe demo. | Client adoption, private prompt access, or unverified outcomes. |
| **Design-Language Reconstruction** | Visual grammar, semantic tokens, design-system recovery, and controlled extension. | Before/after evidence, token model, documented reconstruction. | A proprietary client relationship or original authorship without approval. |
| **Evidence → Decision → Implementation** | Research, synthesis, service design, pilots, and bounded implementation. | Research boundary, contribution, decision artifact, phase/limitation. | Live/pilot status without explicit human-gated evidence. |

The supplied planning source names the same four families as a working taxonomy. It is clearer to buyers than the existing navigation’s mixture of media types, tools, portals, and services. [2]

## Test of the four “territories” model

The handoff asks whether the territories—Intent → Intelligence → Governance; Language → Material → Interface; Realtime → Motion → Simulation; Ecology → Fabrication → Physical Systems—give visitors a mental map. They are interesting **secondary lenses**, but they are not recommended as primary navigation labels. They describe ways of thinking rather than problems a buyer is trying to solve.

| Use | Decision | Why |
|---|---|---|
| Top-level navigation | **REJECT** | Buyers should not need to translate abstractions into a route choice. |
| Project detail / related-work graph | **KEEP, selectively** | Territories can reveal relationships across heterogeneous work after a visitor has selected a project. |
| About / method explanation | **KEEP, tightened** | They can make the practice memorable when presented as a framework with evidence anchors. |
| Spatial collection labels | **DEFER** | First prove that visitors understand the four capability families and content records. |

## Alternative umbrella formulations

The phrase **“systems for translating intent across representations”** is elegant but too abstract as the principal commercial thesis. Test the following alternatives in recruiter/client language.

| Formulation | Strength | Risk | Best placement |
|---|---|---|---|
| **Creative technologist building governed AI systems, realtime experiences, and executable design languages.** | Names role, capability, and differentiator. | Slightly dense; may need controlled word choice. | Homepage first viewport / About. |
| **I turn complex ideas into clear interactive systems, from evidence and visual language to working experiences.** | Human, outcome-oriented, and accessible. | Less technically distinctive. | Intro paragraph / conversion pages. |
| **Designing accountable digital experiences where research, creative technology, and implementation stay connected.** | Strong fit for client/innovation audiences. | Realtime/AI specificity can become implicit. | Services / Research / case-study intros. |

## Flagship descriptor standard

Every approved flagship should use the following structure; no detail should be invented when source authority is incomplete.

| Field | Required public content | Authority rule |
|---|---|---|
| Canonical name | Approved project title. | Preserve unless Jennipher changes it. |
| Functional descriptor | What the project is in buyer language. | Must not inflate maturity. |
| One-sentence outcome | What it enables or demonstrates. | Use “demonstrates” for portfolio proof when outcomes are not verified. |
| Problem / contribution | The problem and Jennipher’s defined role. | Omit or mark boundary when unresolved. |
| Architecture / mechanism | How it works at the appropriate public level. | No private repo or secret disclosure. |
| Evidence | Live URL, approved repo, source artefact, or visible demonstration. | Link only first-party or approved sources. |
| Current phase / limitation | Current, truthful state and boundary. | Human-gated for LIVE/PILOT. |
| Next gate / horizon | The next validation action or planned interval. | Label as roadmap; never present tense. |
| Professional proof role / offer | What capability it demonstrates and relevant engagement. | Match only approved offers. |
| CTA | Read case study, inspect proof, enquire, or view related work. | Must have a stable public route. |

## Recommendation

### N-01 — Make capability families primary and territories a secondary relationship layer

| Field | Decision |
|---|---|
| **Source class** | NEW_INFERENCE based on PROJECT_SPECIFIC current IA and planning taxonomy. |
| **Problem** | Existing labels and the proposed territories risk making visitors decode an internal conceptual system before they can select a useful path. |
| **Recommendation** | Use four buyer-readable capability families as the primary taxonomy. Use territory relationships on project pages, a method map, and optional spatial/exploratory contexts only. |
| **Alternative** | Make the territory names the main navigation. |
| **Chosen against** | Abstract terminology as the front door. |
| **Expected effect** | Faster comprehension while retaining a distinctive intellectual framework. |
| **Test** | First-click test: identify a route for a realtime experience, governed-AI workflow, design-system need, and research-to-implementation project. |
| **Confidence / reversibility** | 0.90 / MODERATE |
| **Affected specification** | `references_portfolio_priorities.txt` §4; v4 concepts require Jennipher approval. |

## References

[1]: https://melodyfire-studio.vercel.app/ "Live Melodyfire home page"
[2]: ../../melodyfire_handoff/melodyfire_manus_handoff_v4_2026-08-18/references_portfolio_priorities.txt "Working four-family taxonomy"
[3]: ../../melodyfire_handoff/melodyfire_manus_handoff_v4_2026-08-18/05_NARRATIVE_AND_ECOSYSTEM_REVIEW.md "Narrative and Ecosystem Review Protocol"
