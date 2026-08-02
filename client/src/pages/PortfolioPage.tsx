import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'wouter';
import { ExternalLink, Code2 } from 'lucide-react';
import { SiGithub, SiFigma } from 'react-icons/si';

import shaderGalleryImg from '@assets/img/shadergallery-abalone.png';
import beatsBoxesImg from '@assets/img/beats-boxes.png';
import restoryingImg from '@assets/img/restorying.png';
import heroImg from '@assets/img/hero.png';
import heroMandalaImg from '@assets/img/hero-mandala.png';
import childrensArtImg from '@assets/img/mf-childrens-art-service.png';
import artGalleryImg from '@assets/img/art-gallery.png';
import portfolioImg from '@assets/img/portfolio.png';
import processImg from '@assets/img/process.png';
import stickersImg from '@assets/img/stickers.png';
import chromafloraImg from '@assets/img/chromaflora-preview.png';
import neumorphismImg from '@assets/img/neumorphism-preview.png';
import solarGrimoireImg from '@assets/img/mf-solar-grimoire.png';

type Project = {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  categories: string[];
  tags: string[];
  disciplines: string[];
  image: string;
  year: string;
  status: string;
  driveUrl?: string | null;
  githubUrl?: string;
  ctas?: { label: string; href: string }[];
};

const PROJECTS: Project[] = [
  {
    id: 10,
    title: 'ChromaFlora Design System v5',
    description: 'A 20-page cosmic generative art system featuring 15+ families of live GLSL shaders, a music synthesizer with frequency visualizer, sacred geometry plotter, AI studio, and an interactive particle universe. The most ambitious single generative canvas system I\'ve built.',
    longDescription: 'ChromaFlora v5 is a live, 20-page cosmic generative art environment built on React 18 + Vite + Canvas API + WebGL GLSL. It features 15+ families of procedural shaders — each with interactive parameter controls — a full music synthesizer with frequency visualizer, a sacred geometry plotter, an AI studio, and a particle universe simulator. Every page is its own living canvas. This is the most ambitious single-author generative system I\'ve built, and it continues to evolve.',
    categories: ['web-apps', 'generative-art'],
    tags: ['WebGL', 'Canvas API', 'Music Synthesis', 'Sacred Geometry'],
    disciplines: ['GLSL Shaders', 'Generative Systems', 'Audio Synthesis', 'React 18 + Vite'],
    image: chromafloraImg,
    year: '2025-2026',
    status: 'Live',
    driveUrl: null,
    githubUrl: 'https://github.com/qt314wink/chromaflora-sitezip',
  },
  {
    id: 11,
    title: 'AETHER Portfolio — Iridescent Abalone Shaders',
    description: 'A polished technical showcase curating 15 families of iridescent \'abalone\' shaders — thin-film interference, Fresnel ramps, bubble membranes, prismatic light effects — integrated into a React/Next.js portfolio with physics-based Z-axis spring parameters.',
    longDescription: 'AETHER is a WebGL/GLSL iridescent abalone shader portfolio built with React + Three.js and deployed on Vercel. It curates 15 shader families — thin-film interference, Fresnel ramps, bubble membranes, prismatic light diffraction — each with live interactive parameter controls and physics-based spring animations. The portfolio itself is a demonstration of the visual language it documents.',
    categories: ['web-apps', 'ui-ux'],
    tags: ['WebGL', 'GLSL', 'React', 'Three.js', 'Vercel'],
    disciplines: ['Shader Programming', 'Three.js', 'React', 'Physics Animation'],
    image: neumorphismImg,
    year: '2026',
    status: 'Vercel',
    driveUrl: 'https://docs.google.com/document/d/1EVokii1xQ13AX8Zk30ZyINESAfbjBdYK/view',
    githubUrl: 'https://github.com/qt314wink',
  },
  {
    id: 12,
    title: 'Neumorphism / Jewelmorphism Design System',
    description: 'A physics-based elemental animation and soft UI design system exploring jewelmorphism, woodmorphism, and realistic light refraction. Deployed on Netlify. Comprehensive documentation with state transition guides and animation technique specs.',
    longDescription: 'A comprehensive design system exploring the intersections of neumorphism, jewelmorphism, woodmorphism, and physics-based elemental animations. Features realistic light refraction effects, state transition guides, and animation technique specifications. Deployed on Netlify with full documentation. The system includes a woodmorphism variant (github.com/qt314wink/woodmorphism) that extends the visual language into organic material simulation.',
    categories: ['ui-ux'],
    tags: ['Design System', 'Netlify', 'Physics Animation', 'Jewelmorphism'],
    disciplines: ['Design Systems', 'CSS Animation', 'Neumorphism', 'Documentation'],
    image: neumorphismImg,
    year: '2025-2026',
    status: 'Live on Netlify',
    driveUrl: null,
    githubUrl: 'https://github.com/qt314wink/neumorphism-soft-ui-design-system',
  },
  {
    id: 1,
    title: 'Beats & Boxes',
    description: 'Art Feeds the City. — Jennipher Troup, Co. La\'Bright. A civic food-justice initiative turning DJ sets into distribution networks for mutual aid, community sustenance, and solidarity. "Philadelphia has always spoken in rhythm — a pulse made of rail lines and basement basslines, of poets yelling from stoops, of graffiti prayers that bloom on crumbling brick."',
    longDescription: 'Art Feeds the City.\n\nBeats & Boxes is not charity. It is choreography. Founded by Jennipher Troup under Co. La\'Bright, this participatory civic initiative turns the dance floor into a field where every step plants something real — connecting music events, community organizing, and food justice infrastructure across Philadelphia (ZIP 19135, Fox Chase / Playwicki area).\n\nThe mission: Turn art into sustenance, sustenance into solidarity, and solidarity into sound. The infrastructure runs as a living network of reciprocity: Give → Grow → Feed → Return.\n\n"Logistics wrapped in love. May every bass drop carry the vibration of enough."\n\nPhiladelphia has always spoken in rhythm — a pulse made of rail lines and basement basslines, of poets yelling from stoops, of graffiti prayers that bloom on crumbling brick. Beats & Boxes amplifies that pulse into a system that feeds people.',
    categories: ['civic-tech'],
    tags: ['Civic Tech', 'Food Justice', 'Mutual Aid', 'Co. La\'Bright'],
    disciplines: ['Participatory Design', 'Civic Infrastructure', 'Sound + Food Justice', 'Community Organizing'],
    image: beatsBoxesImg,
    year: '2024',
    status: 'Ongoing',
    driveUrl: 'https://docs.google.com/presentation/d/1PRtvsqOxgrAv8DTGFy6xeX7G9J1W0onZ/preview',
    ctas: [
      { label: 'View Case Study →', href: '#' },
      { label: 'The Doctrine', href: '#doctrine' },
    ],
  },
  {
    id: 2,
    title: 'Restorying Framework',
    description: 'A systems-design methodology for institutions ready to move from extraction to regenerative practice.',
    longDescription: 'Restorying is a 5-phase design framework that helps organizations audit their practices, identify harmful patterns, and redesign from a place of ecological and cultural reciprocity. Outputs include facilitation guides, visual maps, and governance templates.',
    categories: ['systems', 'regenerative'],
    tags: ['Systems Design', 'Regenerative', 'Framework'],
    disciplines: ['Systems Thinking', 'Facilitation Design', 'Visual Strategy'],
    image: restoryingImg,
    year: '2023',
    status: 'Published',
  },
  {
    id: 3,
    title: 'ShaderGallery',
    description: '15 shader families including: Iridescent/Abalone Nacre, Thin-Film Interference, Fresnel Ramp, Bubble Membrane, Prismatic Refraction, Pearlescent Glow, Metallic Anisotropy, and more. Raw GLSL imports via sourceMap.ts, dynamic variant building, family tab filtering.',
    longDescription: 'ShaderGallery is a React + WebGL component system for generative, shader-driven visual experiences in the browser. 15 shader families: Iridescent/Abalone Nacre, Thin-Film Interference, Fresnel Ramp, Bubble Membrane, Prismatic Refraction, Pearlescent Glow, Metallic Anisotropy, and more. Built with raw GLSL imports via sourceMap.ts, dynamic variant building, and family tab filtering — GPU-accelerated composable building blocks for aurora visuals, interactive particle fields, and procedural mandala renderers.',
    categories: ['web-apps', 'ui-ux'],
    tags: ['WebGL', 'React', 'Generative'],
    disciplines: ['Creative Engineering', 'UI Systems', 'GLSL / Three.js'],
    image: shaderGalleryImg,
    year: '2024',
    status: 'Beta',
    githubUrl: 'https://github.com/qt314wink',
  },
  {
    id: 4,
    title: 'Monsterverse / Storybook AI Art System',
    description: "A reusable AI art pipeline for children's book illustration with character consistency across scenes.",
    longDescription: 'The Monsterverse pipeline is a ComfyUI + SDXL workflow with trained LoRA weights producing layered papercraft diorama aesthetics. A single "canon prompt" set drives character consistency across unlimited scenes — enabling fast, affordable illustrated storybooks.',
    categories: ['children-art', 'generative-art'],
    tags: ["AI Art", "Children's Books", 'ComfyUI'],
    disciplines: ['Prompt Engineering', 'LoRA Training', 'Story Design'],
    image: childrensArtImg,
    year: '2024',
    status: 'Active',
  },
  {
    id: 5,
    title: 'Chaotic Halos Series',
    description: 'A 40-piece generative art series exploring sacred geometry through chromatic noise and mandala forms.',
    longDescription: 'Halos began as a meditative experiment in radial symmetry and grew into a full series. Each piece is generated through an iterative prompt + ControlNet pipeline, then hand-curated for compositional tension.',
    categories: ['generative-art'],
    tags: ['Generative Art', 'Sacred Geometry', 'Series'],
    disciplines: ['Prompt Architecture', 'Curation', 'Edition Design'],
    image: artGalleryImg,
    year: '2023',
    status: 'Complete',
  },
  {
    id: 6,
    title: 'Nexus Design System',
    description: 'A component library and token architecture for creative technologist portfolios and brand experiences.',
    longDescription: 'Nexus is a design system built on Tailwind CSS + Radix primitives, opinionated toward expressive, high-contrast creative sites. It ships with 40+ components, a motion library, and a multi-theme engine.',
    categories: ['ui-ux', 'systems'],
    tags: ['Design System', 'Tailwind', 'Component Library'],
    disciplines: ['Design Tokens', 'Component Architecture', 'Documentation'],
    image: portfolioImg,
    year: '2024',
    status: 'V3 Active',
  },
  {
    id: 7,
    title: 'Philly Gig Dashboard',
    description: 'A data dashboard mapping independent gig economy workers across Philadelphia neighborhoods.',
    longDescription: 'Built with React, Recharts, and a Supabase backend, the Philly Gig Dashboard visualizes income data, neighborhood density, and policy impact for freelance workers.',
    categories: ['web-apps', 'civic-tech'],
    tags: ['Dashboard', 'Data Viz', 'Civic Tech'],
    disciplines: ['Data Visualization', 'Policy Design', 'React / Supabase'],
    image: portfolioImg,
    year: '2023',
    status: 'Deployed',
  },
  {
    id: 8,
    title: 'Notion AI Orchestration',
    description: 'An automated knowledge-management system using Notion + AI to organize creative project pipelines.',
    longDescription: 'This orchestration system uses Notion databases, custom API integrations, and LLM-driven tagging to automate project documentation, brief generation, and client-ready exports.',
    categories: ['systems'],
    tags: ['Notion', 'AI Automation', 'Knowledge Systems'],
    disciplines: ['Systems Design', 'API Integration', 'Workflow Architecture'],
    image: processImg,
    year: '2024',
    status: 'Personal Use',
  },
  {
    id: 9,
    title: 'Sticker & Pattern Collection',
    description: 'A 200+ piece sticker and seamless pattern library generated through SDXL and refined for print.',
    longDescription: 'A fully licensable sticker and pattern library spanning floral, geometric, and folk textile aesthetics. Each piece goes through a 5-stage pipeline: generation, upscale, background removal, color correction, and vectorization.',
    categories: ['generative-art', 'ui-ux'],
    tags: ['Stickers', 'Patterns', 'Print-Ready'],
    disciplines: ['Pattern Design', 'Print Production', 'Licensing'],
    image: stickersImg,
    year: '2024',
    status: 'Available',
  },
  {
    id: 13,
    title: 'AI Cognitive Reframing System',
    description: 'A conversational AI interface for pattern recognition and neuroplastic revision — recognizing adaptive patterns as survival intelligence rather than pathology. Features Heart-Mind Coherence Visualizer, multi-modal exercise library, and seven explicit AI governance/restraint protocols. React 18 + Vite + HTML5 Canvas + Claude Sonnet API.',
    longDescription: 'An interactive AI-powered system built to support cognitive pattern recognition and neuroplastic revision. The interface recognizes adaptive behaviors as survival intelligence rather than pathology, and guides users through structured reframing exercises. Includes a Heart-Mind Coherence Visualizer powered by HTML5 Canvas, a multi-modal exercise library, and seven explicit AI governance/restraint protocols built directly into the system prompt architecture. Built with React 18, Vite, and the Claude Sonnet API.',
    categories: ['systems', 'web-apps'],
    tags: ['React', 'Claude API', 'Canvas', 'AI/UX'],
    disciplines: ['Conversational AI', 'UX Design', 'Canvas Animation', 'AI Governance'],
    image: processImg,
    year: '2026',
    status: 'Live · Vercel',
    githubUrl: 'https://github.com/qt314wink',
    driveUrl: null,
  },
  {
    id: 14,
    title: 'Bellwoods',
    description: 'An architectural visualization and experience platform — detailed technical architecture documentation, deployment pipeline, and immersive UX system design. Full technical briefing authored and maintained in Google Drive.',
    longDescription: 'Bellwoods is a full-stack architectural visualization platform with a rich immersive UX system. This entry covers the technical architecture documentation, deployment pipeline design, and UX systems authored for the project. The comprehensive technical briefing is maintained in Google Drive and includes component architecture, state management strategy, and deployment specifications.',
    categories: ['web-apps', 'ui-ux'],
    tags: ['Architecture', 'UX Systems', 'Technical Writing'],
    disciplines: ['Technical Architecture', 'UX Systems Design', 'Documentation'],
    image: heroMandalaImg,
    year: '2026',
    status: '2026 · In Development',
    driveUrl: 'https://docs.google.com/document/d/1Id1qZMXR3V4VNR_vT29wD9Nld_fQfwmd/edit',
  },
  {
    id: 15,
    title: '2026 Creative Developer Toolkit',
    description: 'A comprehensive framework guide covering Astro, Svelte 5, shadcn/ui, Motion, Lemon Squeezy, and the full creative developer ecosystem in 2026. Research-backed with quantitative data (GitHub stars, download counts). Published as both PDF and interactive reference.',
    longDescription: 'A definitive research-backed guide to the creative developer ecosystem in 2026. Covers Astro, Svelte 5, shadcn/ui, Motion (Framer Motion successor), Lemon Squeezy, and adjacent tools. Includes quantitative data: GitHub stars, weekly download counts, community growth metrics. Published as both a downloadable PDF and an interactive web reference. Designed as a decision framework for creative technologists choosing their stack.',
    categories: ['systems', 'ui-ux'],
    tags: ['Research', 'Frameworks', 'Developer Tools', 'Published'],
    disciplines: ['Technical Research', 'Content Strategy', 'Framework Evaluation'],
    image: portfolioImg,
    year: '2026',
    status: '2026 · Published',
    driveUrl: 'https://onedrive.live.com/?id=571926ad-edc8-45b1-b797-242f6c131355&cid=82762ade02f391d1',
  },
  {
    id: 16,
    title: 'Pinterest & Instagram Bulk Uploader',
    description: 'Bulk pin uploader with background removal, per-image AI hashtag generation, and batch scheduling for Pinterest and Instagram.',
    longDescription: 'A productivity tool for visual creators — batch-upload images to Pinterest and Instagram with automated background removal, per-image AI-generated hashtags, smart scheduling, and board organization. Built for Melodyfire and available as a service to other creators.',
    categories: ['web-apps', 'systems'],
    tags: ['React', 'Node.js', 'AI/ML', 'Social API'],
    disciplines: ['Automation', 'Social API Integration', 'AI/ML'],
    image: portfolioImg,
    year: '2026',
    status: 'In Development',
    githubUrl: 'https://github.com/qt314wink',
  },
  {
    id: 17,
    title: 'Ritual Geometry Guide',
    description: 'An illustrated guide to the mathematics and philosophy of sacred geometry — frequency, symmetry, and pattern as spiritual technology.',
    longDescription: 'A comprehensive illustrated guide exploring sacred geometry from first principles — frequency ratios, Fibonacci sequences, Platonic solids, mandala construction, and the philosophical frameworks that unite mathematics with ritual practice. Written and illustrated by Jennipher Troup.',
    categories: ['systems', 'generative-art'],
    tags: ['Sacred Geometry', 'Illustration', 'Publishing', 'Research'],
    disciplines: ['Illustration', 'Research', 'Publishing'],
    image: solarGrimoireImg,
    year: '2026',
    status: 'In Progress',
    driveUrl: 'https://docs.google.com/document/d/ritual-geometry-guide',
  },
  {
    id: 18,
    title: 'Live SVG / G-Code Mandala Generator',
    description: 'Real-time mandala generator with live SVG output, G-code export for plotters and laser cutters, built on real mathematical foundations.',
    longDescription: 'A live parametric mandala generator built on real mathematical foundations — frequency harmonics, Lissajous paths, symmetry groups, turbulence fields, fold geometry. Outputs live SVG for web display and G-code for physical plotters, laser cutters, and CNC machines. Designed for sacred geometry practitioners, artists, and fabricators.',
    categories: ['web-apps', 'generative-art'],
    tags: ['WebGL', 'SVG', 'G-Code', 'Plotter', 'Math'],
    disciplines: ['Generative Systems', 'Math / Geometry', 'Fabrication'],
    image: heroMandalaImg,
    year: '2026',
    status: 'In Development',
    githubUrl: 'https://github.com/qt314wink',
  },
];

const FILTER_TABS = [
  { label: 'All', value: 'all' },
  { label: 'Regenerative', value: 'regenerative' },
  { label: 'Systems', value: 'systems' },
  { label: 'Generative Art', value: 'generative-art' },
  { label: 'Web Apps', value: 'web-apps' },
  { label: 'Civic Tech', value: 'civic-tech' },
  { label: 'UI/UX', value: 'ui-ux' },
  { label: 'Children Art', value: 'children-art' },
];

// Decorative mandala canvas
function MandalaCanvas({ size = 200 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = size;
    canvas.height = size;
    const cx = size / 2, cy = size / 2;
    const arms = 12, layers = 5;
    ctx.clearRect(0, 0, size, size);
    for (let l = 1; l <= layers; l++) {
      const r = (l / layers) * (size * 0.44);
      const alpha = 0.12 + (l / layers) * 0.1;
      const colors = ['#7c3aed', '#f43f5e', '#06b6d4', '#f59e0b'];
      ctx.strokeStyle = colors[l % colors.length];
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 0.8;
      for (let i = 0; i < arms; i++) {
        const angle = (i / arms) * Math.PI * 2;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.stroke();
        ctx.beginPath(); ctx.arc(x, y, r * 0.15, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }, [size]);
  return <canvas ref={canvasRef} style={{ width: size, height: size }} />;
}

// Project modal
function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', h); document.body.style.overflow = ''; };
  }, [onClose]);

  const embedUrl = project.driveUrl
    ? project.driveUrl.includes('/preview') ? project.driveUrl : project.driveUrl + '/preview'
    : null;

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {project.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 text-xs font-medium rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">{tag}</span>
              ))}
            </div>
            <h2 className="font-display text-2xl font-bold text-white">{project.title}</h2>
          </div>
          <button onClick={onClose} className="ml-4 w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all flex-shrink-0 text-xl" aria-label="Close modal">×</button>
        </div>
        <p className="text-white/70 mb-6 leading-relaxed">{project.longDescription}</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {project.disciplines.map(d => (
            <span key={d} className="px-3 py-1 text-xs rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">{d}</span>
          ))}
        </div>
        {embedUrl ? (
          <div className="mb-6">
            <div className="relative w-full rounded-xl overflow-hidden border border-white/10" style={{ paddingTop: '56.25%' }}>
              <iframe src={embedUrl} className="absolute inset-0 w-full h-full" allow="autoplay" title={`${project.title} presentation`} />
            </div>
            <div className="mt-4 space-y-2">
              <button
                onClick={() => window.open('/reverse-prompt?note=' + encodeURIComponent(project.title), '_blank')}
                className="w-full py-3 px-5 rounded-xl font-semibold text-sm text-white hover:opacity-90 transition-opacity"
                style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #f43f5e 100%)' }}
              >
                Want to use this visual prompt?
              </button>
              <p className="text-center text-sm text-white/50">
                <a href="/reverse-prompt" target="_blank" rel="noreferrer" className="hover:text-violet-400 transition-colors underline underline-offset-2">
                  See if my Reverse Prompt Engineer can assist you!
                </a>
              </p>
            </div>
          </div>
        ) : (
          <img src={project.image} alt={project.title} className="w-full rounded-xl mb-6 object-cover" style={{ aspectRatio: '4/3', maxHeight: 340 }} />
        )}
        <div className="flex items-center justify-between text-sm text-white/40 pt-4 border-t border-white/10">
          <span>{project.year}</span>
          <div className="flex items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors"
              >
                <SiGithub size={12} /> GitHub
              </a>
            )}
            <span className={`px-2 py-0.5 rounded-full text-xs ${['Ongoing','Active','V3 Active','Beta','Live','Vercel','Live on Netlify'].includes(project.status) ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/40'}`}>
              {project.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Project card
function ProjectCard({ project, onOpen }: { project: Project; onOpen: (p: Project) => void }) {
  return (
    <div className="group sg-card hover:border-violet-500/40 transition-all duration-300 cursor-pointer overflow-hidden" onClick={() => onOpen(project)}>
      <div className="relative overflow-hidden" style={{ height: 200 }}>
        <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/25">{tag}</span>
          ))}
        </div>
        <h3 className="font-display font-semibold text-white text-lg mb-2 group-hover:text-violet-300 transition-colors">{project.title}</h3>
        <p className="text-white/60 text-sm leading-relaxed line-clamp-3">{project.description}</p>
      </div>
      <div className="px-5 pb-5 flex items-center justify-between text-xs text-white/40">
        <div className="flex items-center gap-2">
          <span>{project.year}</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span className={`px-1.5 py-0.5 rounded-full ${['Ongoing','Active','V3 Active','Beta','Live','Vercel','Live on Netlify'].includes(project.status) ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/40'}`}>
            {project.status}
          </span>
        </div>
        <span className="text-violet-400 group-hover:translate-x-1 transition-transform">View →</span>
      </div>
    </div>
  );
}

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [modalProject, setModalProject] = useState<Project | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed'); }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const filteredProjects = activeFilter === 'all' ? PROJECTS : PROJECTS.filter(p => p.categories.includes(activeFilter));
  const featuredProject = PROJECTS[0];
  const handleOpen = useCallback((p: Project) => setModalProject(p), []);

  return (
    <>
      <main className="min-h-screen" style={{ background: 'hsl(var(--background))' }}>
        {/* Hero */}
        <section
          className="relative pt-28 pb-16 px-6 overflow-hidden"
          style={{ background: 'linear-gradient(to bottom right, #1a0a2e 0%, #0d1520 60%, #0f0820 100%)' }}
        >
          <div className="absolute top-16 right-6 md:right-16 opacity-30 pointer-events-none" style={{ width: 200, height: 200 }}>
            <MandalaCanvas size={200} />
          </div>
          <div className="max-w-4xl mx-auto">
            <p className="text-sm font-medium tracking-widest uppercase text-violet-400 mb-4 reveal">Creative Technologist · Jennipher Troup</p>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 reveal delay-100">
              <span className="gradient-text-primary">Work &amp; Projects</span>
            </h1>
            <p className="text-white/60 text-lg md:text-xl max-w-2xl leading-relaxed reveal delay-200">
              A living archive of civic design, generative art systems, web applications, and community-centered technology. Every project is rooted in regenerative practice and joyful experimentation.
            </p>
          </div>
        </section>

        {/* Filter Tabs */}
        <section className="px-6 pb-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-2">
              {FILTER_TABS.map(tab => (
                <button
                  key={tab.value}
                  onClick={() => setActiveFilter(tab.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeFilter === tab.value ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Project */}
        {(activeFilter === 'all' || featuredProject.categories.includes(activeFilter)) && (
          <section className="px-6 pb-16">
            <div className="max-w-6xl mx-auto">
              <p className="text-xs font-semibold tracking-widest uppercase mb-6 reveal" style={{ color: '#f43f5e' }}>Featured Project</p>
              <div className="sg-card overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative overflow-hidden" style={{ minHeight: 360 }}>
                    <img src={beatsBoxesImg} alt="Beats & Boxes" className="w-full h-full object-cover" style={{ minHeight: 360 }} />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
                  </div>
                  <div className="p-8 md:p-10 flex flex-col justify-center">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {featuredProject.tags.map(t => (
                        <span key={t} className="px-2 py-0.5 text-xs rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">{t}</span>
                      ))}
                    </div>
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">{featuredProject.title}</h2>
                    <p className="text-white/65 leading-relaxed mb-6">{featuredProject.longDescription}</p>
                    <div className="mb-6">
                      <p className="text-xs text-white/40 uppercase tracking-wider mb-2 font-semibold">Disciplines</p>
                      <div className="flex flex-wrap gap-2">
                        {featuredProject.disciplines.map(d => (
                          <span key={d} className="px-2.5 py-1 text-xs rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">{d}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button onClick={() => handleOpen(featuredProject)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #f43f5e 100%)' }}>
                        View Case Study →
                      </button>
                      <a href="#doctrine" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white/70 border border-white/20 hover:border-violet-500/50 hover:text-white transition-all">
                        The Doctrine
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Project Grid */}
        <section className="px-6 pb-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-white mb-8 reveal">
              All Projects <span className="text-white/30 font-normal text-lg">({filteredProjects.length})</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, i) => (
                <div key={project.id} className={`reveal delay-${(['100','200','300','100','200','300','100','200','300'][i] || '100') as '100'}`}>
                  <ProjectCard project={project} onOpen={handleOpen} />
                </div>
              ))}
            </div>
            {filteredProjects.length === 0 && (
              <div className="text-center py-24 text-white/40">
                <p className="text-4xl mb-4">∅</p>
                <p>No projects in this category yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* Live on the Web — Platform Cards */}
        <section className="px-6 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="mb-10 reveal">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">Find Me Across Platforms</h2>
              <p className="text-white/50 text-base">Real deployed work, live repositories, and design systems — click through to the actual builds.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* GitHub */}
              <a
                href="https://github.com/qt314wink"
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-2xl p-6 border border-white/10 hover:border-violet-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(124,58,237,0.18)]"
                style={{ background: 'rgba(255,255,255,0.03)', borderTop: '3px solid #7c3aed' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <SiGithub className="w-6 h-6 text-violet-400" />
                  <span className="font-display font-bold text-white text-base">GitHub</span>
                </div>
                <p className="text-xs text-white/40 mb-3">github.com/qt314wink</p>
                <p className="text-sm text-white/60 leading-relaxed mb-4">15+ repositories including ChromaFlora, AETHER, Neumorphism, Woodmorphism, and more generative experiments.</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-400 group-hover:text-violet-300 transition-colors">
                  Visit <ExternalLink size={10} />
                </span>
              </a>

              {/* Replit */}
              <a
                href="https://replit.com/@qt314wink"
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-2xl p-6 border border-white/10 hover:border-rose-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(244,63,94,0.18)]"
                style={{ background: 'rgba(255,255,255,0.03)', borderTop: '3px solid #f43f5e' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Code2 className="w-6 h-6 text-rose-400" />
                  <span className="font-display font-bold text-white text-base">Replit</span>
                </div>
                <p className="text-xs text-white/40 mb-3">replit.com/@qt314wink</p>
                <p className="text-sm text-white/60 leading-relaxed mb-4">Live repls including ChromaFlora v5, interactive experiments, and rapid prototypes.</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 group-hover:text-rose-300 transition-colors">
                  Visit <ExternalLink size={10} />
                </span>
              </a>

              {/* Netlify */}
              <a
                href="https://github.com/qt314wink/neumorphism-soft-ui-design-system"
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-2xl p-6 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(6,182,212,0.18)]"
                style={{ background: 'rgba(255,255,255,0.03)', borderTop: '3px solid #06b6d4' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <ExternalLink className="w-6 h-6 text-cyan-400" />
                  <span className="font-display font-bold text-white text-base">Netlify</span>
                </div>
                <p className="text-xs text-white/40 mb-3">Deployed Sites</p>
                <p className="text-sm text-white/60 leading-relaxed mb-4">Neumorphism/Jewelmorphism design system and other static deployments live on Netlify.</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                  Visit <ExternalLink size={10} />
                </span>
              </a>

              {/* Figma */}
              <a
                href="https://figma.com/@jennipher"
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-2xl p-6 border border-white/10 hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(245,158,11,0.18)]"
                style={{ background: 'rgba(255,255,255,0.03)', borderTop: '3px solid #f59e0b' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <SiFigma className="w-6 h-6 text-amber-400" />
                  <span className="font-display font-bold text-white text-base">Figma</span>
                </div>
                <p className="text-xs text-white/40 mb-3">Design Systems</p>
                <p className="text-sm text-white/60 leading-relaxed mb-4">UI kits, component libraries, and design system documentation — Aurora Dashboard, Nexus, and more.</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 group-hover:text-amber-300 transition-colors">
                  Visit <ExternalLink size={10} />
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* Philosophy Pullquote */}
        <section id="doctrine" className="px-6 py-20 solarpunk-section">
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <p className="sg-gold text-xs font-semibold tracking-widest uppercase mb-8">The Doctrine</p>
            <blockquote className="font-display text-2xl md:text-3xl sg-text leading-relaxed mb-8">
              "Every project is a living system. Design for the moment it operates without you —<span className="sg-gradient-text"> for the community that inherits it.</span>"
            </blockquote>
            <p className="sg-text-muted text-base leading-relaxed max-w-2xl mx-auto">
              Regenerative design means building things that give back more than they take. Every tool, framework, and piece of art created here is governed by that principle — from the prompts to the processes to the people involved.
            </p>
          </div>
        </section>

        {/* CTA Band */}
        <section className="px-6 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4 reveal">
              Ready to build something <span className="gradient-text-fire">together?</span>
            </h2>
            <p className="text-white/50 mb-8 reveal delay-100">Open for commissions, collaborations, and consulting.</p>
            <div className="flex flex-wrap gap-4 justify-center reveal delay-200">
              <Link href="/services">
                <span className="px-6 py-3 rounded-xl font-semibold text-white cursor-pointer transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #f43f5e 100%)' }}>
                  View Services
                </span>
              </Link>
              <a href="mailto:hello@melodyfire.com" className="px-6 py-3 rounded-xl font-semibold text-white/70 border border-white/20 hover:border-violet-500/50 hover:text-white transition-all">
                Get in Touch
              </a>
            </div>
          </div>
        </section>
      </main>

      {modalProject && <ProjectModal project={modalProject} onClose={() => setModalProject(null)} />}
    </>
  );
}

export { PortfolioPage };
