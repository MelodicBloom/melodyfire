import { useEffect } from 'react';
import { Link } from 'wouter';
import { GalleryGrid, type GalleryItem } from '@/components/gallery';

import k1 from '@assets/kaleidoscope-1.gif';
import k2 from '@assets/kaleidoscope-2.gif';
import k3 from '@assets/kaleidoscope-3.mp4';
import k4 from '@assets/kaleidoscope-4.mp4';
import k5 from '@assets/kaleidoscope-5.mp4';
import k6 from '@assets/kaleidoscope-6.mp4';

/* ------------------------------------------------------------------ */
/*  Data                                                                 */
/* ------------------------------------------------------------------ */

// All sources are 320×704 / 640×1408 → declare the true ~9:20 ratio so nothing is cropped.
const KALEIDO_RATIO = '5/11';

const KALEIDO_ITEMS: GalleryItem[] = [
  { id: 1, title: 'Violet Mandala I', label: 'Sacred Geometry', kind: 'gif', src: k1, aspectRatio: KALEIDO_RATIO },
  { id: 2, title: 'Chromatic Bloom', label: 'Sacred Geometry', kind: 'gif', src: k2, aspectRatio: KALEIDO_RATIO },
  { id: 3, title: 'Kaleidoscope III', label: 'Motion Study', kind: 'video', src: k3, aspectRatio: KALEIDO_RATIO },
  { id: 4, title: 'Kaleidoscope IV', label: 'Motion Study', kind: 'video', src: k4, aspectRatio: KALEIDO_RATIO },
  { id: 5, title: 'Kaleidoscope V', label: 'Motion Study', kind: 'video', src: k5, aspectRatio: KALEIDO_RATIO },
  { id: 6, title: 'Kaleidoscope VI', label: 'Motion Study', kind: 'video', src: k6, aspectRatio: KALEIDO_RATIO },
];

const TAXONOMY = [
  {
    title: 'Radial Symmetry',
    desc: 'n-fold rotational geometry derived from frequency harmonics',
  },
  {
    title: 'Chromatic Field Theory',
    desc: 'color as vibrational data, palette as waveform',
  },
  {
    title: 'Sacred Proportions',
    desc: 'Fibonacci ratios, golden angle, Platonic solid projections',
  },
];

/* ------------------------------------------------------------------ */
/*  Main Page                                                            */
/* ------------------------------------------------------------------ */

export function KaleidoscopePage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('revealed');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen" style={{ background: 'hsl(var(--background))' }}>
      {/* ---- Hero ---- */}
      <section className="relative pt-28 pb-20 px-6 overflow-hidden holographic-section">
        <div className="max-w-4xl mx-auto relative z-10">
          <p className="text-xs font-bold tracking-widest uppercase mb-4 prismatic-text reveal">
            Generative Motion Art
          </p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 reveal delay-100">
            <span className="gradient-text-fire">Kaleidoscope</span>
            <br />
            <span className="text-white">Series</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl leading-relaxed mb-10 reveal delay-200">
            Sacred geometry in motion — living mandalas generated through ComfyUI, custom SDXL
            pipelines, and parametric symmetry engines. Each piece is a unique exploration of
            radial harmony, frequency resonance, and chromatic field theory.
          </p>
          <div className="flex flex-wrap gap-4 reveal delay-300">
            <a
              href="mailto:jennipher@melodicbloom.com"
              className="px-6 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.02]"
              style={{ background: 'var(--gradient-fire)' }}
            >
              Commission a Piece →
            </a>
            <Link href="/art">
              <span className="px-6 py-3 rounded-xl font-semibold text-white/70 border border-white/20 hover:border-violet-500/50 hover:text-white transition-all cursor-pointer">
                View Generative Art
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ---- Gallery ---- */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <GalleryGrid items={KALEIDO_ITEMS} label="Kaleidoscope series — gifs and motion studies" />
        </div>
      </section>

      {/* ---- About Section ---- */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase mb-4 text-violet-400 reveal">
                Process & Practice
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6 reveal delay-100">
                The Geometry <span className="gradient-text-primary">of Pattern</span>
              </h2>
              <p className="text-white/60 leading-relaxed reveal delay-200">
                These kaleidoscope studies emerge from the intersection of radial mathematics and
                generative AI. Each begins as a frequency specification — a ratio of symmetry
                axes, a color temperature target, a turbulence parameter — then passes through a
                custom ComfyUI pipeline that resolves it into living, breathing sacred geometry.
                The result is not randomness but resonance: patterns that feel inevitable because
                they obey deep mathematical laws.
              </p>
            </div>
            {/* Image */}
            <div className="reveal reveal-right delay-300">
              <div className="relative">
                <div
                  className="absolute -inset-4 rounded-2xl opacity-30"
                  style={{ background: 'linear-gradient(135deg, #7c3aed 0%, transparent 70%)' }}
                />
                <img
                  src={k1}
                  alt="Violet Mandala I"
                  className="relative w-full rounded-2xl object-cover border border-[hsl(var(--border))]"
                  style={{ aspectRatio: '1/1' }}
                />
              </div>
            </div>
          </div>

          {/* Taxonomy cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {TAXONOMY.map((item, i) => (
              <div
                key={item.title}
                className={`holo-card p-6 reveal delay-${Math.min((i % 3) * 100 + 100, 600) as 100 | 200 | 300}`}
              >
                <h3 className="font-display font-semibold text-white text-lg mb-3">{item.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="px-6 py-16 holographic-section">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4 reveal">
            License · Commission
          </h2>
          <p className="text-white/50 mb-3 reveal delay-100">
            License a piece for commercial use · Commission a custom study
          </p>
          <p className="prismatic-text font-semibold mb-8 reveal delay-200">
            Every inquiry starts with a conversation.
          </p>
          <div className="flex flex-wrap gap-4 justify-center reveal delay-300">
            <a
              href="mailto:jennipher@melodicbloom.com?subject=Kaleidoscope Commission Inquiry"
              className="px-6 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.02]"
              style={{ background: 'var(--gradient-fire)' }}
            >
              Commission a Piece →
            </a>
            <Link href="/art">
              <span className="px-6 py-3 rounded-xl font-semibold text-white/70 border border-white/20 hover:border-violet-500/50 hover:text-white transition-all cursor-pointer">
                View Generative Art
              </span>
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
