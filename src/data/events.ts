import club from "@/assets/event-club.jpg";
import bar from "@/assets/event-bar.jpg";
import concert from "@/assets/event-concert.jpg";
import culture from "@/assets/event-culture.jpg";
import sport from "@/assets/event-sport.jpg";
import afterwork from "@/assets/event-afterwork.jpg";

export type CategoryKey =
  | "afterwork"
  | "happyhour"
  | "concert"
  | "clubbing"
  | "culture"
  | "sport";

export const CATEGORIES: { key: CategoryKey; label: Record<"fr" | "de" | "en", string> }[] = [
  { key: "afterwork", label: { fr: "Afterwork", de: "Afterwork", en: "Afterwork" } },
  { key: "happyhour", label: { fr: "Happy Hour", de: "Happy Hour", en: "Happy Hour" } },
  { key: "concert", label: { fr: "Concert / Live", de: "Konzert / Live", en: "Concert / Live" } },
  { key: "clubbing", label: { fr: "Clubbing", de: "Clubbing", en: "Clubbing" } },
  { key: "culture", label: { fr: "Culture & Expo", de: "Kultur & Expo", en: "Culture & Expo" } },
  { key: "sport", label: { fr: "Sport en direct", de: "Sport Live", en: "Sport Broadcast" } },
];

export type Event = {
  id: string;
  title: string;
  venue: string;
  time: string; // HH:MM
  category: CategoryKey;
  image: string;
  price?: string;
  area: string;
};

export const EVENTS: Event[] = [
  {
    id: "1",
    title: "Sunset Rooftop Apéro",
    venue: "Hôtel de la Rose",
    time: "17:30",
    category: "afterwork",
    image: afterwork,
    price: "Free",
    area: "Old Town",
  },
  {
    id: "2",
    title: "2-for-1 Cocktails",
    venue: "Le Tunnel Bar",
    time: "18:00",
    category: "happyhour",
    image: bar,
    price: "from CHF 9",
    area: "Pérolles",
  },
  {
    id: "3",
    title: "FC Fribourg vs Servette",
    venue: "Café des Sports",
    time: "20:00",
    category: "sport",
    image: sport,
    price: "Free entry",
    area: "Gare",
  },
  {
    id: "4",
    title: "Mira Lune — Live Set",
    venue: "Fri-Son",
    time: "21:00",
    category: "concert",
    image: concert,
    price: "CHF 28",
    area: "Route de la Fonderie",
  },
  {
    id: "5",
    title: "Vernissage — Néon Suisse",
    venue: "Fri Art Kunsthalle",
    time: "19:00",
    category: "culture",
    image: culture,
    price: "Free",
    area: "Petites-Rames",
  },
  {
    id: "6",
    title: "House Night w/ DJ Kael",
    venue: "XXKult",
    time: "23:00",
    category: "clubbing",
    image: club,
    price: "CHF 20",
    area: "Route des Arsenaux",
  },
  {
    id: "7",
    title: "Late Techno: Subterrain",
    venue: "Nouveau Monde",
    time: "23:30",
    category: "clubbing",
    image: club,
    price: "CHF 25",
    area: "Esplanade",
  },
  {
    id: "8",
    title: "Jazz & Vinyl Session",
    venue: "Le Tunnel Bar",
    time: "21:30",
    category: "concert",
    image: bar,
    price: "Free",
    area: "Pérolles",
  },
];
