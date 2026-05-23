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
  | "sport"
  | "shisha"
  | "lounge";

export const CATEGORIES: { key: CategoryKey; label: Record<"fr" | "de" | "en", string> }[] = [
  { key: "afterwork", label: { fr: "Afterwork", de: "Afterwork", en: "Afterwork" } },
  { key: "happyhour", label: { fr: "Happy Hour", de: "Happy Hour", en: "Happy Hour" } },
  { key: "concert", label: { fr: "Concert / Live", de: "Konzert / Live", en: "Concert / Live" } },
  { key: "clubbing", label: { fr: "Clubbing", de: "Clubbing", en: "Clubbing" } },
  { key: "culture", label: { fr: "Culture & Expo", de: "Kultur & Expo", en: "Culture & Expo" } },
  { key: "sport", label: { fr: "Sport en direct", de: "Sport Live", en: "Sport Broadcast" } },
  { key: "shisha", label: { fr: "Shisha", de: "Shisha", en: "Shisha" } },
  { key: "lounge", label: { fr: "Bar lounge", de: "Lounge Bar", en: "Lounge Bar" } },
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
  {
    id: "13",
    title: "Beer Pong Tournament — Uni Night",
    venue: "Le Château d'eau",
    time: "20:00",
    category: "afterwork",
    image: afterwork,
    price: "CHF 5",
    area: "Pérolles",
  },
  {
    id: "14",
    title: "Blues & Folk — Jam Session",
    venue: "L'Amalgame",
    time: "20:30",
    category: "concert",
    image: concert,
    price: "Entrée libre",
    area: "Grand-Places",
  },
  {
    id: "15",
    title: "Mojito Madness — Happy Hour",
    venue: "Le Basset",
    time: "17:00",
    category: "happyhour",
    image: bar,
    price: "CHF 10",
    area: "Rue du Simplon",
  },
  {
    id: "16",
    title: "House Classics — DJ Lumi",
    venue: "Nouveau Monde",
    time: "22:30",
    category: "clubbing",
    image: club,
    price: "CHF 25",
    area: "Esplanade de Pérolles",
  },
  {
    id: "17",
    title: "Quiz Night — Général Knowledge",
    venue: "Le Château d'eau",
    time: "19:30",
    category: "afterwork",
    image: afterwork,
    price: "Entrée libre",
    area: "Pérolles",
  },
  {
    id: "18",
    title: "Documentaire & Débat — Quartiers",
    venue: "Le Point de Vue",
    time: "18:30",
    category: "culture",
    image: culture,
    price: "Entrée libre",
    area: "Rue de Romont",
  },
  {
    id: "19",
    title: "Soirée Chicha — Oriental Vibes",
    venue: "Oxygène Lounge",
    time: "19:00",
    category: "shisha",
    image: bar,
    price: "CHF 18",
    area: "Rue de Lausanne",
  },
  {
    id: "20",
    title: "Lounge & Cocktails — Sunset Vibes",
    venue: "Le 7ème Ciel",
    time: "18:00",
    category: "lounge",
    image: afterwork,
    price: "dès CHF 14",
    area: "Pérolles",
  },
  {
    id: "21",
    title: "Shisha Night — Mint & Grape",
    venue: "Le Caire",
    time: "20:00",
    category: "shisha",
    image: bar,
    price: "CHF 16",
    area: "Basse-Ville",
  },
  {
    id: "22",
    title: "Chill Lounge — Deep House Session",
    venue: "Terrasse Samsâra",
    time: "19:30",
    category: "lounge",
    image: afterwork,
    price: "Entrée libre",
    area: "Rue de Lausanne",
  },
  {
    id: "23",
    title: "Chicha & Thé à la Menthe",
    venue: "Oxygène Lounge",
    time: "21:00",
    category: "shisha",
    image: bar,
    price: "CHF 15",
    area: "Rue de Lausanne",
  },
  {
    id: "24",
    title: "Rooftop Lounge — Golden Hour",
    venue: "Le 7ème Ciel",
    time: "17:30",
    category: "lounge",
    image: afterwork,
    price: "dès CHF 12",
    area: "Pérolles",
  },
];
