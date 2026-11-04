# Conversion Paths and Offers

## Baseline assessment

Melodyfire currently provides **Get in Touch**, Services, Shop, children’s-art, and tool routes. The current home route also ends with a general collaboration prompt. This makes contact possible, but the visitor is largely responsible for translating an observed project into a suitable engagement. Historical low-ticket prompt/art paths are more prominent than evidence-backed high-value practice framing, which can anchor perceived value downward for prospective organizations. [1]

> **Conversion principle:** A portfolio CTA should complete the thought begun by the evidence. It should name the buyer’s problem, the relevant deliverable, the proof, the next conversation, and any boundary—not merely say “contact.”

## Recommended offer architecture

The following are **offer hypotheses**, not published services or price commitments. They may be presented only after an approved relevant proof record and Jennipher review.

| Offer hypothesis | Buyer | Problem | Indicative deliverable | Required proof | Objection to address | CTA | Price handling |
|---|---|---|---|---|---|---|---|
| Governed campaign systems pilot | Brand, cultural organization, innovation team | Creative campaign workflows lack traceability and operational controls. | Bounded discovery, evidence/authority map, prototype, pilot evaluation plan. | Approved Observation/Seed Loom-style evidence. | “Will this create an opaque AI workflow?” | Discuss a governed pilot. | **Hypothesis only; no public band until approved.** |
| Governed agent / evidence audit | Innovation or operations lead | AI/automation concepts outrun sources, permissions, and decision boundaries. | Claim/evidence audit, authority matrix, risk controls, pilot recommendation. | Approved governed-AI case evidence. | “Is this technical or strategic?” | Request an evidence audit. | **Hypothesis only.** |
| Interface archaeology / design-language reconstruction | Product, design-system, brand team | Interface drift or legacy visual system blocks controlled evolution. | Token audit, grammar recovery, component plan, priority prototype. | Approved reconstruction/system evidence. | “Will this become a full rebrand?” | Discuss a UI integrity audit. | **Hypothesis only.** |
| Executable effects language / realtime identity | Brand, creative director, experience team | Digital identity lacks demonstrable movement/material character. | Realtime visual language, interaction prototype, performance/fallback spec. | Approved shader/filter/realtime proof. | “Will it be accessible and performant?” | Explore a realtime identity prototype. | **Hypothesis only.** |
| Interactive/realtime creative prototype | Museum, arts, civic/cultural, innovation partners | A public idea needs an experiential demonstration without an unbounded platform build. | Bounded concept, interactive specimen, public-screen/mobile fallback, test plan. | Approved realtime/civic project proof. | “Can it work for real audiences and constraints?” | Plan a creative prototype. | **Hypothesis only.** |

## Conversion path model

| Visitor context | Required proof page content | Primary CTA | Secondary CTA | Avoid |
|---|---|---|---|---|
| Client who recognizes a similar problem | Problem, contribution, mechanism, phase, evidence, limitation. | Discuss a comparable project. | View related capability. | Generic contact with no context. |
| Hiring manager | Role, technical contribution, evidence links, architecture, current state. | View related technical proof. | Download/contact only if approved. | Commercial package language that hides contribution. |
| Creative buyer | Visual collection, provenance/rights, availability, commission boundary. | Request a commission or licensing conversation. | Explore related work. | Claiming availability/inventory without a current record. |
| Research/innovation lead | Research boundary, evidence, governance, next validation gate. | Discuss a pilot or audit. | Read method. | Unverified outcome claims. |

## Recommendation

### O-01 — Attach one approved engagement hypothesis to each flagship, after proof is established

| Field | Decision |
|---|---|
| **Source class** | NEW_INFERENCE. |
| **Problem** | Current navigation separates project evidence from services and leaves buyers to infer the commercial relevance. |
| **Recommendation** | Add a related-offer field to approved `ProjectRecord`s. On a project page, use a specific CTA that names the relevant conversation; retain a general contact path as a fallback. |
| **Alternative** | Keep Services separate and use generic contact CTAs on all projects. |
| **Chosen against** | A portfolio that inspires but does not convert proof into a next step. |
| **Expected effect** | Lower translation cost from evidence to engagement. |
| **Test** | First-click and qualitative interviews: ask a relevant buyer what Jennipher could help them do and what they would click next. |
| **Confidence / reversibility** | 0.87 / EASY once canonical records exist |
| **Affected specification** | `references_portfolio_priorities.txt` §§7–8, 29; current Home/Services/Work CTA patterns. |

### O-02 — Keep low-ticket art/prompt services in contextual, not practice-defining, positions

| Field | Decision |
|---|---|
| **Source class** | NEW_INFERENCE. |
| **Problem** | Prominent low-ticket or consumer-facing routes can unintentionally lead enterprise/agency visitors to infer a narrower value proposition. |
| **Recommendation** | Preserve Shop, commissions, and prompt/art work as valid offers, but place them under Gallery/Art or contextual project routes rather than at equal top-level priority with high-consideration practice entry points. |
| **Alternative** | Keep all offer types as peer primary-navigation choices. |
| **Chosen against** | Price/value anchoring that obscures the strategic and technical offer. |
| **Expected effect** | Better alignment between high-value proof and high-value inquiry, without removing art commerce. |
| **Test** | Compare recruiter/client IA task performance and conversion intent with current vs intent-led navigation. |
| **Confidence / reversibility** | 0.82 / MODERATE |
| **Affected specification** | `references_portfolio_priorities.txt` §§5–6, 29; current `Nav.tsx` and Home route. |

## Price-band boundary

No price-band hypothesis is justified by the reviewed evidence. Publish pricing only where an approved current offer, scope boundary, fulfilment model, and currency/tax policy exist. All rows above are discovery/pilot conversations until explicitly productized.

## References

[1]: https://melodyfire-studio.vercel.app/ "Current home CTAs and routes"
[2]: ../../melodyfire_handoff/melodyfire_manus_handoff_v4_2026-08-18/10_CONVERSION_REVENUE_OFFER_REVIEW.md "Conversion and offer review protocol"
[3]: ../../melodyfire_handoff/melodyfire_manus_handoff_v4_2026-08-18/references_portfolio_priorities.txt "Offer hypotheses and canonical record planning"
