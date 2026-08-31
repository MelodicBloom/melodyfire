export type MotionTopology =
  | 'radial_annular'
  | 'radial_petaled'
  | 'lattice'
  | 'stratified_relief'
  | 'directional_procession'
  | 'network'
  | 'cellular'
  | 'architecture'
  | 'portrait_anchor'
  | 'material_macro';

export type MotionGrammarId =
  | 'radial.counterphase'
  | 'radial.hinged_aperture'
  | 'lattice.excavation'
  | 'relief.stratified'
  | 'directional.procession'
  | 'network.propagation'
  | 'cellular.diffusion'
  | 'architecture.depth'
  | 'portrait.anchor'
  | 'material.macro';

export type MotionPrimitive =
  | 'rotate.local'
  | 'rotate.counterphase'
  | 'translate.radial'
  | 'translate.tangential'
  | 'translate.depth'
  | 'fold.root_hinge'
  | 'fold.medial_ridge'
  | 'fold.saddle'
  | 'fold.counter'
  | 'reveal.occlusion'
  | 'reveal.mask_growth'
  | 'reveal.density'
  | 'reveal.aperture'
  | 'light.specular_sweep'
  | 'light.vein_propagate'
  | 'light.caustic_confined'
  | 'light.rim_migrate'
  | 'network.propagate'
  | 'network.tension'
  | 'cell.normal_displace'
  | 'cell.neighbor_diffuse'
  | 'camera.dolly'
  | 'camera.pan'
  | 'camera.focus_rack'
  | 'temporal.phase_offset'
  | 'temporal.pulse'
  | 'temporal.settle'
  | 'temporal.inverse_reassemble';

export type MaterialResponseId = 'wood' | 'paper' | 'opal' | 'labradorite' | 'abalone';
export type MotionModifierId =
  | 'ceremonial'
  | 'percussive'
  | 'respiratory'
  | 'mechanical'
  | 'psychedelic'
  | 'dreamlike';
export type EasingProfileId = 'sineInOut' | 'smoothstep' | 'expoOut' | 'linear';

export interface MotionGrammarDefinition {
  id: MotionGrammarId;
  topology: MotionTopology[];
  description: string;
  preferredPrimitives: MotionPrimitive[];
  complexitySource: string;
  guardrail: string;
}

/**
 * Provider-neutral material dimensions. Every value is normalized to [0, 1];
 * adapters own conversion into renderer-specific controls and physical units.
 */
export interface NormalizedMaterialBaseline {
  surfaceRoughness: number;
  specularResponse: number;
  emissiveResponse: number;
  subsurfaceScatter: number;
  angularFlash: number;
  microstructureDensity: number;
}

export interface MaterialResponse {
  id: MaterialResponseId;
  description: string;
  motionResponse: string;
  lightingResponse: string;
  prohibitedShortcut: string;
  baseline: NormalizedMaterialBaseline;
}

export interface ModifierProfile {
  id: MotionModifierId;
  description: string;
  attackRatio: number;
  holdRatio: number;
  releaseRatio: number;
  phaseBehavior: string;
  amplitudeBias: 'low' | 'medium' | 'high';
  failureRisk: 'low' | 'medium' | 'high';
}

export interface EasingProfile {
  id: EasingProfileId;
  cssApproximation: string;
  useWhen: string;
  avoidWhen: string;
}

/**
 * Semantic priority tiers, not a serialized prompt order. Sections within a
 * tier are unordered; the Observation Ad Pipeline compiler owns provider-
 * specific linearization.
 */
export const PROMPT_SECTION_PRECEDENCE = {
  invariants: ['subject', 'structure', 'preservation', 'failure_exclusions'],
  motionIntent: ['motion_grammar', 'local_motion_channels', 'reveal_mechanism'],
  responseContext: ['material_response', 'lighting_behavior', 'camera'],
  temporalContract: ['timing_and_phase', 'final_loop_state'],
} as const;

export const GENERATIVE_MOTION_GRAMMARS: MotionGrammarDefinition[] = [
  {
    id: 'radial.counterphase',
    topology: ['radial_annular'],
    description:
      'Nested radial regions move at different signed amplitudes and phases while an outer anchor remains fixed.',
    preferredPrimitives: ['rotate.local', 'rotate.counterphase', 'reveal.density', 'light.specular_sweep'],
    complexitySource: 'phase relationships between local regions rather than high global rotation amplitude',
    guardrail: 'A radial image is not authorization for whole-object spin.',
  },
  {
    id: 'radial.hinged_aperture',
    topology: ['radial_petaled'],
    description:
      'Repeated petal sectors articulate from explicit hinge roots, exposing underlayers through physical occlusion.',
    preferredPrimitives: ['fold.root_hinge', 'fold.counter', 'reveal.occlusion', 'light.vein_propagate'],
    complexitySource: 'sector relay, contact-shadow change and material reveal',
    guardrail: 'Preserve petal count, outer silhouette and edge attachment.',
  },
  {
    id: 'lattice.excavation',
    topology: ['lattice'],
    description:
      'A fixed lattice reveals independently moving or illuminated underlayers through its existing apertures.',
    preferredPrimitives: ['translate.depth', 'reveal.mask_growth', 'light.caustic_confined', 'temporal.phase_offset'],
    complexitySource: 'node activation and changing occlusion through stable topology',
    guardrail: 'Never redraw, multiply or rotate the complete lattice.',
  },
  {
    id: 'relief.stratified',
    topology: ['stratified_relief'],
    description:
      'Depth planes separate, hinge or settle while contact shadows communicate physical layer order.',
    preferredPrimitives: ['translate.depth', 'fold.medial_ridge', 'fold.saddle', 'reveal.occlusion'],
    complexitySource: 'depth separation, fold hierarchy and shadow response',
    guardrail: 'Rigid craft materials do not behave like rubber or liquid.',
  },
  {
    id: 'directional.procession',
    topology: ['directional_procession'],
    description:
      'Motion propagates along a legible directional path such as a crest, contour, sequence or narrative layer.',
    preferredPrimitives: ['translate.tangential', 'temporal.phase_offset', 'camera.pan', 'temporal.settle'],
    complexitySource: 'ordered propagation and foreground/midground/background phase offsets',
    guardrail: 'Preserve the source direction and avoid whole-frame wobble.',
  },
  {
    id: 'network.propagation',
    topology: ['network'],
    description: 'Energy, emphasis or tension travels node-to-node while the connection graph remains invariant.',
    preferredPrimitives: ['network.propagate', 'network.tension', 'light.specular_sweep', 'temporal.phase_offset'],
    complexitySource: 'branch timing and local node response',
    guardrail: 'Do not change graph topology or detach connected nodes.',
  },
  {
    id: 'cellular.diffusion',
    topology: ['cellular'],
    description:
      'A local state change diffuses to neighbors while cell boundaries remain stable and material-local.',
    preferredPrimitives: ['cell.normal_displace', 'cell.neighbor_diffuse', 'light.specular_sweep', 'camera.focus_rack'],
    complexitySource: 'neighbor propagation, local convexity and bounded palette diffusion',
    guardrail: 'No cell merging, count changes or soap-bubble substitution.',
  },
  {
    id: 'architecture.depth',
    topology: ['architecture'],
    description: 'Rigid planes reveal depth through parallax, occlusion and conservative camera movement.',
    preferredPrimitives: ['translate.depth', 'camera.dolly', 'camera.pan', 'reveal.occlusion'],
    complexitySource: 'perspective relationships between stable planes',
    guardrail: 'Verticals, edges and structural geometry stay rigid.',
  },
  {
    id: 'portrait.anchor',
    topology: ['portrait_anchor'],
    description:
      'Identity and anatomy remain fixed while environment, background planes, focus and light carry the motion.',
    preferredPrimitives: ['camera.focus_rack', 'light.specular_sweep', 'temporal.settle'],
    complexitySource: 'light and environment motion around a stable human anchor',
    guardrail: 'No identity drift, facial morphing or unrequested head/body motion.',
  },
  {
    id: 'material.macro',
    topology: ['material_macro'],
    description: 'Material response is revealed by incidence, focus, micro-relief and local optical behavior.',
    preferredPrimitives: ['light.specular_sweep', 'camera.focus_rack', 'translate.depth', 'reveal.density'],
    complexitySource: 'material-specific optical response rather than object deformation',
    guardrail: 'Do not use a global recolor or generic liquid warp to fake material behavior.',
  },
];

export const MATERIAL_RESPONSES: MaterialResponse[] = [
  {
    id: 'wood',
    description: 'Matte or satin wood veneer with visible directional grain.',
    motionResponse: 'rigid; may translate or hinge only at explicit construction boundaries',
    lightingResponse: 'broad warm highlight, low specular response, grain becomes more legible at glancing angles',
    prohibitedShortcut: 'rubbery bending, melting grain, glow',
    baseline: {
      surfaceRoughness: 0.72,
      specularResponse: 0.12,
      emissiveResponse: 0,
      subsurfaceScatter: 0,
      angularFlash: 0,
      microstructureDensity: 0.65,
    },
  },
  {
    id: 'paper',
    description: 'Dry fibrous cotton/card paper carrying printed stipple, halftone or crosshatch.',
    motionResponse:
      'rigid fold only at explicit construction boundaries; printed texture remains attached to the surface',
    lightingResponse: 'diffuse response with contact-shadow emphasis at lifted edges',
    prohibitedShortcut: 'texture crawling, boiling, liquid deformation',
    baseline: {
      surfaceRoughness: 0.88,
      specularResponse: 0.06,
      emissiveResponse: 0,
      subsurfaceScatter: 0,
      angularFlash: 0,
      microstructureDensity: 0.74,
    },
  },
  {
    id: 'opal',
    description: 'Milky translucent mineral with broad internal spectral fire.',
    motionResponse: 'structure remains rigid; perceived motion can come from moving incidence light',
    lightingResponse: 'broad persistent cyan/mint/violet/gold internal scatter',
    prohibitedShortcut: 'flat hue cycling across unrelated materials',
    baseline: {
      surfaceRoughness: 0.24,
      specularResponse: 0.42,
      emissiveResponse: 0.08,
      subsurfaceScatter: 0.56,
      angularFlash: 0.62,
      microstructureDensity: 0.38,
    },
  },
  {
    id: 'labradorite',
    description: 'Dark mineral that produces a narrow blue-green flash at favorable incidence.',
    motionResponse: 'rigid; visual activation depends on viewing/light angle',
    lightingResponse: 'mostly dark until a directional flash threshold is crossed',
    prohibitedShortcut: 'always-on neon glow',
    baseline: {
      surfaceRoughness: 0.31,
      specularResponse: 0.55,
      emissiveResponse: 0,
      subsurfaceScatter: 0.08,
      angularFlash: 0.82,
      microstructureDensity: 0.52,
    },
  },
  {
    id: 'abalone',
    description: 'Fine shell interference with green-violet-gold micro-iridescence.',
    motionResponse: 'rigid with fine local shimmer',
    lightingResponse: 'small-scale spectral shifts rather than broad uniform glow',
    prohibitedShortcut: 'large liquid rainbow waves',
    baseline: {
      surfaceRoughness: 0.26,
      specularResponse: 0.48,
      emissiveResponse: 0.14,
      subsurfaceScatter: 0.22,
      angularFlash: 0.68,
      microstructureDensity: 0.68,
    },
  },
];

export const MOTION_MODIFIERS: ModifierProfile[] = [
  {
    id: 'ceremonial',
    description: 'Deliberate, symmetric, low-amplitude motion with long readable holds.',
    attackRatio: 0.28,
    holdRatio: 0.24,
    releaseRatio: 0.48,
    phaseBehavior: 'ordered and sparse',
    amplitudeBias: 'low',
    failureRisk: 'low',
  },
  {
    id: 'percussive',
    description: 'Fast activation, short hold, clear event boundaries and long settling tail.',
    attackRatio: 0.15,
    holdRatio: 0.15,
    releaseRatio: 0.7,
    phaseBehavior: 'beat-addressable',
    amplitudeBias: 'medium',
    failureRisk: 'medium',
  },
  {
    id: 'respiratory',
    description: 'Smooth inhale/exhale rhythm with one dominant fundamental and small secondary lag.',
    attackRatio: 0.35,
    holdRatio: 0.05,
    releaseRatio: 0.6,
    phaseBehavior: 'near-synchronous with subtle local lag',
    amplitudeBias: 'low',
    failureRisk: 'low',
  },
  {
    id: 'mechanical',
    description: 'Rigid hinge points, piecewise motion and minimal surface elasticity.',
    attackRatio: 0.22,
    holdRatio: 0.22,
    releaseRatio: 0.56,
    phaseBehavior: 'explicit indexed sequence',
    amplitudeBias: 'medium',
    failureRisk: 'low',
  },
  {
    id: 'psychedelic',
    description:
      'Controlled multi-harmonic phase relationships, counter-motion, progressive pattern reveal and spectral material response.',
    attackRatio: 0.22,
    holdRatio: 0.12,
    releaseRatio: 0.66,
    phaseBehavior: 'multi-harmonic and counter-phased',
    amplitudeBias: 'medium',
    failureRisk: 'medium',
  },
  {
    id: 'dreamlike',
    description: 'Soft temporal blending and ambiguous continuity; useful only when topology preservation is noncritical.',
    attackRatio: 0.3,
    holdRatio: 0.1,
    releaseRatio: 0.6,
    phaseBehavior: 'softly asynchronous',
    amplitudeBias: 'medium',
    failureRisk: 'high',
  },
];

export const EASING_PROFILES: EasingProfile[] = [
  {
    id: 'sineInOut',
    cssApproximation: 'cubic-bezier(0.37, 0, 0.63, 1)',
    useWhen: 'breathing, oscillation, symmetric local rotation, return-to-origin loops',
    avoidWhen: 'sharp impact or snap-open behavior',
  },
  {
    id: 'smoothstep',
    cssApproximation: 'cubic-bezier(0.3333, 0, 0.6667, 1)',
    useWhen: 'bounded folds, mask growth, contact-shadow transitions',
    avoidWhen: 'constant-speed scanning or light sweeps',
  },
  {
    id: 'expoOut',
    cssApproximation: 'cubic-bezier(0.16, 1, 0.3, 1)',
    useWhen: 'impact, activation, fast aperture opening or attention events',
    avoidWhen: 'meditative continuous motion',
  },
  {
    id: 'linear',
    cssApproximation: 'linear',
    useWhen: 'constant light sweep, scanning, uniform phase accumulation',
    avoidWhen: 'organic hinge motion or breathing',
  },
];

export const FAILURE_TAXONOMY = {
  topology: ['petal_multiplication', 'outer_frame_deformation', 'cell_merge', 'network_rewire'],
  temporal: ['ghost_frame', 'crossfade_echo', 'loop_jump', 'texture_boiling'],
  camera: ['unintended_orbit', 'turntable_spin', 'edge_hallucination_from_zoom'],
  material: ['wood_liquefaction', 'paper_boiling', 'mineral_smear', 'global_iridescent_recolor'],
  environment: ['water_ripple_background', 'radial_wall_wave', 'unmotivated_fog'],
  identity: ['face_morph', 'anatomy_drift', 'expression_drift'],
} as const;

export const SUBSTITUTION_HYPOTHESES = [
  {
    swap: 'opal → labradorite',
    expected:
      'broad persistent spectral fire becomes mostly-dark material with narrow angle-threshold blue/green flashes',
    test: 'keep motion and palette fixed; sweep light incidence angle only',
  },
  {
    swap: 'phase_offset 0.08s → 0.34s',
    expected: 'near-synchronous breathing becomes a legible sector relay',
    test: 'keep fold angle, duration, easing and seed fixed',
  },
  {
    swap: 'fold_strength 0.35 → 0.65',
    expected: 'occlusion and contact-shadow depth increase while topology-drift risk rises',
    test: 'compare silhouette error and exposed-underlayer area',
  },
  {
    swap: 'sineInOut → expoOut',
    expected: 'calm continuous activation becomes a sharper snap/open event',
    test: 'hold amplitude and duration constant; compare peak velocity and settling behavior',
  },
  {
    swap: '48mm → 85mm with camera distance increased to preserve the initial framing',
    expected:
      'narrower field of view plus increased camera distance reduces perspective exaggeration while preserving subject scale and emphasizing material detail',
    test:
      'match the initial subject framing before each run, keep the same 1.6% relative dolly, then compare foreground/background size ratios and anchor displacement',
  },
] as const;
