import { useEffect, useState } from 'react';
import { supabase, getSessionId } from '@/lib/supabase';
import solarGrimoireImg from '@assets/img/mf-solar-grimoire.png';
import processImg from '@assets/img/process.png';
import restoryingImg from '@assets/img/restorying.png';

// ── Scroll-reveal hook ─────────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('revealed'); } }),
      { threshold: 0.12 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ── Data ───────────────────────────────────────────────────────────────────
const PRINCIPLES = [
  { icon: '🌱', title: 'Regenerate Soil', body: 'Every system improves its environment. Every output becomes input for the next cycle of growth.' },
  { icon: '☀️', title: 'Capture & Store Energy', body: 'Design for abundance, not scarcity. Build capacities and capabilities, not dependencies.' },
  { icon: '🌿', title: 'Cultivate Biodiversity', body: 'Monocultures fail under pressure. Diverse, redundant, interconnected systems are resilient.' },
  { icon: '⬡', title: 'Integrate Rather Than Segregate', body: 'The relationship between elements is as important as the elements themselves. Context is everything.' },
  { icon: '🤝', title: 'Strengthen Relationships', body: 'Power flows through connections. Design for connection first — tools, tactics, and tech follow.' },
  { icon: '🏙', title: 'Empower Community Ownership', body: 'The most sustainable system is one the community owns, maintains, and evolves on its own terms.' },
];

const PROJECTS = [
  { title: 'Beats & Boxes', desc: 'Civic imagination + urban systems design — reimagining community infrastructure through sound and space.', link: null },
  { title: 'Restorying Framework', desc: 'Narrative healing for communities — a structured approach to collective sense-making and transformation.', link: null },
  { title: 'Philly Gig Dashboard', desc: 'Civic tech for gig workers — transparent data, shared power, community-owned tools.', link: null },
  { title: 'Regenerative Design Workshop', desc: 'Participatory practice sessions exploring permaculture principles applied to digital and community systems.', link: '/#/services' },
  { title: 'Prison & Justice Regeneration Initiative', desc: 'Systems-level design for restorative justice — from inside-out to structural transformation.', link: 'https://drive.google.com' },
];

const RESOURCES = [
  {
    title: "From Shelters to Systems: A Student's Primer on Regenerative Design",
    desc: "An accessible introduction to regenerative design principles for students and practitioners new to ecological systems thinking.",
    link: "https://docs.google.com/document/d/1iR4SEWKya06cwczvZS4XL0zBe1hgiwfv/edit",
  },
  {
    title: "Spec-Driven Development for Regenerative Systems",
    desc: "How specification-first development practices align with regenerative values — clarity, accountability, and iterative improvement.",
    link: "https://docs.google.com/document/d/1azGqii-jmQbEL6imMRJ-daXx6qIWsVrYAIoDic80aw0/edit",
  },
  {
    title: "The Regenerative Webseries",
    desc: "A multi-part exploration of regenerative principles in practice — community conversations, case studies, and live experiments.",
    link: "https://docs.google.com/document/d/1Z99zGdfw-RNQQ_W2H0uqSl4bo-MDZjhuWiurPcm4k0Y/edit",
  },
];

const ECOSYSTEM_NODES = [
  { label: 'Regenerative Design', caption: 'Permaculture ethics applied to digital, civic, and narrative systems.', x: 20, y: 18 },
  { label: 'Narrative Systems', caption: 'Stories as infrastructure — how meaning shapes possibility.', x: 70, y: 12 },
  { label: 'Generative AI', caption: 'AI as creative partner in service of regenerative goals.', x: 85, y: 50 },
  { label: 'Community', caption: 'The human web — trust, care, and collective action.', x: 60, y: 80 },
  { label: 'Code', caption: 'Craft as practice — writing systems that serve living ends.', x: 20, y: 75 },
  { label: 'Pattern', caption: 'The recurring forms that connect all living systems.', x: 45, y: 45 },
];

// ── Component ──────────────────────────────────────────────────────────────
export default function RegenerativePage() {
  useScrollReveal();
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setEmailLoading(true);
    const sessionId = getSessionId();
    await supabase.from('inquiries').insert({
      session_id: sessionId,
      type: 'regenerative_join',
      email,
      created_at: new Date().toISOString(),
    });
    setEmailLoading(false);
    setEmailSent(true);
    setEmail('');
  };

  return (
    <div style={{ background: 'var(--sg-bg)', color: 'var(--sg-text)', minHeight: '100vh' }}>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="solarpunk-section texture-grain" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative' }}>
        {/* Background image */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `url(${solarGrimoireImg})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.55,
        }} />
        {/* Gold vignette overlay */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, var(--sg-bg) 80%)',
        }} />
        <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 900, margin: '0 auto', padding: '120px 24px 80px' }}>
          {/* Eyebrow */}
          <p className="reveal" style={{
            color: 'var(--sg-gold)', fontSize: '0.8rem', fontWeight: 700,
            letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 20,
          }}>
            ✦ The Regenerative Ideas Portal
          </p>
          {/* H1 */}
          <h1 className="font-display reveal delay-100" style={{
            fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 800,
            lineHeight: 1.05, marginBottom: 24,
          }}>
            <span className="sg-gradient-text">Systems that</span><br />
            <span style={{ color: 'var(--sg-text)' }}>Restore</span>
          </h1>
          <p className="reveal delay-200" style={{
            fontSize: '1.35rem', color: 'var(--sg-gold)', fontStyle: 'italic',
            marginBottom: 28, opacity: 0.9,
          }}>
            Designing in service to Life
          </p>
          <p className="reveal delay-300" style={{
            fontSize: '1.05rem', color: 'var(--sg-text-muted)', maxWidth: 640,
            lineHeight: 1.75, marginBottom: 48,
          }}>
            A living inquiry into how design, code, and community can move beyond sustainability
            into active regeneration — drawing from solarpunk practice, civic imagination,
            and ecological intelligence.
          </p>
          {/* CTAs */}
          <div className="reveal delay-400" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <a href="#systems-map" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'linear-gradient(135deg, var(--sg-gold) 0%, #e8cc7a 100%)',
              color: '#0a0e1a', padding: '14px 32px', borderRadius: 8,
              fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--glow-gold)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}
            >
              Enter the Portal →
            </a>
            <a href="#doctrine" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              border: '1.5px solid var(--sg-gold)', color: 'var(--sg-gold)',
              padding: '14px 32px', borderRadius: 8,
              fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none',
              transition: 'background 0.2s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.08)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              The Doctrine
            </a>
          </div>
        </div>

        {/* Torn edge */}
        <div className="torn-edge" style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 40, background: 'var(--sg-bg)', zIndex: 3,
        }} />
      </section>

      {/* ── SYSTEMS MAP ──────────────────────────────────────────────── */}
      <section id="systems-map" className="solarpunk-section" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ color: 'var(--sg-gold)', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>
              ⬡ Systems Thinking
            </p>
            <h2 className="font-display sg-gradient-text" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800 }}>
              The Recursive Ecosystem
            </h2>
          </div>

          {/* Sacred geometry map */}
          <div className="reveal delay-200" style={{ position: 'relative', borderRadius: 16, overflow: 'hidden' }}>
            <img src={processImg} alt="Regenerative Systems Map" style={{ width: '100%', display: 'block', opacity: 0.7 }} />
            {/* Gold overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(135deg, rgba(201,168,76,0.12) 0%, rgba(45,90,61,0.1) 50%, rgba(201,168,76,0.08) 100%)',
            }} />
            {/* Node labels */}
            {ECOSYSTEM_NODES.map((node) => (
              <div key={node.label} style={{
                position: 'absolute',
                left: `${node.x}%`, top: `${node.y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 2,
              }}>
                <div className="sg-card imperfect-border" style={{
                  padding: '8px 14px', background: 'rgba(10,14,26,0.88)',
                  borderColor: 'rgba(201,168,76,0.5)',
                  cursor: 'default', maxWidth: 160,
                }}>
                  <div style={{ color: 'var(--sg-gold)', fontSize: '0.7rem', fontWeight: 700, marginBottom: 2 }}>
                    {node.label}
                  </div>
                  <div style={{ color: 'var(--sg-text-muted)', fontSize: '0.62rem', lineHeight: 1.4 }}>
                    {node.caption}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6 REGENERATIVE PRINCIPLES ────────────────────────────────── */}
      <section id="doctrine" className="solarpunk-section" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ color: 'var(--sg-gold)', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>
              ✦ The Doctrine
            </p>
            <h2 className="font-display sg-gradient-text" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 800 }}>
              Six Regenerative Principles
            </h2>
            <p style={{ color: 'var(--sg-text-muted)', marginTop: 16, maxWidth: 560, margin: '16px auto 0' }}>
              Drawn from permaculture ethics and adapted for systems design, civic tech, and community practice.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {PRINCIPLES.map((p, i) => (
              <div
                key={p.title}
                className={`sg-card reveal delay-${(i % 3 + 1) * 100}`}
                style={{ padding: '28px 24px' }}
              >
                <div style={{
                  fontSize: '2rem', marginBottom: 16,
                  filter: 'drop-shadow(0 0 8px rgba(201,168,76,0.4))',
                }}>
                  {p.icon}
                </div>
                <h3 className="font-display" style={{
                  color: 'var(--sg-gold)', fontSize: '1.05rem',
                  fontWeight: 700, marginBottom: 10,
                }}>
                  {p.title}
                </h3>
                <p style={{ color: 'var(--sg-text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KEY PROJECTS ─────────────────────────────────────────────── */}
      <section className="solarpunk-section" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div className="reveal" style={{ marginBottom: 44 }}>
            <p style={{ color: 'var(--sg-gold)', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>
              ⬡ Active Work
            </p>
            <h2 className="font-display sg-gradient-text" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 800 }}>
              Key Projects in the Regenerative Sphere
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {PROJECTS.map((proj, i) => (
              <div
                key={proj.title}
                className={`sg-card reveal delay-${(i + 1) * 100}`}
                style={{ padding: '22px 28px', display: 'flex', alignItems: 'flex-start', gap: 20 }}
              >
                {/* Gold bullet */}
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: 'var(--sg-gold)', flexShrink: 0, marginTop: 6,
                  boxShadow: '0 0 8px rgba(201,168,76,0.5)',
                }} />
                <div style={{ flex: 1 }}>
                  <h3 className="font-display" style={{ color: 'var(--sg-text)', fontWeight: 700, fontSize: '1rem', marginBottom: 6 }}>
                    {proj.title}
                  </h3>
                  <p style={{ color: 'var(--sg-text-muted)', fontSize: '0.88rem', lineHeight: 1.65 }}>
                    {proj.desc}
                  </p>
                </div>
                {proj.link && (
                  <a
                    href={proj.link}
                    target={proj.link.startsWith('http') ? '_blank' : '_self'}
                    rel="noreferrer"
                    style={{
                      color: 'var(--sg-gold)', fontSize: '0.8rem', fontWeight: 600,
                      textDecoration: 'none', flexShrink: 0, marginTop: 2,
                      border: '1px solid rgba(201,168,76,0.3)', padding: '4px 12px',
                      borderRadius: 6, transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.1)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    View →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESTORYING IMAGE INTERLUDE ────────────────────────────────── */}
      <section className="solarpunk-section" style={{ padding: '40px 0' }}>
        <div style={{ position: 'relative', maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <div className="reveal" style={{ borderRadius: 16, overflow: 'hidden', position: 'relative' }}>
            <img src={restoryingImg} alt="Restorying — narrative healing" style={{ width: '100%', display: 'block', opacity: 0.6 }} />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to right, rgba(10,14,26,0.7) 0%, transparent 40%, rgba(10,14,26,0.7) 100%)',
              display: 'flex', alignItems: 'center', padding: '0 48px',
            }}>
              <div>
                <p style={{ color: 'var(--sg-gold)', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 10 }}>
                  Narrative Systems
                </p>
                <h3 className="font-display" style={{ color: 'var(--sg-text)', fontSize: '1.8rem', fontWeight: 700, maxWidth: 360 }}>
                  Stories are the roots of systems change
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── READING & RESOURCES ───────────────────────────────────────── */}
      <section className="solarpunk-section" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ color: 'var(--sg-gold)', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>
              ✦ The Library
            </p>
            <h2 className="font-display sg-gradient-text" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 800 }}>
              Reading &amp; Resources
            </h2>
            <p style={{ color: 'var(--sg-text-muted)', marginTop: 16 }}>
              Documents, primers, and explorations from the regenerative practice.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {RESOURCES.map((r, i) => (
              <div key={r.title} className={`sg-card reveal delay-${(i + 1) * 100}`} style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Gold top line already via .sg-card::before */}
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem',
                }}>
                  📄
                </div>
                <h3 className="font-display" style={{ color: 'var(--sg-text)', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.4 }}>
                  {r.title}
                </h3>
                <p style={{ color: 'var(--sg-text-muted)', fontSize: '0.85rem', lineHeight: 1.65, flex: 1 }}>
                  {r.desc}
                </p>
                <a
                  href={r.link}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: 'linear-gradient(135deg, var(--sg-gold) 0%, #e8cc7a 100%)',
                    color: '#0a0e1a', padding: '10px 20px', borderRadius: 6,
                    fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none',
                    width: 'fit-content', transition: 'transform 0.2s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; }}
                >
                  Open Document →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLARPUNK GRIMOIRE DECK PREVIEW ───────────────────────────── */}
      <section className="solarpunk-section" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div className="sg-card reveal" style={{ overflow: 'hidden', position: 'relative' }}>
            {/* Background image */}
            <img
              src={solarGrimoireImg}
              alt="The Solarpunk Grimoire"
              style={{ width: '100%', display: 'block', opacity: 0.4, maxHeight: 420, objectFit: 'cover' }}
            />
            {/* Overlay content */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(10,14,26,0.95) 0%, rgba(10,14,26,0.6) 50%, transparent 100%)',
              display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
              padding: '40px 40px',
            }}>
              <p style={{ color: 'var(--sg-gold)', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 10 }}>
                ✦ Visual Language System
              </p>
              <h2 className="font-display sg-gradient-text" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 800, marginBottom: 12 }}>
                The Solarpunk Grimoire
              </h2>
              <p style={{ color: 'var(--sg-text-muted)', maxWidth: 540, marginBottom: 28, lineHeight: 1.65 }}>
                A visual language for regenerative futures — a slide deck of iconography, color systems,
                and design patterns drawn from solarpunk aesthetics and ecological imagination.
              </p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <a
                  href="https://docs.google.com/presentation/d/1PRtvsqOxgrAv8DTGFy6xeX7G9J1W0onZ/edit"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: 'linear-gradient(135deg, var(--sg-gold) 0%, #e8cc7a 100%)',
                    color: '#0a0e1a', padding: '13px 28px', borderRadius: 8,
                    fontWeight: 700, fontSize: '0.92rem', textDecoration: 'none',
                  }}
                >
                  View Deck →
                </a>
                <a
                  href="/#/reverse-prompt"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    border: '1.5px solid var(--sg-gold)', color: 'var(--sg-gold)',
                    padding: '13px 28px', borderRadius: 8,
                    fontWeight: 600, fontSize: '0.92rem', textDecoration: 'none',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.08)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  Want to use this visual prompt?
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── END CTA — JOIN THE PRACTICE ──────────────────────────────── */}
      <section className="solarpunk-section" style={{ padding: '100px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <p className="reveal" style={{ color: 'var(--sg-gold)', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>
            ✦ Community
          </p>
          <h2 className="font-display sg-gradient-text reveal delay-100" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: 16 }}>
            Join the Practice
          </h2>
          <p className="reveal delay-200" style={{ color: 'var(--sg-text-muted)', lineHeight: 1.7, marginBottom: 40 }}>
            Stay connected with regenerative design practice, workshops, reading circles,
            and civic imagination experiments.
          </p>

          {emailSent ? (
            <div className="sg-card reveal" style={{ padding: '24px', textAlign: 'center' }}>
              <p style={{ color: 'var(--sg-gold)', fontWeight: 700, fontSize: '1.05rem' }}>
                ✦ You're in the network. Welcome.
              </p>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="reveal delay-300" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{
                  flex: '1 1 260px', padding: '13px 20px',
                  background: 'rgba(201,168,76,0.07)',
                  border: '1.5px solid rgba(201,168,76,0.3)',
                  borderRadius: 8, color: 'var(--sg-text)',
                  fontSize: '0.95rem', outline: 'none',
                }}
              />
              <button
                type="submit"
                disabled={emailLoading}
                style={{
                  background: 'linear-gradient(135deg, var(--sg-gold) 0%, #e8cc7a 100%)',
                  color: '#0a0e1a', padding: '13px 28px', borderRadius: 8,
                  fontWeight: 700, fontSize: '0.92rem', border: 'none', cursor: 'pointer',
                }}
              >
                {emailLoading ? '…' : 'Join →'}
              </button>
            </form>
          )}

          <div className="reveal delay-400" style={{ marginTop: 28 }}>
            <a
              href="/#/services"
              style={{
                color: 'var(--sg-gold)', fontWeight: 600, fontSize: '0.9rem',
                textDecoration: 'underline', textUnderlineOffset: 4,
              }}
            >
              Book a Workshop →
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
