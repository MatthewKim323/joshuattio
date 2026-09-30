// Shared motion tokens for the hero.
export const EASE_UI = [0.33, 1, 0.68, 1] as const;
export const EASE_REVEAL = [0, 0, 0.58, 1] as const;
export const EASE_UI_EXIT = [0.32, 0, 0.67, 0] as const;
export const BLUR_CARD = 2;
export const BLUR_ENTRANCE = 2.5;
export const BLUR_IMAGE = 1;
export const BLUR_REVEAL = 1.5;
export const DUR_ENTRANCE = 0.8;
export const DUR_EXIT = 0.3;
export const DUR_REVEAL = 0.6;
export const DUR_SWITCH = 0.5;
export const STREAM_MS_PER_CHAR = 6;
export const withTempo = (e: number) => 0.85 * e;
