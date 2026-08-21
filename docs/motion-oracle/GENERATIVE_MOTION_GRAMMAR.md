# Generative Motion Grammar v0.1

Motion Oracle already classifies interface motion by user-facing role, brand dialect, semantic tag, token architecture, and content density. The generative grammar extends that authority into image-to-motion and procedural visual work without replacing those existing layers.

The governing distinction is:

**role / dialect describes why motion exists; topology / grammar describes how a source can move safely.**

## Prompt convention

Generative prompts should be assembled in this authority order:

`SUBJECT → STRUCTURE → PRESERVATION → MOTION GRAMMAR → LOCAL MOTION CHANNELS → REVEAL MECHANISM → MATERIAL RESPONSE → LIGHTING BEHAVIOR → CAMERA → TIMING / PHASE → FINAL / LOOP STATE → FAILURE EXCLUSIONS`

Aesthetic adjectives are lower authority than structure, target locality, numeric bounds, and preservation rules. "Psychedelic" is not permission to spin the whole image. "Dreamlike" is not permission to ghost or dissolve topology. "Iridescent" is not permission to recolor materials that are not optically iridescent.

## Topology before style

The grammar vocabulary in `client/src/content/motion-oracle/generativeMotionGrammar.ts` starts from ten source topologies:

- radial annular
- radial petaled
- lattice
- stratified relief
- directional procession
- network
- cellular
- architecture
- portrait anchor
- material macro

Each topology has a bounded motion grammar and preferred primitive vocabulary. The intended complexity comes from phase relationships, reveal order, depth, occlusion, material-specific lighting, and local choreography rather than uncontrolled global amplitude.

## Material semantics

Material terms are behavioral contracts, not palette synonyms.

- **wood**: rigid, matte/satin, grain remains attached to structure; no glow or rubbery bending.
- **paper**: dry, fibrous, foldable only at explicit construction boundaries; printed stipple/crosshatch must not crawl.
- **opal**: broad internal spectral fire with persistent scatter as light incidence changes.
- **labradorite**: mostly dark until a directional blue-green flash threshold is crossed.
- **abalone**: fine local green-violet-gold interference; never a broad liquid rainbow wave.

A useful material substitution test holds all motion constant and swaps only the material response. `opal → labradorite`, for example, should change *how and when light appears*, not the object's geometry or choreography.

## Motion modifiers

Modifiers are parameter profiles rather than decorative prose.

- `ceremonial`: low amplitude, ordered timing, long readable hold.
- `percussive`: fast attack, short hold, long settling tail.
- `respiratory`: one dominant inhale/exhale rhythm with small local lag.
- `mechanical`: explicit rigid hinges and piecewise motion.
- `psychedelic`: controlled multi-harmonic phase, counter-motion, pattern reveal, spectral response.
- `dreamlike`: soft temporal blending; classified high-risk when topology preservation matters.

The modifier table includes attack / hold / release ratios, phase behavior, amplitude bias, and failure risk so downstream systems can translate the description into controls.

## Experimental convention

When testing a prompt or renderer, change one control surface at a time while holding the reference image, model, seed, sampler, duration, and unrelated parameters constant.

Examples encoded in `SUBSTITUTION_HYPOTHESES` include:

- phase offset `0.08s → 0.34s`
- fold strength `0.35 → 0.65`
- easing `sineInOut → expoOut`
- distortion frequency `0.42 → 1.20`
- lens `48mm → 85mm` at the same dolly amount
- material `opal → labradorite`

The result should be judged against a prediction before the candidate is generated. This turns prompt iteration into an empirical control-surface study rather than post-hoc preference matching.

## System boundary

Motion Oracle owns:

- semantic motion grammar names and meanings
- topology vocabulary
- material-response meaning
- modifier and easing profiles
- failure taxonomy
- substitution hypotheses

Observation Ad Pipeline owns:

- provider-neutral Motion Program contracts
- evidence / preservation records
- deterministic compilation
- hashes, validation, calibration programs, and experiment receipts

Wan / Comfy execution systems own:

- graph and node bindings
- model / checkpoint / sampler / scheduler choices
- frame count and temporal latent implementation
- installed-node compatibility
- runtime execution and output receipts

This separation prevents Motion Oracle from becoming an execution engine and prevents renderer repositories from silently redefining the semantic language.

## Acceptance rule

A new semantic token or grammar is ready to become canonical only when:

1. its meaning is distinguishable from the existing vocabulary;
2. at least one calibration source exposes the behavior clearly;
3. a bounded parameter change produces the predicted perceptual difference;
4. prohibited failure modes are named;
5. downstream provider adapters can map it without changing the upstream meaning.
