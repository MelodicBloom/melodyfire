import { useRef, useEffect, useState } from 'react';
import { Link } from 'wouter';
import { ArrowRight, ChevronDown, Flame, Sparkles, Globe, Zap, Leaf, Brain, Building } from 'lucide-react';
import { MandalaCanvas } from '../components/MandalaCanvas';
import { ProjectCard, Project } from '../components/ProjectCard';

import heroMandalaPng from '../assets/img/hero-mandala.png';
import beatsBoxesPng from '../assets/img/beats-boxes.png';
import restoryingPng from '../assets/img/restorying.png';
import artGalleryPng from '../assets/img/art-gallery.png';
import aiSectionPng from '../assets/img/ai-section.png';
import solarGrimoirePng from '../assets/img/mf-solar-grimoire.png';
import childrensArtPng from '../assets/img/mf-childrens-art-service.png';

// ---- Marquee Skills ----
const MARQUEE_ITEMS = [
  'ComfyUI Pipelines',
  'SDXL LoRA Training',
  'Regenerative Design',
  'Prompt Engineering',
  'Sacred Geometry',
  'React TypeScript',
  'Civic Technology',
  'Narrative Systems',
  'WebGL Shaders',
  'Mutual Aid',
  'Design Systems',
  'Agentic AI',
];

// ---- Disciplines ----
const DISCIPLINES = [
  { icon: <Leaf className="w-7 h-7" />, label: 'Regenerative Design', color: '#4a8c5c', href: '/regenerative', desc: 'Futures that restore rather than deplete — design as ecology.' },
  { icon: <Sparkles className="w-7 h-7" />, label: 'Generative AI Art', color: '#7c3aed', href: '/art', desc: 'Machine imagination as collaborative medium. SDXL, ComfyUI, LoRA.' },
  { icon: <Brain className="w-7 h-7" />, label: 'Systems Design', color: '#06b6d4', href: '/work', desc: 'Patterns that recurse. Structures that launch themselves.' },
  { icon: <Globe className="w-7 h-7" />, label: 'Web Development', color: '#f43f5e', href: '/work', desc: 'React, TypeScript, full-stack — built with intention.' },
  { icon: <Building className="w-7 h-7" />, label: 'Civic Technology', color: '#f59e0b', href: '/work', desc: 'Community as co-author. Technology in service of the neighborhood.' },
];

// ---- Doctrine Cards ----
const DOCTRINE = [
  { n: '01', title: 'Regenerative over Sustainable', body: 'Sustainability holds ground. Regeneration actively restores. Every system should leave its context more alive than it found it.' },
  { n: '02', title: 'Contradiction as Force', body: 'Hold contradiction as a design parameter — not a problem to solve, but a pressure that produces form.' },
  { n: '03', title: 'Socratic Recursion', body: 'Questions that generate better questions. The inquiry loops back and deepens each time.' },
  { n: '04', title: 'Community as Co-Author', body: 'The people most affected by a system are its rightful designers. Community is not a stakeholder — it is the author.' },
  { n: '05', title: 'Pattern as Wisdom', body: 'Recurring patterns across scales contain compressed knowledge. Sacred geometry is just math that remembers itself.' },
  { n: '06', title: 'Launch to Independence', body: 'A system that requires perpetual management has failed. Good systems launch themselves and keep going.' },
];

// ---- Recent Work ----
const RECENT_WORK: Project[] = [
  {
    title: 'Restorying Framework',
    category: 'Systems Design',
    tags: ['Narrative', 'Regenerative', 'Community'],
    description: 'A participatory framework for communities to rewrite their own futures through narrative systems and collective authorship.',
    coverImage: restoryingPng,
  },
  {
    title: 'Chaotic Halos Series',
    category: 'Generative Art',
    tags: ['SDXL', 'ComfyUI', 'Sacred Geometry'],
    description: 'A generative art series exploring sacred geometry, chaos theory, and chromatic dissolution through custom LoRA training.',
    coverImage: artGalleryPng,
  },
  {
    title: 'Prompt Laboratory',
    category: 'AI Tools',
    tags: ['Agentic AI', 'Prompt Eng.', 'Web App'],
    description: 'An experimental workspace for iterative prompt development — where the machine learns your visual language.',
    coverImage: aiSectionPng,
  },
];

// ---- Kinetic Name component ----
function KineticName() {
  const name = 'Jennipher Troup';
  return (
    <p className="text-xl text-[hsl(var(--muted-foreground))] tracking-[0.15em] uppercase font-light mt-2">
      {name.split('').map((char, i) => (
        <span
          key={i}
          className="inline-block transition-all duration-300 hover:-translate-y-1 hover:text-[hsl(var(--primary))] cursor-default"
          style={{ transitionDelay: `${i * 20}ms` }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </p>
  );
}

// ---- Marquee ----
function Marquee() {
  const [paused, setPaused] = useState(false);
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div
      className="relative overflow-hidden py-5 bg-[hsl(var(--card))] border-y border-[hsl(var(--border))]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, hsl(var(--background)), transparent)' }} />
      <div className="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, hsl(var(--background)), transparent)' }} />

      <div
        className="flex gap-8 w-max"
        style={{
          animation: paused ? 'none' : 'marquee-scroll 35s linear infinite',
        }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-4 whitespace-nowrap text-sm font-medium text-[hsl(var(--muted-foreground))]">
            <span className="gradient-text font-bold">✦</span>
            {item}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

// ---- Scroll indicator ----
function ScrollIndicator() {
  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
      <span className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-widest">Scroll</span>
      <div className="w-px h-8 bg-gradient-to-b from-[hsl(var(--primary))] to-transparent" />
      <ChevronDown className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
    </div>
  );
}

// ================================================================
//  HomePage
// ================================================================
export function HomePage() {
  return (
    <div>
      {/* ===== SECTION 1: HERO ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroMandalaPng})`, opacity: 0.35 }}
        />
        {/* Dark overlay gradient */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, hsl(var(--background)) 40%, transparent 100%)' }}
        />

        {/* Interactive mandala — top right */}
        <MandalaCanvas
          petals={12}
          rings={6}
          speed={0.25}
          interactive={true}
          glowIntensity={0.85}
          autoRotate={true}
          className="absolute top-[5%] right-[-5%] lg:right-[2%] opacity-60 lg:opacity-75"
          style={{ width: 680, height: 680 }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--card))] border border-[hsl(var(--border))] mb-8"
            data-reveal>
            <Flame className="w-3.5 h-3.5 text-[hsl(var(--secondary))]" />
            <span className="text-xs font-semibold text-[hsl(var(--primary))] tracking-widest uppercase">
              Creative Technologist · Regenerative Designer · Philadelphia
            </span>
          </div>

          {/* H1 */}
          <h1 className="font-display font-black leading-none mb-4" data-reveal>
            <span className="gradient-text-fire text-[clamp(5rem,12vw,10rem)]">Melody</span>
            <span className="gradient-text text-[clamp(5rem,12vw,10rem)]">fire</span>
          </h1>

          {/* Kinetic name */}
          <div data-reveal className="delay-100">
            <KineticName />
          </div>

          {/* Blockquote */}
          <blockquote
            className="mt-8 max-w-2xl text-lg text-[hsl(var(--muted-foreground))] italic leading-relaxed border-l-2 border-[hsl(var(--border))] pl-5"
            data-reveal
          >
            "Where generative systems, regenerative design, and community imagination converge — building futures that restore rather than deplete."
          </blockquote>

          {/* Body */}
          <p className="mt-6 max-w-xl text-[hsl(var(--muted-foreground))] leading-relaxed" data-reveal>
            A unified body of creative and technical work spanning generative AI art, civic technology, web development, and systems design — all in service of communities that restore rather than extract.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center gap-4" data-reveal>
            <Link
              href="/work"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white transition-all duration-300 shadow-[var(--glow-primary)] hover:shadow-[0_0_40px_rgba(124,58,237,0.7)] hover:-translate-y-0.5"
              style={{ background: 'var(--gradient-primary)' }}
            >
              Explore Work <ArrowRight size={16} />
            </Link>
            <Link
              href="/regenerative"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold border border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:border-[hsl(var(--border))] hover:bg-[hsl(var(--card))] transition-all"
            >
              The Doctrine
            </Link>
            <Link
              href="/ai-tools"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-[hsl(var(--accent))] border border-[hsl(var(--border))] hover:bg-[hsl(var(--card))] transition-all"
            >
              <Zap size={15} /> AI Tools
            </Link>
          </div>
        </div>

        <ScrollIndicator />
      </section>

      {/* ===== SECTION 2: MARQUEE ===== */}
      <Marquee />

      {/* ===== SECTION 3: THESIS BAND ===== */}
      <section className="relative py-24 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(160deg, hsl(var(--background)) 0%, hsl(267 50% 10%) 35%, hsl(267 50% 10%) 65%, hsl(var(--background)) 100%)' }}
        />
        {/* Bottom fade back to page background */}
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-10"
          style={{ background: 'linear-gradient(to bottom, transparent, hsl(var(--background)))' }} />
        {/* Subtle mandala bg */}
        <MandalaCanvas
          petals={6}
          rings={4}
          speed={0.08}
          interactive={false}
          glowIntensity={0.3}
          autoRotate={true}
          className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20"
          style={{ width: 500, height: 500 }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6" data-reveal>
            <span className="gradient-text-fire">Design that restores.</span>{' '}
            <span className="gradient-text">Systems that recurse.</span>{' '}
            <span className="text-white">Work that asks questions.</span>
          </h2>
          <p className="text-white/70 text-lg leading-relaxed mb-10 max-w-2xl mx-auto" data-reveal>
            The Melodyfire doctrine is a set of principles for making things that matter — not by following trends, but by holding contradictions, centering community, and building systems that launch themselves into independence.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4" data-reveal>
            <Link
              href="/regenerative"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white"
              style={{ background: 'var(--gradient-aurora)' }}
            >
              Read the Doctrine <ArrowRight size={16} />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold border border-white/30 text-white/80 hover:text-white hover:border-white/60 transition-all"
            >
              About Jennipher
            </Link>
          </div>
        </div>
      </section>

      {/* ===== SECTION 4: FIVE DISCIPLINES ===== */}
      <section className="py-20 bg-[hsl(var(--background))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3" data-reveal>
              Five <span className="gradient-text-primary">Disciplines</span>
            </h2>
            <p className="text-[hsl(var(--muted-foreground))] max-w-xl mx-auto" data-reveal>
              Each discipline feeds the others — a regenerative ecosystem of practice.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {DISCIPLINES.map(({ icon, label, color, href, desc }, i) => (
              <Link
                href={href}
                key={label}
                className="group relative flex flex-col items-center text-center p-6 rounded-2xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] transition-all duration-500 hover:border-transparent hover:-translate-y-1.5 cursor-pointer reveal"
                data-reveal
                style={{
                  transitionDelay: `${i * 80}ms`,
                  // @ts-ignore
                  '--glow-color': color,
                } as React.CSSProperties}
              >
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ boxShadow: `0 0 32px ${color}30`, background: `radial-gradient(circle at 50% 100%, ${color}08 0%, transparent 70%)` }} />

                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${color}18`, color }}
                >
                  {icon}
                </div>
                <h3 className="font-display font-bold text-sm mb-2 text-[hsl(var(--foreground))]">{label}</h3>
                <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">{desc}</p>

                <div className="mt-4 flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color }}>
                  Explore <ArrowRight size={11} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 5: FEATURED — BEATS & BOXES ===== */}
      <section className="py-20 bg-[hsl(var(--card))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-[hsl(var(--secondary))] text-xs font-semibold uppercase tracking-widest mb-4">
              ✦ Flagship Project
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold" data-reveal>
              <span className="gradient-text">Featured Work</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-[hsl(var(--card))] rounded-3xl overflow-hidden border border-[hsl(var(--border))] shadow-[0_0_60px_rgba(124,58,237,0.1)]">
            {/* Image */}
            <div className="relative h-72 lg:h-full min-h-[380px] overflow-hidden">
              <img
                src={beatsBoxesPng}
                alt="Beats & Boxes project"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[hsl(var(--card))] opacity-40 lg:opacity-60 hidden lg:block" />
            </div>

            {/* Text */}
            <div className="p-8 lg:p-12 space-y-5">
              <div className="flex flex-wrap gap-2">
                {['Civic Tech', 'Systems Design', 'Regenerative', 'Flagship'].map(t => (
                  <span key={t} className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[hsl(var(--card))] text-[hsl(var(--primary))] border border-[hsl(var(--border))]">
                    {t}
                  </span>
                ))}
              </div>

              <h3 className="font-display text-3xl lg:text-4xl font-black gradient-text-fire">
                Beats & Boxes
              </h3>

              <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
                A music-centered civic initiative merging beats, mutual aid, and community systems design in Philadelphia neighborhoods. Beats & Boxes demonstrates how sound can become infrastructure — a platform for collective authorship, economic regeneration, and neighborhood identity.
              </p>

              <p className="text-[hsl(var(--muted-foreground))] text-sm leading-relaxed">
                The project integrates participatory design workshops, a digital distribution platform for local artists, and a mutual aid network powered by music revenue — proving that cultural production can fund its own community.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/work"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
                  style={{ background: 'var(--gradient-fire)' }}
                >
                  View Case Study <ArrowRight size={14} />
                </Link>
                <Link
                  href="/regenerative"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-all"
                >
                  The Doctrine
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 6: RECENT WORK ===== */}
      <section className="py-20 bg-[hsl(var(--background))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold" data-reveal>
                Recent <span className="gradient-text-primary">Work</span>
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] mt-2" data-reveal>
                Across systems, narrative, and generative art.
              </p>
            </div>
            <Link
              href="/work"
              className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))] transition-colors"
            >
              All Work <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {RECENT_WORK.map((project, i) => (
              <ProjectCard
                key={project.title}
                project={project}
                className={`reveal delay-${(i + 1) * 100 as 100 | 200 | 300}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 7: SOLARPUNK GRIMOIRE ===== */}
      <section className="solarpunk-section torn-edge py-24 relative overflow-hidden">
        {/* Background image at 40% opacity */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${solarGrimoirePng})`, opacity: 0.4 }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, var(--sg-bg) 0%, transparent 30%, transparent 70%, var(--sg-bg) 100%)' }} />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.25)] mb-6" data-reveal>
            <span className="text-xs font-semibold sg-gold uppercase tracking-widest">✦ The Grimoire</span>
          </div>

          <h2 className="font-display text-4xl md:text-5xl font-black mb-5" data-reveal>
            <span className="sg-gradient-text">The Regenerative</span>
            <br />
            <span className="sg-text">Ideas Portal</span>
          </h2>

          <p className="text-[var(--sg-text-muted)] text-lg leading-relaxed mb-10 max-w-xl mx-auto" data-reveal>
            Where solarpunk futures meet systems design practice — a living archive of frameworks, provocations, and world-building prompts for regenerative practitioners.
          </p>

          <Link
            href="/regenerative"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold sg-text border border-[rgba(201,168,76,0.4)] hover:bg-[rgba(201,168,76,0.08)] transition-all"
            data-reveal
          >
            Enter the Portal <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ===== SECTION 8: CHILDREN'S ART ===== */}
      <section className="py-20 bg-[hsl(var(--background))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="order-2 lg:order-1 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--card))] border border-[hsl(var(--border))]" data-reveal>
                <Sparkles className="w-3 h-3 text-[hsl(var(--accent))]" />
                <span className="text-xs font-semibold text-[hsl(var(--accent))] uppercase tracking-widest">Storybook Art</span>
              </div>

              <h2 className="font-display text-3xl md:text-4xl font-bold" data-reveal>
                Storybook Art <span className="gradient-text">Commissions</span>
              </h2>

              <p className="text-[hsl(var(--muted-foreground))] leading-relaxed" data-reveal>
                Hand-crafted AI-assisted illustrations for children's stories, educational materials, and family keepsakes. Each piece is guided by your story, your characters, and your world — rendered with warmth and wonder.
              </p>

              <ul className="space-y-2 text-sm text-[hsl(var(--muted-foreground))]" data-reveal>
                {['Custom characters and settings', 'Warm, expressive illustration style', 'Printable high-resolution files', 'Story consultation included'].map(item => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="text-[hsl(var(--accent))]">✦</span> {item}
                  </li>
                ))}
              </ul>

              <div data-reveal>
                <Link
                  href="/children-art"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white"
                  style={{ background: 'var(--gradient-cool)' }}
                >
                  Commission a Scene <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="order-1 lg:order-2 relative" data-reveal>
              <div className="rounded-3xl overflow-hidden shadow-[var(--glow-accent)]">
                <img
                  src={childrensArtPng}
                  alt="Children's storybook art by Melodyfire"
                  className="w-full h-80 lg:h-[420px] object-cover"
                />
              </div>
              {/* Decoration */}
              <MandalaCanvas
                petals={6}
                rings={3}
                speed={0.1}
                interactive={false}
                glowIntensity={0.5}
                autoRotate={true}
                className="absolute -bottom-12 -left-12 opacity-30"
                style={{ width: 200, height: 200 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 9: DOCTRINE CARDS ===== */}
      <section className="py-24 bg-[hsl(var(--card))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3" data-reveal>
              The <span className="gradient-text-fire">Doctrine</span>
            </h2>
            <p className="text-[hsl(var(--muted-foreground))] max-w-xl mx-auto" data-reveal>
              Six principles that guide every project, every system, every collaboration.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {DOCTRINE.map(({ n, title, body }, i) => {
              const colors = ['#7c3aed', '#f43f5e', '#06b6d4', '#f59e0b', '#4a8c5c', '#a78bfa'];
              const color = colors[i % colors.length];
              return (
                <div
                  key={n}
                  className="group relative bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-6 overflow-hidden transition-all duration-500 hover:-translate-y-1 reveal"
                  data-reveal
                  style={{ transitionDelay: `${i * 70}ms` }}
                >
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: color }} />
                  {/* Glow on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                    style={{ boxShadow: `inset 0 0 40px ${color}10` }}
                  />

                  <div className="relative z-10">
                    <span className="font-display text-5xl font-black opacity-10 absolute -top-2 -right-1" style={{ color }}>
                      {n}
                    </span>
                    <span className="inline-block text-xs font-bold mb-3 uppercase tracking-widest" style={{ color }}>{n}</span>
                    <h3 className="font-display font-bold text-base text-[hsl(var(--foreground))] mb-3 leading-tight">{title}</h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{body}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/regenerative"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))] transition-colors"
            >
              Read the full Doctrine <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== SECTION 10: CTA BAND ===== */}
      <section className="relative py-24 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: 'var(--gradient-primary)', opacity: 0.12 }}
        />
        <MandalaCanvas
          petals={8}
          rings={5}
          speed={0.15}
          interactive={false}
          glowIntensity={0.6}
          autoRotate={true}
          className="absolute inset-0 m-auto opacity-20"
          style={{ width: 600, height: 600 }}
        />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-display text-4xl md:text-5xl font-black" data-reveal>
            <span className="gradient-text-fire">Build something</span>
            <br />
            <span className="gradient-text">that restores.</span>
          </h2>
          <p className="text-[hsl(var(--muted-foreground))] text-lg" data-reveal>
            Every collaboration begins with a question. Let's find yours.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4" data-reveal>
            <a
              href="mailto:hello@melodyfire.studio"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white shadow-[var(--glow-primary)] hover:shadow-[0_0_48px_rgba(124,58,237,0.8)] hover:-translate-y-0.5 transition-all duration-300"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <Flame className="w-4 h-4" /> Start a Conversation
            </a>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:border-[hsl(var(--border))] transition-all"
            >
              View Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
