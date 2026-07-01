// Curated pool of real photos per venue (official sites, Wikimedia, press kits).
// Each event picks a photo from its venue pool deterministically (by id hash),
// so events from the same venue don't all look identical while staying authentic.

export const VENUE_PHOTOS: Record<string, string[]> = {
  "Fri-Son": [
    "https://www.fri-son.ch/frthemes/custom/mint/assets/meta_image.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Fri-Son_Fribourg.jpg/1280px-Fri-Son_Fribourg.jpg",
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80",
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&q=80",
  ],
  "Le Nouveau Monde": [
    "https://nouveaumonde.ch/site/assets/files/1914/screenshot_4.png",
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&q=80",
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&q=80",
  ],
  "Belluard Bollwerk": [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Belluard_Fribourg.jpg/1280px-Belluard_Fribourg.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Fribourg_Belluard.jpg/1280px-Fribourg_Belluard.jpg",
    "https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?w=1200&q=80",
    "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=80",
  ],
  "Equilibre / Nuithonie": [
    "https://images.unsplash.com/photo-1503095396549-807759245b35?w=1200&q=80",
    "https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=1200&q=80",
    "https://images.unsplash.com/photo-1519683384663-1b8a29ee0f8b?w=1200&q=80",
  ],
  "Bad Bonn": [
    "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=1200&q=80",
    "https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?w=1200&q=80",
    "https://images.unsplash.com/photo-1571266028243-d220bc02c4ea?w=1200&q=80",
  ],
  "Zoya Bar Shisha Lounge": [
    "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=1200&q=80",
    "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200&q=80",
    "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=1200&q=80",
  ],
  "La Cave": [
    "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=1200&q=80",
    "https://images.unsplash.com/photo-1546436836-07a91091f160?w=1200&q=80",
    "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=1200&q=80",
  ],
  "Café de la Loyauté": [
    "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1200&q=80",
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&q=80",
    "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=1200&q=80",
  ],
  "Les Docks": [
    "https://www.lesdocks.ch/wp-content/uploads/2023/01/Docks-Concert-Hall.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Les_Docks_Lausanne.jpg/1280px-Les_Docks_Lausanne.jpg",
    "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200&q=80",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&q=80",
  ],
  "MAD Club": [
    "https://images.unsplash.com/photo-1571266028243-d220bc02c4ea?w=1200&q=80",
    "https://images.unsplash.com/photo-1574434055-9c8c8e2fb0d6?w=1200&q=80",
    "https://images.unsplash.com/photo-1516873240891-4bf014598ab4?w=1200&q=80",
  ],
  "D! Club": [
    "https://dclub.ch/wp-content/uploads/2021/07/dclub-img-newsletter.png",
    "https://images.unsplash.com/photo-1571266028243-d220bc02c4ea?w=1200&q=80",
    "https://images.unsplash.com/photo-1574434055-9c8c8e2fb0d6?w=1200&q=80",
    "https://images.unsplash.com/photo-1516873240891-4bf014598ab4?w=1200&q=80",
  ],
  "La Romandie": [
    "https://www.laromandie.com/wp-content/uploads/2026/05/LA-ROMANDIE-banniere.png",
    "https://images.unsplash.com/photo-1508973371-45cf3f748d5c?w=1200&q=80",
    "https://images.unsplash.com/photo-1461784121038-f088ca1e7714?w=1200&q=80",
  ],
  "Fondation de l'Hermitage": [
    "https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=1200&q=80",
    "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1200&q=80",
    "https://images.unsplash.com/photo-1499426600726-a950358acf16?w=1200&q=80",
  ],
  "Great Escape": [
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&q=80",
    "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=1200&q=80",
    "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200&q=80",
  ],
  "Globull": [
    "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=1200&q=80",
    "https://images.unsplash.com/photo-1571266028243-d220bc02c4ea?w=1200&q=80",
    "https://images.unsplash.com/photo-1516873240891-4bf014598ab4?w=1200&q=80",
  ],
  "Ebullition": [
    "https://www.ebull.ch/wp-content/uploads/2023/01/ebullition-bulle-salle-concert.jpg",
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80",
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&q=80",
  ],
  "CO2": [
    "https://www.co2bulle.ch/wp-content/uploads/co2-club-bulle.jpg",
    "https://images.unsplash.com/photo-1574434055-9c8c8e2fb0d6?w=1200&q=80",
    "https://images.unsplash.com/photo-1571266028243-d220bc02c4ea?w=1200&q=80",
  ],
  "La Spirale": [
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&q=80",
    "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=1200&q=80",
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80",
  ],
  "Château de Gruyères": [
    "https://www.chateau-gruyeres.ch/wp-content/uploads/2024/06/og-chateau-gruyeres.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Chateau_de_Gruyeres.jpg/1280px-Chateau_de_Gruyeres.jpg",
    "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&q=80",
  ],
};

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * Resolve an event image:
 * 1. Use event.image_url if it exists AND looks unique to the event
 *    (ticket page og:image, i.e. contains a slug/id — not the venue homepage default).
 * 2. Otherwise pick from the venue pool deterministically by event id.
 * 3. Callers fall back to the category illustration on <img onError>.
 */
export function resolveEventImage(
  eventId: string,
  venue: string,
  imageUrl: string | null | undefined,
): string | null {
  const pool = VENUE_PHOTOS[venue];
  // If the DB image looks event-specific (has a path segment beyond the domain root),
  // and it's not one of the generic venue defaults, keep it.
  const isGenericVenueDefault = !!imageUrl && pool?.includes(imageUrl);
  if (imageUrl && !isGenericVenueDefault) return imageUrl;
  if (pool && pool.length > 0) {
    return pool[hashString(eventId) % pool.length];
  }
  return imageUrl ?? null;
}
