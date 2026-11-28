import { ExternalLink } from 'lucide-react';
import type { ReactNode } from 'react';

/**
 * Three distinct portfolio surfaces. The source ChatGPT Site has not exposed
 * a verified public URL, so we feature it without fabricating an external link.
 * This map does not modify, redirect or collapse its material-state page links.
 */
const MATERIAL_STUDIES_URL = 'https://melodic-bloom-material-studies.qt-314wink.chatgpt.site/';
const GALLERY_URL = 'https://melodicbloom.github.io/shader-gallery/docs/';
const GALLERY_SOURCE = 'https://github.com/MelodicBloom/shader-gallery';
const ABALONE_SOURCE = 'https://github.com/MelodicBloom/shader-gallery/tree/main/portfolio-runtime';

function ExternalAction({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-violet-400/30 px-3 py-2 text-sm font-semibold text-violet-200 hover:bg-violet-400/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300">
      {children}<ExternalLink size={14} aria-hidden="true" />
    </a>
  );
}

export function MaterialProjectMap() {
  return (
    <section id="material-project-map" aria-labelledby="material-project-map-title" className="px-6 pb-16">
      <div className="max-w-6xl mx-auto">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-violet-300">Featured visual systems</p>
        <h2 id="material-project-map-title" className="font-display text-2xl md:text-3xl font-bold text-white">
          Materials that respond <span className="text-white/40 font-normal">/ implementation map</span>
        </h2>
        <p className="mt-3 mb-7 max-w-3xl text-white/60 leading-relaxed">
          From interactive material-state design to runnable WebGL specimens and inspectable implementation evidence.
          These are connected parts of the same research direction, not interchangeable deployment claims.
        </p>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <li className="rounded-2xl border border-violet-400/30 bg-violet-400/5 p-6">
            <p className="mb-3 text-xs uppercase tracking-widest text-violet-300">01 · Interactive design site</p>
            <h3 className="font-display text-xl font-semibold text-white">Melodic Bloom — Materials that respond</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/65">
              Explore three interactive studies in implicit geometry, repetition, and spectral light.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <ExternalAction href={MATERIAL_STUDIES_URL}>Open studies</ExternalAction>
              <ExternalAction href={MATERIAL_STUDIES_URL + '?work=porous'}>Porous</ExternalAction>
              <ExternalAction href={MATERIAL_STUDIES_URL + '?work=fold'}>Fold</ExternalAction>
              <ExternalAction href={MATERIAL_STUDIES_URL + '?work=spectral'}>Spectral</ExternalAction>
            </div>
          </li>
          <li className="rounded-2xl border border-cyan-400/30 bg-cyan-400/5 p-6">
            <p className="mb-3 text-xs uppercase tracking-widest text-cyan-300">02 · WebGL gallery</p>
            <h3 className="font-display text-xl font-semibold text-white">Shader Gallery</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/65">
              Browser-based WebGL/GLSL shader and optical-material studies, including abalone and other procedural surfaces.
              The public gallery is a demonstrable implementation surface, not proof of physical calibration.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <ExternalAction href={GALLERY_URL}>Open gallery</ExternalAction>
              <ExternalAction href={GALLERY_SOURCE}>Source</ExternalAction>
            </div>
          </li>
          <li className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-6">
            <p className="mb-3 text-xs uppercase tracking-widest text-amber-300">03 · Stateful WebGL specimen</p>
            <h3 className="font-display text-xl font-semibold text-white">Abalone material runtime</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/65">
              Source-backed WebGL2 specimen with bounded uniforms, camera and light controls,
              versioned state presets, input handling and fallback behavior. Publication is a separate gate.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <ExternalAction href={ABALONE_SOURCE}>Inspect source</ExternalAction>
            </div>
          </li>
        </ol>
        <p className="mt-4 text-xs text-white/45">
          The Abalone specimen links to its implementation source. Cross-device renderer acceptance is pending.
        </p>
      </div>
    </section>
  );
}
