// Hero background video.
//
// Until a video is added, the hero draws its animated "signals from the noise"
// backdrop in code (HeroBackdrop.tsx), which costs no download.
//
// To switch to a video: put the files in public/hero/ and fill in the paths, e.g.
//   export const HERO_VIDEO: HeroVideo | null = {
//     desktop: { mp4: '/hero/hero-1080.mp4', webm: '/hero/hero-1080.webm' },
//     mobile:  { mp4: '/hero/hero-720x1280.mp4' },
//     poster:  '/hero/hero-poster.webp',
//   };
// The video only loads after the page is interactive, and is skipped when the visitor
// has Data Saver or "reduce motion" turned on (they keep the animated backdrop).

export interface HeroVideoSource {
  mp4: string;
  webm?: string;
}

export interface HeroVideo {
  desktop: HeroVideoSource;
  mobile?: HeroVideoSource;
  poster?: string;
}

// "Coin to light": a rupee coin shatters into gold and lavender particles that sweep into a
// ribbon of light (a seamless 5-second loop cut from the second half of the generated clip).
// The video's black blends into the hero background, so only the particles show.
// Its gold and lavender particles predate the Ink + Cobalt palette and would hide the hero
// "threads", so it is switched off. Set this to true to bring it back on desktop.
export const HERO_VIDEO_ENABLED = false;

export const HERO_VIDEO: HeroVideo | null = {
  desktop: { mp4: '/hero/hero-1600.mp4', webm: '/hero/hero-1600.webm' },
  mobile: { mp4: '/hero/hero-portrait.mp4', webm: '/hero/hero-portrait.webm' },
};
