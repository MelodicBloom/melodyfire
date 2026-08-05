import { useEffect, useState, useRef } from 'react';
import heroMandalaImg from '@assets/img/hero-mandala.png';

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
/*  Data — The Three Roles                                              */
/* ------------------------------------------------------------------ */
const ROLES = [
  {
    key: 'informational',
    name: 'Informational',
    icon: '🧠',
    color: '#06b6d4',
    borderColor: 'border-t-cyan-500',
    glow: 'shadow-[0_0_40px_-12px_rgba(6,182,212,0.5)]',
    desc: 'Use when the user needs to understand hierarchy, sequence, progression, state change, comparison, or navigation structure. Clear, legible, calm, restrained.',
    examples: ['Diagrams', 'Process reveals', 'Tabs', 'Accordions', 'Dashboards'],
  },
  {
    key: 'expressive',
    name: 'Expressive',
    icon: '✦',
    color: '#7c3aed',
    borderColor: 'border-t-violet-500',
    glow: 'shadow-[0_0_40px_-12px_rgba(124,58,237,0.5)]',
    desc: 'Use for emotional framing, atmospheric tone, brand presence, editorial identity, sensory richness, narrative impact. Strongest in hero moments, gallery surfaces, manifesto endings.',
    examples: ['Hero sections', 'Galleries', 'Manifesto sections', 'Ambient branding'],
  },
  {
    key: 'focus',
    name: 'Focus',
    icon: '◎',
    color: '#f43f5e',
    borderColor: 'border-t-rose-500',
    glow: 'shadow-[0_0_40px_-12px_rgba(244,63,94,0.5)]',
    desc: 'Use to draw attention, confirm interaction, support affordance, highlight priority content, clarify which object changed.',
    examples: ['Buttons', 'CTAs', 'Card hover states', 'Validation feedback'],
  },
];

/* ------------------------------------------------------------------ */
/*  Data — Brand Dialects                                               */
/* ------------------------------------------------------------------ */
const DIALECTS = [
  {
    name: 'Organic',
    desc: 'Warm, fluid, embodied, tactile, breathable. Default for Beautiful Imperfection systems.',
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    duration: 'Spacious, medium-long',
  },
  {
    name: 'Structured',
    desc: 'Architectural, deliberate, controlled, mechanical, editorial, precise. Default for The Death of Perfect systems.',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    duration: 'Tight, short-medium',
  },
  {
    name: 'Hybrid',
    desc: 'Expressive surfaces can be Organic; structural UI must remain Structured. For sites that span campaign storytelling and app infrastructure.',
    easing: 'context-dependent',
    duration: 'Mixed by component',
  },
];

/* ------------------------------------------------------------------ */
/*  Data — Motion Tag Taxonomy                                          */
/* ------------------------------------------------------------------ */
type TagInfo = { tag: string; role: string; duration: string; behavior: string };

const TAG_DATA: Record<string, TagInfo> = {
  hero: { tag: 'hero', role: 'Expressive', duration: '500–900ms', behavior: 'Layered reveal, strong atmosphere, staggered hierarchy. Reduced motion: fade only.' },
  thesis: { tag: 'thesis', role: 'Informational + Expressive', duration: '300–520ms', behavior: 'Headline first, then body, then media.' },
  comparison: { tag: 'comparison', role: 'Informational', duration: '180–320ms', behavior: 'Row-by-row or card-by-card reveals. Avoid simultaneous animation.' },
  process: { tag: 'process', role: 'Informational', duration: '220–360ms', behavior: 'Staged progression, one conceptual beat at a time.' },
  technical: { tag: 'technical', role: 'Informational', duration: '220–420ms', behavior: 'Diagram-led, annotation-led, sequence-aware.' },
  proof: { tag: 'proof', role: 'Focus + Informational', duration: '120–240ms', behavior: 'Subtle emphasis only.' },
  manifesto: { tag: 'manifesto', role: 'Expressive', duration: '400–800ms', behavior: 'Slower, emotionally resolved movement.' },
  pause: { tag: 'pause', role: 'None / low Informational', duration: '0–180ms', behavior: 'Near stillness — rest and breathing room.' },
  cta: { tag: 'cta', role: 'Focus', duration: '120–220ms', behavior: 'Visible affordance, concise confirmation.' },
  gallery: { tag: 'gallery', role: 'Expressive', duration: '320–700ms', behavior: 'Gentle stagger, immersive reveal.' },
  diagram: { tag: 'diagram', role: 'Informational', duration: '220–500ms', behavior: 'Reveal one relationship at a time.' },
  callout: { tag: 'callout', role: 'Focus', duration: '120–240ms', behavior: 'Quick emphasis, immediate settling.' },
  bridge: { tag: 'bridge', role: 'Informational + Expressive', duration: '200–320ms', behavior: 'Soft narrative handoff between ideas.' },
  nav: { tag: 'nav', role: 'Focus + Informational', duration: '120–220ms', behavior: 'Tight, stable, low-noise transitions.' },
  modal: { tag: 'modal', role: 'Focus', duration: '180–320ms', behavior: 'Dim background, clear entry, preserve escape clarity.' },
  drawer: { tag: 'drawer', role: 'Informational', duration: '220–360ms', behavior: 'Anchored directional motion.' },
  form: { tag: 'form', role: 'Informational + Focus', duration: '180–300ms', behavior: 'Clarity and validation over flair.' },
  feedback: { tag: 'feedback', role: 'Focus', duration: '120–220ms', behavior: 'Fast, obvious, non-blocking.' },
  'state-change': { tag: 'state-change', role: 'Focus', duration: '120–220ms', behavior: 'Toggles, selected states, tabs, expansion, control confirmation.' },
  dashboard: { tag: 'dashboard', role: 'Informational', duration: '180–300ms', behavior: 'Stable, low-drama, emphasis only where necessary.' },
  media: { tag: 'media', role: 'Expressive + Informational', duration: '240–480ms', behavior: 'Content-aware reveal, respects aspect ratio and load state.' },
  loading: { tag: 'loading', role: 'Informational', duration: 'ongoing / looped', behavior: 'Signals progress without inducing anxiety; always interruptible.' },
  wayfinding: { tag: 'wayfinding', role: 'Informational', duration: '180–320ms', behavior: 'Orients the user within structure; supports scanning and location.' },
  'background-atmosphere': { tag: 'background-atmosphere', role: 'Expressive', duration: 'ambient / continuous', behavior: 'Must always be optional and ignorable. Never interferes with reading or tasks.' },
  carousel: { tag: 'carousel', role: 'Informational + Expressive', duration: '280–520ms', behavior: 'Directional slide, momentum-aware, pausable.' },
  'card-grid': { tag: 'card-grid', role: 'Informational', duration: '180–320ms', behavior: 'Staggered but restrained; density scales with grid size.' },
  search: { tag: 'search', role: 'Informational + Focus', duration: '120–240ms', behavior: 'Instant feedback on input, gentle result reveal.' },
  'empty-state': { tag: 'empty-state', role: 'Expressive + Informational', duration: '240–420ms', behavior: 'Soft, reassuring, guides toward next action.' },
};

const TAG_ROWS: { label: string; tags: string[] }[] = [
  { label: 'Content', tags: ['hero', 'thesis', 'comparison', 'process', 'technical', 'proof', 'manifesto', 'pause', 'cta', 'gallery', 'diagram', 'callout', 'bridge'] },
  { label: 'App / Web', tags: ['nav', 'modal', 'drawer', 'form', 'feedback', 'state-change', 'dashboard', 'media', 'loading', 'wayfinding'] },
  { label: 'Density', tags: ['background-atmosphere', 'carousel', 'card-grid', 'search', 'empty-state'] },
];

/* ------------------------------------------------------------------ */
/*  Data — Density Rules                                                */
/* ------------------------------------------------------------------ */
const DENSITY_LEVELS = [
  {
    name: 'Low',
    color: '#06b6d4',
    items: ['Navigation', 'Forms', 'Dashboards', 'Proof sections', 'Body copy', 'Checkout', 'Technical UI'],
  },
  {
    name: 'Medium',
    color: '#f59e0b',
    items: ['Thesis sections', 'Process reveals', 'Diagrams', 'Card grids', 'Comparison modules', 'Editorial callouts'],
  },
  {
    name: 'High',
    color: '#f43f5e',
    items: ['Hero moments', 'Manifesto endings', 'Galleries', 'Chapter transitions', 'Campaign moments'],
  },
];

/* ------------------------------------------------------------------ */
/*  Tag Pill with tooltip                                               */
/* ------------------------------------------------------------------ */
function TagPill({ tag }: { tag: string }) {
  const [open, setOpen] = useState(false);
  const info = TAG_DATA[tag];
  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen((o) => !o)}
        className="px-3.5 py-1.5 rounded-full text-xs font-mono font-medium border border-white/15 bg-white/5 text-white/70 hover:text-white hover:border-violet-400/60 hover:bg-violet-500/15 transition-all duration-200"
      >
        {tag}
      </button>
      {open && info && (
        <div className="absolute z-30 left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 rounded-lg border border-white/15 bg-[#0b0f1c] p-3.5 shadow-2xl text-left">
          <p className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold mb-1">Primary role</p>
          <p className="text-xs text-white/80 mb-2">{info.role}</p>
          <p className="text-[10px] uppercase tracking-wider text-rose-400 font-bold mb-1">Duration band</p>
          <p className="text-xs text-white/80 mb-2 font-mono">{info.duration}</p>
          <p className="text-[10px] uppercase tracking-wider text-amber-400 font-bold mb-1">Behavior</p>
          <p className="text-xs text-white/70 leading-relaxed">{info.behavior}</p>
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-3 h-3 bg-[#0b0f1c] border-r border-b border-white/15 rotate-45 -mt-1.5" />
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Interactive Motion Demo Sandbox                                     */
/* ------------------------------------------------------------------ */
type MotionMode = 'idle' | 'organic' | 'structured' | 'focus';

function MotionSandbox() {
  const [mode, setMode] = useState<MotionMode>('idle');
  const [key, setKey] = useState(0);

  const trigger = (m: MotionMode) => {
    setMode('idle');
    // Force re-mount to replay animation
    requestAnimationFrame(() => {
      setMode(m);
      setKey((k) => k + 1);
    });
  };

  const cardStyle: Record<MotionMode, string> = {
    idle: 'opacity-100 translate-y-0 scale-100 rotate-0',
    organic: 'motion-demo-organic',
    structured: 'motion-demo-structured',
    focus: 'motion-demo-focus',
  };

  return (
    <div className="holo-card p-8 rounded-2xl">
      <div className="flex flex-wrap gap-3 mb-10 justify-center">
        <button
          onClick={() => trigger('organic')}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white border transition-all duration-200"
          style={{ background: 'rgba(124,58,237,0.18)', borderColor: 'rgba(124,58,237,0.5)' }}
        >
          Organic Enter
        </button>
        <button
          onClick={() => trigger('structured')}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white border transition-all duration-200"
          style={{ background: 'rgba(6,182,212,0.18)', borderColor: 'rgba(6,182,212,0.5)' }}
        >
          Structured Enter
        </button>
        <button
          onClick={() => trigger('focus')}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white border transition-all duration-200"
          style={{ background: 'rgba(244,63,94,0.18)', borderColor: 'rgba(244,63,94,0.5)' }}
        >
          Focus Pulse
        </button>
      </div>

      <div className="flex items-center justify-center h-40">
        <div
          key={key}
          className={`w-56 h-28 rounded-xl flex items-center justify-center text-white font-display font-bold text-sm border border-white/15 ${cardStyle[mode]}`}
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(244,63,94,0.2), rgba(6,182,212,0.2))',
          }}
        >
          {mode === 'idle' ? 'Demo Card' : mode === 'organic' ? 'Organic' : mode === 'structured' ? 'Structured' : 'Focus'}
        </div>
      </div>

      <p className="text-center text-white/40 text-xs font-mono mt-6">
        {mode === 'organic' && 'ease: cubic-bezier(0.22, 1, 0.36, 1) · duration: var(--motion-duration-lg)'}
        {mode === 'structured' && 'ease: cubic-bezier(0.4, 0, 0.2, 1) · duration: var(--motion-duration-sm)'}
        {mode === 'focus' && 'ease: cubic-bezier(0.16, 1, 0.3, 1) · duration: var(--motion-duration-xs)'}
        {mode === 'idle' && 'Select a motion type above to preview'}
      </p>

      <style>{`
        @keyframes motionDemoOrganic {
          0% { opacity: 0; transform: translateY(28px) scale(0.94); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes motionDemoStructured {
          0% { opacity: 0; transform: translateY(-14px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes motionDemoFocus {
          0% { transform: scale(1); }
          40% { transform: scale(1.06); }
          70% { transform: scale(0.98); }
          100% { transform: scale(1); }
        }
        .motion-demo-organic { animation: motionDemoOrganic 520ms cubic-bezier(0.22, 1, 0.36, 1); }
        .motion-demo-structured { animation: motionDemoStructured 240ms cubic-bezier(0.4, 0, 0.2, 1); }
        .motion-demo-focus { animation: motionDemoFocus 320ms cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                            */
/* ------------------------------------------------------------------ */
export function MotionOraclePage() {
  useScrollReveal();
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white">
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="holographic-section relative min-h-[85vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 z-0 opacity-10"
          style={{ backgroundImage: `url(${heroMandalaImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-32 text-center">
          <p className="prismatic-text reveal text-xs uppercase tracking-[0.2em] mb-6 font-semibold">
            Motion Oracle · System Architecture
          </p>
          <h1 className="font-display reveal delay-100 text-6xl sm:text-7xl md:text-8xl font-black leading-[1.02] mb-8">
            <span className="gradient-text">Motion</span>
            <br />
            <span className="gradient-text-fire">Oracle</span>
          </h1>
          <p className="reveal delay-200 text-white/60 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            A semantic motion framework for digital systems where expressive visual identity must coexist with
            stable interaction infrastructure. Motion must explain, guide, or enrich — never exist as decoration
            alone.
          </p>
          <div className="reveal delay-300 flex flex-wrap gap-4 justify-center">
            <button
              onClick={scrollToContent}
              className="px-8 py-4 rounded-xl font-bold text-white text-sm transition-transform hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #f43f5e, #f59e0b)', boxShadow: '0 0 40px rgba(124,58,237,0.4)' }}
            >
              Explore the System
            </button>
            <a
              href="mailto:jennipher@melodicbloom.com"
              className="px-8 py-4 rounded-xl font-bold text-sm border border-white/20 text-white hover:bg-white/10 transition-all"
            >
              Download Framework
            </a>
          </div>
        </div>
      </section>

      <div ref={contentRef} />

      {/* ── THE THREE ROLES ─────────────────────────────────────── */}
      <section className="px-6 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-16 reveal">
          <p className="text-violet-400 text-xs uppercase tracking-[0.2em] font-semibold mb-3">Classification Layer 1</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold gradient-text-primary">The Three Roles</h2>
          <p className="text-white/50 max-w-xl mx-auto mt-4">Every motion moment is classified by what the user needs: understanding, feeling, or attention.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {ROLES.map((role, i) => (
            <div
              key={role.key}
              className={`reveal delay-${(i + 1) * 100} rounded-2xl border-t-4 ${role.borderColor} bg-white/[0.03] border border-white/10 p-8 flex flex-col ${role.glow}`}
            >
              <div className="text-4xl mb-4" style={{ color: role.color }}>{role.icon}</div>
              <h3 className="font-display text-2xl font-bold mb-3 text-white">{role.name}</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-6 flex-1">{role.desc}</p>
              <div className="flex flex-wrap gap-2">
                {role.examples.map((ex) => (
                  <span
                    key={ex}
                    className="text-xs px-2.5 py-1 rounded-full border border-white/10 text-white/50"
                    style={{ background: `${role.color}14` }}
                  >
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BRAND DIALECTS ──────────────────────────────────────── */}
      <section className="solarpunk-section px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <p className="sg-gold text-xs uppercase tracking-[0.2em] font-semibold mb-3">Classification Layer 2</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold sg-gradient-text">Brand Dialects</h2>
            <p className="sg-text-muted max-w-xl mx-auto mt-4">
              Every system speaks one of three motion dialects — determined by its foundational text.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {DIALECTS.map((d, i) => (
              <div key={d.name} className={`sg-card reveal delay-${(i + 1) * 100} p-8 rounded-2xl`}>
                <h3 className="font-display text-2xl font-bold sg-gold mb-3">{d.name}</h3>
                <p className="sg-text text-sm leading-relaxed mb-5">{d.desc}</p>
                <div className="text-xs font-mono sg-text-muted space-y-1 border-t border-white/10 pt-4">
                  <p><span className="sg-gold">easing:</span> {d.easing}</p>
                  <p><span className="sg-gold">duration:</span> {d.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MOTION TAG TAXONOMY ─────────────────────────────────── */}
      <section className="px-6 py-24 max-w-6xl mx-auto">
        <div className="text-center mb-14 reveal">
          <p className="text-cyan-400 text-xs uppercase tracking-[0.2em] font-semibold mb-3">Classification Layer 3</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white">Motion Tag Taxonomy</h2>
          <p className="text-white/50 max-w-xl mx-auto mt-4">
            24 semantic tags describe intent, not appearance. Hover any tag for role, duration, and behavior.
          </p>
        </div>
        <div className="space-y-8">
          {TAG_ROWS.map((row, ri) => (
            <div key={row.label} className={`reveal delay-${(ri + 1) * 100}`}>
              <p className="text-white/35 text-xs uppercase tracking-widest font-semibold mb-3">{row.label}</p>
              <div className="flex flex-wrap gap-2.5">
                {row.tags.map((tag) => (
                  <TagPill key={tag} tag={tag} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TOKEN ARCHITECTURE ──────────────────────────────────── */}
      <section className="holographic-section px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 reveal">
            <p className="prismatic-text text-xs uppercase tracking-[0.2em] font-semibold mb-3">Implementation Layer</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white">Token Architecture</h2>
            <p className="text-white/50 max-w-xl mx-auto mt-4">Semantic CSS custom properties — never hardcoded values.</p>
          </div>
          <div className="holo-card reveal delay-100 rounded-2xl p-8 md:p-10 font-mono text-sm leading-relaxed overflow-x-auto">
            <pre className="whitespace-pre">
              <code>
                <span className="text-white/30">{'/* duration scale */'}</span>{'\n'}
                <span className="text-cyan-400">--motion-duration-xxs</span>: <span className="text-rose-400">120ms</span>;{'\n'}
                <span className="text-cyan-400">--motion-duration-xs</span>: <span className="text-rose-400">180ms</span>;{'\n'}
                <span className="text-cyan-400">--motion-duration-sm</span>: <span className="text-rose-400">240ms</span>;{'\n'}
                <span className="text-cyan-400">--motion-duration-md</span>: <span className="text-rose-400">320ms</span>;{'\n'}
                <span className="text-cyan-400">--motion-duration-lg</span>: <span className="text-rose-400">520ms</span>;{'\n'}
                <span className="text-cyan-400">--motion-duration-xl</span>: <span className="text-rose-400">700ms</span>;{'\n\n'}
                <span className="text-white/30">{'/* easing curves */'}</span>{'\n'}
                <span className="text-cyan-400">--motion-ease-organic-enter</span>: <span className="text-rose-400">cubic-bezier(0.22, 1, 0.36, 1)</span>;{'\n'}
                <span className="text-cyan-400">--motion-ease-organic-accent</span>: <span className="text-rose-400">cubic-bezier(0.16, 1, 0.3, 1)</span>;{'\n'}
                <span className="text-cyan-400">--motion-ease-structured-ui</span>: <span className="text-rose-400">cubic-bezier(0.4, 0, 0.2, 1)</span>;
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* ── DENSITY RULES ───────────────────────────────────────── */}
      <section className="px-6 py-24 max-w-6xl mx-auto">
        <div className="text-center mb-14 reveal">
          <p className="text-amber-400 text-xs uppercase tracking-[0.2em] font-semibold mb-3">Constraint Layer</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white">Density Rules</h2>
          <p className="text-white/50 max-w-xl mx-auto mt-4">The denser the content, the quieter the motion.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {DENSITY_LEVELS.map((lvl, i) => (
            <div key={lvl.name} className={`reveal delay-${(i + 1) * 100} rounded-2xl border border-white/10 bg-white/[0.03] p-8`}>
              <div className="flex items-center gap-3 mb-5">
                <span className="w-3 h-3 rounded-full" style={{ background: lvl.color, boxShadow: `0 0 10px ${lvl.color}` }} />
                <h3 className="font-display text-xl font-bold text-white">{lvl.name} Density</h3>
              </div>
              <ul className="space-y-2">
                {lvl.items.map((it) => (
                  <li key={it} className="text-white/60 text-sm flex items-start gap-2">
                    <span className="text-white/25 mt-0.5">—</span> {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── INTERACTIVE DEMO ────────────────────────────────────── */}
      <section className="holographic-section px-6 py-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 reveal">
            <p className="prismatic-text text-xs uppercase tracking-[0.2em] font-semibold mb-3">Live Sandbox</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white">Try the Motion System</h2>
            <p className="text-white/50 max-w-xl mx-auto mt-4">Pure CSS transitions driven by the token architecture above.</p>
          </div>
          <div className="reveal delay-100">
            <MotionSandbox />
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="px-6 py-28 text-center max-w-3xl mx-auto">
        <h2 className="reveal font-display text-3xl md:text-4xl font-bold text-white mb-6">
          Use this system for your project
        </h2>
        <p className="reveal delay-100 text-white/50 mb-10 max-w-xl mx-auto">
          Grounded in Beautiful Imperfection and The Death of Perfect — a motion language built to scale across
          brands without losing its calm foundation.
        </p>
        <div className="reveal delay-200 flex flex-wrap gap-4 justify-center">
          <a
            href="mailto:jennipher@melodicbloom.com?subject=Motion%20Audit%20Inquiry"
            className="px-8 py-4 rounded-xl font-bold text-white text-sm transition-transform hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #f43f5e, #f59e0b)', boxShadow: '0 0 40px rgba(124,58,237,0.4)' }}
          >
            Commission a Motion Audit
          </a>
          <a
            href="mailto:jennipher@melodicbloom.com"
            className="px-8 py-4 rounded-xl font-bold text-sm border border-white/20 text-white hover:bg-white/10 transition-all"
          >
            jennipher@melodicbloom.com
          </a>
        </div>
      </section>
    </div>
  );
}
