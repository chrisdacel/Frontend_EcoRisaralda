import { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';
import Footer from './components/Footer';

function QueOfrecemosPage({ onNavigateRegister }) {
  const { user } = useAuth();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 100);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const features = [
    { id: 'seccion2', title: 'Guarda tus sitios favoritos', description: 'Guarda tus sitios favoritos y tenlos siempre a un click', image: '/images/loqueofrecemos/marcadorrr.webp' },
    { id: 'seccion3', title: 'Espacio para tu opinión', description: 'Comparte tu experiencia y ayuda a otros viajeros', image: '/images/loqueofrecemos/customer-reviewww.webp' },
    { id: 'seccion4', title: 'Notificaciones personalizadas', description: 'Recibe notificaciones a tu medida, con lo que realmente te interesa', image: '/images/loqueofrecemos/notificacion.webp' },
    { id: 'seccion5', title: 'Mantente al día', description: 'No te pierdas los nuevos eventos y actividades ecológicas', image: '/images/loqueofrecemos/calendario (1).webp' },
    { id: 'seccion6', title: 'Recomendaciones personalizadas', description: 'Descubre experiencias únicas según tus gustos e intereses', image: '/images/loqueofrecemos/medios-de-comunicacion-social (2).webp' },
  ];

  const sections = [
    { id: 'seccion2', intro: 'Tus lugares favoritos siempre a mano', title: 'Guarda tus sitios favoritos', description: 'Guarda los destinos y lugares que más te inspiran para futuras aventuras. Ten siempre a mano tus sitios favoritos y accede rápidamente cuando planifiques tu próxima escapada.', image: '/images/loqueofrecemos/360_F_543301935_x7GbHP4insZoPIlyiefioUteakwn4ivh.webp', cta: 'Regístrate para guardar tus sitios favoritos' },
    { id: 'seccion3', intro: 'Comparte tu experiencia', title: 'Espacio para tu opinión', description: 'Tu opinión ayuda a otros viajeros. Comparte experiencias, sugerencias y comentarios sobre los destinos que has visitado para enriquecer las aventuras ecológicas de la comunidad.', image: '/images/loqueofrecemos/experiencias-de-team-building-al-aire-libre-portada.webp', cta: 'Regístrate para dejar tu reseña' },
    { id: 'seccion4', intro: 'Notificaciones a tu medida', title: 'Notificaciones personalizadas', description: 'Recibe alertas adaptadas a tus intereses: nuevos eventos, ofertas especiales y novedades en tus lugares favoritos para que no te pierdas nada.', image: '/images/loqueofrecemos/photo-1560483647-6a049edeef29.webp', cta: 'Regístrate para personalización' },
    { id: 'seccion5', intro: 'No te pierdas de nada', title: 'Mantente al día', description: 'Entérate de festivales, actividades y experiencias en tus destinos preferidos. Mantén tu agenda ecológica actualizada y disfruta cada momento.', image: '/images/loqueofrecemos/calendar-pencil-and-clock-as-tiempo-background-jlwr8f81osug906i.webp', cta: 'Conoce los nuevos eventos' },
    { id: 'seccion6', intro: 'Planes que se adaptan a ti', title: 'Recomendaciones personalizadas', description: 'Descubre actividades, destinos y eventos ajustados a tus gustos. Te ayudamos a planear el viaje perfecto, ya sea aventura, relax o cultura.', image: '/images/loqueofrecemos/contagiarte_de_ritmos_locales_GettyImages-627027011-scaled.webp', cta: 'Regístrate para tu personalización' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden pt-14">
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <div className="mb-16 flex flex-col gap-4 text-left">
            <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">Qué ofrecemos</h1>
            <p className="text-lg text-gray-600 md:text-xl">Experiencias auténticas en armonía con el planeta</p>
          </div>

          <section className="mb-20 grid gap-12 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.id} className="flex flex-col gap-3">
                <img loading="lazy" src={feature.image} alt={feature.title} className="h-28 w-28 brand-icon" />
                <p className="text-lg font-semibold text-slate-900">{feature.title}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                <a href={`#${feature.id}`} className="text-sm font-semibold text-slate-700 underline decoration-emerald-500 decoration-2 underline-offset-4 hover:text-emerald-600">Más información</a>
              </div>
            ))}
          </section>

          <section className="flex flex-col gap-24">
            {sections.map((section) => (
              <div key={section.id} id={section.id} className="flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-[#267E1B] md:text-3xl">{section.intro}</h2>
                <img loading="lazy" src={section.image} alt={section.title} className="h-[380px] w-full rounded-lg object-cover shadow-md" />
                <h3 className="text-2xl font-semibold text-slate-900">{section.title}</h3>
                <p className="text-base text-gray-700 leading-relaxed">{section.description}</p>
                {!user && (
                  <button onClick={onNavigateRegister} className="w-fit rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:bg-emerald-400">{section.cta}</button>
                )}
              </div>
            ))}
          </section>
        </div>
      </main>

      {showScrollTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-6 right-6 z-[9999] rounded-full bg-emerald-500 px-3 py-3 text-white shadow-lg shadow-emerald-500/40 transition hover:scale-110 hover:bg-emerald-600" aria-label="Subir">↑</button>
      )}

      {/* FOOTER */}
      <Footer 
        onNavigateSobreNosotros={() => window.location.href = '/sobre-nosotros'}
        onNavigatePrivacidad={() => window.location.href = '/privacidad'}
        onNavigateQueOfrecemos={() => window.location.href = '/que-ofrecemos'}
      />
    </div>
  );
}

export default QueOfrecemosPage;