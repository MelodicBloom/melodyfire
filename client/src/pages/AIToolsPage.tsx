import { useEffect, useState, useCallback } from 'react';
import { supabase, getSessionId, savePromptSession } from '@/lib/supabase';
import aiSectionImg from '@assets/img/ai-section.png';

// ── Scroll-reveal hook ─────────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('revealed'); }),
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ── Style configs ──────────────────────────────────────────────────────────
const STYLES: Record<string, { prefix: string; suffix: string }> = {
  ComfyUI:       { prefix: 'masterpiece, best quality, ', suffix: ', detailed, sharp, 8k resolution, professional lighting' },
  Midjourney:    { prefix: '', suffix: ' --ar 16:9 --stylize 750 --v 6 --q 2' },
  'DALL·E':      { prefix: 'A high-quality digital illustration of ', suffix: '. Professional, detailed, vibrant.' },
  Cinematic:     { prefix: 'Cinematic still, anamorphic lens, ', suffix: ', golden hour, depth of field, film grain, Kodachrome' },
  Illustration:  { prefix: 'Digital illustration, ', suffix: ', concept art, trending on ArtStation, painterly, vibrant colors' },
  Psychedelic:   { prefix: 'Psychedelic visionary art, ', suffix: ', fractal geometry, iridescent, cosmic, Alex Grey style, ultra-detailed' },
};

const MEDIUMS = ['Illustration', 'Oil Painting', 'Digital Art', 'Watercolor', 'Cinematic Photography'];
const TONES   = ['Epic', 'Intimate', 'Whimsical', 'Dark & Mysterious', 'Hopeful & Luminous'];

const NEGATIVE_TOKENS: Record<string, string> = {
  'Anatomy errors (deformed, extra limbs)': 'deformed, malformed, extra limbs, mutation, disfigured, bad anatomy, extra fingers, missing limbs',
  'Text/watermarks': 'text, watermark, signature, logo, copyright, username, letters, words',
  'Low quality (blurry, noisy)': 'blurry, noisy, pixelated, jpeg artifacts, compression artifacts, low resolution, out of focus',
  'Overexposure': 'overexposed, blown highlights, washed out, too bright, clipping',
  'Bad composition': 'bad composition, cluttered, unbalanced, cropped, cut off, out of frame',
  'Wrong colors': 'wrong colors, color bleeding, oversaturated, desaturated, muddy colors, flat colors',
  'Duplicate elements': 'duplicate, repeated elements, clone, copy, mirrored artifact',
  'Render artifacts': 'render artifacts, 3D artifacts, uncanny valley, plastic, fake, CGI artifacts',
};

const VARIANT_FRAMINGS = [
  'wide establishing shot', 'intimate close-up portrait', 'abstract symbolic interpretation',
  'rich symbolic iconography', 'aerial bird\'s eye view', 'dramatic silhouette against light',
  'fine macro detail study', 'emotional psychological focus',
];

const PROMPT_ANATOMY_SEGMENTS = [
  { label: 'Subject', example: 'a lone figure in a cosmic forest', color: '#7c3aed' },
  { label: 'Environment', example: 'surrounded by bioluminescent flora', color: '#06b6d4' },
  { label: 'Lighting', example: 'dappled moonlight, ethereal glow', color: '#f59e0b' },
  { label: 'Style', example: 'digital painting, concept art', color: '#f43f5e' },
  { label: 'Quality', example: 'masterpiece, 8k, ultra-detailed', color: '#22c55e' },
  { label: 'Camera', example: 'wide angle, f/2.8, bokeh', color: '#a78bfa' },
  { label: 'Negative', example: 'no blur, no text, no watermark', color: '#6b7280' },
];

const WORKFLOW_GUIDES = [
  {
    title: 'Character Consistency Pipeline',
    tech: 'ComfyUI + SDXL LoRA',
    steps: [
      'Train a LoRA on 20-40 reference images with consistent lighting',
      'Build a ComfyUI workflow with KSampler + ControlNet OpenPose',
      'Apply LoRA at 0.7-0.9 weight, adjust per scene',
      'Batch generate expressions using dynamic prompts node',
    ],
  },
  {
    title: 'Style Transfer System',
    tech: 'IPAdapter + ControlNet',
    steps: [
      'Select a strong style reference image (high contrast, clear aesthetic)',
      'Feed through IPAdapter at 0.6 weight for soft style transfer',
      'Add ControlNet Canny/Depth to preserve subject structure',
      'Fine-tune with CFG 7-9 and DPM++ 2M Karras sampler',
    ],
  },
  {
    title: 'Fractal Series Generation',
    tech: 'SDXL + Custom Nodes',
    steps: [
      'Install Efficiency Nodes + Inspire Pack in ComfyUI',
      'Use WAS Node Suite for mathematical pattern seeds',
      'Chain multiple KSamplers with progressive denoising (0.7→0.3)',
      'Export 4K tiled outputs for print production',
    ],
  },
  {
    title: 'Agentic Prompt Orchestration',
    tech: 'Multi-Model Pipeline',
    steps: [
      'Use GPT-4 to expand seed concept into structured prompt components',
      'Route to Midjourney for ideation, ComfyUI for refinement',
      'Apply Claude for narrative context and scene description',
      'Combine outputs with img2img at 0.4 denoising for cohesion',
    ],
  },
];

// ── Typing animation ───────────────────────────────────────────────────────
async function typeText(text: string, setter: (s: string) => void, ms = 400) {
  const chars = text.split('');
  let current = '';
  const delay = Math.max(5, Math.floor(ms / chars.length));
  for (const ch of chars) {
    current += ch;
    setter(current);
    await new Promise((r) => setTimeout(r, delay));
  }
}

// ── Main component ─────────────────────────────────────────────────────────
type Mode = 'simple' | 'weaver' | 'narrative' | 'negative' | 'batch';

export default function AIToolsPage() {
  useScrollReveal();
  const sessionId = getSessionId();
  const [activeMode, setActiveMode] = useState<Mode>('simple');

  // ─ Mode 1: Simple Transform ─
  const [simpleInput, setSimpleInput]     = useState('');
  const [simpleStyle, setSimpleStyle]     = useState('');
  const [simpleOutput, setSimpleOutput]   = useState('');
  const [simpleLoading, setSimpleLoading] = useState(false);

  const handleSimpleTransform = async (styleName: string) => {
    if (!simpleInput.trim()) return;
    setSimpleStyle(styleName);
    setSimpleLoading(true);
    setSimpleOutput('');
    const cfg = STYLES[styleName];
    const result = `${cfg.prefix}${simpleInput}${cfg.suffix}`;
    await typeText(result, setSimpleOutput, 400);
    setSimpleLoading(false);
    savePromptSession(sessionId, { mode: 'simple_transform', style: styleName, input: simpleInput, output: result });
  };

  // ─ Mode 2: Style Weaver ─
  const [subject, setSubject]         = useState('');
  const [environment, setEnvironment] = useState('');
  const [mood, setMood]               = useState('');
  const [detail, setDetail]           = useState(50);
  const [surrealism, setSurrealism]   = useState(30);
  const [colorInt, setColorInt]       = useState(60);
  const [complexity, setComplexity]   = useState(40);
  const [weaverOutput, setWeaverOutput] = useState('');
  const [weaverLoading, setWeaverLoading] = useState(false);

  const handleWeave = async () => {
    if (!subject.trim()) return;
    setWeaverLoading(true);
    setWeaverOutput('');
    let prompt = `${subject}${environment ? `, in ${environment}` : ''}${mood ? `, ${mood} mood` : ''}`;
    if (detail > 70) prompt += ', ultra-detailed, 8k, sharp focus';
    if (surrealism > 70) prompt += ', dreamlike, impossible geometry, surreal';
    if (colorInt > 70) prompt += ', vibrant palette, chromatic, highly saturated';
    if (complexity > 70) prompt += ', intricate patterns, dense composition, fractal details';
    prompt += ', digital art, professional quality';
    await typeText(prompt, setWeaverOutput, 400);
    setWeaverLoading(false);
    savePromptSession(sessionId, { mode: 'style_weaver', input: { subject, environment, mood, detail, surrealism, colorInt, complexity }, output: prompt });
  };

  // ─ Mode 3: Narrative Prompt ─
  const [narrative, setNarrative]       = useState('');
  const [medium, setMedium]             = useState(MEDIUMS[0]);
  const [tone, setTone]                 = useState(TONES[0]);
  const [narrativeOutput, setNarrativeOutput] = useState('');
  const [narrativeLoading, setNarrativeLoading] = useState(false);

  const handleNarrative = async () => {
    if (!narrative.trim()) return;
    setNarrativeLoading(true);
    setNarrativeOutput('');
    const toneMap: Record<string, string> = {
      'Epic': 'sweeping, grand, monumental, heroic in scale and ambition',
      'Intimate': 'quiet, personal, tender, small moments of profound meaning',
      'Whimsical': 'playful, lighthearted, fantastical, full of wonder',
      'Dark & Mysterious': 'shadowy, ominous, gothic atmosphere, hidden depths',
      'Hopeful & Luminous': 'warm, radiant, uplifting, suffused with golden light',
    };
    const result = `${medium} of a scene: ${narrative}. Rendered in a ${toneMap[tone]} style. Professional ${medium.toLowerCase()}, rich in detail, emotionally resonant, story-driven composition, award-winning quality.`;
    await typeText(result, setNarrativeOutput, 400);
    setNarrativeLoading(false);
    savePromptSession(sessionId, { mode: 'narrative_prompt', input: { narrative, medium, tone }, output: result });
  };

  // ─ Mode 4: Negative Builder ─
  const [negChecked, setNegChecked] = useState<Record<string, boolean>>({});
  const [negFreeText, setNegFreeText] = useState('');
  const [negOutput, setNegOutput] = useState('');

  const buildNegative = () => {
    const tokens: string[] = [];
    Object.entries(negChecked).forEach(([k, v]) => { if (v) tokens.push(NEGATIVE_TOKENS[k]); });
    if (negFreeText.trim()) tokens.push(negFreeText.trim());
    const result = tokens.join(', ');
    setNegOutput(result);
    if (result) savePromptSession(sessionId, { mode: 'negative_builder', selections: Object.keys(negChecked).filter(k => negChecked[k]), extra: negFreeText, output: result });
  };

  // ─ Mode 5: Batch Variants ─
  const [batchConcept, setBatchConcept] = useState('');
  const [batchStyle, setBatchStyle]     = useState('Midjourney');
  const [variantCount, setVariantCount] = useState(4);
  const [batchVariants, setBatchVariants] = useState<string[]>([]);
  const [batchLoading, setBatchLoading]   = useState(false);

  const handleBatch = async () => {
    if (!batchConcept.trim()) return;
    setBatchLoading(true);
    setBatchVariants([]);
    const cfg = STYLES[batchStyle] || STYLES['Midjourney'];
    const framings = VARIANT_FRAMINGS.slice(0, variantCount);
    const variants = framings.map((framing, i) =>
      `${cfg.prefix}${framing} of ${batchConcept}${cfg.suffix}${i > 0 ? ` --seed ${Math.floor(Math.random() * 99999)}` : ''}`
    );
    setBatchVariants(variants);
    setBatchLoading(false);
    savePromptSession(sessionId, { mode: 'batch_variants', concept: batchConcept, style: batchStyle, count: variantCount, variants });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
  };

  // ── Shared terminal textarea ─────────────────────────────────────────────
  const TerminalOutput = ({ value, onCopy }: { value: string; onCopy: () => void }) => (
    <div style={{ position: 'relative' }}>
      <textarea
        readOnly
        value={value}
        rows={5}
        style={{
          width: '100%', background: '#080c14', color: '#4ade80',
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: '0.82rem',
          padding: '16px', border: '1px solid rgba(74,222,128,0.25)', borderRadius: 8,
          resize: 'vertical', lineHeight: 1.6, outline: 'none',
        }}
        placeholder="// output will appear here…"
      />
      {value && (
        <button
          onClick={onCopy}
          style={{
            position: 'absolute', top: 10, right: 10,
            background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)',
            color: '#4ade80', padding: '4px 10px', borderRadius: 4,
            fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'monospace',
          }}
        >
          copy
        </button>
      )}
    </div>
  );

  const SliderRow = ({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) => (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>{label}</span>
        <span style={{ color: '#a78bfa', fontSize: '0.82rem', fontFamily: 'monospace' }}>{value}</span>
      </div>
      <input type="range" min={0} max={100} value={value} onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#7c3aed' }} />
    </div>
  );

  return (
    <div style={{ background: '#070b14', color: 'rgba(255,255,255,0.9)', minHeight: '100vh' }}>

      {/* ── COMPACT HERO ─────────────────────────────────────────────── */}
      <section style={{ position: 'relative', padding: '120px 24px 80px', textAlign: 'center', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${aiSectionImg})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.25,
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 20%, #070b14 80%)',
        }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 740, margin: '0 auto' }}>
          <p className="reveal" style={{
            color: '#a78bfa', fontSize: '0.75rem', letterSpacing: '0.18em',
            textTransform: 'uppercase', marginBottom: 16,
          }}>
            ⬡ Melodyfire AI Suite
          </p>
          <h1 className="font-display gradient-text reveal delay-100" style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800,
            lineHeight: 1.1, marginBottom: 20,
          }}>
            AI Generative Tools
          </h1>
          <p className="reveal delay-200" style={{
            color: 'rgba(255,255,255,0.55)', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: 560, margin: '0 auto 32px',
          }}>
            Real tools from real production pipelines. Craft, weave, and engineer prompts
            for ComfyUI, Midjourney, DALL·E, and beyond. Every session saved.
          </p>
          <div className="reveal delay-300" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['ComfyUI', 'Midjourney', 'DALL·E', 'SDXL', 'Flux'].map((t) => (
              <span key={t} style={{
                padding: '6px 14px', background: 'rgba(124,58,237,0.15)',
                border: '1px solid rgba(124,58,237,0.35)', borderRadius: 20,
                fontSize: '0.8rem', color: '#a78bfa',
              }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROMPT ANATOMY ────────────────────────────────────────────── */}
      <section style={{ padding: '60px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="reveal" style={{ marginBottom: 32, textAlign: 'center' }}>
            <p style={{ color: '#f59e0b', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>
              Anatomy of a Prompt
            </p>
            <h2 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>
              Build every prompt with intention
            </h2>
          </div>
          <div className="reveal delay-100" style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 12 }}>
            {PROMPT_ANATOMY_SEGMENTS.map((seg) => (
              <div key={seg.label} style={{
                flexShrink: 0, minWidth: 140,
                border: `1.5px solid ${seg.color}55`,
                borderRadius: 10, padding: '14px 16px',
                background: `${seg.color}0d`,
              }}>
                <div style={{ color: seg.color, fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                  {seg.label}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', lineHeight: 1.5 }}>
                  "{seg.example}"
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROMPT LABORATORY ─────────────────────────────────────────── */}
      <section className="holographic-section" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 920, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 className="font-display prismatic-text" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, marginBottom: 12 }}>
              Prompt Laboratory
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem' }}>
              Craft prompts with surgical precision. Every output is session-saved.
            </p>
          </div>

          {/* Terminal card */}
          <div className="holo-card reveal delay-100" style={{ overflow: 'hidden' }}>
            {/* Toolbar */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 20px', background: 'rgba(0,0,0,0.4)',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}>
              {['#f43f5e', '#f59e0b', '#22c55e'].map((c, i) => (
                <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
              ))}
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', fontFamily: 'monospace', marginLeft: 8 }}>
                Prompt Laboratory v2.1 — Melodyfire
              </span>
            </div>

            {/* Mode tabs */}
            <div style={{
              display: 'flex', overflowX: 'auto',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              padding: '0 20px',
            }}>
              {[
                { id: 'simple', label: 'Simple Transform' },
                { id: 'weaver', label: 'Style Weaver' },
                { id: 'narrative', label: 'Narrative Prompt' },
                { id: 'negative', label: 'Negative Builder' },
                { id: 'batch', label: 'Batch Variants' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveMode(tab.id as Mode)}
                  style={{
                    padding: '12px 18px', background: 'none',
                    border: 'none', cursor: 'pointer',
                    color: activeMode === tab.id ? '#a78bfa' : 'rgba(255,255,255,0.35)',
                    fontSize: '0.82rem', fontWeight: activeMode === tab.id ? 700 : 400,
                    borderBottom: activeMode === tab.id ? '2px solid #7c3aed' : '2px solid transparent',
                    marginBottom: '-1px', whiteSpace: 'nowrap', transition: 'color 0.2s',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Mode content */}
            <div style={{ padding: '28px 24px' }}>

              {/* ── MODE 1: Simple Transform ── */}
              {activeMode === 'simple' && (
                <div>
                  <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', display: 'block', marginBottom: 8 }}>
                    YOUR CONCEPT
                  </label>
                  <textarea
                    value={simpleInput}
                    onChange={e => setSimpleInput(e.target.value)}
                    rows={3}
                    placeholder="Describe your subject, scene, or concept…"
                    style={{
                      width: '100%', background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
                      color: 'rgba(255,255,255,0.85)', padding: '12px 16px',
                      fontSize: '0.9rem', outline: 'none', resize: 'vertical', marginBottom: 16,
                    }}
                  />
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
                    {Object.keys(STYLES).map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSimpleTransform(s)}
                        disabled={simpleLoading}
                        style={{
                          padding: '8px 18px',
                          background: simpleStyle === s ? 'rgba(124,58,237,0.35)' : 'rgba(255,255,255,0.06)',
                          border: simpleStyle === s ? '1.5px solid #7c3aed' : '1px solid rgba(255,255,255,0.12)',
                          borderRadius: 20, color: simpleStyle === s ? '#c4b5fd' : 'rgba(255,255,255,0.6)',
                          cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
                          transition: 'all 0.2s',
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  {simpleLoading && (
                    <div className="generation-loader">
                      <div className="gen-dot" /><div className="gen-dot" />
                      <div className="gen-dot" /><div className="gen-dot" />
                    </div>
                  )}
                  <TerminalOutput value={simpleOutput} onCopy={() => copyToClipboard(simpleOutput)} />
                </div>
              )}

              {/* ── MODE 2: Style Weaver ── */}
              {activeMode === 'weaver' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 20 }}>
                    {[
                      { label: 'Subject', value: subject, setter: setSubject, placeholder: 'A lone wanderer…' },
                      { label: 'Environment', value: environment, setter: setEnvironment, placeholder: 'In a neon-lit city…' },
                      { label: 'Mood', value: mood, setter: setMood, placeholder: 'Melancholic, hopeful…' },
                    ].map(({ label, value, setter, placeholder }) => (
                      <div key={label}>
                        <label style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', display: 'block', marginBottom: 6 }}>{label.toUpperCase()}</label>
                        <input
                          value={value}
                          onChange={e => setter(e.target.value)}
                          placeholder={placeholder}
                          style={{
                            width: '100%', background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6,
                            color: 'rgba(255,255,255,0.85)', padding: '10px 14px',
                            fontSize: '0.85rem', outline: 'none',
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <SliderRow label="Detail Level" value={detail} onChange={setDetail} />
                  <SliderRow label="Surrealism" value={surrealism} onChange={setSurrealism} />
                  <SliderRow label="Color Intensity" value={colorInt} onChange={setColorInt} />
                  <SliderRow label="Composition Complexity" value={complexity} onChange={setComplexity} />
                  <button
                    onClick={handleWeave}
                    disabled={weaverLoading || !subject.trim()}
                    style={{
                      background: 'linear-gradient(135deg, #7c3aed, #f43f5e)',
                      color: '#fff', padding: '11px 28px', borderRadius: 8,
                      border: 'none', cursor: 'pointer', fontWeight: 700,
                      fontSize: '0.88rem', marginBottom: 16, opacity: !subject.trim() ? 0.5 : 1,
                    }}
                  >
                    {weaverLoading ? 'Weaving…' : '⬡ Weave Prompt'}
                  </button>
                  {weaverLoading && (
                    <div className="generation-loader">
                      <div className="gen-dot" /><div className="gen-dot" />
                      <div className="gen-dot" /><div className="gen-dot" />
                    </div>
                  )}
                  <TerminalOutput value={weaverOutput} onCopy={() => copyToClipboard(weaverOutput)} />
                </div>
              )}

              {/* ── MODE 3: Narrative Prompt ── */}
              {activeMode === 'narrative' && (
                <div>
                  <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', display: 'block', marginBottom: 6 }}>
                    STORY PREMISE
                  </label>
                  <textarea
                    value={narrative}
                    onChange={e => setNarrative(e.target.value)}
                    rows={4}
                    placeholder="A scholar discovers an ancient map that leads not to treasure, but to the memory of a world that never was…"
                    style={{
                      width: '100%', background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
                      color: 'rgba(255,255,255,0.85)', padding: '12px 16px',
                      fontSize: '0.9rem', outline: 'none', resize: 'vertical', marginBottom: 16,
                    }}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
                    <div>
                      <label style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', display: 'block', marginBottom: 6 }}>VISUAL MEDIUM</label>
                      <select
                        value={medium}
                        onChange={e => setMedium(e.target.value)}
                        style={{
                          width: '100%', background: '#0f1420',
                          border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6,
                          color: 'rgba(255,255,255,0.85)', padding: '10px 14px', fontSize: '0.85rem',
                        }}
                      >
                        {MEDIUMS.map(m => <option key={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', display: 'block', marginBottom: 6 }}>NARRATIVE TONE</label>
                      <select
                        value={tone}
                        onChange={e => setTone(e.target.value)}
                        style={{
                          width: '100%', background: '#0f1420',
                          border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6,
                          color: 'rgba(255,255,255,0.85)', padding: '10px 14px', fontSize: '0.85rem',
                        }}
                      >
                        {TONES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={handleNarrative}
                    disabled={narrativeLoading || !narrative.trim()}
                    style={{
                      background: 'linear-gradient(135deg, #7c3aed, #f43f5e)',
                      color: '#fff', padding: '11px 28px', borderRadius: 8,
                      border: 'none', cursor: 'pointer', fontWeight: 700,
                      fontSize: '0.88rem', marginBottom: 16, opacity: !narrative.trim() ? 0.5 : 1,
                    }}
                  >
                    {narrativeLoading ? 'Generating…' : '✦ Generate Narrative'}
                  </button>
                  {narrativeLoading && (
                    <div className="generation-loader">
                      <div className="gen-dot" /><div className="gen-dot" />
                      <div className="gen-dot" /><div className="gen-dot" />
                    </div>
                  )}
                  <TerminalOutput value={narrativeOutput} onCopy={() => copyToClipboard(narrativeOutput)} />
                </div>
              )}

              {/* ── MODE 4: Negative Builder ── */}
              {activeMode === 'negative' && (
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', marginBottom: 16 }}>
                    Select elements to exclude from your generation:
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10, marginBottom: 20 }}>
                    {Object.keys(NEGATIVE_TOKENS).map((label) => (
                      <label key={label} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        background: negChecked[label] ? 'rgba(244,63,94,0.1)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${negChecked[label] ? 'rgba(244,63,94,0.4)' : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: 8, padding: '10px 14px', cursor: 'pointer', transition: 'all 0.2s',
                      }}>
                        <input
                          type="checkbox"
                          checked={!!negChecked[label]}
                          onChange={e => setNegChecked(prev => ({ ...prev, [label]: e.target.checked }))}
                          style={{ accentColor: '#f43f5e', flexShrink: 0 }}
                        />
                        <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem', lineHeight: 1.4 }}>{label}</span>
                      </label>
                    ))}
                  </div>
                  <input
                    value={negFreeText}
                    onChange={e => setNegFreeText(e.target.value)}
                    placeholder="Add custom negative tokens…"
                    style={{
                      width: '100%', background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
                      color: 'rgba(255,255,255,0.85)', padding: '10px 14px',
                      fontSize: '0.85rem', outline: 'none', marginBottom: 16,
                    }}
                  />
                  <button
                    onClick={buildNegative}
                    style={{
                      background: 'linear-gradient(135deg, #f43f5e, #f59e0b)',
                      color: '#fff', padding: '11px 28px', borderRadius: 8,
                      border: 'none', cursor: 'pointer', fontWeight: 700,
                      fontSize: '0.88rem', marginBottom: 16,
                    }}
                  >
                    Build Negative Prompt
                  </button>
                  <TerminalOutput value={negOutput} onCopy={() => copyToClipboard(negOutput)} />
                </div>
              )}

              {/* ── MODE 5: Batch Variants ── */}
              {activeMode === 'batch' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                    <div>
                      <label style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', display: 'block', marginBottom: 6 }}>CORE CONCEPT</label>
                      <input
                        value={batchConcept}
                        onChange={e => setBatchConcept(e.target.value)}
                        placeholder="e.g. ancient library in space"
                        style={{
                          width: '100%', background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6,
                          color: 'rgba(255,255,255,0.85)', padding: '10px 14px',
                          fontSize: '0.85rem', outline: 'none',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', display: 'block', marginBottom: 6 }}>STYLE TARGET</label>
                      <select
                        value={batchStyle}
                        onChange={e => setBatchStyle(e.target.value)}
                        style={{
                          width: '100%', background: '#0f1420',
                          border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6,
                          color: 'rgba(255,255,255,0.85)', padding: '10px 14px', fontSize: '0.85rem',
                        }}
                      >
                        {Object.keys(STYLES).map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>Number of Variants</span>
                      <span style={{ color: '#a78bfa', fontFamily: 'monospace', fontSize: '0.8rem' }}>{variantCount}</span>
                    </div>
                    <input type="range" min={2} max={8} value={variantCount} onChange={e => setVariantCount(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#7c3aed' }} />
                  </div>
                  <button
                    onClick={handleBatch}
                    disabled={batchLoading || !batchConcept.trim()}
                    style={{
                      background: 'linear-gradient(135deg, #06b6d4, #7c3aed)',
                      color: '#fff', padding: '11px 28px', borderRadius: 8,
                      border: 'none', cursor: 'pointer', fontWeight: 700,
                      fontSize: '0.88rem', marginBottom: 20, opacity: !batchConcept.trim() ? 0.5 : 1,
                    }}
                  >
                    {batchLoading ? 'Generating…' : `Generate ${variantCount} Variants`}
                  </button>
                  {batchVariants.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {batchVariants.map((v, i) => (
                        <div key={i} style={{
                          background: '#080c14', border: '1px solid rgba(6,182,212,0.2)',
                          borderRadius: 8, padding: '12px 14px', position: 'relative',
                        }}>
                          <div style={{ color: '#06b6d4', fontSize: '0.68rem', fontFamily: 'monospace', marginBottom: 6 }}>
                            VARIANT {i + 1} — {VARIANT_FRAMINGS[i]?.toUpperCase()}
                          </div>
                          <p style={{ color: '#4ade80', fontFamily: 'monospace', fontSize: '0.78rem', lineHeight: 1.6 }}>{v}</p>
                          <button
                            onClick={() => copyToClipboard(v)}
                            style={{
                              position: 'absolute', top: 10, right: 10,
                              background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.25)',
                              color: '#4ade80', padding: '3px 8px', borderRadius: 4,
                              fontSize: '0.68rem', cursor: 'pointer', fontFamily: 'monospace',
                            }}
                          >
                            copy
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* ── WORKFLOW GUIDE CARDS ──────────────────────────────────────── */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ color: '#f59e0b', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 10 }}>
              Production Workflows
            </p>
            <h2 className="font-display" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 800 }}>
              From Concept to Output
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 20 }}>
            {WORKFLOW_GUIDES.map((wf, i) => (
              <div key={wf.title} className={`holo-card reveal delay-${(i % 2 + 1) * 100}`} style={{ padding: '28px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <h3 className="font-display" style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 700, fontSize: '1rem' }}>
                    {wf.title}
                  </h3>
                  <span style={{
                    padding: '3px 10px', background: 'rgba(124,58,237,0.2)',
                    border: '1px solid rgba(124,58,237,0.35)', borderRadius: 12,
                    fontSize: '0.68rem', color: '#a78bfa', flexShrink: 0, marginLeft: 8,
                  }}>
                    {wf.tech}
                  </span>
                </div>
                <ol style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {wf.steps.map((step, si) => (
                    <li key={si} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <span style={{
                        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                        background: 'rgba(124,58,237,0.25)', border: '1px solid rgba(124,58,237,0.4)',
                        color: '#a78bfa', fontSize: '0.7rem', fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginTop: 2,
                      }}>
                        {si + 1}
                      </span>
                      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', lineHeight: 1.55 }}>
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ────────────────────────────────────────────────── */}
      <section className="holographic-section" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h2 className="font-display prismatic-text reveal" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, marginBottom: 16 }}>
            Ready to go deeper?
          </h2>
          <p className="reveal delay-100" style={{ color: 'rgba(255,255,255,0.45)', marginBottom: 32, lineHeight: 1.65 }}>
            Upload an image and reverse-engineer the exact prompt that would recreate it.
            Our multi-step architecture extracts every visual parameter.
          </p>
          <a
            href="/#/reverse-prompt"
            className="reveal delay-200"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #7c3aed, #f43f5e)',
              color: '#fff', padding: '14px 36px', borderRadius: 10,
              fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none',
              boxShadow: '0 0 32px rgba(124,58,237,0.4)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; }}
          >
            Try Reverse Prompt Engineer →
          </a>
        </div>
      </section>

    </div>
  );
}
