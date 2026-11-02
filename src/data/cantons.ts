// Les 26 cantons suisses, positionnés sur leur chef-lieu.
export type Canton = { code: string; name: string; capital: string; lat: number; lng: number };

export const CANTONS: Canton[] = [
  { code: "ZH", name: "Zurich", capital: "Zurich", lat: 47.3769, lng: 8.5417 },
  { code: "BE", name: "Berne", capital: "Berne", lat: 46.948, lng: 7.4474 },
  { code: "LU", name: "Lucerne", capital: "Lucerne", lat: 47.0502, lng: 8.3093 },
  { code: "UR", name: "Uri", capital: "Altdorf", lat: 46.8804, lng: 8.6444 },
  { code: "SZ", name: "Schwytz", capital: "Schwytz", lat: 47.0207, lng: 8.6541 },
  { code: "OW", name: "Obwald", capital: "Sarnen", lat: 46.8961, lng: 8.2457 },
  { code: "NW", name: "Nidwald", capital: "Stans", lat: 46.9579, lng: 8.3658 },
  { code: "GL", name: "Glaris", capital: "Glaris", lat: 47.0404, lng: 9.068 },
  { code: "ZG", name: "Zoug", capital: "Zoug", lat: 47.1662, lng: 8.5155 },
  { code: "FR", name: "Fribourg", capital: "Fribourg", lat: 46.8065, lng: 7.1619 },
  { code: "SO", name: "Soleure", capital: "Soleure", lat: 47.2088, lng: 7.5323 },
  { code: "BS", name: "Bâle-Ville", capital: "Bâle", lat: 47.5596, lng: 7.5886 },
  { code: "BL", name: "Bâle-Campagne", capital: "Liestal", lat: 47.4846, lng: 7.7344 },
  { code: "SH", name: "Schaffhouse", capital: "Schaffhouse", lat: 47.6959, lng: 8.6348 },
  { code: "AR", name: "Appenzell Rhodes-Extérieures", capital: "Herisau", lat: 47.3861, lng: 9.2792 },
  { code: "AI", name: "Appenzell Rhodes-Intérieures", capital: "Appenzell", lat: 47.3316, lng: 9.4093 },
  { code: "SG", name: "Saint-Gall", capital: "Saint-Gall", lat: 47.4245, lng: 9.3767 },
  { code: "GR", name: "Grisons", capital: "Coire", lat: 46.8508, lng: 9.532 },
  { code: "AG", name: "Argovie", capital: "Aarau", lat: 47.3925, lng: 8.0442 },
  { code: "TG", name: "Thurgovie", capital: "Frauenfeld", lat: 47.5536, lng: 8.8987 },
  { code: "TI", name: "Tessin", capital: "Bellinzone", lat: 46.1946, lng: 9.0244 },
  { code: "VD", name: "Vaud", capital: "Lausanne", lat: 46.5197, lng: 6.6323 },
  { code: "VS", name: "Valais", capital: "Sion", lat: 46.2331, lng: 7.3606 },
  { code: "NE", name: "Neuchâtel", capital: "Neuchâtel", lat: 46.9899, lng: 6.9293 },
  { code: "GE", name: "Genève", capital: "Genève", lat: 46.2044, lng: 6.1432 },
  { code: "JU", name: "Jura", capital: "Delémont", lat: 47.3649, lng: 7.3445 },
];

// Rectangle englobant la Suisse (avec une petite marge).
export function isInSwitzerland(p: { lat: number; lng: number }): boolean {
  return p.lat >= 45.8 && p.lat <= 47.85 && p.lng >= 5.9 && p.lng <= 10.55;
}

function km(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371, r = Math.PI / 180;
  const dLat = (b.lat - a.lat) * r, dLng = (b.lng - a.lng) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Canton le plus proche de la position (approximation par chef-lieu).
export function nearestCanton(p: { lat: number; lng: number }): Canton | null {
  if (!isInSwitzerland(p)) return null;
  return CANTONS.reduce((best, c) => (km(p, c) < km(p, best) ? c : best), CANTONS[0]);
}
