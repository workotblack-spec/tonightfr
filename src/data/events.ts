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
    title: "Apéro Jazz au XXe",
    venue: "Café le XXe",
    time: "17:30",
    category: "afterwork",
    image: afterwork,
    price: "Entrée libre",
    area: "Avenue de Tivoli",
  },
  {
    id: "2",
    title: "Happy Hour — Cocktails 2 pour 1",
    venue: "Le Singe Bleu",
    time: "18:00",
    category: "happyhour",
    image: bar,
    price: "dès CHF 12",
    area: "Rue de Romont",
  },
  {
    id: "3",
    title: "Fri-Son Sessions — Local Heroes",
    venue: "Fri-Son",
    time: "20:30",
    category: "concert",
    image: concert,
    price: "CHF 15",
    area: "Route de la Fonderie",
  },
  {
    id: "4",
    title: "Vernissage — Regards Croisés",
    venue: "Fri Art Kunsthalle",
    time: "19:00",
    category: "culture",
    image: culture,
    price: "Entrée libre",
    area: "Petites-Rames",
  },
  {
    id: "5",
    title: "FC Fribourg — Match en direct",
    venue: "Café des Sports",
    time: "20:45",
    category: "sport",
    image: sport,
    price: "Consommation",
    area: "Place de la Gare",
  },
  {
    id: "6",
    title: "Techno Underground — Nouveau Monde",
    venue: "Nouveau Monde",
    time: "23:00",
    category: "clubbing",
    image: club,
    price: "CHF 22",
    area: "Esplanade de Pérolles",
  },
  {
    id: "7",
    title: "Hip-Hop Night — Peaches'n'Cream",
    venue: "Fri-Son",
    time: "22:00",
    category: "clubbing",
    image: club,
    price: "CHF 18",
    area: "Route de la Fonderie",
  },
  {
    id: "8",
    title: "Jazz Live — Trio Fribourgeois",
    venue: "La Spirale",
    time: "21:00",
    category: "concert",
    image: bar,
    price: "CHF 10",
    area: "Basse-Ville",
  },
  {
    id: "9",
    title: "Soirée Karaoké — Samsâra",
    venue: "Samsâra Bar",
    time: "21:30",
    category: "afterwork",
    image: afterwork,
    price: "Entrée libre",
    area: "Rue de Lausanne",
  },
  {
    id: "10",
    title: "DJ Set — Sunset Electronic",
    venue: "Terrasse du XXe",
    time: "19:00",
    category: "happyhour",
    image: bar,
    price: "dès CHF 8",
    area: "Avenue de Tivoli",
  },
  {
    id: "11",
    title: "Dub Arena — Soundsystem Night",
    venue: "Fri-Son",
    time: "22:00",
    category: "clubbing",
    image: club,
    price: "CHF 20",
    area: "Route de la Fonderie",
  },
  {
    id: "12",
    title: "Exposition Photo — Fribourg by Night",
    venue: "Galerie de l'Arsenal",
    time: "18:00",
    category: "culture",
    image: culture,
    price: "Entrée libre",
    area: "Rue d'Or",
  },
];
