import { useEffect, useState, useCallback } from 'react';
import { supabase, getSessionId, saveReversePromptSession } from '@/lib/supabase';
import reversePromptImg from '@assets/img/mf-reverse-prompt-hero.png';
import heroMandalaImg from '@assets/img/hero-mandala.png';

// ── Scroll-reveal ──────────────────────────────────────────────────────────
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

// ── Analysis simulation ────────────────────────────────────────────────────
type AnalysisResult = {
  subject: string;
  lighting: string;
  composition: string;
  camera: string;
  styleAesthetic: string;
  moodAtmosphere: string;
  colorPalette: string[];
  technicalDetails: string;
};

function analyzeTextInput(text: string): AnalysisResult {
  const lower = text.toLowerCase();

  const subject = lower.includes('portrait') || lower.includes('person') || lower.includes('figure')
    ? 'Human subject, portrait or figurative composition'
    : lower.includes('landscape') || lower.includes('forest') || lower.includes('nature')
    ? 'Natural landscape, organic environment'
    : lower.includes('city') || lower.includes('urban') || lower.includes('street')
    ? 'Urban environment, architectural setting'
    : lower.includes('abstract') ? 'Abstract conceptual composition'
    : 'Central subject with environmental context';

  const lighting = lower.includes('dark') || lower.includes('shadow') || lower.includes('night')
    ? 'Chiaroscuro, dramatic shadows, low-key lighting'
    : lower.includes('bright') || lower.includes('light') || lower.includes('glow')
    ? 'High-key, luminous, radiant light source'
    : lower.includes('sunset') || lower.includes('golden') || lower.includes('warm')
    ? 'Golden hour, warm directional light, long shadows'
    : 'Soft ambient lighting, diffused natural light';

  const composition = lower.includes('close') || lower.includes('detail')
    ? 'Macro/close-up, foreground emphasis, shallow depth'
    : lower.includes('wide') || lower.includes('vast') || lower.includes('panorama')
    ? 'Wide establishing shot, environmental context'
    : lower.includes('symmetr') ? 'Symmetrical composition, centered subject'
    : 'Rule of thirds, balanced composition, leading lines';

  const camera = lower.includes('blur') || lower.includes('bokeh')
    ? 'f/1.8 wide aperture, shallow depth of field, bokeh background'
    : lower.includes('sharp') || lower.includes('crisp') || lower.includes('detail')
    ? 'f/8 medium aperture, sharp throughout, high detail'
    : lower.includes('wide') ? '24mm wide angle lens, environmental distortion'
    : '50mm prime lens, natural perspective, neutral rendering';

  const styleAesthetic = lower.includes('paint') || lower.includes('oil') ? 'Oil painting aesthetic, textured brushwork'
    : lower.includes('photo') || lower.includes('realistic') ? 'Photorealistic, documentary quality'
    : lower.includes('cartoon') || lower.includes('illustrat') ? 'Illustrated style, stylized rendering'
    : lower.includes('vintage') || lower.includes('retro') ? 'Vintage analog aesthetic, film grain'
    : lower.includes('futur') || lower.includes('sci-fi') ? 'Futuristic digital aesthetic, chrome and neon'
    : 'Contemporary digital art, painterly realism';

  const moodAtmosphere = lower.includes('sad') || lower.includes('melanchol') ? 'Melancholic, contemplative, introspective'
    : lower.includes('joy') || lower.includes('happy') || lower.includes('vibrant') ? 'Joyful, vibrant, energetic, celebratory'
    : lower.includes('peaceful') || lower.includes('calm') || lower.includes('serene') ? 'Serene, meditative, peaceful'
    : lower.includes('dark') || lower.includes('ominous') || lower.includes('danger') ? 'Ominous, foreboding, dramatic tension'
    : lower.includes('wonder') || lower.includes('magic') || lower.includes('dream') ? 'Dreamlike wonder, magical, otherworldly'
    : 'Contemplative, emotionally resonant, atmospheric';

  const colorPalette = lower.includes('warm') ? ['#d4824a', '#e8b86d', '#c75b3b', '#f0d08a', '#8b4513']
    : lower.includes('cool') || lower.includes('blue') ? ['#1e3a5f', '#2d6a9f', '#4a90b8', '#7ec8e3', '#c5e8f5']
    : lower.includes('green') || lower.includes('nature') || lower.includes('forest') ? ['#1a3d2b', '#2d6a4f', '#52b788', '#95d5b2', '#b7e4c7']
    : lower.includes('purple') || lower.includes('violet') ? ['#3d1f5e', '#6b35a0', '#9b59b6', '#c39bd3', '#e8d5f0']
    : lower.includes('dark') || lower.includes('night') ? ['#0d0d1a', '#1a1a2e', '#2d2d4a', '#4a4a6e', '#8888aa']
    : ['#2d1b69', '#7c3aed', '#f43f5e', '#f59e0b', '#06b6d4'];

  const technicalDetails = 'Ultra-detailed, 8K resolution, professional quality, sharp focus, HDR, award-winning';

  return { subject, lighting, composition, camera, styleAesthetic, moodAtmosphere, colorPalette, technicalDetails };
}

function analyzeImageUrl(url: string): AnalysisResult {
  const lower = url.toLowerCase();
  const isPortrait = lower.includes('portrait') || lower.includes('face') || lower.includes('person');
  const isLandscape = lower.includes('landscape') || lower.includes('nature') || lower.includes('scene');
  const isAbstract = lower.includes('abstract') || lower.includes('art') || lower.includes('design');

  return {
    subject: isPortrait ? 'Human portrait subject, facial expression, personal narrative'
      : isLandscape ? 'Environmental landscape, natural geography, atmospheric perspective'
      : isAbstract ? 'Abstract composition, conceptual visual language'
      : 'Primary subject with contextual environment, focal point composition',
    lighting: 'Three-point studio lighting with rim light, soft shadows, natural fill',
    composition: 'Rule of thirds composition, strong focal point, deliberate negative space',
    camera: '85mm portrait lens equivalent, f/2.8 aperture, soft background separation',
    styleAesthetic: 'Professional digital photography or digital painting, high production value',
    moodAtmosphere: 'Evocative, emotionally resonant, narrative-driven atmosphere',
    colorPalette: ['#1a1a2e', '#16213e', '#0f3460', '#e94560', '#f59e0b'],
    technicalDetails: 'Ultra-high resolution, sharp focus, professional color grading, cinematic aspect ratio',
  };
}

function buildPromptFromAnalysis(analysis: AnalysisResult, inputType: 'url' | 'text'): string {
  return `${analysis.subject}, ${analysis.lighting}, ${analysis.composition}, ${analysis.camera} lens, ${analysis.styleAesthetic}, ${analysis.moodAtmosphere} mood, color palette: ${analysis.colorPalette.join(' ')}, ${analysis.technicalDetails}, professional quality, award-winning composition`;
}

// ── Typing animation ───────────────────────────────────────────────────────
async function typeText(text: string, setter: (s: string) => void, ms = 600) {
  const words = text.split(' ');
  let current = '';
  for (const word of words) {
    current += (current ? ' ' : '') + word;
    setter(current);
    await new Promise((r) => setTimeout(r, ms / words.length));
  }
}

// ── Style / customization data ─────────────────────────────────────────────
const STYLE_TARGETS = ['ComfyUI', 'Midjourney', 'DALL·E', 'Stable Diffusion', 'Flux'];
const ART_MEDIUMS   = ['Photography', 'Digital Art', 'Oil Painting', 'Watercolor', 'Illustration', 'Concept Art', 'Anime'];
const MOOD_CHIPS    = ['Ethereal', 'Dramatic', 'Playful', 'Dark', 'Luminous', 'Nostalgic', 'Futuristic'];

type InputMode = 'url' | 'text' | 'file';
type Step = 1 | 2 | 3 | 4;

type SessionHistoryItem = {
  id: string;
  input_type: string;
  input_value: string;
  created_at: string;
  final_prompt?: string;
};

// ── Analysis card segment ──────────────────────────────────────────────────
const ANALYSIS_FIELDS: { key: keyof AnalysisResult; label: string; color: string }[] = [
  { key: 'subject',         label: 'Subject',          color: '#7c3aed' },
  { key: 'lighting',        label: 'Lighting',         color: '#f59e0b' },
  { key: 'composition',     label: 'Composition',      color: '#f43f5e' },
  { key: 'camera',          label: 'Camera',           color: '#06b6d4' },
  { key: 'styleAesthetic',  label: 'Style / Aesthetic',color: '#a78bfa' },
  { key: 'moodAtmosphere',  label: 'Mood / Atmosphere',color: '#f59e0b' },
  { key: 'technicalDetails',label: 'Technical Details',color: '#6b7280' },
];

// ── Main component ─────────────────────────────────────────────────────────
export default function ReversePromptPage() {
  useScrollReveal();
  const sessionId = getSessionId();

  const [step, setStep] = useState<Step>(1);
  const [inputMode, setInputMode] = useState<InputMode>('url');
  const [urlInput, setUrlInput]   = useState('');
  const [textInput, setTextInput] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  const [analysis, setAnalysis]       = useState<AnalysisResult | null>(null);
  const [basePrompt, setBasePrompt]   = useState('');
  const [promptTyping, setPromptTyping] = useState('');
  const [promptLoading, setPromptLoading] = useState(false);

  // Customization state
  const [styleTarget, setStyleTarget]     = useState('Midjourney');
  const [artMediums, setArtMediums]       = useState<Set<string>>(new Set(['Digital Art']));
  const [moods, setMoods]                 = useState<Set<string>>(new Set(['Ethereal']));
  const [detailLevel, setDetailLevel]     = useState(65);
  const [surrealLevel, setSurrealLevel]   = useState(20);
  const [saturation, setSaturation]       = useState(60);
  const [compComplexity, setCompComplexity] = useState(40);

  // Step 4
  const [finalPrompt, setFinalPrompt]   = useState('');
  const [finalEditable, setFinalEditable] = useState('');
  const [showPreview, setShowPreview]     = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [promptSaved, setPromptSaved]     = useState(false);
  const [promptCopied, setPromptCopied]   = useState(false);

  // Session history
  const [history, setHistory] = useState<SessionHistoryItem[]>([]);

  // Load history on mount
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('reverse_prompt_sessions')
        .select('id, input_type, input_value, created_at, final_prompt')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false })
        .limit(5);
      if (data) setHistory(data as SessionHistoryItem[]);
    })();
  }, [sessionId]);

  // ── Step 1 → 2: Analyze ──
  const handleAnalyze = useCallback(async () => {
    const inputValue = inputMode === 'url' ? urlInput : textInput;
    if (!inputValue.trim()) return;
    setAnalyzing(true);

    // Show loader for 1500ms
    await new Promise((r) => setTimeout(r, 1500));

    const result = inputMode === 'url'
      ? analyzeImageUrl(inputValue)
      : analyzeTextInput(inputValue);

    const resolvedMode = inputMode === 'file' ? 'text' : inputMode;
    const prompt = buildPromptFromAnalysis(result, resolvedMode);
    setAnalysis(result);
    setBasePrompt(prompt);

    // Save step 1
    await saveReversePromptSession(sessionId, {
      input_type: inputMode,
      input_value: inputValue,
      steps_completed: ['input'],
    });

    setAnalyzing(false);

    // Type out the prompt
    setPromptLoading(true);
    await typeText(prompt, setPromptTyping, 600);
    setPromptLoading(false);

    setStep(2);
  }, [inputMode, urlInput, textInput, sessionId]);

  // ── Step 3: Customize → build final prompt ──
  const handleUsePrompt = useCallback(async () => {
    let prompt = basePrompt;

    // Apply style target modifiers
    const styleModifiers: Record<string, string> = {
      ComfyUI:            ' masterpiece, best quality, 8k, sharp',
      Midjourney:         ' --ar 16:9 --stylize 750 --v 6',
      'DALL·E':           ' Professional digital illustration.',
      'Stable Diffusion': ' <lora:detail_tweaker:0.7>, steps 30, CFG 7',
      Flux:               ' flux_dev, high quality, cinematic',
    };
    prompt += styleModifiers[styleTarget] || '';

    // Art mediums
    if (artMediums.size > 0) {
      prompt = Array.from(artMediums).join(', ') + ', ' + prompt;
    }

    // Moods
    if (moods.size > 0) {
      prompt += ', ' + Array.from(moods).map(m => m.toLowerCase()).join(', ') + ' atmosphere';
    }

    // Slider modifiers
    if (detailLevel > 70) prompt += ', ultra-detailed, 8k resolution, sharp focus';
    if (surrealLevel > 70) prompt += ', dreamlike, impossible geometry, surreal transformation';
    if (saturation > 70)   prompt += ', vibrant saturated colors, chromatic, vivid palette';
    if (compComplexity > 70) prompt += ', intricate patterns, dense layered composition';

    setFinalPrompt(prompt);
    setFinalEditable(prompt);
    setStep(4);
    setShowPreview(false);
    setPromptSaved(false);

    window.scrollTo({ top: document.getElementById('final-prompt-block')?.offsetTop ?? 9999, behavior: 'smooth' });
  }, [basePrompt, styleTarget, artMediums, moods, detailLevel, surrealLevel, saturation, compComplexity]);

  const handleGeneratePreview = async () => {
    setShowPreview(false);
    setPreviewLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setPreviewLoading(false);
    setShowPreview(true);
  };

  const handleSaveSession = async () => {
    await saveReversePromptSession(sessionId, {
      input_type: inputMode,
      input_value: inputMode === 'url' ? urlInput : textInput,
      steps_completed: ['input', 'analysis', 'customization', 'final'],
      final_prompt: finalEditable,
    });
    setPromptSaved(true);
    // Refresh history
    const { data } = await supabase
      .from('reverse_prompt_sessions')
      .select('id, input_type, input_value, created_at, final_prompt')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(5);
    if (data) setHistory(data as SessionHistoryItem[]);
  };

  const handleStartOver = () => {
    setStep(1);
    setUrlInput('');
    setTextInput('');
    setAnalysis(null);
    setBasePrompt('');
    setPromptTyping('');
    setFinalPrompt('');
    setFinalEditable('');
    setShowPreview(false);
    setPromptSaved(false);
    setPromptCopied(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const restoreSession = (item: SessionHistoryItem) => {
    if (item.input_type === 'url') {
      setInputMode('url');
      setUrlInput(item.input_value);
    } else {
      setInputMode('text');
      setTextInput(item.input_value);
    }
    if (item.final_prompt) {
      setFinalEditable(item.final_prompt);
      setFinalPrompt(item.final_prompt);
    }
    setStep(1);
    window.scrollTo({ top: document.getElementById('rp-tool')?.offsetTop ?? 0, behavior: 'smooth' });
  };

  // ── Chip toggle helpers ──
  const toggleMedium = (m: string) => setArtMediums(prev => {
    const next = new Set(prev);
    next.has(m) ? next.delete(m) : next.add(m);
    return next;
  });
  const toggleMood = (m: string) => setMoods(prev => {
    const next = new Set(prev);
    next.has(m) ? next.delete(m) : next.add(m);
    return next;
  });

  // ── Slider row ──
  const SliderRow = ({ label, value, onChange, color = '#7c3aed' }: { label: string; value: number; onChange: (n: number) => void; color?: string }) => (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>{label}</span>
        <span style={{ color, fontSize: '0.82rem', fontFamily: 'monospace', fontWeight: 600 }}>{value}</span>
      </div>
      <input type="range" min={0} max={100} value={value} onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: color }} />
    </div>
  );

  return (
    <div style={{ background: '#070b14', color: 'rgba(255,255,255,0.9)', minHeight: '100vh' }}>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="holographic-section" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', position: 'relative' }}>
        {/* BG image */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `url(${reversePromptImg})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.35,
        }} />
        {/* Prismatic overlay */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 10%, #070b14 75%)',
        }} />
        <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 860, margin: '0 auto', padding: '120px 24px 80px', textAlign: 'center' }}>
          <p className="reveal" style={{
            color: '#a78bfa', fontSize: '0.75rem', letterSpacing: '0.2em',
            textTransform: 'uppercase', marginBottom: 20,
          }}>
            ⬡ Melodyfire AI — Flagship Tool
          </p>
          <h1 className="font-display reveal delay-100" style={{
            fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 900,
            lineHeight: 1.05, marginBottom: 24,
          }}>
            <span className="prismatic-text">Reverse Prompt</span><br />
            <span style={{ color: 'rgba(255,255,255,0.85)' }}>Engineer</span>
          </h1>
          <p className="reveal delay-200" style={{
            color: 'rgba(255,255,255,0.5)', fontSize: '1.05rem', lineHeight: 1.8,
            maxWidth: 620, margin: '0 auto 40px',
          }}>
            Upload an image or describe a visual. The multi-step architecture extracts:{' '}
            <span style={{ color: '#a78bfa' }}>Subject · Lighting · Composition · Camera · Style · Mood · Color Palette · Technical Details</span>
            {' '}— then builds you a complete, deployable prompt.
          </p>
          <a
            href="#rp-tool"
            className="reveal delay-300"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #7c3aed, #f43f5e, #f59e0b)',
              backgroundSize: '200% auto',
              color: '#fff', padding: '16px 40px', borderRadius: 12,
              fontWeight: 800, fontSize: '1rem', textDecoration: 'none',
              boxShadow: '0 0 40px rgba(124,58,237,0.45)',
              animation: 'shimmer 3s linear infinite',
            }}
          >
            Start Analyzing →
          </a>
        </div>
      </section>

      {/* ── MAIN TOOL ─────────────────────────────────────────────────── */}
      <section id="rp-tool" className="holographic-section" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>

          {/* Progress steps */}
          <div className="reveal" style={{ display: 'flex', gap: 0, marginBottom: 48, position: 'relative' }}>
            {['Input', 'Analysis', 'Customize', 'Final Prompt'].map((label, i) => {
              const stepNum = (i + 1) as Step;
              const active = step >= stepNum;
              return (
                <div key={label} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
                  {i > 0 && (
                    <div style={{
                      position: 'absolute', top: 14, left: 0, right: '50%',
                      height: 2, background: active ? 'linear-gradient(90deg, #7c3aed, #a78bfa)' : 'rgba(255,255,255,0.1)',
                      transition: 'background 0.4s',
                    }} />
                  )}
                  {i < 3 && (
                    <div style={{
                      position: 'absolute', top: 14, left: '50%', right: 0,
                      height: 2, background: step > stepNum ? 'linear-gradient(90deg, #a78bfa, #7c3aed)' : 'rgba(255,255,255,0.1)',
                      transition: 'background 0.4s',
                    }} />
                  )}
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', margin: '0 auto 8px',
                    background: active ? 'linear-gradient(135deg, #7c3aed, #f43f5e)' : 'rgba(255,255,255,0.08)',
                    border: `2px solid ${active ? '#7c3aed' : 'rgba(255,255,255,0.15)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative', zIndex: 1, transition: 'all 0.3s',
                  }}>
                    <span style={{ color: '#fff', fontSize: '0.7rem', fontWeight: 700 }}>{i + 1}</span>
                  </div>
                  <span style={{
                    color: active ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)',
                    fontSize: '0.72rem', fontWeight: active ? 600 : 400,
                    transition: 'color 0.3s',
                  }}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* ── STEP 1: Input ─── */}
          <div className="holo-card reveal delay-100" style={{ padding: '32px 28px', marginBottom: 24 }}>
            <h3 className="font-display" style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 700, fontSize: '1.1rem', marginBottom: 20 }}>
              <span style={{ color: '#a78bfa' }}>Step 1</span> — Choose Your Input
            </h3>

            {/* Input mode tabs */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
              {([['url', 'Upload Image URL', '🔗'], ['text', 'Describe Visually', '✏️'], ['file', 'Upload File (coming soon)', '📁']] as [InputMode, string, string][]).map(([mode, label, icon]) => (
                <button
                  key={mode}
                  onClick={() => mode !== 'file' && setInputMode(mode)}
                  disabled={mode === 'file'}
                  style={{
                    flex: 1, padding: '10px 14px',
                    background: inputMode === mode ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.04)',
                    border: `1.5px solid ${inputMode === mode ? '#7c3aed' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: 8, color: mode === 'file' ? 'rgba(255,255,255,0.2)' : inputMode === mode ? '#c4b5fd' : 'rgba(255,255,255,0.5)',
                    cursor: mode === 'file' ? 'not-allowed' : 'pointer', fontSize: '0.78rem',
                    fontWeight: inputMode === mode ? 700 : 400, transition: 'all 0.2s',
                  }}
                >
                  {icon} {label}
                </button>
              ))}
            </div>

            {/* URL input */}
            {inputMode === 'url' && (
              <div>
                <label style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', display: 'block', marginBottom: 8 }}>
                  IMAGE URL
                </label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input
                    type="url"
                    value={urlInput}
                    onChange={e => setUrlInput(e.target.value)}
                    placeholder="https://example.com/your-image.jpg"
                    style={{
                      flex: 1, background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8,
                      color: 'rgba(255,255,255,0.85)', padding: '12px 16px',
                      fontSize: '0.9rem', outline: 'none',
                    }}
                  />
                  <button
                    onClick={handleAnalyze}
                    disabled={analyzing || !urlInput.trim()}
                    style={{
                      background: 'linear-gradient(135deg, #7c3aed, #f43f5e)',
                      color: '#fff', padding: '12px 22px', borderRadius: 8,
                      border: 'none', cursor: !urlInput.trim() ? 'not-allowed' : 'pointer',
                      fontWeight: 700, fontSize: '0.88rem', opacity: !urlInput.trim() ? 0.5 : 1,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {analyzing ? 'Analyzing…' : 'Fetch & Analyze'}
                  </button>
                </div>
              </div>
            )}

            {/* Text input */}
            {inputMode === 'text' && (
              <div>
                <label style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', display: 'block', marginBottom: 8 }}>
                  VISUAL DESCRIPTION
                </label>
                <textarea
                  value={textInput}
                  onChange={e => setTextInput(e.target.value)}
                  rows={5}
                  placeholder="Describe the visual in detail — colors, mood, subjects, composition, lighting, materials, atmosphere. The more specific, the better the extraction."
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8,
                    color: 'rgba(255,255,255,0.85)', padding: '12px 16px',
                    fontSize: '0.9rem', outline: 'none', resize: 'vertical', marginBottom: 12,
                  }}
                />
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing || !textInput.trim()}
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed, #f43f5e)',
                    color: '#fff', padding: '12px 28px', borderRadius: 8,
                    border: 'none', cursor: !textInput.trim() ? 'not-allowed' : 'pointer',
                    fontWeight: 700, fontSize: '0.88rem', opacity: !textInput.trim() ? 0.5 : 1,
                  }}
                >
                  {analyzing ? 'Analyzing…' : 'Analyze Description'}
                </button>
              </div>
            )}

            {/* Loading animation */}
            {analyzing && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 0', gap: 16 }}>
                <div className="mandala-loader" />
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                  Extracting visual parameters…
                </p>
              </div>
            )}
          </div>

          {/* ── STEP 2: Analysis Results ─── */}
          {step >= 2 && analysis && (
            <div className="holo-card reveal" style={{ padding: '32px 28px', marginBottom: 24, animation: 'fadeIn 0.5s ease' }}>
              <h3 className="font-display" style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 700, fontSize: '1.1rem', marginBottom: 24 }}>
                <span style={{ color: '#06b6d4' }}>Step 2</span> — Analysis Results
              </h3>

              {/* Analysis segments grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12, marginBottom: 24 }}>
                {ANALYSIS_FIELDS.map(({ key, label, color }) => (
                  <div key={key} style={{
                    padding: '14px 16px',
                    background: `${color}0d`,
                    border: `1px solid ${color}44`,
                    borderLeft: `3px solid ${color}`,
                    borderRadius: 8,
                  }}>
                    <div style={{ color, fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
                      {label}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.83rem', lineHeight: 1.5 }}>
                      {analysis[key] as string}
                    </div>
                  </div>
                ))}

                {/* Color palette */}
                <div style={{
                  padding: '14px 16px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderLeft: '3px solid rgba(255,255,255,0.3)',
                  borderRadius: 8,
                }}>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
                    Color Palette
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {analysis.colorPalette.map((c, i) => (
                      <div key={i} title={c} style={{
                        width: 32, height: 32, borderRadius: '50%', background: c,
                        border: '2px solid rgba(255,255,255,0.15)',
                        boxShadow: `0 0 10px ${c}66`,
                      }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Generated base prompt */}
              <div>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', marginBottom: 10, fontFamily: 'monospace' }}>
                  // Based on your {inputMode === 'url' ? 'image' : 'description'}, here is your reverse-engineered prompt:
                </p>
                <div style={{ position: 'relative' }}>
                  <textarea
                    readOnly
                    value={promptLoading ? promptTyping : basePrompt}
                    rows={4}
                    style={{
                      width: '100%', background: '#080c14', color: '#4ade80',
                      fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: '0.82rem',
                      padding: '16px', border: '1px solid rgba(74,222,128,0.25)', borderRadius: 8,
                      resize: 'none', lineHeight: 1.6, outline: 'none',
                    }}
                  />
                  {(promptLoading) && (
                    <div style={{ position: 'absolute', bottom: 10, right: 10 }}>
                      <div style={{
                        display: 'inline-block', width: 8, height: 16,
                        background: '#4ade80', animation: 'gen-bounce 1s infinite',
                      }} />
                    </div>
                  )}
                </div>

                <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setStep(3)}
                    style={{
                      background: 'linear-gradient(135deg, #7c3aed, #f43f5e)',
                      color: '#fff', padding: '12px 28px', borderRadius: 8,
                      border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem',
                    }}
                  >
                    Customize This Prompt →
                  </button>
                  <button
                    onClick={() => navigator.clipboard.writeText(basePrompt)}
                    style={{
                      background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)',
                      color: '#4ade80', padding: '12px 20px', borderRadius: 8,
                      cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'monospace',
                    }}
                  >
                    Copy Base Prompt
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3: Customization ─── */}
          {step >= 3 && (
            <div className="holo-card reveal" style={{ padding: '32px 28px', marginBottom: 24 }}>
              <h3 className="font-display" style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 700, fontSize: '1.1rem', marginBottom: 24 }}>
                <span style={{ color: '#f59e0b' }}>Step 3</span> — Customize &amp; Refine
              </h3>

              {/* Style target toggles */}
              <div style={{ marginBottom: 24 }}>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
                  Style Target
                </p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {STYLE_TARGETS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStyleTarget(s)}
                      style={{
                        padding: '8px 18px',
                        background: styleTarget === s ? 'rgba(124,58,237,0.35)' : 'rgba(255,255,255,0.05)',
                        border: `1.5px solid ${styleTarget === s ? '#7c3aed' : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: 20, color: styleTarget === s ? '#c4b5fd' : 'rgba(255,255,255,0.5)',
                        cursor: 'pointer', fontSize: '0.82rem', fontWeight: styleTarget === s ? 700 : 400,
                        transition: 'all 0.2s',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Art medium chips */}
              <div style={{ marginBottom: 24 }}>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
                  Art Medium <span style={{ fontSize: '0.65rem', opacity: 0.5 }}>(multi-select)</span>
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {ART_MEDIUMS.map((m) => (
                    <button
                      key={m}
                      onClick={() => toggleMedium(m)}
                      style={{
                        padding: '7px 16px',
                        background: artMediums.has(m) ? 'rgba(6,182,212,0.25)' : 'rgba(255,255,255,0.04)',
                        border: `1.5px solid ${artMediums.has(m) ? '#06b6d4' : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: 20, color: artMediums.has(m) ? '#67e8f9' : 'rgba(255,255,255,0.5)',
                        cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.2s',
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mood chips */}
              <div style={{ marginBottom: 24 }}>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
                  Mood Modifiers <span style={{ fontSize: '0.65rem', opacity: 0.5 }}>(multi-select)</span>
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {MOOD_CHIPS.map((m) => (
                    <button
                      key={m}
                      onClick={() => toggleMood(m)}
                      style={{
                        padding: '7px 16px',
                        background: moods.has(m) ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.04)',
                        border: `1.5px solid ${moods.has(m) ? '#f59e0b' : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: 20, color: moods.has(m) ? '#fcd34d' : 'rgba(255,255,255,0.5)',
                        cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.2s',
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                <SliderRow label="Detail Level" value={detailLevel} onChange={setDetailLevel} color="#7c3aed" />
                <SliderRow label="Surrealism" value={surrealLevel} onChange={setSurrealLevel} color="#f43f5e" />
                <SliderRow label="Color Saturation" value={saturation} onChange={setSaturation} color="#f59e0b" />
                <SliderRow label="Composition Complexity" value={compComplexity} onChange={setCompComplexity} color="#06b6d4" />
              </div>

              {/* Use This Prompt CTA */}
              <button
                onClick={handleUsePrompt}
                style={{
                  width: '100%', padding: '18px',
                  background: 'linear-gradient(135deg, #7c3aed 0%, #f43f5e 50%, #f59e0b 100%)',
                  backgroundSize: '200% auto',
                  color: '#fff', border: 'none', borderRadius: 12,
                  fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer',
                  boxShadow: '0 0 40px rgba(124,58,237,0.4)',
                  animation: 'shimmer 3s linear infinite',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; }}
              >
                ✦ Use This Prompt!
              </button>
            </div>
          )}

          {/* ── STEP 4: Final Prompt Block ─── */}
          {step >= 4 && finalPrompt && (
            <div id="final-prompt-block" className="holo-card reveal" style={{ padding: '32px 28px', marginBottom: 24 }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: '#22c55e', boxShadow: '0 0 10px #22c55e',
                  animation: 'gen-bounce 2s infinite',
                }} />
                <h3 className="font-display" style={{ color: '#22c55e', fontWeight: 700, fontSize: '1rem' }}>
                  Prompt Ready! — Your Customized Prompt
                </h3>
              </div>

              <label style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem', display: 'block', marginBottom: 8 }}>
                EDITABLE — READY TO DEPLOY
              </label>
              <textarea
                value={finalEditable}
                onChange={e => setFinalEditable(e.target.value)}
                rows={6}
                style={{
                  width: '100%', background: '#080c14', color: '#4ade80',
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: '0.82rem',
                  padding: '16px', border: '1px solid rgba(34,197,94,0.4)', borderRadius: 8,
                  resize: 'vertical', lineHeight: 1.65, outline: 'none', marginBottom: 20,
                }}
              />

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
                <button
                  onClick={handleGeneratePreview}
                  style={{
                    background: 'rgba(124,58,237,0.25)', border: '1px solid rgba(124,58,237,0.5)',
                    color: '#c4b5fd', padding: '10px 22px', borderRadius: 8,
                    cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem',
                  }}
                >
                  Generate Preview
                </button>
                <button
                  onClick={() => { navigator.clipboard.writeText(finalEditable); setPromptCopied(true); setTimeout(() => setPromptCopied(false), 2000); }}
                  style={{
                    background: promptCopied ? 'rgba(34,197,94,0.25)' : 'rgba(74,222,128,0.1)',
                    border: `1px solid ${promptCopied ? 'rgba(34,197,94,0.5)' : 'rgba(74,222,128,0.25)'}`,
                    color: promptCopied ? '#86efac' : '#4ade80', padding: '10px 22px', borderRadius: 8,
                    cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', fontFamily: 'monospace',
                    transition: 'all 0.2s',
                  }}
                >
                  {promptCopied ? '✓ Copied!' : 'Copy Prompt'}
                </button>
                <button
                  onClick={handleSaveSession}
                  disabled={promptSaved}
                  style={{
                    background: promptSaved ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.06)',
                    border: `1px solid ${promptSaved ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.12)'}`,
                    color: promptSaved ? '#fcd34d' : 'rgba(255,255,255,0.5)',
                    padding: '10px 22px', borderRadius: 8,
                    cursor: promptSaved ? 'default' : 'pointer', fontSize: '0.88rem',
                    transition: 'all 0.2s',
                  }}
                >
                  {promptSaved ? '✓ Saved' : 'Save Session'}
                </button>
                <button
                  onClick={handleStartOver}
                  style={{
                    background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)',
                    color: 'rgba(244,63,94,0.7)', padding: '10px 22px', borderRadius: 8,
                    cursor: 'pointer', fontSize: '0.88rem',
                  }}
                >
                  Start Over
                </button>
              </div>

              {/* Preview area */}
              {previewLoading && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px', gap: 16, background: 'rgba(0,0,0,0.3)', borderRadius: 8 }}>
                  <div className="mandala-loader" />
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', fontFamily: 'monospace' }}>
                    Preparing generation preview…
                  </p>
                </div>
              )}
              {showPreview && !previewLoading && (
                <div style={{
                  borderRadius: 10, overflow: 'hidden',
                  background: 'linear-gradient(135deg, #1a0533 0%, #0d1f3c 50%, #1a1a0d 100%)',
                  padding: '48px 24px', textAlign: 'center',
                  border: '1px solid rgba(124,58,237,0.25)',
                }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: '50%', margin: '0 auto 16px',
                    background: 'linear-gradient(135deg, #7c3aed, #f43f5e, #f59e0b)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.8rem',
                  }}>
                    🎨
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: 8 }}>
                    Generation preview — connect your API key to enable live generation
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>
                    Connect Midjourney, DALL·E, or Stability API in Studio settings for live generation
                  </p>
                </div>
              )}
            </div>
          )}

        </div>
      </section>

      {/* ── SESSION HISTORY ────────────────────────────────────────────── */}
      {history.length > 0 && (
        <section style={{ padding: '60px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ maxWidth: 820, margin: '0 auto' }}>
            <div className="reveal" style={{ marginBottom: 24 }}>
              <p style={{ color: '#a78bfa', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
                Session Memory
              </p>
              <h2 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>
                Recent Sessions
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {history.map((item, i) => (
                <div key={item.id} className={`holo-card reveal delay-${(i + 1) * 100}`} style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{
                    padding: '3px 10px', borderRadius: 12, flexShrink: 0,
                    background: item.input_type === 'url' ? 'rgba(6,182,212,0.2)' : 'rgba(124,58,237,0.2)',
                    border: `1px solid ${item.input_type === 'url' ? 'rgba(6,182,212,0.4)' : 'rgba(124,58,237,0.4)'}`,
                    color: item.input_type === 'url' ? '#67e8f9' : '#c4b5fd',
                    fontSize: '0.68rem', fontWeight: 700,
                  }}>
                    {item.input_type === 'url' ? 'URL' : 'TEXT'}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.input_value}
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.68rem', marginTop: 3 }}>
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => restoreSession(item)}
                    style={{
                      background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.35)',
                      color: '#a78bfa', padding: '7px 14px', borderRadius: 6,
                      cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, flexShrink: 0,
                    }}
                  >
                    Restore
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── BOTTOM DIVIDER / HERO MANDALA ────────────────────────────── */}
      <section className="holographic-section" style={{ padding: '60px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${heroMandalaImg})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.08,
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', marginBottom: 16 }}>
            Looking for a ready-made visual language?
          </p>
          <a
            href="/#/regenerative"
            style={{
              color: '#a78bfa', fontWeight: 600, fontSize: '0.9rem',
              textDecoration: 'underline', textUnderlineOffset: 4,
            }}
          >
            Explore the Solarpunk Grimoire visual system →
          </a>
        </div>
      </section>

    </div>
  );
}
