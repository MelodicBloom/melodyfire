import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import childrensArtImg from '@assets/img/mf-childrens-art-service.png';
import aboutImg from '@assets/img/about.png';
import whitePortraitImg from '@assets/img/mf-portrait-white-companion.png';
import storybookVideoSrc from '@assets/storybook-art-demo.mp4';
import monsterMirrorVideoSrc from '@assets/monster-mirror-demo.mp4';

/* ------------------------------------------------------------------ */
/*  Types                                                                */
/* ------------------------------------------------------------------ */

type InquiryForm = {
  name: string;
  email: string;
  description: string;
  tier: string;
};

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

/* ------------------------------------------------------------------ */
/*  Data                                                                 */
/* ------------------------------------------------------------------ */

const PRICING_TIERS = [
  {
    icon: '🎨',
    name: 'Single Scene',
    price: '$75',
    description:
      'One illustrated scene, up to 2 main characters. Perfect for a personalized gift, a chapter header, or a single story moment.',
    deliverables: [
      'High-res PNG + JPEG (300 dpi)',
      'Up to 2 revision rounds',
      'Commercial license included',
      '1 character consistency pass',
    ],
    highlight: false,
  },
  {
    icon: '📖',
    name: 'Story Pack',
    price: '$220',
    description:
      '5 cohesive illustrated scenes with full character consistency — everything you need for a picture book arc, a gift series, or an illustrated journal.',
    deliverables: [
      '5 illustrated scenes',
      'Consistent character system',
      'Up to 3 revision rounds per scene',
      'Print-ready export package',
      'Commercial license',
    ],
    highlight: true,
  },
  {
    icon: '🏆',
    name: 'Full Book Companion',
    price: '$650',
    description:
      '15+ scenes for a complete illustrated book — cover, interior spreads, and character bible. The full Monsterverse pipeline applied to your story.',
    deliverables: [
      '15+ illustrated scenes',
      'Book cover design',
      'Character bible document',
      'Style guide for future use',
      'Unlimited revisions (within brief)',
      'Print + digital license',
    ],
    highlight: false,
  },
];

const WHY_AI_CARDS = [
  {
    icon: '💛',
    title: 'Emotionally Safe Themes',
    description:
      'Every scene is built around warmth, wonder, and child-centered emotional narratives. No scary characters — just whimsical mirrors of childhood experiences.',
  },
  {
    icon: '🎭',
    title: 'Character Consistency',
    description:
      'The Monsterverse pipeline maintains character identity across scenes using LoRA weights and a canon prompt set — your character looks the same on every page.',
  },
  {
    icon: '🖼️',
    title: 'Tactile Craft Aesthetic',
    description:
      'Layered papercraft dioramas with visible edge thickness, hand-drawn woodgrain, and embroidered textile details. It looks like art made by loving hands.',
  },
  {
    icon: '⚡',
    title: 'Fast Turnaround',
    description:
      'Single scenes delivered in 5–7 business days. Story packs in 14 days. No waiting months for a finished book — iterate in real time.',
  },
];

const FAQ_ITEMS = [
  {
    q: 'What is the art style like?',
    a: 'Layered papercraft diorama with visible staggered edges and thickness — each "layer" reads as a cut piece of painted cardstock. Backgrounds feature impasto oil-painted skies, foreground characters are rendered in quilled paper ribbons and embroidered folk textiles, and every scene has deep ambient occlusion shadows that make it feel physically constructed. Warm amber and rose lighting throughout, with soft cel-shading outlines on characters.',
  },
  {
    q: 'Can you create specific characters?',
    a: "Yes — character consistency is a core feature of the Monsterverse pipeline. You provide a character description (or a reference image), and I train a lightweight consistency pass that keeps your character recognizable across all scenes. This works for human children, talking animals, whimsical creatures, and parent-child pairs.",
  },
  {
    q: 'What file formats do you deliver?',
    a: 'High-resolution 300dpi PNG and JPEG files, print-ready at standard picture book dimensions (8.5×8.5" and 8.5×11"). All files include embedded color profiles (sRGB and CMYK on request). For Story Packs and Full Book Companions, you also receive a layered export guide.',
  },
  {
    q: 'How long does it take?',
    a: 'Single scenes are delivered in 5–7 business days from brief approval. Story Packs take 14 calendar days. Full Book Companions are scoped individually — typically 4–6 weeks with milestone check-ins at scenes 5, 10, and final review. Rush options are available at +30%.',
  },
  {
    q: 'Is this suitable for publishing?',
    a: 'Yes. All files are delivered at print quality (300 dpi minimum) with commercial licensing included. The artwork meets standard requirements for print-on-demand platforms (Lulu, KDP, IngramSpark) and traditional publishers. For traditional publishing, I recommend a rights discussion before committing to a manuscript.',
  },
];

/* ------------------------------------------------------------------ */
/*  Commission Form                                                      */
/* ------------------------------------------------------------------ */

function CommissionForm() {
  const [form, setForm] = useState<InquiryForm>({
    name: '',
    email: '',
    description: '',
    tier: 'single_scene',
  });
  const [status, setStatus] = useState<FormStatus>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const { error } = await supabase.from('inquiries').insert({
        name: form.name,
        email: form.email,
        description: form.description,
        tier: form.tier,
        inquiry_type: 'children_art',
        created_at: new Date().toISOString(),
      });

      if (error) throw error;
      setStatus('success');
      setForm({ name: '', email: '', description: '', tier: 'single_scene' });
    } catch (err) {
      console.error('Inquiry submission failed:', err);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">🎉</div>
        <h3 className="font-display text-2xl font-bold text-white mb-3">Inquiry received!</h3>
        <p className="text-white/60 max-w-md mx-auto">
          Thank you — I'll be in touch within 1–2 business days to discuss your project and next
          steps.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-6 px-5 py-2.5 rounded-xl text-sm font-semibold text-white/70 border border-white/20 hover:border-violet-500/50 hover:text-white transition-all"
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-2">
            Your Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Jennipher Troup"
            className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/30 border border-white/15 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-all"
            style={{ background: 'hsl(var(--input))' }}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2">
            Email Address *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="hello@example.com"
            className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/30 border border-white/15 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-all"
            style={{ background: 'hsl(var(--input))' }}
          />
        </div>
      </div>

      <div>
        <label htmlFor="tier" className="block text-sm font-medium text-white/70 mb-2">
          Service Tier
        </label>
        <select
          id="tier"
          name="tier"
          value={form.tier}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl text-sm text-white border border-white/15 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-all appearance-none cursor-pointer"
          style={{ background: 'hsl(var(--input))' }}
        >
          <option value="single_scene">Single Scene — $75</option>
          <option value="story_pack">Story Pack — $220</option>
          <option value="full_book">Full Book Companion — $650</option>
          <option value="custom">Custom / Not Sure Yet</option>
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-white/70 mb-2">
          Tell Me About Your Project *
        </label>
        <textarea
          id="description"
          name="description"
          required
          value={form.description}
          onChange={handleChange}
          rows={5}
          placeholder="Describe your story, characters, mood, or any reference images you have in mind. The more detail, the better..."
          className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/30 border border-white/15 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-all resize-y"
          style={{ background: 'hsl(var(--input))' }}
        />
      </div>

      {status === 'error' && (
        <p className="text-red-400 text-sm bg-red-500/10 px-4 py-3 rounded-xl border border-red-500/20">
          Something went wrong. Please try again or email hello@melodyfire.com directly.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-3.5 rounded-xl font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #f43f5e 100%)' }}
      >
        {status === 'loading' ? (
          <span className="flex items-center justify-center gap-2">
            <span className="mandala-loader w-5 h-5 border-2" />
            Sending...
          </span>
        ) : (
          'Send Commission Inquiry →'
        )}
      </button>
      <p className="text-center text-xs text-white/30">
        No payment required at this stage. I'll send a formal quote after our initial conversation.
      </p>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                            */
/* ------------------------------------------------------------------ */

export default function ChildrensArtPage() {
  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('revealed');
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen" style={{ background: 'hsl(var(--background))' }}>
      {/* ================================================================
          HERO — full-width, warm amber lighting
          ================================================================ */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        {/* Background image at 40% opacity */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${childrensArtImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            opacity: 0.4,
          }}
        />
        {/* Warm amber overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(245,158,11,0.08) 0%, rgba(15,5,25,0.75) 60%, hsl(var(--background)) 100%)',
          }}
        />
        {/* Glow orbs */}
        <div
          className="absolute top-20 right-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-20">
          <p className="text-sm font-semibold tracking-widest uppercase text-amber-400 mb-5 reveal">
            Children's Art &amp; Story Services
          </p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 reveal delay-100">
            <span className="text-white">Stories that feel</span>
            <br />
            <span className="gradient-text-fire">like magic</span>
          </h1>
          <p className="text-white/65 text-lg md:text-xl max-w-2xl leading-relaxed reveal delay-200">
            AI-generated illustrated artwork for children's books, personalized gifts, and
            toddler-safe visual storytelling. Built on the Monsterverse pipeline — layered papercraft,
            impasto skies, quilled botanicals.
          </p>
          <div className="flex flex-wrap gap-4 mt-8 reveal delay-300">
            <a
              href="#commission"
              className="px-6 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #f43f5e 100%)' }}
            >
              Commission a Scene
            </a>
            <a
              href="https://docs.google.com/document/d/1WcRLvegKEkkwGIW2adYWUsxu8VC3Cp-yoNlbTdkI4XI/edit"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-xl font-semibold text-white/70 border border-white/20 hover:border-amber-500/50 hover:text-white transition-all"
            >
              Open Production Bible →
            </a>
          </div>
        </div>
      </section>

      {/* ================================================================
          ABOUT THE ART STYLE
          ================================================================ */}
      <section className="px-6 py-20" style={{ background: 'linear-gradient(160deg, #1a0a2e 0%, #0d1520 50%, #1a0d30 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-amber-400 mb-4 reveal">
                The Visual Language
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6 reveal delay-100">
                A Style Built for{' '}
                <span className="gradient-text-fire">Wonder</span>
              </h2>
              <div className="space-y-4 reveal delay-200">
                <p className="text-white/75 leading-relaxed">
                  The Melodyfire children's art style is a hybrid medium: <strong className="text-amber-400">40% papercraft
                  diorama</strong> (staggered layers, visible card edge thickness, die-cut
                  silhouettes), <strong className="text-rose-400">30% impasto oil painting</strong> (turbulent sky
                  backgrounds with visible heavy brushwork), <strong className="text-violet-400">20% quilled paper ribbons</strong> (coiled
                  foreground botanicals, character hair, and fabric texture), and{' '}
                  <strong className="text-cyan-400">10% soft cel-shading</strong> outlines on characters.
                </p>
                <p className="text-white/75 leading-relaxed">
                  The tactile details matter: hand-drawn woodgrain visible in furniture and trees,
                  shiny wet mud and water rendered with specular highlights, embroidered folk
                  textiles on character clothing, and deep ambient occlusion shadows at every layer
                  edge that convince the eye the scene is physically constructed.
                </p>
                <p className="text-white/75 leading-relaxed">
                  Warm amber and rose color temperatures throughout. Every scene feels like late
                  afternoon in a room where something magical just happened — and the child in the
                  picture is completely at home in it.
                </p>
              </div>
            </div>

            {/* Image */}
            <div className="reveal reveal-right delay-300">
              <div className="relative">
                {/* Decorative border frame */}
                <div
                  className="absolute -inset-4 rounded-3xl opacity-50"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(245,158,11,0.3), rgba(244,63,94,0.2), rgba(124,58,237,0.15))',
                    padding: 2,
                  }}
                />
                <div
                  className="absolute -inset-3 rounded-2xl"
                  style={{
                    border: '2px solid rgba(245,158,11,0.25)',
                    borderRadius: '1.25rem',
                  }}
                />
                <img
                  src={childrensArtImg}
                  alt="Monsterverse children's art style preview"
                  className="relative w-full rounded-2xl object-cover imperfect-border"
                  style={{ aspectRatio: '4/3', maxHeight: 480 }}
                  loading="lazy"
                />
                {/* Caption badge */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/60 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/10">
                    <p className="text-xs text-amber-400 font-semibold mb-0.5">
                      Monsterverse Pipeline
                    </p>
                    <p className="text-white/70 text-xs">
                      Papercraft · Impasto · Quilled · Cel-shaded
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          SEE IT IN MOTION — Video players
          ================================================================ */}
      <section className="py-20 bg-[hsl(var(--background))]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold tracking-widest uppercase text-amber-400 mb-3 reveal">
              In Motion
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 reveal delay-100">
              <span className="gradient-text-fire">Watch the Magic Happen</span>
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto leading-relaxed reveal delay-200">
              These aren't renders — they're living, breathing papercraft worlds. Watch how the layered diorama aesthetic moves.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Video 1 — Storybook */}
            <div className="reveal reveal-left delay-100">
              <video
                className="w-full rounded-2xl"
                style={{ aspectRatio: '16/9' }}
                autoPlay
                muted
                loop
                playsInline
                controls
              >
                <source src={storybookVideoSrc} type="video/mp4" />
              </video>
              <p className="mt-3 text-sm text-white/60 leading-relaxed text-center">
                Storybook World Comes Alive — papercraft terrain + quilled botanicals + character animation
              </p>
            </div>

            {/* Video 2 — Monster Mirror */}
            <div className="reveal reveal-right delay-200">
              <video
                className="w-full rounded-2xl"
                style={{ aspectRatio: '16/9' }}
                autoPlay
                muted
                loop
                playsInline
                controls
              >
                <source src={monsterMirrorVideoSrc} type="video/mp4" />
              </video>
              <p className="mt-3 text-sm text-white/60 leading-relaxed text-center">
                Monster Mirror Series — emotional resonance through character mirroring
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          ABOUT MONSTERVERSE — Solarpunk section with warm tint
          ================================================================ */}
      <section
        className="px-6 py-20 relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #120a05 0%, #0a0e1a 40%, #1a0d30 100%)',
        }}
      >
        {/* Warm amber dot pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Ccircle cx='30' cy='30' r='0.5' fill='rgba(245,158,11,0.12)'/%3E%3C/svg%3E\")",
            // backgroundImage2 removed — use separate overlay element
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(245,158,11,0.05) 0%, transparent 70%)',
          }}
        />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-4 reveal"
            style={{ color: '#c9a84c' }}
          >
            The World Behind the Work
          </p>
          <h2
            className="font-display text-3xl md:text-4xl font-bold mb-6 reveal delay-100"
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #e8cc7a 50%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            The Monster Mirror Series
          </h2>
          <p className="leading-relaxed mb-6 reveal delay-200" style={{ color: '#e8dfc8' }}>
            Children's storybook series featuring talking animals, parent-child bonds, and whimsical
            monsters as mirrors of childhood emotions. Each book explores one core feeling —
            loneliness, jealousy, wonder, courage — through a creature who embodies it, and a child
            who learns to be friends with it.
          </p>
          <p className="leading-relaxed mb-8 reveal delay-300" style={{ color: '#9b8c6e' }}>
            Each scene is generated from 4 canon prompts forming the Monsterverse style engine —
            a reusable system that any story can plug into and produce consistent, high-quality
            illustrated results. The pipeline is documented, tested, and available for
            collaboration.
          </p>
          <a
            href="https://docs.google.com/document/d/1WcRLvegKEkkwGIW2adYWUsxu8VC3Cp-yoNlbTdkI4XI/edit"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-90 hover:scale-[1.02] reveal delay-400"
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #c9a84c 100%)',
              color: '#0a0e1a',
            }}
          >
            Open Production Bible →
          </a>
        </div>
      </section>

      {/* ================================================================
          COMMISSION SERVICE — Pricing Tiers
          ================================================================ */}
      <section id="commission" className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase text-amber-400 mb-3 reveal">
              Pricing
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white reveal delay-100">
              Choose Your{' '}
              <span className="gradient-text-fire">Adventure</span>
            </h2>
            <p className="text-white/50 mt-3 max-w-lg mx-auto reveal delay-200">
              Every tier includes commercial licensing and revision rounds. No surprises.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {PRICING_TIERS.map((tier, i) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl p-8 flex flex-col reveal delay-${(i * 100 + 100) as 100 | 200 | 300} ${
                  tier.highlight
                    ? 'border-2 border-amber-500/40'
                    : 'border border-white/10'
                }`}
                style={{
                  background: tier.highlight
                    ? 'linear-gradient(160deg, rgba(245,158,11,0.08) 0%, rgba(15,5,25,0.9) 100%)'
                    : 'hsl(var(--card))',
                }}
              >
                {tier.highlight && (
                  <div
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold"
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b 0%, #f43f5e 100%)',
                      color: 'white',
                    }}
                  >
                    Most Popular
                  </div>
                )}
                <span className="text-4xl mb-4 block">{tier.icon}</span>
                <h3 className="font-display text-xl font-bold text-white mb-1">{tier.name}</h3>
                <p className="font-display text-3xl font-bold text-white mb-4"
                   style={{ color: tier.highlight ? '#f59e0b' : 'white' }}>
                  {tier.price}
                </p>
                <p className="text-white/60 text-sm leading-relaxed mb-6">{tier.description}</p>

                <ul className="space-y-2 mb-8 flex-1">
                  {tier.deliverables.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-white/65">
                      <span className="text-amber-400 mt-0.5 flex-shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <a
                  href="#commission-form"
                  className="block text-center py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
                  style={
                    tier.highlight
                      ? { background: 'linear-gradient(135deg, #f59e0b 0%, #f43f5e 100%)', color: 'white' }
                      : { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.12)' }
                  }
                >
                  Get Started
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          WHY AI ART FOR CHILDREN
          ================================================================ */}
      <section className="px-6 py-20 holographic-section">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase text-cyan-400 mb-3 reveal">
              Why This Works
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white reveal delay-100">
              Why AI Art{' '}
              <span className="prismatic-text">for Children?</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY_AI_CARDS.map((card, i) => (
              <div
                key={card.title}
                className={`holo-card p-6 text-center reveal delay-${(i * 100 + 100) as 100 | 200 | 300 | 400}`}
              >
                <span className="text-3xl mb-4 block">{card.icon}</span>
                <h3 className="font-display font-semibold text-white mb-3 text-sm">
                  {card.title}
                </h3>
                <p className="text-white/55 text-xs leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          PORTRAITS GALLERY
          ================================================================ */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold tracking-widest uppercase text-violet-400 mb-3 reveal">
              The Studio
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white reveal delay-100">
              Representation Matters in{' '}
              <span className="gradient-text-primary">Creative Tools</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Portrait 1 */}
            <div className="sg-card overflow-hidden reveal reveal-left delay-100">
              <div className="relative" style={{ height: 320 }}>
                <img
                  src={aboutImg}
                  alt="Jennipher's creative world — where code meets story"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white/90 text-sm font-medium">
                    Jennipher's creative world — where code meets story
                  </p>
                </div>
              </div>
            </div>
            {/* Portrait 2 */}
            <div className="sg-card overflow-hidden reveal reveal-right delay-200">
              <div className="relative" style={{ height: 320 }}>
                <img
                  src={whitePortraitImg}
                  alt="The collaborative studio spirit"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white/90 text-sm font-medium">
                    The collaborative studio spirit
                  </p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-white/40 text-sm leading-relaxed reveal delay-300">
            Melodyfire serves families and creators across every background.
            <br />
            Representation in creative tools matters.
          </p>
        </div>
      </section>

      {/* ================================================================
          FAQ ACCORDION
          ================================================================ */}
      <section className="px-6 py-16 solarpunk-section">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-10">
            <p className="sg-gold text-xs font-semibold tracking-widest uppercase mb-3 reveal">
              Questions
            </p>
            <h2 className="font-display text-3xl font-bold sg-text reveal delay-100">
              Frequently Asked
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-3 reveal delay-200">
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="sg-card rounded-xl border-none px-6"
              >
                <AccordionTrigger className="font-semibold sg-text text-left hover:no-underline py-5">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="sg-text-muted leading-relaxed pb-5">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ================================================================
          COMMISSION FORM
          ================================================================ */}
      <section id="commission-form" className="px-6 py-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold tracking-widest uppercase text-amber-400 mb-3 reveal">
              Get Started
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3 reveal delay-100">
              Commission Your{' '}
              <span className="gradient-text-fire">Story</span>
            </h2>
            <p className="text-white/50 reveal delay-200">
              Tell me about your vision and I'll send a formal quote within 1–2 business days.
            </p>
          </div>

          <div className="sg-card p-8 reveal delay-300">
            <CommissionForm />
          </div>
        </div>
      </section>
    </main>
  );
}
