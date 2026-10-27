# GalleryGrid — shared densify + focus theater (Melodyfire)

Date: 2026-10-27 · Owner: MelodicBloom/melodyfire · Status: approved (Jennipher: fill gaps + implement)

## Intent
One shared gallery runtime for `/#/art` (GenerativeArtPage) and `/kaleidoscope` with pinch densify, focus theater, video-aware tiles, swipe, and full keyboard/ARIA. Scrollytelling case studies are **out of scope** (next).

## Gap fills (best practice for this stack)

| Gap | Choice |
|---|---|
| Motion | **framer-motion** already in package (layoutId / spring). GSAP reserved for scrollytelling later. Prefer transforms (`x`,`y`,`scale`,`filter`) not width/height. |
| Pinch / wheel densify | Add **`@use-gesture/react`** (pinch + wheel). Snap density with spring to discrete column stops. |
| Density stops | `sm`: 1→2→3→4 · `md+`: 2→3→4→6. Continuous scale between stops, spring-snap on release. `+`/`−` buttons + `Ctrl/⌘+wheel`. |
| Void backdrop | When density > base, grid sits on a deep void (`bg` near black / `--background`) with subtle vignette — page chrome stays; tiles reflow denser. |
| 9:16 / mismatched ratio | Cell uses declared `aspectRatio`. Media: **`object-fit: cover`** by default; portraits that need full figure use `fit: 'contain'` + card fill. Widescreen never breaks columns — only crops. Prefer declaring true ratio. |
| Video | `kind: 'image' \| 'gif' \| 'video'`. Grid: muted, loop, playsInline, `preload="metadata"`. Optional `poster`. Focus: same + show mute toggle. First video LCP-adjacent: `fetchpriority` only on first visible tile. |
| Focus theater | Selected tile uses `layoutId` spring to center (~max 86vw × 80vh). Siblings: `scale: 0.9`, `filter: blur(6px)`, `opacity: 0.55`, `pointer-events: none`. Void click / Esc / close → restore; return focus to originating tile. |
| Dialog a11y | Prefer native **`<dialog>`** + `showModal()` where practical; else role=dialog with focus trap. Light dismiss + Esc. `aria-modal`, labelled title. Prevent body scroll while open (`overscroll-behavior` on dialog). |
| Keyboard | Grid: arrows move focus between cells (spatial nav by visual order). Enter/Space → focus theater. Esc → exit. Focus mode: ←/→ cycle items (filtered set), Esc exit. |
| Swipe | Pointer swipe left/right in focus mode cycles items; vertical swipe-down (threshold) exits. |
| Reduced motion | `prefers-reduced-motion: reduce` → instant layout changes, no blur, no tilt. |
| Deps allowed | `@use-gesture/react` (+ peer `@use-gesture/core` if needed). No other new deps unless type packages. |

## Architecture
```
client/src/components/gallery/
  types.ts           # GalleryItem, DensityStop
  GalleryGrid.tsx    # densify shell + grid role
  GalleryTile.tsx    # media + hover
  FocusTheater.tsx   # center lock + sibling treatment
  useGalleryDensity.ts
  useGalleryFocus.ts
  useGalleryKeyboard.ts
  densify.css        # void, density CSS vars (--gg-cols)
docs/gallery/ASSET-GUIDE.md  # sizing/compression notes
```

## Integration
- `GenerativeArtPage`: map ART_ITEMS → GalleryItem[]; keep style tabs + lead form; replace masonry + old lightbox.
- `KaleidoscopePage`: map gif/video items into same grid; drop duplicate lightbox.
- Branch: `feat/gallery-grid-theater` from current `feat/gallery-proof-lead-capture` (stacks on #8) OR from `master` if cleaner — prefer stack on #8 so polish+CRM stay together, open as new PR targeting master (or note stack on #8).
- Do **not** merge #8/#10; leave owner SQL gate.

## Acceptance
1. Pinch / Ctrl+wheel / ± snaps column density with spring.
2. Click tile → center lock; siblings blur+shrink; click void/Esc restores + focus returns.
3. Video tiles play in grid + theater; 16:9 and 9:16 do not break layout.
4. Arrow keys across grid; swipe cycles in theater.
5. `npm run check` (tsc) passes; `test:routes` still green.
6. Reduced-motion path verified via matchMedia.

## Non-goals
Supabase CMS uploads; scrollytelling article template; Storybook (optional later).
