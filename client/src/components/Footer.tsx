import { Link } from 'wouter';
import { Flame, MapPin, Mail, ExternalLink } from 'lucide-react';

const EXPLORE_LINKS = [
  { label: 'Portfolio', href: '/work' },
  { label: 'Generative Art', href: '/art' },
  { label: 'AI Tools', href: '/ai-tools' },
  { label: 'Regenerative Portal', href: '/regenerative' },
  { label: 'Blog', href: '/blog' },
  { label: 'Shop', href: '/shop' },
];

const DISCIPLINES = [
  { label: 'Regenerative Design', href: '/regenerative' },
  { label: 'Generative AI Art', href: '/art' },
  { label: 'Systems Design', href: '/work' },
  { label: 'Web Development', href: '/work' },
  { label: 'Civic Technology', href: '/work' },
];

const SERVICES = [
  { label: 'Design Services', href: '/services' },
  { label: 'AI Art Commissions', href: '/services' },
  { label: "Children's Art", href: '/children-art' },
  { label: 'Reverse Prompt Lab', href: '/reverse-prompt' },
  { label: 'Consulting', href: '/services' },
];

const CONNECT_LINKS = [
  { label: 'hello@melodyfire.studio', href: 'mailto:hello@melodyfire.studio', external: false },
  { label: 'GitHub — qt314wink', href: 'https://github.com/qt314wink', external: true },
  { label: 'Replit — qt314wink', href: 'https://replit.com/@qt314wink', external: true },
  { label: 'Figma', href: 'https://figma.com/@jennipher', external: true },
  { label: 'Instagram', href: 'https://instagram.com', external: true },
  { label: 'Are.na', href: 'https://are.na', external: true },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-[hsl(var(--border))] bg-[hsl(var(--card))]">
      {/* Aurora top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px opacity-60"
        style={{ background: 'var(--gradient-aurora)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="relative w-8 h-8">
                <svg
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8"
                  aria-label="Melodyfire"
                >
                  <defs>
                    <linearGradient id="footer-logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="50%" stopColor="#f43f5e" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M16 2 C16 2, 26 10, 24 18 C22 24, 18 26, 16 30 C14 26, 10 24, 8 18 C6 10, 16 2, 16 2Z"
                    fill="url(#footer-logo-grad)"
                    opacity="0.9"
                  />
                  <path
                    d="M10 22 L10 14 L13.5 19 L16 16 L18.5 19 L22 14 L22 22"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </div>
              <span className="font-display text-xl font-bold gradient-text-fire">Melodyfire</span>
            </Link>

            <p className="text-[hsl(var(--muted-foreground))] text-sm leading-relaxed max-w-xs">
              A unified body of creative and technical work by Jennipher Troup — where generative systems, regenerative
              design, and community imagination converge to build futures that restore rather than deplete.
            </p>

            <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
              <MapPin size={14} className="text-[hsl(var(--secondary))]" />
              <span>Philadelphia, PA</span>
            </div>

            <a
              href="mailto:hello@melodyfire.studio"
              className="inline-flex items-center gap-2 text-sm text-[hsl(var(--accent))] hover:text-[hsl(var(--accent))] transition-colors"
            >
              <Mail size={14} />
              hello@melodyfire.studio
            </a>

            {/* Doctrine mark */}
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[hsl(var(--card))] border border-[hsl(var(--border))]">
              <Flame size={12} className="text-[hsl(var(--secondary))]" />
              <span className="text-xs text-[hsl(var(--primary))] font-medium">Regenerative over Sustainable</span>
            </div>
          </div>

          {/* Explore */}
          <FooterCol title="Explore" links={EXPLORE_LINKS} internal />

          {/* Disciplines */}
          <FooterCol title="Disciplines" links={DISCIPLINES} internal />

          {/* Services & Connect */}
          <div className="space-y-8">
            <FooterCol title="Services" links={SERVICES} internal />
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-4">
                Connect
              </h4>
              <ul className="space-y-2">
                {CONNECT_LINKS.map(({ label, href, external }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center gap-1.5 text-sm text-[hsl(var(--foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                    >
                      {label}
                      {external && <ExternalLink size={10} />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-14 pt-6 border-t border-[hsl(var(--border))] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            © {year} Melodyfire · Jennipher Troup · Philadelphia, PA
          </p>
          <p className="text-xs text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
            Made with{' '}
            <span className="gradient-text-fire font-semibold">fire ✦ light ✦ code</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
  internal = false,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
  internal?: boolean;
}) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-4">
        {title}
      </h4>
      <ul className="space-y-2">
        {links.map(({ label, href }) => (
          <li key={label}>
            {internal ? (
              <Link
                href={href}
                className="text-sm text-[hsl(var(--foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
              >
                {label}
              </Link>
            ) : (
              <a
                href={href}
                className="text-sm text-[hsl(var(--foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
              >
                {label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
