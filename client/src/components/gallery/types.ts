export type GalleryMediaKind = 'image' | 'gif' | 'video';

export type GalleryItem = {
  id: string | number;
  title: string;
  /** Short label / series name shown as a chip. */
  label?: string;
  kind: GalleryMediaKind;
  src: string;
  /** Poster frame for video (recommended — avoids a blank tile before metadata loads). */
  poster?: string;
  /** Declared true ratio, e.g. '16/9', '9/16', '3/4'. Defaults to '1/1'. */
  aspectRatio?: string;
  /** 'cover' (default) crops to the cell; 'contain' letterboxes on the card fill. */
  fit?: 'cover' | 'contain';
  alt?: string;
};

/** Column count at one discrete density stop. */
export type DensityStop = number;

/** sm: 1→2→3→4 · md+: 2→3→4→6 (spec). */
export const DENSITY_STOPS_SM: DensityStop[] = [1, 2, 3, 4];
export const DENSITY_STOPS_MD: DensityStop[] = [2, 3, 4, 6];

export const tileLayoutId = (id: GalleryItem['id']) => `gg-media-${id}`;
