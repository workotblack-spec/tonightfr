import club from "@/assets/event-club.jpg";
import bar from "@/assets/event-bar.jpg";
import concert from "@/assets/event-concert.jpg";
import culture from "@/assets/event-culture.jpg";
import sport from "@/assets/event-sport.jpg";
import afterwork from "@/assets/event-afterwork.jpg";

export const EVENT_IMAGES: Record<string, string> = {
  club,
  bar,
  concert,
  culture,
  sport,
  afterwork,
};

export const imageFor = (key: string) => EVENT_IMAGES[key] ?? bar;
