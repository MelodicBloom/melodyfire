import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';

import artGalleryImg from '@assets/img/art-gallery.png';
import beatsBoxesImg from '@assets/img/beats-boxes.png';
import restoryingImg from '@assets/img/restorying.png';
import heroMandalaImg from '@assets/img/hero-mandala.png';
import stickersImg from '@assets/img/stickers.png';
import processImg from '@assets/img/process.png';
import aiSectionImg from '@assets/img/ai-section.png';
import portfolioImg from '@assets/img/portfolio.png';
import aboutImg from '@assets/img/about.png';
import whitePortraitImg from '@assets/img/mf-portrait-white-companion.png';
import heroImg from '@assets/img/hero.png';
// New sticker pack covers
import cosmicDoodlesImg from '@assets/img/shop-sticker-cosmic-doodles.png';
import cozyDaysImg from '@assets/img/shop-sticker-cozy-days.png';
import retroVibesImg from '@assets/img/shop-sticker-retro-vibes.png';
import kawaiClubImg from '@assets/img/shop-sticker-kawaii-club.png';

/* ------------------------------------------------------------------ */
/*  Data                                                                 */
/* ------------------------------------------------------------------ */

type ArtItem = {
  id: number;
  title: string;
  style: string;
  styleLabel: string;
  image: string;
  aspectRatio: string;
};

const ART_ITEMS: ArtItem[] = [
  { id: 1, title: 'Lotus Mandala No. 7', style: 'mandala', styleLabel: 'Mandala & Sacred Geometry', image: artGalleryImg, aspectRatio: '1/1' },
  { id: 2, title: 'Beats & Boxes Mural Study', style: 'neo-brutalist', styleLabel: 'Neo-Brutalist Pop', image: beatsBoxesImg, aspectRatio: '4/3' },
  { id: 3, title: 'Restorying Circle', style: 'mandala', styleLabel: 'Mandala & Sacred Geometry', image: restoryingImg, aspectRatio: '4/3' },
  { id: 4, title: 'Cosmic Mesh 22', style: 'chromatic-noise', styleLabel: 'Chromatic Noise', image: heroMandalaImg, aspectRatio: '1/1' },
  { id: 5, title: 'Sticker Sheet Alpha', style: 'neo-brutalist', styleLabel: 'Neo-Brutalist Pop', image: stickersImg, aspectRatio: '4/3' },
  { id: 6, title: 'Sacred Circuit', style: 'mandala', styleLabel: 'Mandala & Sacred Geometry', image: processImg, aspectRatio: '1/1' },
  { id: 7, title: 'Neural Bloom', style: 'mandala', styleLabel: 'Mandala & Sacred Geometry', image: aiSectionImg, aspectRatio: '1/1' },
  { id: 8, title: 'Portfolio Collage', style: 'papercraft', styleLabel: 'Papercraft Diorama', image: portfolioImg, aspectRatio: '4/3' },
  { id: 9, title: 'Fire & Pattern I', style: 'chromatic-noise', styleLabel: 'Chromatic Noise', image: heroMandalaImg, aspectRatio: '1/1' },
  { id: 10, title: 'Jennipher Troup — Portrait Study', style: 'neo-brutalist', styleLabel: 'Neo-Brutalist Pop', image: aboutImg, aspectRatio: '3/4' },
  { id: 11, title: 'Creative Studio Series — Companion', style: 'neo-brutalist', styleLabel: 'Neo-Brutalist Pop', image: whitePortraitImg, aspectRatio: '3/4' },
  { id: 12, title: 'Melodyfire Hero Study', style: 'chromatic-noise', styleLabel: 'Chromatic Noise', image: heroImg, aspectRatio: '16/9' },
  // New sticker series — Chaotic Halos sub-series
  { id: 13, title: 'Cosmic Doodles — Pack Cover', style: 'neo-brutalist', styleLabel: 'Neo-Brutalist Pop', image: cosmicDoodlesImg, aspectRatio: '3/4' },
  { id: 14, title: 'Cozy Days — Pack Cover', style: 'papercraft', styleLabel: 'Papercraft Diorama', image: cozyDaysImg, aspectRatio: '3/4' },
  { id: 15, title: 'Retro Vibes — Pack Cover', style: 'neo-brutalist', styleLabel: 'Neo-Brutalist Pop', image: retroVibesImg, aspectRatio: '3/4' },
  { id: 16, title: 'Kawaii Club — Pack Cover', style: 'neo-brutalist', styleLabel: 'Neo-Brutalist Pop', image: kawaiClubImg, aspectRatio: '3/4' },
];

const STYLE_TABS = [
  { label: 'All', value: 'all' },
  { label: 'Mandala & Sacred Geometry', value: 'mandala' },
  { label: 'Neo-Brutalist Pop', value: 'neo-brutalist' },
  { label: 'Papercraft Diorama', value: 'papercraft' },
  { label: 'Beadwork & Textile', value: 'beadwork' },
  { label: 'Chromatic Noise', value: 'chromatic-noise' },
  { label: 'Quilled Botanicals', value: 'quilled' },
];

const STYLE_GUIDE = [
  {
    emoji: '🌀',
    title: 'Mandala & Sacred Geometry',
    desc: 'Radially symmetric compositions derived from Tibetan and Islamic geometric traditions. Every arm is a mirror, every ring a recursive elaboration. Rendered with high-frequency detail pass and soft ambient glow.',
    tags: ['Radial Symmetry', 'Sacred Forms', 'Meditative'],
  },
  {
    emoji: '⚡',
    title: 'Neo-Brutalist Pop Art',
    desc: 'Bold outlines, flat fills, and aggressive color blocking borrowed from 90s street graphics and Risograph printing. Contrast is the point. Imperfection is the texture. Typography as shape.',
    tags: ['High Contrast', 'Risograph', 'Street Art'],
  },
  {
    emoji: '📦',
    title: 'Papercraft Diorama',
    desc: 'Layered cardstock worlds with visible edge thickness, hand-cut silhouettes, and soft shadow casting. Each piece reads as a constructed set — tangible, toylike, tender.',
    tags: ['Tactile', 'Layered', 'Diorama'],
  },
  {
    emoji: '🪡',
    title: 'Beadwork & Mirror Work',
    desc: 'Textile-inspired surface pattern referencing South Asian and West African beadwork traditions. Tight repeating motifs, reflective inlays, and embroidered texture simulate fabric you can almost touch.',
    tags: ['Folk Textile', 'Mirror Work', 'Pattern'],
  },
  {
    emoji: '🌈',
    title: 'Chromatic Noise Fields',
    desc: 'Procedural color fields built on fractal noise algorithms with interference patterns and spectral bloom. Every pixel is contested. Chaos with compositional intent.',
    tags: ['Generative', 'Fractal', 'Spectral'],
  },
  {
    emoji: '🌿',
    title: 'Quilled Paper Botanicals',
    desc: 'Simulated paper-quilling technique applied to organic plant forms. Coiled paper ribbons become petals, fronds, and root systems. Warm-lit and dimensionally staged.',
    tags: ['Botanical', 'Quilling', 'Organic Form'],
  },
];

/* ------------------------------------------------------------------ */
/*  Art Item component                                                   */
/* ------------------------------------------------------------------ */

function ArtItemCard({ item }: { item: ArtItem }) {
  return (
    <div
      className="art-item group relative overflow-hidden rounded-xl cursor-pointer"
      data-style={item.style}
      style={{ aspectRatio: item.aspectRatio, breakInside: 'avoid', marginBottom: '1.25rem' }}
    >
      <img
        src={item.image}
        alt={item.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-300"
           style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)' }}>
        <p className="font-display font-semibold text-white text-base mb-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          {item.title}
        </p>
        <div className="flex items-center justify-between translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
          <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/30 text-violet-200 border border-violet-500/30">
            {item.styleLabel}
          </span>
          <a
            href="mailto:hello@melodyfire.com?subject=Commission Similar to: ${item.title}"
            onClick={(e) => e.stopPropagation()}
            className="text-xs text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
          >
            Commission Similar →
          </a>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                            */
/* ------------------------------------------------------------------ */

export default function GenerativeArtPage() {
  const [activeStyle, setActiveStyle] = useState('all');

  // Scroll reveal
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

  const filteredItems =
    activeStyle === 'all'
      ? ART_ITEMS
      : ART_ITEMS.filter((item) => item.style === activeStyle);

  return (
    <main className="min-h-screen" style={{ background: 'hsl(var(--background))' }}>
      {/* ---- Hero ---- */}
      <section className="relative pt-28 pb-16 px-6 overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute top-0 left-1/3 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div className="max-w-4xl mx-auto relative z-10">
          <p className="text-sm font-medium tracking-widest uppercase text-violet-400 mb-4 reveal">
            ComfyUI · SDXL · LoRA · Pattern
          </p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 reveal delay-100">
            <span className="gradient-text">The Art</span>
            <br />
            <span className="gradient-text-fire">of Pattern</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl leading-relaxed reveal delay-200">
            Generative art practice rooted in sacred geometry, folk textile traditions, and
            procedural noise systems. Built on ComfyUI, SDXL, and custom LoRA weights trained on
            handcrafted reference sets. Each series is an iterative conversation between prompt
            architecture and visual intuition.
          </p>
        </div>
      </section>

      {/* ---- Style Tab Bar ---- */}
      <section className="px-6 pb-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2">
            {STYLE_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveStyle(tab.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeStyle === tab.value
                    ? 'text-white shadow-lg shadow-violet-500/25'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
                style={
                  activeStyle === tab.value
                    ? { background: 'linear-gradient(135deg, #7c3aed 0%, #f43f5e 100%)' }
                    : {}
                }
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Art Gallery (CSS Columns Masonry) ---- */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          {filteredItems.length > 0 ? (
            <div
              style={{
                columnCount: 1,
                columnGap: '1.25rem',
              }}
              className="art-gallery [column-count:1] sm:[column-count:2] lg:[column-count:3]"
            >
              {filteredItems.map((item) => (
                <ArtItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 text-white/40">
              <p className="text-4xl mb-4">🎨</p>
              <p>No artworks in this style yet — check back soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* ---- From Prompt to Pattern ---- */}
      <section className="px-6 py-20 solarpunk-section">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div>
              <p className="sg-gold text-xs font-semibold tracking-widest uppercase mb-4 reveal">
                Process & Practice
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold sg-text mb-6 reveal delay-100">
                From Prompt <br />
                <span className="sg-gradient-text">to Pattern</span>
              </h2>
              <div className="space-y-4 reveal delay-200">
                <p className="sg-text-muted leading-relaxed">
                  Every image begins with a structured prompt architecture — a layered set of
                  directives specifying medium, lighting, compositional geometry, color palette, and
                  emotional register. The prompt is a score, not a command. The model improvises
                  within it.
                </p>
                <p className="sg-text-muted leading-relaxed">
                  Custom LoRA weights trained on curated reference sets — folk textiles, botanical
                  illustrations, sacred geometry manuscripts — give the model a consistent visual
                  vocabulary. These are not filters. They are learned aesthetic sensibilities that
                  inform every generation without constraining it.
                </p>
                <p className="sg-text-muted leading-relaxed">
                  From hundreds of generations per series, a handful are selected through an
                  intuitive curation process that prioritizes compositional tension, color harmony,
                  and the feeling that something unexpectedly right happened. The final piece is
                  always a surprise that feels inevitable.
                </p>
              </div>
            </div>
            {/* Image */}
            <div className="reveal reveal-right delay-300">
              <div className="relative">
                <div
                  className="absolute -inset-4 rounded-2xl opacity-30"
                  style={{ background: 'linear-gradient(135deg, #c9a84c 0%, transparent 70%)' }}
                />
                <img
                  src={processImg}
                  alt="Process illustration"
                  className="relative w-full rounded-2xl object-cover sg-border"
                  style={{ aspectRatio: '4/3', maxHeight: 440 }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Style Guide Cards ---- */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-medium tracking-widest uppercase text-violet-400 mb-3 reveal">
              Visual Language
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white reveal delay-100">
              The{' '}
              <span className="gradient-text-primary">Style Systems</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {STYLE_GUIDE.map((style, i) => (
              <div
                key={style.title}
                className={`holo-card p-6 reveal delay-${Math.min((i % 3) * 100 + 100, 600) as 100 | 200 | 300 | 400 | 500 | 600}`}
              >
                <span className="text-3xl mb-4 block">{style.emoji}</span>
                <h3 className="font-display font-semibold text-white text-lg mb-3">
                  {style.title}
                </h3>
                <p className="text-white/55 text-sm leading-relaxed mb-4">{style.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {style.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="px-6 py-16 holographic-section">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4 reveal">
            Commission · License · Collaborate
          </h2>
          <p className="text-white/50 mb-3 reveal delay-100">
            Commission a piece tailored to your brand or space.
            License the collection for editorial, print, or product use.
            Collaborate on a project that needs a generative art system.
          </p>
          <p className="prismatic-text font-semibold mb-8 reveal delay-200">
            Every inquiry starts with a conversation.
          </p>
          <div className="flex flex-wrap gap-4 justify-center reveal delay-300">
            <a
              href="mailto:hello@melodyfire.com?subject=Art Commission Inquiry"
              className="px-6 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #f43f5e 100%)' }}
            >
              Commission a Piece
            </a>
            <Link href="/services">
              <span className="px-6 py-3 rounded-xl font-semibold text-white/70 border border-white/20 hover:border-violet-500/50 hover:text-white transition-all cursor-pointer">
                View Services
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
