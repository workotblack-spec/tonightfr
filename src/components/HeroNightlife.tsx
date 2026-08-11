import { Calendar, MapPin, ChevronRight } from 'lucide-react';

export function HeroNightlife() {
  const events = [
    {
      id: 1,
      title: "Soiré©©e Électro Night",
      venue: "Fri-Son",
      date: "Aujourd'hui, 22:00",
      category: "Clubbing",
      image: "https://images.unsplash.com/photo-1574391884720-3850e5e85e45?w=800&q=80",
      badge: "Ce soir"
    },
    {
      id: 2,
      title: "Concert Live - The Night Owls",
      venue: "Nouveau Monde",
      date: "Demain, 20:30",
      category: "Concert",
      image: "https://images.unsplash.com/photo-1501612780327-45045538702b?w=800&q=80",
      badge: "Populaire"
    },
    {
      id: 3,
      title: "Afterwork Chill & Cocktails",
      venue: "Crapule Club",
      date: "18:00 - 23:00",
      category: "Afterwork",
      image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80",
      badge: "Happy Hour"
    }
  ];

  return (
    <div className="tonight-hero">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">Ce soir, on sort où ?</h1>
          <p className="hero-subtitle">
            Les meilleures soiré©©es, concerts et adresses de Fribourg. Ce soir, ce week-end, maintenant.
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary">
              Voir ce soir
              <ChevronRight size={18} />
            </button>
            <button className="btn btn-secondary">
              Explorer les lieux
            </button>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="events-section">
        <h2 className="section-title">À® l'affiche</h2>
        <div className="events-grid">
          {events.map((event) => (
            <article key={event.id} className="event-card card">
              <div className="event-image-wrapper">
                <img
                  src={event.image}
                  alt={event.title}
                  className="event-image"
                  loading="lazy"
                />
                <span className="event-badge badge badge-primary">{event.badge}</span>
              </div>
              <div className="event-content">
                <div className="event-meta">
                  <span className="badge badge-accent">{event.category}</span>
                </div>
                <h3 className="event-title">{event.title}</h3>
                <div className="event-details">
                  <div className="event-detail">
                    <MapPin size={14} />
                    <span>{event.venue}</span>
                  </div>
                  <div className="event-detail">
                    <Calendar size={14} />
                    <span>{event.date}</span>
                  </div>
                </div>
                <button className="btn btn-secondary btn-full">
                  Voir l'é©©vè©©nement
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <style>{`
        .tonight-hero {
          width: 100%;
        }

        /* Hero Section */
        .hero-section {
          position: relative;
          height: 70vh;
          min-height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: url('https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1600&q=80') center/cover no-repeat;
          overflow: hidden;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(7, 7, 10, 0.6) 0%,
            rgba(7, 7, 10, 0.8) 100%
          );
        }

        .hero-content {
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 800px;
          padding: 0 var(--space-md);
        }

        .hero-title {
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 800;
          margin-bottom: var(--space-md);
          color: var(--color-text);
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
        }

        .hero-subtitle {
          font-size: clamp(1rem, 2.5vw, 1.25rem);
          color: var(--color-text-muted);
          margin-bottom: var(--space-xl);
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-cta {
          display: flex;
          gap: var(--space-md);
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-full {
          width: 100%;
        }

        /* Events Section */
        .events-section {
          padding: var(--space-2xl) var(--space-md);
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-title {
          font-size: var(--text-2xl, 2rem);
          margin-bottom: var(--space-lg);
          text-align: center;
        }

        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: var(--space-lg);
        }

        .event-card {
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .event-image-wrapper {
          position: relative;
          aspect-ratio: 16/10;
          overflow: hidden;
        }

        .event-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-slow);
        }

        .event-card:hover .event-image {
          transform: scale(1.05);
        }

        .event-badge {
          position: absolute;
          top: var(--space-sm);
          left: var(--space-sm);
          z-index: 1;
        }

        .event-content {
          padding: var(--space-md);
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
          flex: 1;
        }

        .event-meta {
          display: flex;
          gap: var(--space-xs);
          flex-wrap: wrap;
        }

        .event-title {
          font-size: var(--text-lg, 1.125rem);
          font-weight: 600;
          line-height: 1.3;
        }

        .event-details {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
          margin-top: var(--space-xs);
        }

        .event-detail {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          font-size: var(--text-sm, 0.875rem);
          color: var(--color-text-muted);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .hero-section {
            height: 60vh;
            min-height: 400px;
          }

          .hero-cta {
            flex-direction: column;
            align-items: center;
          }

          .hero-cta .btn {
            width: 100%;
            max-width: 280px;
          }

          .events-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
