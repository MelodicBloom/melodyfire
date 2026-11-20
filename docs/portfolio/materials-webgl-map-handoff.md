# Melodic Bloom material-site ↔ WebGL portfolio map

## Purpose
Feature **Melodic Bloom — Materials that respond** on Melodyfire's `/#/work` page alongside real WebGL implementation evidence, without confusing the design exploration with deployed shader technology.

## Three linked but distinct surfaces
| Surface | Authority | Public link / evidence | Status |
| --- | --- | --- | --- |
| Melodic Bloom — Materials that respond | Source ChatGPT Sites project | Public URL and state-page URLs not yet supplied/verified | Featured as an in-app design site; no fabricated public hyperlink |
| Shader Gallery | `MelodicBloom/shader-gallery` | https://melodicbloom.github.io/shader-gallery/docs/ | Public gallery URL inspected; hardware/browser visual QA remains separately gated |
| Abalone state-driven WebGL2 runtime | `MelodicBloom/shader-gallery/portfolio-runtime` | https://github.com/MelodicBloom/shader-gallery/tree/main/portfolio-runtime | Implementation source present; not claimed as hosted |

## Preservation contract for the ChatGPT Sites source
This PR cannot edit the in-app Sites project. Its per-material card/link behavior remains outside this repository. Any later source-site edit **must preserve** the existing material → interactive state-page mapping:

1. Keep one distinct, keyboard- and touch-operable link for every material with an existing state page.
2. Do not replace links with still images, a single generic gallery URL, noninteractive previews, or a redirect to the portfolio map.
3. Preserve deep-link targets and state/preset query information when present. Do not invent route names.
4. Externally linked state pages must be tested after publication for open, back, reload and direct navigation behavior; do not claim verification from screenshots alone.
5. If the site exposes a verified public URL, add that URL to the corresponding portfolio card; preserve individual material links inside the source site.
6. Distinguish rendered design previews from actual WebGL implementations, and label compile/runtime evidence separately from material accuracy or cross-device acceptance.

## Review gates (before any merge or deployment)
- [ ] Confirm public URL for the exact ChatGPT Site, and enumerate each current material/state-page destination.
- [ ] Inspect site source and compare a before/after map of destinations; no missing/renamed targets.
- [ ] Test keyboard, pointer, touch (physical device or recorded acceptance), reduced motion, back/reload, and broken-link behavior.
- [ ] Run `npm run check`, `npm run build`, and `npm run test:routes` for the Melodyfire branch.
- [ ] Browser-review the `material-project-map` section of `/#/work` and the public gallery from separate clean sessions.
- [ ] Obtain approval for any merge or deployment; this branch itself publishes nothing.

This change is additive to the public portfolio. It deliberately does not alter the source site or shader runtime.
