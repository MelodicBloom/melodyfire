# Gallery asset guide (GalleryGrid)

Applies to `/art` (GenerativeArtPage) and `/kaleidoscope` — both render `client/src/components/gallery/GalleryGrid`.

## Declare every item
```ts
{ id, title, label, kind: 'image' | 'gif' | 'video', src, poster?, aspectRatio: '16/9', fit?: 'cover' | 'contain' }
```
- **`aspectRatio` = the file's true ratio** (`w/h`, reduced). Check it with
  `ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 file.mp4`
  (works for images/gifs too). The cell reserves that box before load (no layout shift); a wrong ratio crops.
- **`fit`** defaults to `cover` (crops to cell). Use `contain` for portraits where the full figure matters — it letterboxes on the card fill. The theater always shows `contain`.
- 16:9, 9:16, 5/11 etc. never break the grid — CSS grid columns are fixed (`--gg-cols`); only row heights vary.

## Images
| | Target |
|---|---|
| Long edge | ≤ **2400 px** (theater max is 86vw × 80vh; 2400 covers 2× DPR on most laptops) |
| Format | **AVIF** or **WebP** (q≈75–80); JPEG q≈82 fallback; PNG only for flat-colour/alpha art |
| Weight | aim ≤ **400 KB**, hard cap ~1 MB |
| Tooling | `npx @squoosh/cli --webp '{quality:78}' --resize '{width:2400}' in.png` or `cwebp -q 78 -resize 2400 0` |

## GIFs
GIFs are huge per second of motion. Anything > ~1 MB should become a **video** (`kind: 'video'`): typically 5–20× smaller at better quality.
`ffmpeg -i in.gif -movflags +faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -crf 26 out.mp4`

## Video (grid autoplays muted, loop, playsInline, `preload="metadata"`)
| | Target |
|---|---|
| Resolution | ≤ **1080p** long edge (grid tiles rarely exceed 700 px; 720p is usually enough) |
| Length | 4–15 s seamless loop |
| Weight | ≤ **8 MB** each (grid can show 6+ at once) |
| Audio | strip it unless the theater needs sound (`-an`) |
| Codec | **H.264 MP4** (universal) — optionally add a VP9/AV1 **WebM** later |

```bash
# H.264, web-optimised, no audio, ≤1080 long edge
ffmpeg -i in.mov -an -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p \
  -vf "scale='min(1080,iw)':-2" -movflags +faststart out.mp4
# VP9 WebM (smaller, Chrome/Firefox/Edge/Safari 16+)
ffmpeg -i in.mov -an -c:v libvpx-vp9 -b:v 0 -crf 34 -row-mt 1 out.webm
```
`+faststart` moves the moov atom to the front so `preload="metadata"` gets dimensions/first frame fast.

### Poster (strongly recommended)
Without a poster a video tile is blank until metadata loads, and users with **reduced motion** see only the poster.
```bash
ffmpeg -ss 1 -i out.mp4 -frames:v 1 -vf "scale='min(1080,iw)':-2" -q:v 3 poster.jpg   # then convert to webp
```
Set `poster` on the item.

## Current repo state (2026-10-27)
- `kaleidoscope-3..6.mp4` are 640×1408 but **8–43 MB** each (k6 = 43 MB) — re-encode with the H.264 command above (CRF 26–28) and add posters. Not done in this PR.
- Kaleidoscope GIFs/videos are 320×704 / 640×1408 → declared `aspectRatio: '5/11'`.

## Behaviour reference
- Density: pinch, Ctrl/⌘ + wheel, or − / + buttons. Stops sm 1→2→3→4, md+ 2→3→4→6; void backdrop past the base stop.
- Focus theater: native `<dialog>` (Esc, light-dismiss on the void, focus returns to the tile); ←/→ or swipe to cycle, swipe ↓ to exit.
- `prefers-reduced-motion: reduce`: no springs/blur/tilt, videos don't autoplay.
