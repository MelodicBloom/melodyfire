import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useTheme } from '../main';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { Menu, Sun, Moon, Flame, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/work' },
  { label: 'Art', href: '/art' },
  { label: 'AI Tools', href: '/ai-tools' },
  { label: 'Regenerative', href: '/regenerative' },
  { label: 'Services', href: '/services' },
  { label: "Children's Art", href: '/children-art' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Shop', href: '/shop' },
];

export function Nav() {
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location]);

  const isActive = (href: string) => {
    if (href === '/') return location === '/';
    return location.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[hsl(var(--background)/0.85)] backdrop-blur-xl border-b border-[hsl(var(--border))] shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="relative w-8 h-8 flex items-center justify-center">
            {/* M-Flame SVG Logo */}
            <svg
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              aria-label="Melodyfire logo"
            >
              <defs>
                <linearGradient id="nav-logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
              {/* Flame body */}
              <path
                d="M16 2 C16 2, 26 10, 24 18 C22 24, 18 26, 16 30 C14 26, 10 24, 8 18 C6 10, 16 2, 16 2Z"
                fill="url(#nav-logo-grad)"
                opacity="0.9"
              />
              {/* M letterform */}
              <path
                d="M10 22 L10 14 L13.5 19 L16 16 L18.5 19 L22 14 L22 22"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              {/* Inner flame */}
              <path
                d="M16 8 C16 8, 20 13, 19 17 C18.5 19, 17 20, 16 22 C15 20, 13.5 19, 13 17 C12 13, 16 8, 16 8Z"
                fill="white"
                opacity="0.25"
              />
            </svg>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-500/20 to-purple-600/20 blur-md group-hover:blur-lg transition-all" />
          </div>
          <span className="font-display text-lg font-bold gradient-text-fire tracking-tight">
            Melodyfire
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(href)
                    ? 'bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))]'
                    : 'text-[hsl(var(--foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--card))]'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Right: theme toggle + CTA */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--card))] transition-all"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <a
            href="mailto:hello@melodyfire.studio"
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-300 relative overflow-hidden group"
            style={{ background: 'var(--gradient-fire)' }}
          >
            <span className="relative z-10">Get in Touch</span>
            <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all" />
          </a>
        </div>

        {/* Mobile: theme + hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--card))] transition-all"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                className="w-9 h-9 rounded-lg flex items-center justify-center text-[hsl(var(--foreground))] hover:bg-[hsl(var(--card))] transition-all"
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-[hsl(var(--background))] border-[hsl(var(--border))] p-0">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-[hsl(var(--border))]">
                  <Link href="/" className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-[hsl(var(--secondary))]" />
                    <span className="font-display font-bold gradient-text-fire">Melodyfire</span>
                  </Link>
                  <button
                    onClick={() => setOpen(false)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Links */}
                <nav className="flex-1 overflow-y-auto px-4 py-6">
                  <ul className="space-y-1">
                    {NAV_LINKS.map(({ label, href }) => (
                      <li key={href}>
                        <Link
                          href={href}
                          className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                            isActive(href)
                              ? 'bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))]'
                              : 'text-[hsl(var(--foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--card))]'
                          }`}
                        >
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* CTA */}
                <div className="px-6 py-5 border-t border-[hsl(var(--border))]">
                  <a
                    href="mailto:hello@melodyfire.studio"
                    className="block w-full px-4 py-3 rounded-xl text-center text-sm font-semibold text-white"
                    style={{ background: 'var(--gradient-fire)' }}
                  >
                    Get in Touch
                  </a>
                  <p className="text-center text-xs text-[hsl(var(--muted-foreground))] mt-3">
                    hello@melodyfire.studio
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
