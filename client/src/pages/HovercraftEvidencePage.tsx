import { ArrowDown, ExternalLink, Github, Mail } from 'lucide-react';
import { SectionLink } from '@/components/SectionLink';
import { HovercraftShaderProof } from '@/components/hovercraft/HovercraftShaderProof';
import '@/styles/hovercraft-evidence.css';

const HOVERCRAFT_ROLE_URL = 'https://job-boards.greenhouse.io/hovercraft/jobs/4281732009';

const evidenceCards = [
  {
    title: 'AURELITH / Melodyfire',
    problem: 'Unify a cross-disciplinary creative-technology practice without flattening the work into a generic portfolio.',
    contribution: 'Creative direction, information architecture, visual system, React/TypeScript implementation, and interactive canvas presentation.',
    technology: 'React 18 · Vite · TypeScript · Canvas/WebGL · Vercel',
    status: 'Melodyfire is production. This route is local-only. AURELITH canonical repo/deployment remains unresolved.',
    links: [
      { label: 'Live portfolio', href: 'https://melodyfire.space/#/work' },
      { label: 'Source repository', href: 'https://github.com/MelodicBloom/melodyfire' },
    ],
  },
  {
    title: 'NACRE//OS',
    problem: 'Translate qualitative material language into reusable, governed interface primitives.',
    contribution: 'Defined semantic profiles, a token pipeline, GLSL surface library, React MaterialSurface, documentation atlas, and five governance gates.',
    technology: 'Next.js · React · design tokens · GLSL',
    status: 'Integration-stage public repository. No finished-product or production-deployment claim.',
    links: [
      { label: 'Public repository', href: 'https://github.com/MelodicBloom/nacre-orchid-atelier' },
    ],
  },
  {
    title: 'Observation Ad Pipeline',
    problem: 'Preserve observed creative intent across multi-provider image and video generation workflows.',
    contribution: 'Designed the semantic creative contract, task compiler, provider adapters, motion directives, validation, and immutable run receipts.',
    technology: 'Python · YAML/JSON Schema · ComfyUI/WAN · CI',
    status: 'Integration-stage private repository. Public-safe case evidence and deterministic provider receipts remain gated.',
    links: [
      { label: 'Private repository · access required', href: 'https://github.com/qt314wink/observation-ad-pipeline' },
    ],
  },
];

export default function HovercraftEvidencePage() {
  return (
    <div className="hovercraft-page">
      <section className="hovercraft-hero" aria-labelledby="hovercraft-title">
        <div className="hovercraft-hero-copy">
          <h1 id="hovercraft-title">Creative technology that stays honest under pressure.</h1>
          <p className="hovercraft-lede">
            I build browser-based real-time graphics and creative systems from prototype through QA. This evidence route maps existing work to Hovercraft&apos;s WebGL/GLSL, React/TypeScript, media-pipeline, and delivery needs.
          </p>
          <p className="hovercraft-boundary">
            <strong>Claim boundary:</strong> the strongest proof here is browser creative coding and governed AI media workflows. TouchDesigner, physical computing, hardware integration, and on-site AV are not represented.
          </p>
          <div className="hovercraft-actions">
            <SectionLink className="hovercraft-action hovercraft-action-primary" targetId="live-proof">
              Inspect the live proof <ArrowDown size={17} aria-hidden="true" />
            </SectionLink>
            <a className="hovercraft-action hovercraft-action-secondary" href={HOVERCRAFT_ROLE_URL} target="_blank" rel="noopener noreferrer">
              Read the Hovercraft role <ExternalLink size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
        <aside className="hovercraft-fit" aria-label="Role fit summary">
          <p>Best-evidenced fit</p>
          <ul>
            <li>Realtime WebGL + GLSL systems</li>
            <li>React + TypeScript delivery</li>
            <li>Generative media pipelines</li>
            <li>Source control, QA, and receipts</li>
          </ul>
        </aside>
      </section>

      <section id="live-proof" className="hovercraft-section hovercraft-proof" aria-labelledby="live-proof-title">
        <div className="hovercraft-section-copy">
          <p className="hovercraft-section-index">01 · Live proof</p>
          <h2 id="live-proof-title">A reused spectral field, instrumented for delivery.</h2>
          <p>
            This is the existing Shader Gallery <code>spectral.mid.frag</code> specimen integrated into Melodyfire. The animation loop and transient input stay outside React state; rendering is worker-owned, capped at 1.5 DPR, paused when hidden, and replaced by an existing still when motion or WebGL is unavailable.
          </p>
          <dl className="hovercraft-proof-ledger">
            <div><dt>Source status</dt><dd>Shader Gallery · in development</dd></div>
            <div><dt>Interaction</dt><dd>Pointer · touch · keyboard · idle drift</dd></div>
            <div><dt>Fallback</dt><dd>Reduced motion · no WebGL · load failure</dd></div>
          </dl>
        </div>
        <HovercraftShaderProof />
      </section>

      <section id="evidence" className="hovercraft-section hovercraft-evidence" aria-labelledby="evidence-title">
        <div className="hovercraft-section-heading">
          <p className="hovercraft-section-index">02 · Evidence</p>
          <h2 id="evidence-title">Three projects. Exact boundaries.</h2>
          <p>Every card separates implemented work from open gates; no metrics or deployment claims are inferred.</p>
        </div>
        <div className="hovercraft-card-grid">
          {evidenceCards.map((card, index) => (
            <article className="hovercraft-card" key={card.title}>
              <div className="hovercraft-card-number" aria-hidden="true">0{index + 1}</div>
              <h3>{card.title}</h3>
              <dl>
                <div><dt>Problem</dt><dd>{card.problem}</dd></div>
                <div><dt>Exact contribution</dt><dd>{card.contribution}</dd></div>
                <div><dt>Technology</dt><dd>{card.technology}</dd></div>
                <div><dt>Implementation status</dt><dd>{card.status}</dd></div>
              </dl>
              <div className="hovercraft-card-links" aria-label={`${card.title} evidence links`}>
                {card.links.map((link) => (
                  <a href={link.href} target="_blank" rel="noopener noreferrer" key={link.href}>
                    {link.label} <ExternalLink size={13} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="hovercraft-section hovercraft-contact" aria-labelledby="contact-title">
        <div>
          <p className="hovercraft-section-index">03 · Contact</p>
          <h2 id="contact-title">Useful where design, code, and production constraints meet.</h2>
        </div>
        <div className="hovercraft-contact-links">
          <a href="mailto:jennipher@melodicbloom.com"><Mail size={17} aria-hidden="true" /> Email Jennipher</a>
          <a href="https://github.com/qt314wink" target="_blank" rel="noopener noreferrer"><Github size={17} aria-hidden="true" /> GitHub</a>
          <a href={HOVERCRAFT_ROLE_URL} target="_blank" rel="noopener noreferrer"><ExternalLink size={17} aria-hidden="true" /> Official role</a>
        </div>
      </section>
    </div>
  );
}
