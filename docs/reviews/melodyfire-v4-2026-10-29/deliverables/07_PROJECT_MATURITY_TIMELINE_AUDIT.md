# Project Maturity Timeline Audit

## Decision

Melodyfire should use a public **evidence timeline**, not a visual “unfinished” disclaimer and not a commit-derived maturity score. The recommended pattern is:

> **Project name → functional descriptor → what it enables → Current Phase → Working Evidence → Next Gate → Horizon**

The timeline should be expressed as **ORIGIN → FOUNDATION → CURRENT → NEXT GATE → HORIZON**. Only the first three may describe present or past facts, and only when verified. `LIVE` and `PILOT` remain human-gated states that require named public evidence. [1]

## Baseline audit

The current Work page exposes labels such as “Live,” “Vercel,” “Deployed,” “Ongoing,” “Published,” “Beta,” “Active,” “In Development,” “In Progress,” and “Available.” These labels are useful orientation signals, but the inspected public pages do not consistently include the source, project role, public route, limitation, or approval record necessary to make those maturity assertions self-validating. The handoff specifically identifies authority gaps for ChromaFlora, AURELITH, Kinexus, DLCOS, Image Analyzer, Particle Simulator, regenerative soil health, Mandala Laser, and certain repositories/deployments. [2] [3]

| Claim type | Current handling observed | Risk | Required v4 control |
|---|---|---|---|
| Live / deployed | Some card labels imply public availability. | Can imply production readiness or active use without evidence. | Human-gated phase plus canonical deployment/source and last verified date. |
| Beta / active / ongoing | Public status chips appear. | Ambiguous user impact and stability. | Define a phase glossary and show working evidence / known limitations. |
| In development / in progress | Public status chips appear. | Can read like a roadmap claim or an unfinished apology. | Present current evidence, next gate, and horizon without making future capability present tense. |
| Published | A label appears. | Publication/source may drift. | Link canonical document, date, author/contribution, revision policy. |
| Available / commercial | A label may imply purchasability. | Price, rights, fulfilment, and availability could be stale. | Link approved offer/purchase policy only. |

## Recommended phase vocabulary

| Phase | Public meaning | Minimum evidence | Forbidden inference |
|---|---|---|---|
| **FOUNDATION** | The problem, research, or architecture has been defined. | Approved framing, source/reference, design/protocol artefact. | That a user-facing system exists. |
| **PROTOTYPE** | A bounded interaction or technical experiment works under stated conditions. | Demo/capture, technical note, constraints, test date. | Production readiness, scale, or client adoption. |
| **VALIDATING** | The system is being tested against defined gates. | Test plan, observed current state, next test. | Pilot use or outcomes. |
| **PILOT** | A real, bounded external test is occurring. | Explicit owner-approved public evidence and boundaries. | General availability or success outcome. |
| **LIVE** | A public system is accessible and maintained within its stated scope. | Canonical URL, last verification, support/ownership boundary. | Adoption, conversion, or business impact without receipts. |
| **ARCHIVED** | A completed or historical project is retained as evidence. | Date, context, limitations, source artefact. | Current availability. |

## Project state compiler assessment

The proposed Project State Compiler can assist with **candidate phase drafting**, repository freshness, broken-link detection, and stale-data warnings. It must not infer `LIVE`, `PILOT`, commercial availability, outcomes, or maturity from commit frequency, deployment metadata, content length, or an AI summary. Human approval remains mandatory for external-facing state changes.

### T-01 — Build human-gated project phases from evidence, not repository activity

| Field | Decision |
|---|---|
| **Source class** | NEW_INFERENCE, constrained by PROJECT_SPECIFIC authority gaps. |
| **Problem** | Current card labels and future automation can turn weak signals into public maturity claims. |
| **Recommendation** | Store `phase`, `phaseEvidence`, `phaseApprovedBy`, `phaseApprovedAt`, `nextGate`, `horizon`, and `lastVerifiedAt` within the canonical record. Permit automation to propose updates only. |
| **Alternative** | Derive status dynamically from commit/deployment activity or let editors select unrestricted labels. |
| **Chosen against** | Automated or unreviewed status inflation. |
| **Expected effect** | Product-first framing that remains accurate about what is working, tested, and next. |
| **Test** | Attempt state transitions for a private repo, stale deployment, prototype-only artefact, and verified live public URL; confirm only the last can be marked LIVE after approval. |
| **Confidence / reversibility** | 0.97 / MODERATE |
| **Affected specification** | `references_portfolio_priorities.txt` §§7–8, 19; existing Studio project status fields. |

## Priority authority ledger entries

| Project / class | Public handling until resolved |
|---|---|
| ChromaFlora repository/deployment | Describe only the verified public experience and phase; do not imply repository authority. |
| AURELITH / Kinexus / DLCOS / Image Analyzer / Particle Simulator | Use no public detailed claim or canonical link until source resolution. |
| Regenerative soil-health work / Mandala Laser | State the smallest truthful description; separate concept/prototype from validated external work. |
| Private repositories | Never reveal the URL or describe proprietary details. Use approved public-safe summaries only. |

## References

[1]: ../../melodyfire_handoff/melodyfire_manus_handoff_v4_2026-08-18/06_PROJECT_REFRAMING_MATURITY_TIMELINE_PROTOCOL.md "Project maturity and timeline protocol"
[2]: https://melodyfire-studio.vercel.app/#/work "Observed project labels on current Work route"
[3]: ../../melodyfire_handoff/melodyfire_manus_handoff_v4_2026-08-18/references/CURRENT_REPO_CONTEXT_LAST_VERIFIED.md "Current repository and authority context"
