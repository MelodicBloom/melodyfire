import { useState, useEffect, useRef } from 'react';
import { ShoppingCart, X, Plus, Minus, Download, Heart, CheckCircle2, Gift, ArrowRight, ChevronRight, Sparkles, Package, Star, ShieldCheck, ExternalLink, MessageCircle } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '../components/ui/sheet';

// ---- Image Imports ----
// New Sticker Packs
import botanicaGardenImg from '@assets/img/shop-sticker-botanica-garden.png';
import nightSkyImg from '@assets/img/shop-sticker-night-sky.png';
// Sticker Packs
import cosmicDoodlesImg from '@assets/img/shop-sticker-cosmic-doodles.png';
import cozyDaysImg from '@assets/img/shop-sticker-cozy-days.png';
import retroVibesImg from '@assets/img/shop-sticker-retro-vibes.png';
import kawaiClubImg from '@assets/img/shop-sticker-kawaii-club.png';
// UI Kits
import auroraDashboardImg from '@assets/img/shop-uikit-aurora-dashboard.png';
import minimalMuseImg from '@assets/img/shop-uikit-minimal-muse.png';
import pixelPortalImg from '@assets/img/shop-uikit-pixel-portal.png';
import dreamyMobileImg from '@assets/img/shop-uikit-dreamy-mobile.png';
// Art Prints
import nebulaFlowImg from '@assets/img/shop-print-nebula-flow.png';
import liquidMountainsImg from '@assets/img/shop-print-liquid-mountains.png';
import geometricHarmonyImg from '@assets/img/shop-print-geometric-harmony.png';
import glitchGardenImg from '@assets/img/shop-print-glitch-garden.png';
// Design Tools
import brushLibraryImg from '@assets/img/shop-tool-brush-library.png';
import gradientCollectionImg from '@assets/img/shop-tool-gradient-collection.png';
import iconsMegaImg from '@assets/img/shop-tool-icons-mega.png';
import shapesKitImg from '@assets/img/shop-tool-3d-shapes.png';
import textureVaultImg from '@assets/img/shop-tool-texture-vault.png';

// ---- Types ----
type Category = 'all' | 'sticker_packs' | 'ui_kits' | 'art_prints' | 'resources' | 'bundles' | 'prompt_packs' | 'services';

interface Product {
  id: number;
  name: string;
  price: number;
  compare_at_price?: number;
  description: string;
  badge: string;
  image: string;
  category: Exclude<Category, 'all'>;
  gumroadUrl?: string;
  isService?: boolean;
}

interface CartItem {
  product: Product;
  quantity: number;
}

// ---- Products Data ----
const PRODUCTS: Product[] = [
  // Sticker Packs
  {
    id: 1,
    name: 'Cosmic Doodles',
    price: 9,
    description: '48 hand-drawn cosmic sticker designs: kawaii planets, rocket ships, moons, stars, UFOs, and cosmic mushrooms. PNG + SVG.',
    badge: 'NEW',
    image: cosmicDoodlesImg,
    category: 'sticker_packs',
    gumroadUrl: 'https://gumroad.com/l/cosmic-doodles',
  },
  {
    id: 2,
    name: 'Cozy Days',
    price: 9,
    description: '40 cozy-life stickers: potted plants, steaming mugs, knit sweaters, candles, book stacks, blanket forts, hedgehogs. PNG.',
    badge: 'NEW',
    image: cozyDaysImg,
    category: 'sticker_packs',
    gumroadUrl: 'https://gumroad.com/l/cozy-days',
  },
  {
    id: 3,
    name: 'Retro Vibes',
    price: 9,
    description: '38 retro-futuristic stickers: cassette tapes, CRT TVs, floppy disks, boomboxes, pixel hearts, VHS tapes. 80s/90s aesthetic.',
    badge: 'NEW',
    image: retroVibesImg,
    category: 'sticker_packs',
    gumroadUrl: 'https://gumroad.com/l/retro-vibes',
  },
  {
    id: 4,
    name: 'Kawaii Club',
    price: 9,
    description: '50 ultra-cute kawaii character stickers: bunnies, frogs, strawberries, bears, shiba inus, cats, dumplings, chicks. PNG.',
    badge: 'NEW',
    image: kawaiClubImg,
    category: 'sticker_packs',
    gumroadUrl: 'https://gumroad.com/l/kawaii-club',
  },
  {
    id: 18,
    name: 'Botanica Garden Sticker Pack',
    category: 'sticker_packs',
    description: '48 botanical illustration stickers: succulents, ferns, mushrooms, pressed flowers, berries, seed pods. PNG + SVG. Scientific illustration meets modern kawaii.',
    price: 9,
    badge: 'NEW',
    image: botanicaGardenImg,
    gumroadUrl: 'https://gumroad.com/l/botanica-garden',
  },
  {
    id: 19,
    name: 'Night Sky Dreams Sticker Pack',
    category: 'sticker_packs',
    description: '44 dreamy night sky stickers: sleeping moons, constellations, aurora, lanterns, fireflies, shooting stars, night flowers, telescopes. Midnight blue + gold palette.',
    price: 9,
    badge: 'NEW',
    image: nightSkyImg,
    gumroadUrl: 'https://gumroad.com/l/night-sky-dreams',
  },
  // UI Kits
  {
    id: 5,
    name: 'Aurora Dashboard UI Kit',
    price: 29,
    description: '40+ Figma components for dashboards and data products. Dark/light modes, fluid type scale, aurora gradient system, motion specs.',
    badge: 'Bestseller',
    image: auroraDashboardImg,
    category: 'ui_kits',
    gumroadUrl: 'https://gumroad.com/l/aurora-dashboard',
  },
  {
    id: 6,
    name: 'Minimal Muse UI Kit',
    price: 24,
    description: '25 typographic Figma components. Swiss editorial aesthetic, generous whitespace, serif + sans pairing, single sage accent.',
    badge: '',
    image: minimalMuseImg,
    category: 'ui_kits',
    gumroadUrl: 'https://gumroad.com/l/minimal-muse',
  },
  {
    id: 7,
    name: 'Pixel Portal UI Kit',
    price: 27,
    description: '35 mobile-first cyberpunk components. Neon borders, glowing toggles, sci-fi nav patterns, dark-mode first.',
    badge: 'Popular',
    image: pixelPortalImg,
    category: 'ui_kits',
    gumroadUrl: 'https://gumroad.com/l/pixel-portal',
  },
  {
    id: 8,
    name: 'Dreamy Mobile UI Kit',
    price: 22,
    description: 'iOS + Android Figma kit. Pastel gradients, soft shadows, rounded corners, consumer app-ready components.',
    badge: 'New',
    image: dreamyMobileImg,
    category: 'ui_kits',
    gumroadUrl: 'https://gumroad.com/l/dreamy-mobile',
  },
  // Art Prints
  {
    id: 9,
    name: 'Nebula Flow',
    price: 19,
    description: 'High-resolution cosmic nebula print. Deep sapphire, violet, amber, and magenta plasma clouds. 50×70cm, 300dpi JPEG.',
    badge: 'Limited',
    image: nebulaFlowImg,
    category: 'art_prints',
    gumroadUrl: 'https://gumroad.com/l/nebula-flow',
  },
  {
    id: 10,
    name: 'Liquid Mountains',
    price: 19,
    description: 'Abstract generative landscape. Layered mountain silhouettes rendered as flowing liquid gradients. 50×70cm, PNG.',
    badge: '',
    image: liquidMountainsImg,
    category: 'art_prints',
    gumroadUrl: 'https://gumroad.com/l/liquid-mountains',
  },
  {
    id: 11,
    name: 'Geometric Harmony',
    price: 19,
    description: 'Bauhaus-inspired geometric composition. Terracotta, navy, gold, sage. Bold and balanced. 50×70cm, JPEG.',
    badge: '',
    image: geometricHarmonyImg,
    category: 'art_prints',
    gumroadUrl: 'https://gumroad.com/l/geometric-harmony',
  },
  {
    id: 12,
    name: 'Glitch Garden',
    price: 19,
    description: 'Botanical meets digital corruption. RGB chromatic aberration on lush florals. 50×70cm, PNG.',
    badge: 'Hot',
    image: glitchGardenImg,
    category: 'art_prints',
    gumroadUrl: 'https://gumroad.com/l/glitch-garden',
  },
  // Design Tools
  {
    id: 13,
    name: 'Brush Library',
    price: 18,
    description: '120 Procreate brushes: impasto oils, fine inks, watercolor washes, charcoal textures, gouache strokes. Procreate 5X+.',
    badge: '',
    image: brushLibraryImg,
    category: 'resources',
    gumroadUrl: 'https://gumroad.com/l/brush-library',
  },
  {
    id: 14,
    name: 'Gradient Collection Vol. 2',
    price: 12,
    description: '200 curated gradients. CSS code, Figma styles, and Sketch presets included. Aurora, fire, forest, sunset, ocean palettes.',
    badge: 'New',
    image: gradientCollectionImg,
    category: 'resources',
    gumroadUrl: 'https://gumroad.com/l/gradient-collection-vol2',
  },
  {
    id: 15,
    name: 'Icons Mega Pack',
    price: 22,
    description: '1000+ SVG icons in outline, filled, and color variants. Figma library + React components. UI, social, e-commerce, weather, tech.',
    badge: 'Bestseller',
    image: iconsMegaImg,
    category: 'resources',
    gumroadUrl: 'https://gumroad.com/l/icons-mega-pack',
  },
  {
    id: 16,
    name: '3D Shapes Kit',
    price: 34,
    description: '50 Blender 4.0+ 3D objects: spheres, toruses, gems, pyramids, icosahedrons, capsules. Studio-lit, multiple materials.',
    badge: 'Hot',
    image: shapesKitImg,
    category: 'resources',
    gumroadUrl: 'https://gumroad.com/l/3d-shapes-kit',
  },
  {
    id: 17,
    name: 'Texture Vault',
    price: 16,
    description: '500+ hi-res PNG textures: concrete, marble, leather, linen, brushed metal, wood grain, watercolor paper, crumpled paper, stone.',
    badge: '',
    image: textureVaultImg,
    category: 'resources',
    gumroadUrl: 'https://gumroad.com/l/texture-vault',
  },
];

// ---- Category Config ----
const CATEGORY_CONFIG: Record<Exclude<Category, 'all'>, {
  label: string;
  tagline: string;
  color: string;
  accent: string;
  glow: string;
}> = {
  sticker_packs: {
    label: 'Sticker Packs',
    tagline: 'Hand-drawn magic for your digital world',
    color: '#f43f5e',
    accent: 'from-[#f43f5e] to-[#f59e0b]',
    glow: 'rgba(244,63,94,0.3)',
  },
  ui_kits: {
    label: 'UI Kits',
    tagline: 'Figma-ready components for every vision',
    color: '#7c3aed',
    accent: 'from-[#7c3aed] to-[#06b6d4]',
    glow: 'rgba(124,58,237,0.3)',
  },
  art_prints: {
    label: 'Art Prints',
    tagline: 'Generative art you can print and hang',
    color: '#06b6d4',
    accent: 'from-[#06b6d4] to-[#7c3aed]',
    glow: 'rgba(6,182,212,0.3)',
  },
  resources: {
    label: 'Design Tools',
    tagline: 'Assets and tools to level up your craft',
    color: '#f59e0b',
    accent: 'from-[#f59e0b] to-[#f43f5e]',
    glow: 'rgba(245,158,11,0.3)',
  },
  bundles: {
    label: 'Bundles',
    tagline: 'Everything in one great deal',
    color: '#10b981',
    accent: 'from-[#10b981] to-[#06b6d4]',
    glow: 'rgba(16,185,129,0.3)',
  },
  prompt_packs: {
    label: 'Prompt Packs',
    tagline: 'Level up your AI creative workflow',
    color: '#a78bfa',
    accent: 'from-[#a78bfa] to-[#7c3aed]',
    glow: 'rgba(167,139,250,0.3)',
  },
  services: {
    label: 'Services',
    tagline: 'Custom work, collaboration, and consulting',
    color: '#f43f5e',
    accent: 'from-[#f43f5e] to-[#7c3aed]',
    glow: 'rgba(244,63,94,0.3)',
  },
};

// ---- Badge colors ----
function badgeStyle(badge: string): string {
  switch (badge.toLowerCase()) {
    case 'new': return 'bg-[#7c3aed] text-white';
    case 'bestseller': return 'bg-[#f59e0b] text-black';
    case 'popular': return 'bg-[#06b6d4] text-black';
    case 'hot': return 'bg-[#f43f5e] text-white';
    case 'limited': return 'bg-gradient-to-r from-[#f59e0b] to-[#f43f5e] text-white';
    default: return 'bg-[#7c3aed] text-white';
  }
}

// ---- Deliverables per category ----
const DELIVERABLES: Record<string, string[]> = {
  sticker_packs: [
    'Instant download',
    'PNG + SVG formats',
    'Commercial license',
    'High resolution',
  ],
  ui_kits: [
    'Figma source file',
    'Component documentation',
    'Dark + light modes',
    'Lifetime updates',
  ],
  art_prints: [
    '300dpi print-ready file',
    'JPEG + PNG',
    '50×70cm',
    'Commercial license',
  ],
  resources: [
    'Instant download',
    'Documentation included',
    'Commercial license',
  ],
  bundles: [
    'All included items',
    'Instant download',
    'Commercial license',
    'Save vs individual',
  ],
  prompt_packs: [
    'PDF guide',
    'Workflow files',
    'Templates',
    'Lifetime access',
  ],
  services: [
    'Custom project scope',
    'Direct communication',
    'Revision rounds included',
  ],
};

// ---- Product Detail Modal ----
function ProductDetailModal({ product, onClose }: { product: Product; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const cfg = CATEGORY_CONFIG[product.category as keyof typeof CATEGORY_CONFIG];
  const deliverables = DELIVERABLES[product.category] || DELIVERABLES.resources;
  const gumroadHref = product.gumroadUrl || 'https://gumroad.com/l/melodyfire';
  const isService = product.isService === true;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row"
        style={{
          background: 'hsl(var(--card))',
          border: '1px solid hsl(var(--border))',
          boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
          maxHeight: '90vh',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Image column */}
        <div className="flex-shrink-0 md:w-56 lg:w-64" style={{ aspectRatio: '4/3' }}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            style={{ aspectRatio: '4/3' }}
          />
        </div>

        {/* Content column */}
        <div className="flex flex-col gap-4 p-6 overflow-y-auto flex-1">
          {/* Badge + name */}
          <div className="flex flex-col gap-2">
            {product.badge && (
              <span className={`self-start text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${badgeStyle(product.badge)}`}>
                {product.badge}
              </span>
            )}
            <h2 className="font-display font-black text-xl leading-tight" style={{ color: 'hsl(var(--foreground))' }}>
              {product.name}
            </h2>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span
              className={`font-display font-black text-3xl bg-gradient-to-r ${cfg?.accent || 'from-[#7c3aed] to-[#f43f5e]'} bg-clip-text`}
              style={{ WebkitTextFillColor: 'transparent' }}
            >
              ${product.price}
            </span>
            {product.compare_at_price && (
              <span className="text-sm line-through" style={{ color: 'hsl(var(--muted-foreground))' }}>
                ${product.compare_at_price}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm leading-relaxed" style={{ color: 'hsl(var(--muted-foreground))' }}>
            {product.description}
          </p>

          {/* Deliverables */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'hsl(var(--foreground))' }}>What's included</p>
            <ul className="flex flex-col gap-1.5">
              {deliverables.map((item) => (
                <li key={item} className="flex items-center gap-2 text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-2 mt-auto pt-2">
            {isService ? (
              <a
                href="mailto:hello@melodyfire.studio"
                className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-[#7c3aed] to-[#f43f5e] text-white hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Start a Conversation →
              </a>
            ) : (
              <a
                href={gumroadHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-[#7c3aed] to-[#f43f5e] text-white hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Buy on Gumroad →
              </a>
            )}
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl font-bold text-sm border transition-all"
              style={{ borderColor: 'hsl(var(--border))', color: 'hsl(var(--muted-foreground))' }}
            >
              Close
            </button>
          </div>

          {/* Trust note */}
          <p className="flex items-center justify-center gap-1.5 text-[11px]" style={{ color: 'hsl(var(--muted-foreground))' }}>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            Secure checkout via Gumroad · Instant digital delivery · 30-day refund policy
          </p>
        </div>
      </div>
    </div>
  );
}

// ---- Scroll Reveal Hook ----
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ---- Product Card Component ----
function ProductCard({
  product,
  onAddToCart,
  onOpenDetail,
}: {
  product: Product;
  onAddToCart: (p: Product) => void;
  onOpenDetail: (p: Product) => void;
}) {
  const [added, setAdded] = useState(false);
  const cfg = CATEGORY_CONFIG[product.category as keyof typeof CATEGORY_CONFIG];
  const gumroadHref = product.gumroadUrl || 'https://gumroad.com/l/melodyfire';

  function handleAdd(e: React.MouseEvent) {
    e.stopPropagation();
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div
      className="group relative flex-shrink-0 w-52 rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: 'hsl(var(--card))',
        border: '1px solid hsl(var(--border))',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 0 1.5px rgba(124,58,237,0.55), 0 12px 40px ${cfg?.glow || 'rgba(124,58,237,0.3)'}`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
      }}
    >
      {/* Image — clickable to open detail modal */}
      <div
        className="relative cursor-pointer"
        style={{ aspectRatio: '3/4' }}
        onClick={() => onOpenDetail(product)}
        title={`View ${product.name} details`}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {/* Badge */}
        {product.badge && (
          <span
            className={`absolute top-2 left-2 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${badgeStyle(product.badge)}`}
          >
            {product.badge}
          </span>
        )}
        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-xs font-bold bg-black/60 px-3 py-1 rounded-full">
            View details
          </span>
        </div>
        {/* Gradient overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-2">
        <h3
          className="font-display font-bold text-sm leading-tight text-[hsl(var(--foreground))] group-hover:text-white transition-colors cursor-pointer"
          title={product.name}
          onClick={() => onOpenDetail(product)}
        >
          {product.name}
        </h3>
        <p className="text-[11px] text-[hsl(var(--muted-foreground))] leading-snug line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-1">
          <span
            className={`font-display font-black text-xl bg-gradient-to-r ${cfg?.accent || 'from-[#7c3aed] to-[#f43f5e]'} bg-clip-text`}
            style={{ WebkitTextFillColor: 'transparent' }}
          >
            ${product.price}
          </span>
        </div>
        {/* Buy on Gumroad button */}
        <a
          href={gumroadHref}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#7c3aed] to-[#f43f5e] text-white hover:brightness-110 active:scale-95"
          onClick={(e) => e.stopPropagation()}
        >
          Buy on Gumroad
          <ExternalLink className="w-3 h-3" />
        </a>
        {/* Add to Cart button */}
        <button
          onClick={handleAdd}
          className={`w-full py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 border ${
            added
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              : 'border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-white hover:border-white/30'
          }`}
        >
          {added ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              Added!
            </>
          ) : (
            <>
              Add to Cart
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ---- Shelf Section ----
function ShelfSection({
  categoryKey,
  products,
  onAddToCart,
  onOpenDetail,
}: {
  categoryKey: Exclude<Category, 'all'>;
  products: Product[];
  onAddToCart: (p: Product) => void;
  onOpenDetail: (p: Product) => void;
}) {
  const cfg = CATEGORY_CONFIG[categoryKey];
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollRight() {
    scrollRef.current?.scrollBy({ left: 280, behavior: 'smooth' });
  }

  if (products.length === 0) return null;

  return (
    <section className="py-10 reveal">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section header */}
        <div className="flex items-end justify-between mb-6 gap-4">
          <div className="flex flex-col gap-1">
            <h2
              className="font-display font-black text-3xl md:text-4xl leading-none"
              style={{ color: cfg.color }}
            >
              {cfg.label}
            </h2>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">{cfg.tagline}</p>
          </div>
          <button
            onClick={scrollRight}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-white hover:border-white/30 transition-all duration-200 flex-shrink-0"
          >
            Browse All
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Shelf divider line */}
        <div
          className="h-px w-full mb-6 opacity-40"
          style={{ background: `linear-gradient(to right, ${cfg.color}, transparent)` }}
        />

        {/* Horizontal scroll */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4"
          style={{
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {products.map((p) => (
            <div key={p.id} style={{ scrollSnapAlign: 'start' }}>
              <ProductCard product={p} onAddToCart={onAddToCart} onOpenDetail={onOpenDetail} />
            </div>
          ))}
          {/* End spacer */}
          <div className="flex-shrink-0 w-4" />
        </div>
      </div>
    </section>
  );
}

// ---- Cart Drawer ----
function CartDrawer({
  open,
  onClose,
  items,
  onUpdateQty,
  onRemove,
}: {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
}) {
  const [checkoutClicked, setCheckoutClicked] = useState(false);
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full max-w-sm flex flex-col p-0"
        style={{ background: 'hsl(var(--card))', borderLeft: '1px solid hsl(var(--border))' }}
      >
        <SheetHeader className="px-5 pt-5 pb-4 border-b border-[hsl(var(--border))]">
          <SheetTitle className="font-display text-xl font-black flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-[#7c3aed]" />
            <span className="gradient-text-primary">Your Cart</span>
            {items.length > 0 && (
              <span className="ml-auto text-xs font-bold bg-[#7c3aed] text-white rounded-full px-2 py-0.5">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center">
                <Package className="w-8 h-8 text-[hsl(var(--muted-foreground))]" />
              </div>
              <p className="text-[hsl(var(--muted-foreground))] text-sm">Your cart is empty</p>
              <button
                onClick={onClose}
                className="text-xs font-bold text-[#7c3aed] hover:underline"
              >
                Browse the shop →
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-3 rounded-xl p-3"
                style={{ background: 'hsl(var(--muted)/0.4)' }}
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-sm leading-tight mb-0.5 truncate">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mb-2">
                    ${item.product.price} each
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQty(item.product.id, -1)}
                      className="w-6 h-6 rounded-full bg-[hsl(var(--border))] flex items-center justify-center hover:bg-[#7c3aed]/30 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQty(item.product.id, 1)}
                      className="w-6 h-6 rounded-full bg-[hsl(var(--border))] flex items-center justify-center hover:bg-[#7c3aed]/30 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onRemove(item.product.id)}
                      className="ml-auto text-[hsl(var(--muted-foreground))] hover:text-[#f43f5e] transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <span className="font-bold text-sm gradient-text-primary">
                    ${item.product.price * item.quantity}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-5 border-t border-[hsl(var(--border))] flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[hsl(var(--muted-foreground))]">Subtotal</span>
              <span className="font-display font-black text-2xl gradient-text-primary">${subtotal}</span>
            </div>
            {checkoutClicked ? (
              <div className="rounded-xl p-3 text-center text-sm"
                style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}>
                <Sparkles className="w-4 h-4 text-[#7c3aed] inline mr-1" />
                <span className="text-[hsl(var(--muted-foreground))]">
                  Coming soon — connect <strong className="text-white">Gumroad</strong> or{' '}
                  <strong className="text-white">Stripe</strong>
                </span>
              </div>
            ) : (
              <button
                onClick={() => setCheckoutClicked(true)}
                className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-[#7c3aed] to-[#f43f5e] text-white hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                Checkout
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl font-bold text-sm border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-white hover:border-white/30 transition-all"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

// ---- Newsletter Section ----
function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  }

  return (
    <section className="py-20 reveal">
      <div className="max-w-2xl mx-auto px-4 text-center flex flex-col items-center gap-6">
        <div className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #f43f5e)' }}>
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h2 className="font-display font-black text-3xl md:text-4xl">
          Stay{' '}
          <span className="gradient-text-fire">inspired!</span>
        </h2>
        <p className="text-[hsl(var(--muted-foreground))] text-base leading-relaxed max-w-md">
          New drops, exclusive bundles, and early access to limited prints — straight to your inbox. No spam, ever.
        </p>
        {submitted ? (
          <div
            className="flex items-center gap-3 px-6 py-4 rounded-2xl text-emerald-400 font-bold"
            style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)' }}
          >
            <CheckCircle2 className="w-5 h-5" />
            You're in! Welcome to the Melodyfire circle. ✨
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex gap-2 w-full max-w-md"
          >
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#7c3aed] transition-all"
              style={{
                background: 'hsl(var(--input))',
                border: '1px solid hsl(var(--border))',
                color: 'hsl(var(--foreground))',
              }}
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-[#7c3aed] to-[#f43f5e] text-white hover:brightness-110 active:scale-95 transition-all flex-shrink-0"
            >
              Subscribe
            </button>
          </form>
        )}
        <p className="text-xs text-[hsl(var(--muted-foreground))]">
          Join 2,400+ creators already subscribed
        </p>
      </div>
    </section>
  );
}

// ---- Trust Strip ----
function TrustStrip() {
  const badges = [
    { icon: <Download className="w-4 h-4" />, label: 'Instant Download' },
    { icon: <Heart className="w-4 h-4" />, label: 'Made with Love' },
    { icon: <CheckCircle2 className="w-4 h-4" />, label: 'Commercial License' },
    { icon: <Gift className="w-4 h-4" />, label: 'Bundles & Deals' },
  ];
  return (
    <div
      className="py-5 border-y border-[hsl(var(--border))]"
      style={{ background: 'hsl(var(--muted)/0.3)' }}
    >
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
          {badges.map((b) => (
            <div key={b.label} className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
              <span className="text-[#7c3aed]">{b.icon}</span>
              <span>{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Filter Pill ----
const FILTER_LABELS: { key: Category; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'sticker_packs', label: 'Sticker Packs' },
  { key: 'ui_kits', label: 'UI Kits' },
  { key: 'art_prints', label: 'Art Prints' },
  { key: 'resources', label: 'Design Tools' },
];

// ---- Main Page ----
export function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const filterBarRef = useRef<HTMLDivElement>(null);
  const [filterBarSticky, setFilterBarSticky] = useState(false);

  useReveal();

  // Sticky filter bar on scroll
  useEffect(() => {
    function onScroll() {
      const bar = filterBarRef.current;
      if (!bar) return;
      const rect = bar.getBoundingClientRect();
      setFilterBarSticky(rect.top <= 0);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function addToCart(product: Product) {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }

  function updateQty(id: number, delta: number) {
    setCartItems((prev) =>
      prev
        .map((i) => (i.product.id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  }

  function removeItem(id: number) {
    setCartItems((prev) => prev.filter((i) => i.product.id !== id));
  }

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  // Filter products
  const filteredCategories: Exclude<Category, 'all'>[] =
    activeCategory === 'all'
      ? ['sticker_packs', 'ui_kits', 'art_prints', 'resources']
      : [activeCategory as Exclude<Category, 'all'>];

  const productsByCategory = (cat: Exclude<Category, 'all'>) =>
    PRODUCTS.filter((p) => p.category === cat);

  return (
    <div className="min-h-screen" style={{ background: 'hsl(var(--background))' }}>

      {/* ===== HERO ===== */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        {/* Aurora glow orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
            style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }}
          />
          <div
            className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-15 blur-3xl"
            style={{ background: 'radial-gradient(circle, #f43f5e 0%, transparent 70%)' }}
          />
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-10 blur-3xl"
            style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)' }}
          />
          <div
            className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full opacity-10 blur-3xl"
            style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 text-center flex flex-col items-center gap-6">
          {/* Eyebrow badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em]"
            style={{
              background: 'rgba(124,58,237,0.15)',
              border: '1px solid rgba(124,58,237,0.4)',
              color: '#a78bfa',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed] animate-pulse inline-block" />
            create · inspire · repeat
          </div>

          {/* Title */}
          <h1 className="font-display font-black text-5xl md:text-7xl leading-[0.95] tracking-tight hero-reveal-immediate">
            <span className="text-white">Creative Tools</span>
            <br />
            <span className="gradient-text-fire">for Curious Minds</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-[hsl(var(--muted-foreground))] max-w-xl leading-relaxed hero-reveal-immediate">
            Digital goodies to spark your imagination and level up your creative superpowers.
          </p>

          {/* Trust badges row */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 pt-2">
            {[
              { icon: <Download className="w-4 h-4" />, label: 'Instant Download' },
              { icon: <Heart className="w-4 h-4" />, label: 'Made with Love' },
              { icon: <CheckCircle2 className="w-4 h-4" />, label: 'Commercial License' },
              { icon: <Gift className="w-4 h-4" />, label: 'Bundles & Deals' },
            ].map((b) => (
              <div
                key={b.label}
                className="flex items-center gap-1.5 text-sm text-[hsl(var(--muted-foreground))] px-3 py-1.5 rounded-full"
                style={{ background: 'hsl(var(--muted)/0.5)', border: '1px solid hsl(var(--border)/0.5)' }}
              >
                <span className="text-[#7c3aed]">{b.icon}</span>
                {b.label}
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div className="flex gap-8 pt-2">
            {[
              { num: '19', label: 'Products' },
              { num: '2.4k+', label: 'Customers' },
              { num: '4.9', label: '★ Rating' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display font-black text-2xl gradient-text-primary">{s.num}</div>
                <div className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FILTER BAR ===== */}
      <div
        ref={filterBarRef}
        className={`sticky top-0 z-40 py-3 transition-all duration-300 ${
          filterBarSticky
            ? 'shadow-lg backdrop-blur-lg'
            : ''
        }`}
        style={{
          background: filterBarSticky
            ? 'hsl(var(--background)/0.92)'
            : 'hsl(var(--background)/0.7)',
          borderBottom: '1px solid hsl(var(--border)/0.5)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {FILTER_LABELS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                  activeCategory === key
                    ? 'text-white shadow-lg scale-105'
                    : 'border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-white hover:border-white/30'
                }`}
                style={
                  activeCategory === key
                    ? { background: 'linear-gradient(135deg, #7c3aed, #f43f5e)' }
                    : {}
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===== CATEGORY SHELVES ===== */}
      <div className="py-4">
        {filteredCategories.map((cat, i) => (
          <div
            key={cat}
            className={i > 0 ? 'border-t border-[hsl(var(--border))]' : ''}
          >
            <ShelfSection
              categoryKey={cat}
              products={productsByCategory(cat)}
              onAddToCart={addToCart}
              onOpenDetail={setDetailProduct}
            />
          </div>
        ))}
      </div>

      {/* ===== BUNDLE SPOTLIGHT ===== */}
      <section className="py-16 reveal">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div
            className="relative rounded-3xl overflow-hidden p-8 md:p-12"
            style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.25) 0%, rgba(244,63,94,0.2) 50%, rgba(245,158,11,0.15) 100%)',
              border: '1px solid rgba(124,58,237,0.35)',
              boxShadow: '0 0 60px rgba(124,58,237,0.2)',
            }}
          >
            {/* Background glow blobs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full opacity-25 blur-2xl"
                style={{ background: 'radial-gradient(circle, #f43f5e, transparent 70%)' }} />
              <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full opacity-25 blur-2xl"
                style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }} />
            </div>

            <div className="relative flex flex-col md:flex-row gap-8 items-start md:items-center">
              {/* Left: Info */}
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-2xl">🎉</span>
                  <span
                    className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                    style={{ background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.4)', color: '#f59e0b' }}
                  >
                    Bundle Deal
                  </span>
                  <span
                    className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full"
                    style={{ background: 'linear-gradient(135deg, #f43f5e, #f59e0b)', color: 'white' }}
                  >
                    Save $39
                  </span>
                </div>

                <h2 className="font-display font-black text-3xl md:text-4xl leading-tight">
                  Melodyfire{' '}
                  <span className="gradient-text-fire">Starter Bundle</span>
                </h2>
                <p className="text-[hsl(var(--muted-foreground))] text-sm md:text-base leading-relaxed">
                  Everything you need to ignite your creative practice — all 4 sticker packs plus our bestselling Aurora Dashboard UI Kit.
                </p>

                {/* Included items */}
                <ul className="flex flex-col gap-2">
                  {[
                    'Cosmic Doodles Sticker Pack',
                    'Cozy Days Sticker Pack',
                    'Retro Vibes Sticker Pack',
                    'Kawaii Club Sticker Pack',
                    'Aurora Dashboard UI Kit',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-[hsl(var(--foreground))]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right: Pricing + CTA */}
              <div className="flex flex-col items-center md:items-end gap-4 flex-shrink-0">
                <div className="text-center md:text-right">
                  <div className="flex items-baseline gap-3 justify-center md:justify-end">
                    <span className="font-display font-black text-5xl text-white">$59</span>
                    <div className="flex flex-col items-start">
                      <span className="text-sm text-[hsl(var(--muted-foreground))] line-through">$98</span>
                      <span className="text-xs font-bold text-emerald-400">40% off</span>
                    </div>
                  </div>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">5 products · instant download</p>
                </div>
                <button
                  onClick={() => {
                    // Add all 5 bundle products to cart
                    [1, 2, 3, 4, 5].forEach((id) => {
                      const p = PRODUCTS.find((x) => x.id === id);
                      if (p) addToCart(p);
                    });
                    setCartOpen(true);
                  }}
                  className="px-8 py-4 rounded-2xl font-display font-black text-lg bg-white text-[#7c3aed] hover:bg-white/90 active:scale-95 transition-all flex items-center gap-2 shadow-xl"
                >
                  Get the Bundle
                  <ArrowRight className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]">
                  <Star className="w-3.5 h-3.5 text-[#f59e0b] fill-[#f59e0b]" />
                  <span>4.9/5 from 184 reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST STRIP ===== */}
      <TrustStrip />

      {/* ===== NEWSLETTER ===== */}
      <NewsletterSection />

      {/* ===== FLOATING CART BUTTON ===== */}
      <button
        onClick={() => setCartOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #7c3aed, #f43f5e)',
          boxShadow: '0 4px 24px rgba(124,58,237,0.5)',
        }}
        aria-label="Open cart"
      >
        <ShoppingCart className="w-6 h-6 text-white" />
        {cartCount > 0 && (
          <span
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center text-white"
            style={{ background: '#f43f5e' }}
          >
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        )}
      </button>

      {/* ===== CART DRAWER ===== */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQty={updateQty}
        onRemove={removeItem}
      />

      {/* ===== PRODUCT DETAIL MODAL ===== */}
      {detailProduct && (
        <ProductDetailModal
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
        />
      )}
    </div>
  );
}
