export interface PhotoMetadata {
  caption?: string;
  location?: string;
  date?: string;
  camera?: string;
  lens?: string;
  alt?: string;
}

/**
 * Optional information for individual photographs.
 * Use the exact filename as the key.
 *
 * Example:
 *
 * "photo.jpg": {
 *   alt: "A quiet beach at dusk",
 *   caption: "The last light of the day",
 *   location: "Kovalam, Kerala",
 *   date: "January 2026",
 *   camera: "Pixel 9",
 *   lens: "24mm",
 * },
 */
export const photoMetadata: Record<string, PhotoMetadata> = {
  "1000073758.jpg": {
    alt: "A quiet shoreline beneath a blue evening sky",
  },
  "1000077731.jpg": {
    alt: "Red flowers on a flowering branch against a pale sky",
  },
  "1000082064.jpg": {
    alt: "A blurred railway view photographed from a moving train",
  },
  "1000106874.jpg": {
    alt: "An airplane wing above clouds at sunset",
  },
  "1000114896.jpg": {
    alt: "A glowing airplane window with blue sky outside",
  },
  "PXL_20251017_123150684.LONG_EXPOSURE-01.COVER.jpg": {
    alt: "A long-exposure seascape at sunset with a distant shoreline",
  },
  "PXL_20251017_125834445.RAW-01.COVER.jpg": {
    alt: "A dark coastal night with lights along the distant shore",
  },
  "PXL_20260115_103933473.RAW-02.ORIGINAL.jpg": {
    alt: "A palm tree beside a bright tropical beach",
  },
};
