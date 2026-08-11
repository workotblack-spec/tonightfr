// TONIGHT — Page d'accueil
// Design system nightlife + composant Hero

import { createFileRoute, Link } from '@tanstack/react-router'
import { HeroNightlife } from '../components/HeroNightlife'
import '../styles-nightlife.css'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="tonight-home">
      {/* Hero Nightlife */}
      <HeroNightlife />

      {/* Section intro */}
      <section className="intro-section">
        <div className="intro-content">
          <h2 className="intro-title">Fribourg ne dort pas</h2>
          <p className="intro-text">
            Découvre les clubs, bars, concerts et afterworks autour de toi.
            Filtre par ambiance, date et quartier. Réserve ta soirée en un clic.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h3 className="cta-title">Tu organises des événements ?</h3>
          <p className="cta-text">
            Mets en avant tes soiré©©es et touche des milliers de fê©©tards.
          </p>
          <Link to="/promouvoir" className="btn btn-primary">
            Promouvoir un é­vé©©nement
          </Link>
        </div>
      </section>

      <style>{`
        .tonight-home {
          width: 100%;
        }

        /* Intro Section */
        .intro-section {
          padding: var(--space-2xl) var(--space-md);
          background: var(--color-surface);
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
        }

        .intro-content {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }

        .intro-title {
          font-size: var(--text-2xl, 2rem);
          margin-bottom: var(--space-md);
        }

        .intro-text {
          font-size: var(--text-base, 1rem);
          color: var(--color-text-muted);
          line-height: 1.7;
        }

        /* CTA Section */
        .cta-section {
          padding: var(--space-2xl) var(--space-md);
          background: linear-gradient(
            135deg,
            var(--color-surface) 0%,
            var(--color-surface-2) 100%
          );
        }

        .cta-content {
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .cta-title {
          font-size: var(--text-xl, 1.5rem);
        }

        .cta-text {
          color: var(--color-text-muted);
        }

        @media (max-width: 768px) {
          .intro-section,
          .cta-section {
            padding: var(--space-xl) var(--space-md);
          }
        }
      `}</style>
    </div>
  )
}
