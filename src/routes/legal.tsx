import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/legal")({
  head: () => ({
    meta: [
      { title: "Mentions légales & confidentialité — Tonight.fr" },
      {
        name: "description",
        content:
          "Mentions légales, conditions d'utilisation et politique de confidentialité de Tonight.fr, conformes à la LPD suisse révisée 2023.",
      },
      { property: "og:title", content: "Mentions légales — Tonight.fr" },
      { property: "og:url", content: "/legal" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/legal" }],
  }),
  component: LegalPage,
});

function LegalPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-10 pb-24 text-sm leading-relaxed">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Retour
      </Link>

      <h1 className="mt-8 font-display text-3xl font-bold tracking-tight">
        Mentions légales & confidentialité
      </h1>
      <p className="mt-2 text-muted-foreground">Dernière mise à jour : mai 2026</p>

      <Section title="1. Éditeur">
        <p>
          Tonight.fr — projet indépendant, basé à Fribourg, Suisse.
          <br />
          Contact :{" "}
          <a className="text-primary underline" href="mailto:hello@tonight.fr">
            hello@tonight.fr
          </a>
        </p>
      </Section>

      <Section title="2. Objet du service">
        <p>
          Tonight.fr est un agenda informatif référençant des événements organisés par des tiers
          (bars, clubs, salles de concert, lieux culturels) dans la région de Fribourg.
          L'exactitude des informations (horaires, prix, programmation) est sous la responsabilité
          des organisateurs. Tonight.fr ne vend pas de billets et n'organise pas d'événements.
        </p>
      </Section>

      <Section title="3. Âge minimum">
        <p>
          Certains lieux référencés ont un âge minimum d'accès (18 ans pour la plupart des clubs).
          Il appartient à l'utilisateur de vérifier les conditions d'accès auprès de chaque lieu.
        </p>
      </Section>

      <Section title="4. Données personnelles (LPD révisée 2023)">
        <p>
          Tonight.fr propose une authentification optionnelle par email ou via Google. Lors de la
          création d'un compte, nous stockons votre adresse email et un identifiant unique afin de
          synchroniser vos favoris entre appareils. Aucune autre donnée personnelle n'est collectée.
        </p>
        <p className="mt-2">
          Si vous n'êtes pas connecté, vos favoris restent stockés localement sur votre appareil
          (localStorage) et ne sont jamais transmis à nos serveurs. Vous pouvez supprimer votre
          compte à tout moment en écrivant à hello@tonight.fr.
        </p>
        <p className="mt-2">
          Aucun cookie de tracking publicitaire n'est utilisé. Aucune donnée n'est revendue ou
          partagée avec des tiers à des fins marketing. Les données d'authentification sont
          hébergées en Europe via notre prestataire backend (Supabase).
        </p>
      </Section>

      <Section title="5. Propriété intellectuelle">
        <p>
          Les visuels d'événements sont utilisés à titre illustratif. Les marques, logos et noms
          de lieux restent la propriété de leurs détenteurs respectifs. Pour toute demande de
          retrait, contactez-nous à hello@tonight.fr — nous donnons suite sous 72h.
        </p>
      </Section>

      <Section title="6. Signalement de contenu">
        <p>
          Pour signaler un contenu inapproprié, une information incorrecte ou demander la
          suppression d'une fiche, écrivez à{" "}
          <a className="text-primary underline" href="mailto:hello@tonight.fr">
            hello@tonight.fr
          </a>
          .
        </p>
      </Section>

      <Section title="7. Droit applicable">
        <p>
          Le présent service est régi par le droit suisse. Tout litige relève de la compétence
          des tribunaux du canton de Fribourg.
        </p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 space-y-2">
      <h2 className="font-display text-lg font-semibold text-foreground">{title}</h2>
      <div className="text-muted-foreground">{children}</div>
    </section>
  );
}
