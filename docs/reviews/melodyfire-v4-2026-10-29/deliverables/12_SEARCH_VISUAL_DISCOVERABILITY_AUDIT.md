# Search, Visual Search, and AI-Search Discoverability Audit

## Baseline result

The reviewed v3 repository is a hash-routed client application with a static document title and meta description. The inspected tree has no `robots.txt`, sitemap, or route-specific metadata implementation. The Work experience uses modal project detail rather than a canonical public project document. These conditions make the portfolio visually rich for direct visitors but structurally weak for crawlers, social sharing, visual/image discovery, AI-search summarization, and durable first-party proof links. [1] [2]

| Requirement | Observed baseline | V4 requirement |
|---|---|---|
| Semantic canonical route | `/#/work` hash routing; project detail modal. | Public `/projects/:slug`, `/case-studies/:slug`, collection/capability routes; old hashes compatibility-mapped. |
| Clear H1 / functional descriptor | Page-level H1s exist; project pages do not. | Every approved project gets an H1, branded name, functional descriptor, phase, and visible evidence. |
| First-hand evidence | Mixed platform links/modal content. | Approved source/live links and first-party artefacts on each project route. |
| Limitations / status | Inconsistent card labels. | Human-approved phase, limitation, next gate, last verification. |
| Original media / rights / provenance | Current assets are displayed, but no inspected structured rights/provenance model. | Media record with alt, caption, creator, credit, rights/license, DigitalSourceType when applicable. |
| Per-route metadata | Static document head only. | Unique title, description, canonical, Open Graph, primary image, structured data, social-preview dimensions. |
| Sitemap / crawler reachability | No inspected robots or sitemap artifact. | XML sitemap, crawlable internal links, configurable crawler policy, accurate `lastmod`. |
| Visual search landing | Images are embedded on SPA routes. | Stable image/project landing pages that explain the work and link to approved sources. |
| AI-search usefulness | Broad generic description; weak project documents. | Human-visible evidence-rich HTML; no hidden machine-only copy. |

## Public document contract

Every important project should be meaningful without an interactive field, JavaScript enhancement, or a viewer’s prior brand knowledge.

1. **What is it?** Brand name and functional descriptor.
2. **What problem does it address?** Specific and public-safe.
3. **What did Jennipher contribute?** Clear role and collaborators/boundaries.
4. **How does it work?** Appropriate-level architecture/mechanism.
5. **What evidence exists?** Source, live, approved artefact, or public demo.
6. **What is different?** Verified differentiator, not superlative.
7. **What are the limitations?** Scope, maturity, accessibility/performance, or evidence boundary.
8. **What is its current status?** Human-approved phase with date.
9. **What is next?** Related project, offer, or carefully labelled next gate.

## Recommendations

### D-01 — Treat semantic project documents as the discoverability foundation

| Field | Decision |
|---|---|
| **Source class** | PROJECT_SPECIFIC / NEW_INFERENCE. |
| **Problem** | The hash-routed SPA and modal project details leave no stable, evidence-bearing document for each flagship. |
| **Recommendation** | Create canonical non-hash project/case-study routes with pre-rendered or server-rendered public HTML, route-aware metadata, approved structured data, links, and an old-hash migration map. Preserve the current Vite/React stack if it can satisfy these requirements with pathname routing and pre-rendering. |
| **Alternative** | Keep the hash router and improve modal content. |
| **Chosen against** | A beautiful public interface that cannot reliably be linked, crawled, previewed, or cited. |
| **Expected effect** | Better direct discoverability, shareability, search visibility, and AI-search answer quality. |
| **Test** | Validate rendered HTML, canonical, Open Graph preview, robots, sitemap, structured data, internal link crawl, direct route reload, old-hash redirect, and mobile share card. |
| **Confidence / reversibility** | 0.97 / EXPENSIVE |
| **Affected specification** | `references_portfolio_priorities.txt` §§22–28; current `App.tsx`, `client/index.html`, `vercel.json`. |

### D-02 — Use structured visual metadata as source-of-truth content, not SEO decoration

| Field | Decision |
|---|---|
| **Source class** | NEW_INFERENCE. |
| **Problem** | Art/media assets need source, rights, AI-provenance, and meaningful page context; generic media metadata risks being inaccurate or hidden. |
| **Recommendation** | Add approved media records with alt text, caption, creator, credit, copyright/license, source type, `DigitalSourceType` where relevant, renditions, focal point, and `lastReviewedAt`. Generate structured data from the approved record and use public image/project landing pages. |
| **Alternative** | Add generic alt text and JSON-LD independently of Studio records. |
| **Chosen against** | Metadata drift and implication that AI provenance or licensing has been verified when it has not. |
| **Expected effect** | More credible visual search and accessible media descriptions. |
| **Test** | Compare page content, media record, and emitted structured data; test image previews and screen-reader descriptions. |
| **Confidence / reversibility** | 0.91 / MODERATE |
| **Affected specification** | `references_portfolio_priorities.txt` §§9–12, 24; proposed media/content model. |

### D-03 — Build a first-party evidence graph; do not automate backlink activity

| Field | Decision |
|---|---|
| **Source class** | NEW_INFERENCE. |
| **Problem** | The current platform links broadly to external profiles rather than grounding individual project claims in reciprocal, canonical public evidence. |
| **Recommendation** | After source approval, link each public project page to its canonical repo/deployment and add a recommended follow-up change for the approved external repository README to link back. Maintain a link ledger. |
| **Alternative** | Mass outreach or automated third-party backlink generation. |
| **Chosen against** | Low-quality link tactics that do not improve factual evidence. |
| **Expected effect** | Better provenance, navigation, and credible discovery signals. |
| **Test** | Crawl the project↔repository↔deployment path and review every target for authority, public safety, and route stability. |
| **Confidence / reversibility** | 0.90 / EASY |
| **Affected specification** | `references_portfolio_priorities.txt` §27. |

## AI-search and crawler policy

No “GEO hack” or hidden `llms.txt` content is recommended. Human-visible, original, accurate public HTML is the canonical content. Crawler policy should be an approved, configurable decision that distinguishes search discovery from model-training permissions. Do not enable/disable any crawler until the owner approves the policy and the public content record is stable.

## References

[1]: ../EVIDENCE_LOG.md "Inspected route, metadata, and build evidence"
[2]: ../../melodyfire_handoff/melodyfire_manus_handoff_v4_2026-08-18/11_DISCOVERABILITY_SEARCH_CONTENT_REVIEW.md "Discoverability review protocol"
[3]: ../../melodyfire_handoff/melodyfire_manus_handoff_v4_2026-08-18/references_portfolio_priorities.txt "Route, metadata, and evidence-graph planning source"
