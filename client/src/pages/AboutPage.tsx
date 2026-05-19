import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowRight, Flame, MapPin, Sparkles } from 'lucide-react';
import { MandalaCanvas } from '../components/MandalaCanvas';

// White companion portrait is the primary about hero image
import aboutPng from '../assets/img/mf-portrait-white-companion.png';
import jenniPng from '../assets/img/about.png';
import processPng from '../assets/img/process.png';

// ---- Aspiration ticker ----
const ASPIRATIONS_TICKER = [
  'designing AI systems that practice appropriate restraint while serving human wellbeing',
  'building self-sustaining systems: Give → Grow → Feed → Return',
  'finding co-founders who feel Philadelphia\'s rhythm in their chest',
  'turning the dance floor into a field where every step plants something real',
  'scaling Co. La\'Bright\'s Beats & Boxes model citywide',
  'developing the AETHER portfolio into a full shader library',
];

// ---- Doctrine principles (full text) ----
const DOCTRINE_FULL = [
  {
    n: '01',
    title: 'Regenerative over Sustainable',
    body: 'Sustainability holds ground — it stops the bleeding. Regeneration actively restores — it heals the wound and rebuilds the tissue. Every system, project, and collaboration I engage with must leave its context more alive, more capable, and more self-determining than it found it. This is not idealism; it is the minimum viable requirement for design that matters.',
  },
  {
    n: '02',
    title: 'Contradiction as Design Force',
    body: 'I work at intersections that make people uncomfortable: technology and community, AI and embodiment, systems thinking and feeling, structure and play. These contradictions are not problems to resolve — they are the exact pressure zones where interesting things happen. Hold contradiction as a parameter. Let it generate form.',
  },
  {
    n: '03',
    title: 'Socratic Recursion',
    body: 'Every question generates a better question. I use inquiry as a design method — probing assumptions, testing frameworks, inviting collaborators to question what they took for granted. This loops back on itself: the better the questions, the better the work, which produces better questions. The loop is the point.',
  },
  {
    n: '04',
    title: 'Community as Co-Author',
    body: 'The people most affected by a system are its rightful designers. Community is not a stakeholder category — it is the authorial voice. My role is to hold space, facilitate emergence, and translate between registers (technical, poetic, civic) — not to impose a vision. The work belongs to the people it serves.',
  },
  {
    n: '05',
    title: 'Pattern as Wisdom',
    body: 'Recurring patterns across scales contain compressed wisdom. The Fibonacci sequence shows up in galaxies, sunflowers, and financial markets. Sacred geometry is mathematics that remembers itself. I look for these cross-scale patterns because they point toward something structural — something true.',
  },
  {
    n: '06',
    title: 'Launch to Independence',
    body: 'A system that requires perpetual management has failed. Good systems launch themselves — they build the conditions for their own continuation without the original designer in the room. I design for obsolescence: the highest compliment is a community that no longer needs me.',
  },
  {
    n: '07',
    title: 'Joyful Experimentalism',
    body: 'Seriousness is not the same as importance. Rigorous inquiry can wear a party hat. Play is a design methodology. The mandala spins because it is beautiful, and because beauty is functional. Delight is not a decoration — it is load-bearing.',
  },
  {
    n: '08',
    title: 'Systems Launch Themselves',
    body: 'The goal of design is not a deliverable — it is a condition. When the conditions are right, the system activates on its own. This means designing for emergence rather than control, for threshold moments rather than sustained intervention.',
  },
  {
    n: '09',
    title: 'Mutual Accountability',
    body: 'I am accountable to the communities I work with, the systems I design, and the futures I am participating in making. Accountability is not guilt — it is responsibility taken up freely, with clear eyes. I show up, I follow through, I acknowledge when I get it wrong.',
  },
];

// ---- Process phases ----
const PROCESS_PHASES = [
  {
    phase: '01',
    name: 'Socratic Orienting',
    desc: 'We begin with questions — not proposals. What does this community already know? What has been tried? What assumptions are we carrying in? This phase destabilizes comfortable certainties and opens genuine inquiry space.',
    color: '#7c3aed',
  },
  {
    phase: '02',
    name: 'Community Grounding',
    desc: 'Deep listening and participatory mapping. We co-identify assets, needs, and the stories a community tells about itself. Community becomes co-author from day one — not a focus group.',
    color: '#4a8c5c',
  },
  {
    phase: '03',
    name: 'Schematic Architecture',
    desc: 'Systems mapping, service blueprinting, and structural design. We sketch the skeleton of the solution — loose enough to adapt, rigorous enough to build from. Every schematic asks: who does this serve, and at whose expense?',
    color: '#06b6d4',
  },
  {
    phase: '04',
    name: 'Iterative Embodiment',
    desc: 'Rapid prototyping with real communities in real contexts. We build, test, rebuild. Each iteration generates new questions. The prototype is a question in physical form.',
    color: '#f59e0b',
  },
  {
    phase: '05',
    name: 'Launch to Independence',
    desc: 'Transfer of knowledge, tools, and ownership. We design the handoff so the community can operate the system without us. The measure of success is how quickly we become unnecessary.',
    color: '#f43f5e',
  },
];

// ---- Tools stacks ----
const TOOLS_STACKS = [
  {
    title: 'AI Stack',
    icon: '✦',
    color: '#7c3aed',
    tools: ['Stable Diffusion XL', 'ComfyUI Pipelines', 'LoRA Training', 'ControlNet', 'IP-Adapter', 'Claude / GPT-4', 'Ollama (local)'],
  },
  {
    title: 'Web Dev Stack',
    icon: '◈',
    color: '#06b6d4',
    tools: ['React + TypeScript', 'Tailwind CSS', 'Supabase', 'PostgreSQL', 'Vite', 'shadcn/ui', 'Framer Motion'],
  },
  {
    title: 'AI Orchestration',
    icon: '⬡',
    color: '#f59e0b',
    tools: ['n8n Workflows', 'LangChain', 'Flowise', 'Webhook Pipelines', 'Prompt Libraries', 'Agent Chaining', 'Vector Stores'],
  },
  {
    title: 'Community Practice',
    icon: '🌱',
    color: '#4a8c5c',
    tools: ['Participatory Design', 'World Café Method', 'Theory of Change', 'Asset Mapping', 'Collective Impact', 'Sociocracy', 'Mutual Aid Networks'],
  },
];

// ---- Aspirations list ----
const ASPIRATIONS_LIST = [
  { n: 1, text: 'Build generative AI tools that are legible and accessible to communities without technical backgrounds — no jargon, no gatekeeping.' },
  { n: 2, text: 'Develop a comprehensive Beats & Boxes digital platform that distributes music revenue directly to participating neighborhood artists and organizations.' },
  { n: 3, text: 'Create a publicly available Regenerative Design Framework — a living document and toolkit for practitioners working at the intersection of systems thinking and community care.' },
  { n: 4, text: 'Train custom LoRA models that represent the aesthetic traditions of communities typically underrepresented in AI training data — starting in Philadelphia.' },
  { n: 5, text: 'Launch a children\'s digital storybook series that uses AI illustration in service of stories that center Black, Brown, and Indigenous children as the protagonists of wonder.' },
  { n: 6, text: 'Co-found a worker-owned creative technology studio with collaborators from across the Philly civic tech and arts ecosystem — structured as a cooperative from day one.' },
];

// ---- Ticker component ----
function AspirationTicker() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % ASPIRATIONS_TICKER.length);
        setVisible(true);
      }, 400);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 mt-4">
      <Sparkles className="w-4 h-4 text-[hsl(var(--accent))] shrink-0" />
      <span
        className="text-sm text-[hsl(var(--accent))] font-medium transition-all duration-400"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(8px)' }}
      >
        Currently: {ASPIRATIONS_TICKER[idx]}
      </span>
    </div>
  );
}

// ================================================================
//  AboutPage
// ================================================================
export function AboutPage() {
  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="pt-28 pb-20 relative overflow-hidden">
        {/* Bg glow */}
        <div className="absolute top-0 right-0 w-[50%] h-[60%] opacity-20"
          style={{ background: 'radial-gradient(ellipse at top right, #7c3aed 0%, transparent 70%)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            {/* Left — portrait */}
            <div className="relative" data-reveal>
              <div className="relative rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(124,58,237,0.25)]">
                <img
                  src={aboutPng}
                  alt="Jennipher Troup — Melodyfire"
                  className="w-full h-[520px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--background))] via-transparent to-transparent opacity-60" />
              </div>

              {/* Floating mandala decoration */}
              <MandalaCanvas
                petals={8}
                rings={4}
                speed={0.12}
                interactive={false}
                glowIntensity={0.7}
                autoRotate={true}
                className="absolute -top-12 -right-12 opacity-50"
                style={{ width: 200, height: 200 }}
              />

              {/* Badge below portrait */}
              <div className="mt-5 flex items-center justify-center gap-3">
                <MapPin className="w-4 h-4 text-[hsl(var(--secondary))]" />
                <span className="text-sm text-[hsl(var(--muted-foreground))]">Creative Technologist · Philadelphia, PA</span>
              </div>
            </div>

            {/* Right — text */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[hsl(var(--primary)/0.1)] border border-[hsl(var(--primary)/0.25)]" data-reveal>
                <Flame className="w-3.5 h-3.5 text-[hsl(var(--secondary))]" />
                <span className="text-xs font-semibold text-[hsl(var(--primary))] uppercase tracking-widest">About</span>
              </div>

              <div data-reveal>
                <h1 className="font-display text-5xl md:text-6xl font-black gradient-text-fire leading-tight mb-2">
                  Jennipher Troup
                </h1>
                <p className="text-[hsl(var(--muted-foreground))] text-lg">AI Systems Designer · Creative Technologist · Behavioral architecture and interaction design for constrained intelligence systems</p>
                <AspirationTicker />
              </div>

              <div className="space-y-4 text-[hsl(var(--muted-foreground))] leading-relaxed" data-reveal>
                <p>
                  I am Jennipher Troup — AI Systems Designer, Creative Technologist, and Regenerative Systems Designer based in Philadelphia. My work sits at a peculiar and necessary intersection: behavioral architecture for constrained intelligence systems, civic technology rooted in mutual aid, and generative art that treats pattern as a form of wisdom.
                </p>
                <p>
                  I design systems that practice appropriate restraint while genuinely serving human wellbeing — whether that's a conversational AI that recognizes adaptive patterns without pathologizing them, a civic food-justice initiative that turns a DJ set into a distribution network for hope, or a WebGL shader system that renders the physics of light as a design language.
                </p>
                <p>
                  Philadelphia is not just where I live — it is what I build toward. From ZIP 19135 to the broader question of what cities owe their people, my work is rooted in a city that "has always spoken in rhythm — a pulse made of rail lines and basement basslines, of poets yelling from stoops, of graffiti prayers that bloom on crumbling brick." I am seeking co-founders, collaborators, and creative partners who feel that same pulse.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2" data-reveal>
                <a
                  href="mailto:hello@melodyfire.studio"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
                  style={{ background: 'var(--gradient-primary)' }}
                >
                  Work Together <ArrowRight size={14} />
                </a>
                <Link
                  href="/work"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-all"
                >
                  View Work
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STUDIO PORTRAITS DUO ===== */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold tracking-widest uppercase text-[hsl(var(--muted-foreground))] text-center mb-8" data-reveal>
            The Studio
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-reveal>
            {/* Jennipher portrait */}
            <div className="relative rounded-2xl overflow-hidden group">
              <img
                src={jenniPng}
                alt="Jennipher Troup in her creative studio — generative art, code, and community"
                className="w-full object-cover"
                style={{ aspectRatio: '4/3' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="font-display font-bold text-white text-lg">Jennipher Troup</p>
                <p className="text-white/65 text-sm">Creative Technologist · Philadelphia</p>
              </div>
            </div>
            {/* Studio companion portrait */}
            <div className="relative rounded-2xl overflow-hidden group">
              <img
                src={aboutPng}
                alt="Studio creative spirit — the collaborative energy of Melodyfire"
                className="w-full object-cover"
                style={{ aspectRatio: '4/3' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="font-display font-bold text-white text-lg">Studio Creative Spirit</p>
                <p className="text-white/65 text-sm">The collaborative energy of Melodyfire</p>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-[hsl(var(--muted-foreground))] mt-4" data-reveal>
            Melodyfire serves and celebrates creators across every background. Representation in our tools matters.
          </p>
        </div>
      </section>

      {/* ===== PULLQUOTE ===== */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ background: 'var(--gradient-aurora)' }} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center" data-reveal>
          <blockquote className="font-display text-2xl md:text-3xl font-bold text-[hsl(var(--foreground))] leading-tight">
            "Hold contradiction as a parameter — not a problem to solve, but a pressure that produces{' '}
            <span className="gradient-text">form</span>."
          </blockquote>
          <cite className="block mt-4 text-sm text-[hsl(var(--muted-foreground))] not-italic">
            — Jennipher Troup, The Melodyfire Doctrine
          </cite>
        </div>
      </section>

      {/* ===== DOCTRINE CARDS (9 principles) ===== */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3" data-reveal>
              The <span className="gradient-text-fire">Full Doctrine</span>
            </h2>
            <p className="text-[hsl(var(--muted-foreground))] max-w-xl mx-auto" data-reveal>
              Nine operating principles — the spine of every project and collaboration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {DOCTRINE_FULL.map(({ n, title, body }, i) => {
              const colors = ['#7c3aed', '#f43f5e', '#06b6d4', '#f59e0b', '#4a8c5c', '#a78bfa', '#f43f5e', '#06b6d4', '#7c3aed'];
              const color = colors[i % colors.length];
              return (
                <div
                  key={n}
                  className="group relative bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-6 overflow-hidden transition-all duration-400 hover:-translate-y-1 reveal"
                  data-reveal
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: color }} />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                    style={{ background: `radial-gradient(ellipse at top, ${color}08 0%, transparent 70%)` }} />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs font-bold uppercase tracking-widest" style={{ color }}>{n}</span>
                      <div className="flex-1 h-px opacity-20" style={{ background: color }} />
                    </div>
                    <h3 className="font-display font-bold text-base text-[hsl(var(--foreground))] mb-3 leading-tight">{title}</h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== PROCESS ARCHITECTURE ===== */}
      <section className="py-20 bg-[hsl(var(--card))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            {/* Left — process image */}
            <div className="relative" data-reveal>
              <div className="rounded-3xl overflow-hidden sticky top-24">
                <img
                  src={processPng}
                  alt="Melodyfire process architecture"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--muted)/0.6)] to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <p className="text-sm font-semibold text-white">Process Architecture</p>
                  <p className="text-xs text-white/60">5 phases · regenerative systems</p>
                </div>
              </div>
            </div>

            {/* Right — phases */}
            <div className="space-y-6">
              <div data-reveal>
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
                  How <span className="gradient-text-primary">I Work</span>
                </h2>
                <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
                  A five-phase process architecture — not a rigid waterfall, but a set of orienting movements that repeat, recurse, and adapt to context.
                </p>
              </div>

              <div className="space-y-4">
                {PROCESS_PHASES.map(({ phase, name, desc, color }, i) => (
                  <div
                    key={phase}
                    className="group relative bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-5 overflow-hidden transition-all duration-400 hover:border-[hsl(var(--primary)/0.3)] reveal"
                    data-reveal
                    style={{ transitionDelay: `${i * 80}ms` }}
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full" style={{ background: color }} />
                    <div className="pl-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-bold uppercase tracking-widest" style={{ color }}>{phase}</span>
                        <h3 className="font-display font-bold text-base text-[hsl(var(--foreground))]">{name}</h3>
                      </div>
                      <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== METHODS & TOOLS ===== */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3" data-reveal>
              Methods <span className="gradient-text">&</span> Tools
            </h2>
            <p className="text-[hsl(var(--muted-foreground))] max-w-xl mx-auto" data-reveal>
              The technical and methodological toolkit behind the practice.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TOOLS_STACKS.map(({ title, icon, color, tools }, i) => (
              <div
                key={title}
                className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-6 transition-all duration-400 hover:border-[hsl(var(--primary)/0.3)] hover:-translate-y-1 reveal"
                data-reveal
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-2xl" style={{ color }}>{icon}</span>
                  <h3 className="font-display font-bold text-base text-[hsl(var(--foreground))]">{title}</h3>
                </div>
                <ul className="space-y-2">
                  {tools.map(tool => (
                    <li key={tool} className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                      <span className="w-1 h-1 rounded-full shrink-0" style={{ background: color }} />
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ASPIRATIONS ===== */}
      <section className="py-20 bg-[hsl(var(--card))]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12" data-reveal>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
              <span className="gradient-text-fire">Aspirations</span>
            </h2>
            <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
              The things I'm working toward — the futures I'm trying to participate in making.
            </p>
          </div>

          <div className="space-y-5">
            {ASPIRATIONS_LIST.map(({ n, text }, i) => (
              <div
                key={n}
                className="flex gap-5 items-start group reveal"
                data-reveal
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-display font-black text-sm bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] group-hover:bg-[hsl(var(--primary)/0.2)] transition-colors">
                  {String(n).padStart(2, '0')}
                </div>
                <p className="text-[hsl(var(--muted-foreground))] leading-relaxed pt-2">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COLLABORATION BANNER ===== */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-15" style={{ background: 'var(--gradient-aurora)' }} />
        <MandalaCanvas
          petals={10}
          rings={5}
          speed={0.12}
          interactive={false}
          glowIntensity={0.5}
          autoRotate={true}
          className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20"
          style={{ width: 500, height: 500 }}
        />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-display text-4xl md:text-5xl font-black" data-reveal>
            <span className="gradient-text">Let's build</span>
            <br />
            <span className="text-[hsl(var(--foreground))]">something that lasts.</span>
          </h2>
          <p className="text-[hsl(var(--muted-foreground))] text-lg leading-relaxed" data-reveal>
            I collaborate with organizations, communities, and individuals who are trying to make things that matter — not trends, not products, but genuine contributions to the futures we want to inhabit.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4" data-reveal>
            <a
              href="mailto:hello@melodyfire.studio"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white shadow-[var(--glow-primary)] hover:-translate-y-0.5 transition-all duration-300"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <Flame className="w-4 h-4" /> Start a Conversation
            </a>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:border-[hsl(var(--primary)/0.5)] transition-all"
            >
              View Services <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
