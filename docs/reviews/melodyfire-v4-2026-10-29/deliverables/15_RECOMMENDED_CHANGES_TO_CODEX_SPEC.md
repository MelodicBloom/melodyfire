# Recommended Changes to Codex Specification

## Patch-map boundary

No standalone, current Codex v4 specification or A/B/C design files were supplied. The closest planning artifact is `references_portfolio_priorities.txt`; the affected sections below use that document’s numbered sections. These are **patch-minded recommendations**, not an implementation instruction or a substitute for Jennipher’s design approval. [1] [2]

| ID | Action | Exact affected section / current file | Recommendation | Expected benefit | Cost / risk | Reversibility | Test | Confidence | Jennipher approval |
|---|---|---|---|---|---|---|---|---:|---|
| P-01 | **AUTHORITY_BLOCKED** | Planning §§2, 8, 20, 23; `lib/supabase.ts`, `StudioPage.tsx` | Freeze migration, public claim expansion, AI context publication, and deployment changes until an authority ledger verifies canonical repo, branch, Vercel project, domain, Supabase ref, RLS/auth/storage, backup, and rollback. | Prevents wrong-environment changes and unsupported claims. | Delays feature delivery; exposes process work. | MODERATE | Owner-reviewed ledger and RLS/rollback evidence. | 0.98 | No design approval; technical/content ownership approval required. |
| P-02 | **TIGHTEN** | Planning §3 Principle 1 and §6 Homepage Contract; `HomePage.tsx` | Lead with a buyer-readable professional proposition and 2–4 evidence-bearing capability families before doctrine. Retain regenerative thinking as differentiating method. | Faster 5s/20s comprehension. | Copy/design iteration. | EASY | Five-second recall and first-click test. | 0.88 | **Yes** |
| P-03 | **SIMPLIFY** | Planning §5 Navigation; `Nav.tsx`, `Footer.tsx` | Test an intent-based 5–6 item navigation: Work, Capabilities, Gallery, Research, About, Start a Project. Demote existing tools/commerce destinations to contextual/footer roles unless data proves primary intent. | Clearer wayfinding and mobile menu. | IA change; route discovery trade-offs. | MODERATE | Tree test, first-click test, analytics after release. | 0.86 | **Yes** |
| P-04 | **ADD** | Planning §§7–8; `PortfolioPage.tsx`, `HomePage.tsx`, `ProjectCard.tsx`, `StudioPage.tsx` | Define one validated `ProjectRecord` with identity, taxonomy, narrative, authority/evidence, media, commercial, AI, and SEO fields; migrate one flagship before broad conversion. | Resolves duplicate content and enables all downstream views. | Data model, migration, editorial work. | EXPENSIVE | Fixture renders identical approved record across all adapters. | 0.96 | **Yes** for content/presentation model |
| P-05 | **ADD** | Planning §§22–24; `App.tsx`, `client/index.html`, `vercel.json` | Implement canonical non-hash project/case-study routes, route-aware metadata, sitemap/robots policy, canonical/Open Graph/structured-data contracts, and old-hash compatibility mapping. Preserve Vite/React first if it meets acceptance requirements. | Shareable/crawlable evidence documents. | Routing/hosting migration risk. | EXPENSIVE | Direct reload, old hash compatibility, metadata/social preview/structured-data/crawl validation. | 0.97 | **Yes** for public route/metadata design |
| P-06 | **REJECT** | Planning §5 Option C and §14 profile | Do not approve immersive-first Work as the default. Require an editorial control and hybrid comparison. | Protects known-item retrieval and evidence access. | May disappoint novelty-first direction. | MODERATE | Persona comparison on retrieval, proof, return, mobile, keyboard, reduced motion. | 0.94 | **Yes** |
| P-07 | **DEFER** | Planning §§13–17 | Deliver editorial sequence as V1; pilot Spatial Showcase only as an optional collection mode after data/route/mobile/accessibility gates. Defer other presentation modes; reject Tri-View without real assets. | Limits CMS and interaction complexity. | Less initial visual breadth. | MODERATE | One approved collection passes dual-access and fallback tests. | 0.93 | **Yes** |
| P-08 | **ADD** | Planning §14; future spatial module | If a field proceeds, require deterministic topology, candidate-before-selection, Focus→Detail, explicit Overview, exact return state, keyboard route, reduced motion, native-scroll boundary, and semantic detail route. | Trustworthy exploratory interaction. | Complex state/gesture implementation. | MODERATE | State/gesture/keyboard/mobile/return performance fixtures. | 0.90 | **Yes** |
| P-09 | **SIMPLIFY** | Planning §17 | Quarantine particle-field, Projection Leap, local modifiers, observer volumes, and cross-pollination concepts to a later Live Specimen Spatial Lab. | Prevents unrelated research from redefining the main gallery. | Defers a creative direction. | MODERATE | Selected realtime specimen validates useful behaviour and fallback. | 0.92 | **Yes** |
| P-10 | **TIGHTEN** | Planning §§11–12, 18; motion system/current hooks | Use a small semantic motion token set and require static/reduced-motion equivalence. Use WebGL/shaders only where genuine procedural/realtime content is being demonstrated. | Consistent identity with lower performance/accessibility risk. | Token design and visual review. | MODERATE | Component/visual fixtures with motion on/off and low-capability fallback. | 0.90 | **Yes** |
| P-11 | **ADD** | Planning §19 | Pilot a project-specific, source-cited explainer only after a flagship evidence record is approved. Add refusal/no-mutation policy and server-side gateway boundary. | Bounded useful guidance and claim safety. | Server/API security and content review. | MODERATE | Adversarial refusal suite and 100% factual-source coverage. | 0.94 | **Yes** for voice/UX |
| P-12 | **TIGHTEN** | Planning §29; Home/Services/Work CTA patterns | Attach one approved engagement hypothesis to each flagship; contextualize low-ticket art/prompt offers instead of making them practice-defining. Publish no price bands without approved current offers. | Converts proof into credible next steps. | Offer strategy and copy approval needed. | EASY | Buyer comprehension and first-click inquiry test. | 0.87 | **Yes** |
| P-13 | **ADD** | Planning §§7–8, 19–20; Studio schema/editor | Add source/claim class, approval, last verification, phase evidence, limitation, next gate, and forbidden-claim data to public record controls. | Prevents claim drift across web, metadata, AI, and offers. | Editorial workflow complexity. | MODERATE | Attempt to publish unsupported status/outcome/private-link; confirm block. | 0.96 | Content-approval policy required |
| P-14 | **KEEP_AS_IS** | Current repository boundaries / PR #3 | Keep route-safety repair separate from v4 redesign. Do not merge visual/IA work into the safety PR. | Preserves reviewability and lowers regression risk. | Requires sequencing discipline. | EASY | PR-specific browser, keyboard, axe, reduced-motion, and external-link evidence. | 0.98 | No |
| P-15 | **ADD** | Planning §4 and v4 review process | Produce A/B/C design package with equivalent content, responsive frames, state model, fallback, and testing plan before final design selection. | Makes selection evidence-led. | Design effort before implementation. | EASY | Design review with Jennipher, then persona comparison. | 0.99 | **Yes** |

## Ordered implementation sequence

1. **Authority and baseline repairs:** P-01 and P-14; correct observed Work mobile control/filter and featured-project identity defects.
2. **Information architecture and public content:** P-02, P-03, P-04, P-13.
3. **Public-document/discoverability foundation:** P-05 and the editorial-sequence part of P-07.
4. **Offer and narrative refinement:** P-12, aligned only to approved project proof.
5. **Prototype/validate interaction:** P-15, then P-06/P-08/P-09/P-10 as relevant.
6. **Bounded intelligence:** P-11 only after approved public records and routes exist.

## Explicitly rejected or deferred assumptions

- A visual spatial field cannot be approved as a primary Work browser from engineering references alone.
- Current commit or deployment activity cannot infer public maturity, deployment quality, pilot status, or outcomes.
- A second CMS is not justified; existing Studio is the correct extension point after authority validation.
- A global AI chat surface is not justified before source governance and public project records.
- Eight presentation modes should not be implemented as a V1 capability.
- External repositories must not be modified in this Melodyfire phase; only recommended follow-up targets belong in the link ledger.

## References

[1]: ../../melodyfire_handoff/melodyfire_manus_handoff_v4_2026-08-18/14_RECOMMENDED_CHANGES_TO_CODEX_SPEC_PROTOCOL.md "Codex spec patch protocol"
[2]: ../../melodyfire_handoff/melodyfire_manus_handoff_v4_2026-08-18/references_portfolio_priorities.txt "User-supplied v4 planning source"
[3]: ../EVIDENCE_LOG.md "Verified review evidence"
