import { useEffect, useState, useMemo } from 'react';
import synthesisImg from '@assets/img/synthesis-method.png';
import multiPersonaImg from '@assets/img/multi-persona-system.png';

/* ------------------------------------------------------------------ */
/*  Scroll reveal hook                                                  */
/* ------------------------------------------------------------------ */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('revealed'); }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ------------------------------------------------------------------ */
/*  Data — Core Principles                                              */
/* ------------------------------------------------------------------ */
const PRINCIPLES = [
  {
    n: '01',
    title: 'Prompts Are Compilers',
    desc: 'A prompt is a program that compiles human intent into machine output. Like any compiler, it has a grammar (input tokens), transformation rules (instructions), and output schema (format/structure constraints). Debug it like code.',
    accent: '#7c3aed',
  },
  {
    n: '02',
    title: 'Token Economics',
    desc: 'Every token in a prompt has a cost — not just financial, but cognitive. The model\u2019s attention is a finite resource. Spend it on structure, examples, and constraints. Never waste tokens on filler, vague qualifiers, or redundant instructions.',
    accent: '#06b6d4',
  },
  {
    n: '03',
    title: 'Multi-Step Architecture',
    desc: 'Complex tasks require pipeline architecture: Stage 1 extracts raw input, Stage 2 transforms it through typed categories, Stage 3 applies synthesis rules, Stage 4 validates against output schema. Each stage is independently debuggable.',
    accent: '#f43f5e',
  },
  {
    n: '04',
    title: 'Style as System',
    desc: 'Aesthetic prompts are not vague mood descriptions — they are taxonomic specifications. Subject \u00b7 Environment \u00b7 Lighting \u00b7 Camera \u00b7 Style \u00b7 Mood \u00b7 Color Palette \u00b7 Technical Quality. Each category is a typed field with a controlled vocabulary.',
    accent: '#f59e0b',
  },
];

/* ------------------------------------------------------------------ */
/*  Data — Style Taxonomy segments                                      */
/* ------------------------------------------------------------------ */
const TAXONOMY_SEGMENTS = [
  {
    key: 'subject',
    label: 'Subject',
    color: '#7c3aed',
    desc: 'The primary entity — person, object, scene, concept.',
    examples: ['a lone astronaut', 'a vintage typewriter', 'a fox in mid-stride', 'an abstract concept of grief'],
  },
  {
    key: 'environment',
    label: 'Environment',
    color: '#14b8a6',
    desc: 'Spatial context, setting, location, background.',
    examples: ['dense redwood forest', 'neon-lit alley', 'minimalist studio', 'open ocean at dusk'],
  },
  {
    key: 'lighting',
    label: 'Lighting',
    color: '#f59e0b',
    desc: 'Quality, direction, color temperature, source.',
    examples: ['golden hour rim light', 'harsh overhead fluorescent', 'soft diffused window light', 'bioluminescent glow'],
  },
  {
    key: 'camera',
    label: 'Camera',
    color: '#f43f5e',
    desc: 'Angle, lens, focal length, depth of field.',
    examples: ['low-angle 35mm', 'macro f/1.4 shallow DOF', 'aerial drone wide shot', '85mm portrait compression'],
  },
  {
    key: 'style',
    label: 'Style',
    color: '#a855f7',
    desc: 'Aesthetic movement, reference artists, medium.',
    examples: ['Studio Ghibli watercolor', 'Cubist fragmentation', 'brutalist photography', 'Baroque oil painting'],
  },
  {
    key: 'mood',
    label: 'Mood',
    color: '#d97706',
    desc: 'Emotional register, atmosphere, energy.',
    examples: ['melancholic and quiet', 'triumphant and kinetic', 'eerie and unresolved', 'tender and intimate'],
  },
  {
    key: 'color',
    label: 'Color Palette',
    color: '#06b6d4',
    desc: 'Dominant hues, saturation, contrast level.',
    examples: ['desaturated teal and rust', 'high-contrast monochrome', 'saturated jewel tones', 'pastel gradient wash'],
  },
  {
    key: 'technical',
    label: 'Technical',
    color: '#9ca3af',
    desc: 'Resolution, quality markers, format specs.',
    examples: ['8K, ultra-detailed', '16:9 cinematic aspect', 'raw unedited grain', 'award-winning composition'],
  },
];

/* ------------------------------------------------------------------ */
/*  Data — Compiler pipeline                                            */
/* ------------------------------------------------------------------ */
const COMPILER_STEPS = [
  { icon: '📥', title: 'Input', desc: 'Raw human intent — a rough idea, reference, or goal.' },
  { icon: '🔍', title: 'Lexical Analysis', desc: 'Tokenize intent into typed categories: subject, tone, constraints.' },
  { icon: '⚙️', title: 'Semantic Transform', desc: 'Apply synthesis rules — map tokens to controlled vocabulary.' },
  { icon: '📐', title: 'Output Schema', desc: 'Enforce structure — format, length, and constraint validation.' },
  { icon: '✅', title: 'Generated Result', desc: 'A deployable, debuggable, reproducible output.' },
];

/* ------------------------------------------------------------------ */
/*  Live keyword-matching extraction demo                               */
/* ------------------------------------------------------------------ */
type Extraction = {
  subject: string;
  environment: string;
  lighting: string;
  camera: string;
  style: string;
  mood: string;
  color: string;
  technical: string;
};

const ENV_KEYWORDS: Record<string, string> = {
  forest: 'forest / woodland',
  beach: 'beach / coastline',
  city: 'urban city environment',
  desert: 'desert landscape',
  mountain: 'mountain terrain',
  ocean: 'open ocean',
  room: 'interior room',
  street: 'urban street',
  space: 'outer space / cosmic',
  garden: 'garden / botanical setting',
};

const LIGHT_KEYWORDS: Record<string, string> = {
  sunset: 'sunset / warm golden hour',
  sunrise: 'sunrise / soft morning light',
  night: 'nighttime / low-key lighting',
  dark: 'dark, dramatic shadow',
  bright: 'bright, high-key light',
  neon: 'neon, saturated artificial light',
  candle: 'candlelight, warm flicker',
  storm: 'stormy, diffused overcast light',
};

const MOOD_KEYWORDS: Record<string, string> = {
  peaceful: 'natural, peaceful',
  calm: 'calm, serene',
  dramatic: 'dramatic, tense',
  joyful: 'joyful, energetic',
  sad: 'melancholic, quiet',
  mysterious: 'mysterious, ambiguous',
  romantic: 'romantic, intimate',
  eerie: 'eerie, unsettled',
};

function extractFromText(text: string): Extraction {
  const lower = text.toLowerCase();

  // Subject: naive heuristic — look for "a/an <noun phrase>" before a known preposition
  const subjectMatch = lower.match(/\b(a|an|the)\s+([a-z\s]+?)(?=\s+(in|at|on|near|under|during|with)\b|$)/);
  const subject = subjectMatch ? subjectMatch[2].trim() : '(unspecified — add a clear subject)';

  let environment = '(unspecified — add a setting)';
  for (const [kw, val] of Object.entries(ENV_KEYWORDS)) {
    if (lower.includes(kw)) { environment = val; break; }
  }

  let lighting = '(unspecified — add a light source or time of day)';
  for (const [kw, val] of Object.entries(LIGHT_KEYWORDS)) {
    if (lower.includes(kw)) { lighting = val; break; }
  }

  const camera = lower.includes('close') ? 'close-up shot (inferred)'
    : lower.includes('wide') ? 'wide establishing shot (inferred)'
    : 'medium shot (inferred)';

  const style = lower.includes('painting') ? 'painterly, fine art medium'
    : lower.includes('photo') ? 'photographic, documentary style'
    : lower.includes('anime') ? 'anime / illustrated style'
    : '(unspecified — add an aesthetic reference)';

  let mood = 'natural, contemplative';
  for (const [kw, val] of Object.entries(MOOD_KEYWORDS)) {
    if (lower.includes(kw)) { mood = val; break; }
  }

  const color = lower.includes('sunset') || lower.includes('warm') ? 'warm amber, forest green'
    : lower.includes('night') || lower.includes('dark') ? 'deep indigo, charcoal black'
    : lower.includes('ocean') || lower.includes('blue') ? 'cool cyan, deep blue'
    : 'balanced natural palette';

  const technical = '(add quality specs — resolution, aspect ratio, rendering engine)';

  return { subject, environment, lighting, camera, style, mood, color, technical };
}

const EXTRACTION_FIELDS: { key: keyof Extraction; label: string; color: string }[] = [
  { key: 'subject', label: 'Subject', color: '#7c3aed' },
  { key: 'environment', label: 'Environment', color: '#14b8a6' },
  { key: 'lighting', label: 'Lighting', color: '#f59e0b' },
  { key: 'camera', label: 'Camera', color: '#f43f5e' },
  { key: 'style', label: 'Style', color: '#a855f7' },
  { key: 'mood', label: 'Mood', color: '#d97706' },
  { key: 'color', label: 'Color Palette', color: '#06b6d4' },
  { key: 'technical', label: 'Technical', color: '#9ca3af' },
];

function buildStructuredPrompt(ex: Extraction): string {
  return `Subject: ${ex.subject}. Environment: ${ex.environment}. Lighting: ${ex.lighting}. Camera: ${ex.camera}. Style: ${ex.style}. Mood: ${ex.mood}. Color palette: ${ex.color}. Technical: ${ex.technical}.`;
}

/* ------------------------------------------------------------------ */
/*  Taxonomy pill + expandable panel                                    */
/* ------------------------------------------------------------------ */
function TaxonomyPill({
  seg,
  isOpen,
  onToggle,
}: {
  seg: typeof TAXONOMY_SEGMENTS[number];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full text-left px-5 py-3 rounded-xl border font-semibold text-sm transition-all duration-200 flex items-center justify-between"
        style={{
          background: isOpen ? `${seg.color}22` : `${seg.color}0d`,
          borderColor: isOpen ? seg.color : `${seg.color}44`,
          color: isOpen ? '#fff' : 'rgba(255,255,255,0.75)',
        }}
      >
        <span>{seg.label}</span>
        <span className="text-xs opacity-60">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div className="mt-2 p-4 rounded-xl bg-white/5 border border-white/10">
          <p className="text-white/60 text-sm mb-3">{seg.desc}</p>
          <div className="flex flex-wrap gap-2">
            {seg.examples.map((ex) => (
              <span
                key={ex}
                className="text-xs font-mono px-2.5 py-1 rounded-md border border-white/10 text-white/60"
                style={{ background: `${seg.color}14` }}
              >
                {ex}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                            */
/* ------------------------------------------------------------------ */
export function PromptEngineeringPage() {
  useScrollReveal();

  const [openSegment, setOpenSegment] = useState<string | null>('subject');
  const [demoInput, setDemoInput] = useState('a woman in a forest at sunset');
  const [copied, setCopied] = useState(false);

  const extraction = useMemo(() => extractFromText(demoInput || ''), [demoInput]);
  const structuredPrompt = useMemo(() => buildStructuredPrompt(extraction), [extraction]);

  const handleCopy = () => {
    navigator.clipboard.writeText(structuredPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white">
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="holographic-section relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-32 text-center">
          <p className="prismatic-text reveal text-xs uppercase tracking-[0.2em] mb-6 font-semibold">
            Prompt Engineering · Token Architecture · Compiler Design
          </p>
          <h1 className="font-display reveal delay-100 text-5xl sm:text-6xl md:text-7xl font-black leading-[1.05] mb-8">
            <span className="gradient-text-primary">The Art of</span>
            <br />
            <span className="text-white">Instructing Machines</span>
          </h1>
          <p className="reveal delay-200 text-white/60 text-lg leading-relaxed max-w-2xl mx-auto">
            Prompt engineering as practiced here is not trial-and-error iteration — it is systematic architecture.
            Every prompt is a compiler specification: input grammar, transformation rules, output schema, and
            quality constraints defined before a single token is generated.
          </p>
        </div>
      </section>

      {/* ── CORE PRINCIPLES ─────────────────────────────────────── */}
      <section className="px-6 py-24 max-w-6xl mx-auto">
        <div className="text-center mb-16 reveal">
          <p className="text-violet-400 text-xs uppercase tracking-[0.2em] font-semibold mb-3">Foundational Principles</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white">How This Craft Works</h2>
        </div>
        <div className="space-y-16">
          {PRINCIPLES.map((p, i) => (
            <div
              key={p.n}
              className={`reveal delay-100 flex flex-col md:flex-row ${i % 2 === 1 ? 'md:flex-row-reverse' : ''} items-center gap-10`}
            >
              <div className="flex-1">
                <span className="font-display text-6xl font-black text-white/10 block mb-2">{p.n}</span>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">{p.title}</h3>
                <p className="text-white/60 leading-relaxed">{p.desc}</p>
              </div>
              <div className="flex-1 flex justify-center">
                <div
                  className="w-full max-w-sm aspect-square rounded-2xl border border-white/10 flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${p.accent}22, transparent)` }}
                >
                  <span className="font-display text-5xl font-black" style={{ color: p.accent }}>
                    {p.n}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── THE SYNTHESIS PIPELINE ──────────────────────────────── */}
      <section className="holographic-section px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 reveal">
            <p className="prismatic-text text-xs uppercase tracking-[0.2em] font-semibold mb-3">Pipeline Architecture</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white">The Synthesis Pipeline</h2>
            <p className="text-white/50 max-w-2xl mx-auto mt-4">
              A 22-node pipeline applied to prompt construction — raw input flows through typed extraction,
              synthesis rules, and schema validation before a single generation call is made.
            </p>
          </div>
          <div className="reveal delay-100 relative rounded-2xl overflow-hidden border border-white/10">
            <img src={synthesisImg} alt="The Synthesis Method — 22-node pipeline" className="w-full h-auto" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
              <p className="text-white text-sm md:text-base font-medium max-w-2xl">
                Each node in the pipeline is a discrete, debuggable transformation — from raw intent capture through
                typed categorization to final schema-validated output.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STYLE TAXONOMY REFERENCE ────────────────────────────── */}
      <section className="px-6 py-24 max-w-4xl mx-auto">
        <div className="text-center mb-12 reveal">
          <p className="text-amber-400 text-xs uppercase tracking-[0.2em] font-semibold mb-3">Reference</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white">Prompt Anatomy</h2>
          <p className="text-white/50 max-w-xl mx-auto mt-4">
            Eight typed fields, each with a controlled vocabulary. Click a segment to see example values.
          </p>
        </div>
        <div className="reveal delay-100 grid sm:grid-cols-2 gap-3">
          {TAXONOMY_SEGMENTS.map((seg) => (
            <TaxonomyPill
              key={seg.key}
              seg={seg}
              isOpen={openSegment === seg.key}
              onToggle={() => setOpenSegment(openSegment === seg.key ? null : seg.key)}
            />
          ))}
        </div>
      </section>

      {/* ── COMPILER DESIGN ─────────────────────────────────────── */}
      <section className="solarpunk-section px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 reveal">
            <h2 className="font-display text-4xl md:text-5xl font-bold sg-gradient-text">
              From Intent to Output: The Compiler Model
            </h2>
          </div>
          <div className="sg-card reveal delay-100 p-8 md:p-10 rounded-2xl">
            <div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-2">
              {COMPILER_STEPS.map((step, i) => (
                <div key={step.title} className="flex-1 flex md:flex-col items-center gap-4 md:gap-3">
                  <div className="flex flex-col items-center text-center flex-1">
                    <div className="text-3xl mb-2">{step.icon}</div>
                    <h4 className="font-display font-bold sg-gold text-sm mb-1">{step.title}</h4>
                    <p className="sg-text-muted text-xs leading-relaxed">{step.desc}</p>
                  </div>
                  {i < COMPILER_STEPS.length - 1 && (
                    <span className="hidden md:block sg-gold text-xl self-center rotate-90 md:rotate-0">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MULTI-PERSONA PROMPT SYSTEM ─────────────────────────── */}
      <section className="holographic-section px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 reveal">
            <p className="prismatic-text text-xs uppercase tracking-[0.2em] font-semibold mb-3">Cognitive Architecture</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white">Multi-Persona Prompt System</h2>
          </div>
          <div className="reveal delay-100 relative rounded-2xl overflow-hidden border border-white/10">
            <img src={multiPersonaImg} alt="Multi-persona 4-layer cognitive architecture" className="w-full h-auto" />
          </div>
          <p className="reveal delay-200 text-white/55 text-sm md:text-base leading-relaxed mt-6 max-w-3xl mx-auto text-center">
            The 4-layer cognitive architecture — applied to prompt design:{' '}
            <span className="text-violet-300 font-medium">Context Layer</span> (operating envelope) →{' '}
            <span className="text-cyan-300 font-medium">Input Layer</span> (signal taxonomy) →{' '}
            <span className="text-rose-300 font-medium">Reasoning Kernel</span> (transformation rules) →{' '}
            <span className="text-amber-300 font-medium">Output Layer</span> (result schema).
          </p>
        </div>
      </section>

      {/* ── LIVE TOOL PREVIEW ───────────────────────────────────── */}
      <section className="px-6 py-24 max-w-4xl mx-auto">
        <div className="text-center mb-10 reveal">
          <p className="text-cyan-400 text-xs uppercase tracking-[0.2em] font-semibold mb-3">Live Demo</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white">Prompt Anatomy Extractor</h2>
          <p className="text-white/50 max-w-xl mx-auto mt-4">
            Type a raw idea. Keyword-based extraction (client-side, no API) maps it to the 8 taxonomic categories.
          </p>
        </div>

        <div className="holo-card reveal delay-100 rounded-2xl p-6 md:p-8">
          <label className="text-white/40 text-xs uppercase tracking-wider block mb-2">Raw prompt idea</label>
          <textarea
            value={demoInput}
            onChange={(e) => setDemoInput(e.target.value)}
            rows={3}
            className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-violet-400/60 transition-colors resize-none mb-6"
            placeholder="e.g. a woman in a forest at sunset"
          />

          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            {EXTRACTION_FIELDS.map(({ key, label, color }) => (
              <div
                key={key}
                className="p-4 rounded-lg border-l-4"
                style={{ background: `${color}0d`, borderColor: color }}
              >
                <p className="text-[10px] uppercase tracking-widest font-bold mb-1" style={{ color }}>{label}</p>
                <p className="text-white/75 text-sm leading-relaxed">{extraction[key]}</p>
              </div>
            ))}
          </div>

          <button
            onClick={handleCopy}
            className="w-full py-3.5 rounded-lg font-bold text-sm text-white transition-transform hover:-translate-y-0.5"
            style={{
              background: copied ? 'rgba(34,197,94,0.25)' : 'linear-gradient(135deg, #7c3aed, #f43f5e, #f59e0b)',
              border: copied ? '1px solid rgba(34,197,94,0.5)' : 'none',
            }}
          >
            {copied ? '✓ Copied!' : 'Copy Full Structured Prompt →'}
          </button>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="px-6 py-28 text-center max-w-3xl mx-auto">
        <h2 className="reveal font-display text-3xl md:text-4xl font-bold text-white mb-6">
          Hire for Prompt Engineering
        </h2>
        <p className="reveal delay-100 text-white/50 mb-10 max-w-xl mx-auto">
          Systematic prompt architecture for teams that need reproducible, debuggable, and scalable generation
          pipelines — not one-off trial and error.
        </p>
        <div className="reveal delay-200 flex flex-wrap gap-4 justify-center">
          <a
            href="mailto:jennipher@melodicbloom.com?subject=Prompt%20Engineering%20Inquiry"
            className="px-8 py-4 rounded-xl font-bold text-white text-sm transition-transform hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #f43f5e, #f59e0b)', boxShadow: '0 0 40px rgba(124,58,237,0.4)' }}
          >
            Hire for Prompt Engineering
          </a>
          <a
            href="/#/reverse-prompt"
            className="px-8 py-4 rounded-xl font-bold text-sm border border-white/20 text-white hover:bg-white/10 transition-all"
          >
            Try the Reverse Prompt Engineer
          </a>
        </div>
      </section>
    </div>
  );
}
