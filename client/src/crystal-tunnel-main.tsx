// Standalone fullscreen page for <CrystalTunnel/>. Served at /crystal-tunnel/ with
// COOP/COEP headers (see vercel.json / netlify.toml) so it is crossOriginIsolated and the
// worker shares its control block with the page through a SharedArrayBuffer.
import { StrictMode, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { CrystalTunnel, CrystalQuality, CrystalTunnelStats } from './components/CrystalTunnel';
import './index.css';

function FullscreenDemo() {
  const params = new URLSearchParams(location.search);
  const [quality, setQuality] = useState<CrystalQuality>((params.get('q') as CrystalQuality) || 'auto');
  const [paused, setPaused] = useState(false);
  const [hud, setHud] = useState(params.get('hud') !== '0');
  const [stats, setStats] = useState<CrystalTunnelStats | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ') { e.preventDefault(); setPaused((p) => !p); }
      if (e.key === 'h' || e.key === 'H') setHud((h) => !h);
      if (e.key === 'f' || e.key === 'F') document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="fixed inset-0 bg-black text-white">
      <CrystalTunnel className="absolute inset-0" quality={quality} paused={paused} onStats={setStats} maxDpr={1.5} />
      {hud && (
        <div className="absolute left-4 bottom-4 flex flex-wrap items-center gap-2 text-xs font-mono bg-black/55 backdrop-blur px-3 py-2 rounded-xl border border-white/10">
          <a href="/" className="font-semibold text-white/90 hover:text-white">← Melodyfire</a>
          <span className="text-white/40">|</span>
          <span>Crystal Tunnel v2</span>
          <button onClick={() => setPaused((p) => !p)} className="px-2 py-0.5 rounded border border-white/20 hover:border-white/50">{paused ? 'play' : 'pause'}</button>
          <select value={quality} onChange={(e) => setQuality(e.target.value as CrystalQuality)} className="bg-black/60 border border-white/20 rounded px-1 py-0.5">
            <option value="auto">auto</option><option value="low">low (1×AA)</option><option value="high">high (2×2 AA)</option>
          </select>
          {stats && (
            <span className="text-white/70">
              {stats.time.toFixed(1)}s · {stats.fps.toFixed(0)} fps · scale {stats.scale.toFixed(2)} · {stats.path}{stats.isolated ? ' · isolated' : ''}
            </span>
          )}
          <a href="https://github.com/MelodicBloom/shader-gallery/pull/55" target="_blank" rel="noreferrer" className="underline text-white/70 hover:text-white">source</a>
          <span className="text-white/40">space · h · f</span>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<StrictMode><FullscreenDemo /></StrictMode>);
