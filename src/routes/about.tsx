import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Heart, MapPin } from "lucide-react";
import logo from "@/assets/logo-tonight.png";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "À propos — Tonight.fr" },
      {
        name: "description",
        content:
          "Tonight.fr est l'agenda nocturne de Fribourg : afterworks, concerts, clubbing, shisha, lounges, culture et sport, mis à jour chaque jour.",
      },
      { property: "og:title", content: "À propos — Tonight.fr" },
      {
        property: "og:description",
        content: "L'agenda nocturne hyper-local de Fribourg.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-10 pb-24">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Retour
      </Link>

      <div className="mt-8 flex items-center gap-3">
        <img src={logo} alt="" width={48} height={48} className="h-12 w-12" />
        <h1 className="font-display text-4xl font-bold tracking-tight">
          Tonight<span className="text-gradient-neon">.fr</span>
        </h1>
      </div>

      <p className="mt-6 text-lg text-muted-foreground">
        L'agenda nocturne de Fribourg, en un coup d'œil. Tout ce qui se passe ce soir,
        demain, ce weekend — sans scroller dix comptes Instagram.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        <Feature
          icon={<Sparkles className="h-5 w-5 text-primary" />}
          title="Curated"
          body="Chaque lieu est vérifié. Pas de spam, pas d'events fantômes."
        />
        <Feature
          icon={<MapPin className="h-5 w-5 text-primary" />}
          title="Hyper-local"
          body="Du Belluard au Nouveau Monde, du Café des Arcades au XXL — on couvre tout Fribourg."
        />
        <Feature
          icon={<Heart className="h-5 w-5 text-primary" />}
          title="Indépendant"
          body="Pas affilié à un lieu. On référence ce qui vaut la peine d'y aller."
        />
      </div>

      <section className="mt-16 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <h2 className="font-display text-xl font-semibold text-foreground">Notre mission</h2>
        <p>
          Fribourg a une vie nocturne riche et fragmentée. Les étudiants vont au Belluard,
          les jeunes actifs en afterwork à la Vieille-Ville, les amateurs de jazz au Nouveau
          Monde — chacun dans sa bulle. Tonight.fr réunit tout dans une seule app, en français,
          allemand et anglais.
        </p>
        <p>
          Le service est gratuit pour les utilisateurs. Les lieux peuvent prochainement
          revendiquer leur fiche et mettre en avant leurs événements.
        </p>
      </section>

      <section className="mt-12 space-y-2 text-sm text-muted-foreground">
        <h2 className="font-display text-xl font-semibold text-foreground">Contact</h2>
        <p>
          Un event à ajouter ?{" "}
          <a className="text-primary underline" href="mailto:hello@tonight.fr">
            hello@tonight.fr
          </a>
        </p>
      </section>

      <div className="mt-12 flex gap-4 text-sm text-muted-foreground">
        <Link to="/legal" className="hover:text-foreground">
          Mentions légales
        </Link>
        <span>·</span>
        <Link to="/" className="hover:text-foreground">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-2xl glass p-5">
      <div className="mb-3 grid h-9 w-9 place-items-center rounded-full bg-surface-elevated">
        {icon}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
