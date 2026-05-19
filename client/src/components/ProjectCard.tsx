import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { X, ExternalLink, BookOpen, ArrowRight } from 'lucide-react';

export interface Project {
  title: string;
  category: string;
  tags: string[];
  description: string;
  coverImage: string;
  driveUrl?: string;
  projectUrl?: string;
  featured?: boolean;
}

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export function ProjectCard({ project, className = '' }: ProjectCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  // Lock body scroll when modal open
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [modalOpen]);

  // Close on Escape
  useEffect(() => {
    if (!modalOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [modalOpen]);

  return (
    <>
      <article
        className={`group relative bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl overflow-hidden transition-all duration-500 hover:border-[hsl(var(--border))] hover:shadow-[var(--glow-primary)] ${className}`}
      >
        {/* Cover Image */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--card))] via-transparent to-transparent opacity-80" />

          {/* Featured badge */}
          {project.featured && (
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold text-white"
                style={{ background: 'var(--gradient-fire)' }}>
                Featured
              </span>
            </div>
          )}

          {/* Category */}
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[hsl(var(--background))] backdrop-blur-sm text-[hsl(var(--muted-foreground))] border border-[hsl(var(--border))]">
              {project.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-xs bg-[hsl(var(--card))] text-[hsl(var(--primary))] border border-[hsl(var(--border))]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className="font-display text-lg font-bold text-[hsl(var(--foreground))] leading-tight group-hover:text-[hsl(var(--primary))] transition-colors">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed line-clamp-3">
            {project.description}
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-2 pt-1">
            {project.projectUrl && (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))] transition-colors"
              >
                View Project <ArrowRight size={14} />
              </a>
            )}
            {!project.projectUrl && (
              <button
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))] transition-colors"
                onClick={() => {}}
              >
                View Project <ArrowRight size={14} />
              </button>
            )}

            {project.driveUrl && (
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[hsl(var(--accent))] hover:text-[hsl(var(--accent))] transition-colors ml-auto"
              >
                <BookOpen size={14} /> Open Deck
              </button>
            )}
          </div>
        </div>
      </article>

      {/* Deck Modal */}
      {modalOpen && project.driveUrl && (
        <DeckModal
          title={project.title}
          driveUrl={project.driveUrl}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}

function DeckModal({
  title,
  driveUrl,
  onClose,
}: {
  title: string;
  driveUrl: string;
  onClose: () => void;
}) {
  return (
    <div
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} deck`}
    >
      <div className="modal-content w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[hsl(var(--border))] shrink-0">
          <div>
            <h2 className="font-display text-lg font-bold text-[hsl(var(--foreground))]">{title}</h2>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">Project Deck</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={driveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:text-[hsl(var(--foreground))] hover:border-[hsl(var(--border))] transition-all"
            >
              <ExternalLink size={12} /> Open in Drive
            </a>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-all"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* iframe */}
        <div className="flex-1 overflow-hidden">
          <iframe
            src={driveUrl.replace('/view', '/preview')}
            title={`${title} deck`}
            className="w-full h-full border-0"
            style={{ minHeight: '500px' }}
            allow="autoplay"
          />
        </div>

        {/* Modal footer — reverse prompt CTA */}
        <div className="px-6 py-4 border-t border-[hsl(var(--border))] shrink-0 flex items-center justify-between">
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Inspired by this visual approach?
          </p>
          <Link
            href="/reverse-prompt"
            onClick={onClose}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: 'var(--gradient-aurora)' }}
          >
            ✦ Want to use this visual prompt?
          </Link>
        </div>
      </div>
    </div>
  );
}
