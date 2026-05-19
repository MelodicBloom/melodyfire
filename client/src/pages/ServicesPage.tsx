import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { supabase } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';

import childrensArtImg from '@assets/img/mf-childrens-art-service.png';
import artGalleryImg from '@assets/img/art-gallery.png';
import aiSectionImg from '@assets/img/ai-section.png';
import processImg from '@assets/img/process.png';
import restoryingImg from '@assets/img/restorying.png';
import reversePromptImg from '@assets/img/mf-reverse-prompt-hero.png';

/* ------------------------------------------------------------------ */
/*  Types                                                                */
/* ------------------------------------------------------------------ */

type PricingTier = {
  name: string;
  price: string;
  description: string;
};

type Service = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  deliverables: string[];
  pricing_tiers: PricingTier[];
  turnaround: string;
  active: boolean;
  cta_label?: string;
  cta_href?: string;
  image_url?: string;
};

/* ------------------------------------------------------------------ */
/*  Category → image map                                                 */
/* ------------------------------------------------------------------ */

const CATEGORY_IMAGES: Record<string, string> = {
  children_art: childrensArtImg,
  ai_art_commission: artGalleryImg,
  prompt_engineering: aiSectionImg,
  lora_training: processImg,
  workshop: restoryingImg,
  storybook_service: childrensArtImg,
  reverse_prompt: reversePromptImg,
};

/* Fallback services shown if DB is empty */
const FALLBACK_SERVICES: Service[] = [
  {
    id: '1',
    name: 'Storybook Art Commissions',
    tagline: 'Illustrated scenes for children\'s books, gifts, and visual storytelling.',
    description:
      'Custom AI-generated illustrated artwork in the Monsterverse layered papercraft style. Each commission is guided by a structured brief process that ensures character consistency, emotional resonance, and print-ready quality.',
    category: 'storybook_service',
    deliverables: [
      'High-res PNG + JPEG (300 dpi)',
      'Print-ready files',
      'Up to 2 revision rounds',
      'Commercial license included',
    ],
    pricing_tiers: [
      { name: 'Single Scene', price: '$75', description: '1 illustrated scene, 2 characters max' },
      { name: 'Story Pack', price: '$220', description: '5 scenes with character consistency' },
      { name: 'Full Book Companion', price: '$650', description: '15+ scenes + cover' },
    ],
    turnaround: '5–14 business days',
    active: true,
    cta_label: 'Commission Now',
    cta_href: '/childrens-art',
  },
  {
    id: '2',
    name: 'Prompt Engineering Consultation',
    tagline: 'Structure your AI workflows for repeatable, high-quality outputs.',
    description:
      'A 60-minute working session to audit your current prompting approach, identify structural weaknesses, and build a reusable prompt architecture tailored to your tools (SDXL, Midjourney, ChatGPT, Claude).',
    category: 'prompt_engineering',
    deliverables: [
      'Prompt audit report',
      'Custom prompt template set',
      'LoRA recommendation map',
      '30-day follow-up email support',
    ],
    pricing_tiers: [
      { name: 'Single Session', price: '$120', description: '60-min consultation + written summary' },
      { name: 'Sprint Pack', price: '$320', description: '3 sessions over 2 weeks' },
      { name: 'Ongoing Retainer', price: '$800/mo', description: 'Weekly sessions + async support' },
    ],
    turnaround: 'Booked within 3 business days',
    active: true,
    cta_label: 'Book a Session',
    cta_href: 'mailto:hello@melodyfire.com?subject=Prompt Engineering Consultation',
  },
  {
    id: '3',
    name: 'Custom LoRA Training',
    tagline: 'Train a model on your aesthetic — own a visual style no one else has.',
    description:
      'End-to-end LoRA training service: dataset curation, captioning, training configuration, and delivery. Built for artists who want consistent style reproduction, brands needing visual identity in generative tools, and creators building their own AI pipelines.',
    category: 'lora_training',
    deliverables: [
      'Trained .safetensors LoRA file',
      'Dataset (curated, captioned)',
      'Recommended trigger words',
      'Sample prompt set + usage guide',
    ],
    pricing_tiers: [
      { name: 'Style LoRA', price: '$350', description: 'Single aesthetic, 100–200 images' },
      { name: 'Character LoRA', price: '$450', description: 'Character consistency, multi-pose' },
      { name: 'Full Pipeline', price: '$900', description: 'Style + character + integration support' },
    ],
    turnaround: '7–10 business days',
    active: true,
    cta_label: 'Inquire About Training',
    cta_href: 'mailto:hello@melodyfire.com?subject=LoRA Training Inquiry',
  },
  {
    id: '4',
    name: 'Regenerative Design Workshop',
    tagline: 'Systems thinking for organizations ready to design beyond extraction.',
    description:
      'A half-day or full-day facilitated workshop using the Restorying Framework. Teams audit current practices, map system interdependencies, and co-design transition pathways toward more reciprocal, ecologically responsible operations.',
    category: 'workshop',
    deliverables: [
      'Pre-workshop intake + stakeholder survey',
      'Visual systems map (Miro)',
      'Facilitated ideation session',
      'Post-workshop action roadmap',
    ],
    pricing_tiers: [
      { name: 'Half-Day (4h)', price: '$1,200', description: 'Up to 10 participants, remote' },
      { name: 'Full-Day (8h)', price: '$2,200', description: 'Up to 20 participants, remote' },
      { name: 'On-Site', price: '$3,500+', description: 'In-person facilitation + travel' },
    ],
    turnaround: 'Scheduled 2+ weeks out',
    active: true,
    cta_label: 'Schedule a Workshop',
    cta_href: 'mailto:hello@melodyfire.com?subject=Workshop Inquiry',
  },
  {
    id: '5',
    name: 'AI Art Commission',
    tagline: 'Custom AI-generated artwork for editorial, brand, and personal use.',
    description:
      'Bespoke AI art commissions across the Melodyfire style library: sacred geometry mandalas, neo-brutalist pop compositions, papercraft dioramas, and chromatic noise fields. Each piece is directed through a structured brief and curated from hundreds of generations.',
    category: 'ai_art_commission',
    deliverables: [
      'Final high-res artwork (300 dpi)',
      'Commercial license',
      'Up to 3 direction rounds',
      'Source prompt documentation',
    ],
    pricing_tiers: [
      { name: 'Single Artwork', price: '$95', description: '1 final image, 1 style' },
      { name: 'Series (5)', price: '$380', description: '5 cohesive pieces, one brief' },
      { name: 'Brand Package', price: '$950', description: '15+ pieces + style guide' },
    ],
    turnaround: '3–7 business days',
    active: true,
    cta_label: 'Commission Art',
    cta_href: 'mailto:hello@melodyfire.com?subject=AI Art Commission',
  },
  {
    id: '6',
    name: 'Reverse Prompt Engineering',
    tagline: 'Upload an image. Get the prompt architecture that could recreate it.',
    description:
      'The Reverse Prompt Engineer analyzes your reference images and produces a structured prompt set — medium, style, lighting, color, composition, negative — that you can use in any AI image tool to generate similar results. Includes LoRA and workflow recommendations.',
    category: 'reverse_prompt',
    deliverables: [
      'Structured prompt document (5+ components)',
      'Recommended model + LoRA pairings',
      'ComfyUI / A1111 workflow notes',
      'Negative prompt set',
    ],
    pricing_tiers: [
      { name: 'Single Image', price: '$45', description: 'One reference, full prompt breakdown' },
      { name: 'Image Set (5)', price: '$175', description: '5 references with pattern analysis' },
      { name: 'Style Audit', price: '$350', description: 'Full brand style → prompt system' },
    ],
    turnaround: '2–4 business days',
    active: true,
    cta_label: 'Try Reverse Prompt',
    cta_href: '/reverse-prompt',
  },
];

/* ------------------------------------------------------------------ */
/*  Pricing Tier Card                                                    */
/* ------------------------------------------------------------------ */

function PricingTierCard({ tier, index }: { tier: PricingTier; index: number }) {
  const highlights = [
    'bg-violet-600/20 border-violet-500/40',
    'bg-cyan-500/10 border-cyan-500/30',
    'bg-amber-500/10 border-amber-500/30',
  ];
  const textColors = ['text-violet-300', 'text-cyan-300', 'text-amber-300'];

  return (
    <div
      className={`rounded-xl p-5 border ${highlights[index] || 'bg-white/5 border-white/10'} flex flex-col`}
    >
      <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${textColors[index] || 'text-white/50'}`}>
        {tier.name}
      </p>
      <p className="font-display text-2xl font-bold text-white mb-2">{tier.price}</p>
      <p className="text-white/55 text-sm leading-relaxed">{tier.description}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Service Card                                                         */
/* ------------------------------------------------------------------ */

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const isEven = index % 2 === 0;
  const img = CATEGORY_IMAGES[service.category] || aiSectionImg;

  return (
    <div className="sg-card overflow-hidden reveal">
      <div className={`grid md:grid-cols-2 gap-0 ${isEven ? '' : 'md:[direction:rtl]'}`}>
        {/* Image */}
        <div
          className={`relative overflow-hidden ${isEven ? '' : 'md:[direction:ltr]'}`}
          style={{ minHeight: 320 }}
        >
          <img
            src={img}
            alt={service.name}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            style={{ minHeight: 320 }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: isEven
                ? 'linear-gradient(to right, transparent 70%, rgba(15,21,32,0.8))'
                : 'linear-gradient(to left, transparent 70%, rgba(15,21,32,0.8))',
            }}
          />
          {/* Category badge */}
          <div className={`absolute top-4 ${isEven ? 'right-4' : 'left-4'} md:[direction:ltr]`}>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/40 backdrop-blur-sm text-white border border-white/20">
              {service.category.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className={`p-8 md:p-10 flex flex-col justify-center ${isEven ? '' : 'md:[direction:ltr]'}`}>
          <h3 className="font-display text-2xl font-bold text-white mb-2">{service.name}</h3>
          <p className="text-violet-300 text-sm font-medium mb-4">{service.tagline}</p>
          <p className="text-white/60 leading-relaxed mb-6 text-sm">{service.description}</p>

          {/* Deliverables */}
          {service.deliverables?.length > 0 && (
            <div className="mb-6">
              <p className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-3">
                What's Included
              </p>
              <ul className="space-y-1.5">
                {service.deliverables.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/65">
                    <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pricing tiers */}
          {service.pricing_tiers?.length > 0 && (
            <div className="mb-6">
              <p className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-3">
                Pricing
              </p>
              <div className="grid grid-cols-3 gap-3">
                {service.pricing_tiers.map((tier, i) => (
                  <PricingTierCard key={tier.name} tier={tier} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* Turnaround */}
          {service.turnaround && (
            <p className="text-xs text-white/40 mb-5">
              <span className="text-amber-400 font-semibold">Turnaround:</span>{' '}
              {service.turnaround}
            </p>
          )}

          {/* CTA */}
          <a
            href={service.cta_href || 'mailto:hello@melodyfire.com'}
            target={service.cta_href?.startsWith('http') || service.cta_href?.startsWith('mailto') ? '_blank' : undefined}
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.02] self-start"
            style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #f43f5e 100%)' }}
          >
            {service.cta_label || 'Get Started'}
            <span>→</span>
          </a>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Skeleton loader                                                      */
/* ------------------------------------------------------------------ */

function ServiceSkeleton() {
  return (
    <div className="sg-card overflow-hidden">
      <div className="grid md:grid-cols-2 gap-0">
        <Skeleton className="w-full" style={{ minHeight: 320 }} />
        <div className="p-8 md:p-10 space-y-4">
          <Skeleton className="h-7 w-3/4 rounded-lg" />
          <Skeleton className="h-4 w-1/2 rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-4 w-full rounded" />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                            */
/* ------------------------------------------------------------------ */

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('active', true);

        if (error) throw error;

        if (data && data.length > 0) {
          setServices(data as Service[]);
        } else {
          // Use fallback data if DB is empty
          setServices(FALLBACK_SERVICES);
        }
      } catch (err) {
        console.error('Failed to fetch services:', err);
        // Graceful fallback
        setServices(FALLBACK_SERVICES);
        setError(null); // Suppress error — show fallback data
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

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
  }, [loading]);

  return (
    <main className="min-h-screen" style={{ background: 'hsl(var(--background))' }}>
      {/* ---- Hero ---- */}
      <section className="relative pt-28 pb-20 px-6 overflow-hidden">
        {/* Background gradient orbs */}
        <div
          className="absolute top-20 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(244,63,94,0.08) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute top-40 left-10 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        <div className="max-w-4xl mx-auto relative z-10">
          <p className="text-sm font-medium tracking-widest uppercase text-violet-400 mb-4 reveal">
            Jennipher Troup — Creative Technologist
          </p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 reveal delay-100">
            <span className="gradient-text-primary">Services &amp;</span>
            <br />
            <span className="text-white">Offerings</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl leading-relaxed reveal delay-200">
            Built on real practice, governed by the doctrine of regenerative design, joyful
            experimentalism, and systems that operate independently after launch.
          </p>

          {/* Quick-nav pills */}
          <div className="flex flex-wrap gap-3 mt-8 reveal delay-300">
            {['AI Art', 'Prompt Engineering', 'LoRA Training', 'Workshops', 'Children\'s Books'].map(
              (label) => (
                <span
                  key={label}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 text-white/60 border border-white/10"
                >
                  {label}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* ---- Services List ---- */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto space-y-8">
          {loading ? (
            <>
              <ServiceSkeleton />
              <ServiceSkeleton />
              <ServiceSkeleton />
            </>
          ) : error ? (
            <div className="text-center py-20 text-white/50">
              <p className="text-4xl mb-4">⚠️</p>
              <p>{error}</p>
            </div>
          ) : (
            services.map((service, i) => (
              <ServiceCard key={service.id} service={service} index={i} />
            ))
          )}
        </div>
      </section>

      {/* ---- Open Collaboration CTA ---- */}
      <section className="px-6 py-20 holographic-section">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <p className="text-xs font-semibold tracking-widest uppercase text-cyan-400 mb-4 reveal">
            Something Else in Mind?
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4 reveal delay-100">
            Let's build something{' '}
            <span className="prismatic-text">unexpected.</span>
          </h2>
          <p className="text-white/55 leading-relaxed mb-8 max-w-xl mx-auto reveal delay-200">
            If your project doesn't fit a predefined box, that's usually a good sign. Bring your
            half-formed idea, your wild constraint, or your dream outcome — and we'll figure out the
            form together.
          </p>
          <div className="flex flex-wrap gap-4 justify-center reveal delay-300">
            <a
              href="mailto:hello@melodyfire.com?subject=Open Collaboration Inquiry"
              className="px-6 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)' }}
            >
              Start a Conversation
            </a>
            <Link href="/portfolio">
              <span className="px-6 py-3 rounded-xl font-semibold text-white/70 border border-white/20 hover:border-violet-500/50 hover:text-white transition-all cursor-pointer">
                See Past Work
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
