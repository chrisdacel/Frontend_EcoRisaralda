import { useState, useEffect } from 'react';
import Footer from './components/Footer';

function SobreNosotrosPage({ onNavigateHome, onNavigateLogin, onNavigateRegister, onNavigatePrivacidad }) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 overflow-x-hidden pt-14">

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-[9999] rounded-full bg-emerald-500 px-3 py-3 text-white shadow-lg shadow-emerald-500/40 transition hover:scale-110 hover:bg-emerald-600"
          aria-label="Volver arriba"
        >
          ↑
        </button>
      )}

      <main>
        {/* Hero */}
        {/* Hero: igual a PrivacidadPage */}
        <section
          className="relative overflow-hidden bg-cover bg-center min-h-[70vh]"
          style={{ backgroundImage: "url('/images/Sobre_Nosotros/fondo ciudad.webp')" }}
        >
          <div className={`absolute inset-0 bg-gradient-to-r from-white via-white/70 to-transparent md:from-white md:via-white/50 md:to-black/10 transition-opacity duration-500 ${heroVisible ? 'opacity-100' : 'opacity-0'}`} />
          <div className={`absolute bottom-8 left-6 md:bottom-12 md:left-12 z-10 transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900">Sobre Nosotros</h1>
            <p className="mt-3 max-w-2xl text-base md:text-lg text-slate-700 leading-relaxed">Conectamos viajeros con experiencias sostenibles y auténticas en Risaralda.</p>
          </div>
        </section>

        {/* Intro */}
        <section className="py-12 px-6 md:px-12 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-2">En Conexión EcoRisaralda somos un equipo de apasionados por la naturaleza y el turismo responsable.</p>
            <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-2">Nacimos con la misión de acercarte los rincones más auténticos y sostenibles del mundo, aquellos que</p>
            <p className="text-base md:text-lg text-slate-700 leading-relaxed">muchos desconocen pero que ofrecen experiencias inolvidables</p>
          </div>
        </section>

        {/* Nuestra Misión */}
        <section className="py-16 px-6 md:px-12 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="w-full md:w-[45%]">
                <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-6">Nuestra Misión</h2>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">Te ayudamos a descubrir destinos ecoturísticos cuidadosamente seleccionados, ofreciéndote toda la información práctica que necesitas: cómo llegar, actividades disponibles, alojamientos sostenibles y recomendaciones locales. Queremos que planifiques tu aventura con confianza y que, al mismo tiempo, contribuyas al cuidado del medio ambiente y al desarrollo de las comunidades anfitrionas.</p>
              </div>
              <div className="w-full md:w-[50%]">
                <img loading="lazy" src="/images/Sobre_Nosotros/fondo ciudad.webp" alt="Nuestra Misión" className="w-full h-80 object-cover rounded-lg border border-emerald-100 shadow-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* ¿Qué Ofrecemos? */}
        <section className="py-16 px-6 md:px-12 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="w-full md:w-[45%]">
                <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-6">¿Qué Ofrecemos?</h2>
                <ul className="space-y-3 text-base md:text-lg text-gray-700 leading-relaxed">
                  <li className="flex items-start gap-2"><span className="text-emerald-600 font-bold mt-1">•</span><span>Guías completas de cada lugar: datos de interés, horarios, tarifas y consejos de conservación.</span></li>
                  <li className="flex items-start gap-2"><span className="text-emerald-600 font-bold mt-1">•</span><span>Recomendaciones personalizadas según tus gustos y nivel de aventura.</span></li>
                  <li className="flex items-start gap-2"><span className="text-emerald-600 font-bold mt-1">•</span><span>Notificaciones actuales sobre eventos y novedades en tus destinos favoritos.</span></li>
                  <li className="flex items-start gap-2"><span className="text-emerald-600 font-bold mt-1">•</span><span>Opiniones de otros viajeros, para que conozcas de primera mano experiencias reales.</span></li>
                </ul>
              </div>
              <div className="w-full md:w-[50%]">
                <img loading="lazy" src="/images/Sobre_Nosotros/ecoturismo.webp" alt="Qué Ofrecemos" className="w-full h-80 object-cover rounded-lg border border-emerald-100 shadow-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Nuestros Valores */}
        <section className="py-16 px-6 md:px-12 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="w-full md:w-[45%]">
                <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-6">Nuestros Valores</h2>
                <ul className="space-y-3 text-base md:text-lg text-gray-700 leading-relaxed">
                  <li className="flex items-start gap-2"><span className="text-emerald-600 font-bold mt-1">•</span><span>Sostenibilidad: promovemos prácticas que minimizan el impacto ambiental.</span></li>
                  <li className="flex items-start gap-2"><span className="text-emerald-600 font-bold mt-1">•</span><span>Autenticidad: destacamos proyectos y comunidades locales de verdadera riqueza cultural.</span></li>
                  <li className="flex items-start gap-2"><span className="text-emerald-600 font-bold mt-1">•</span><span>Responsabilidad: educamos sobre el respeto a la flora, fauna y tradiciones locales.</span></li>
                  <li className="flex items-start gap-2"><span className="text-emerald-600 font-bold mt-1">•</span><span>Innovación: usamos tecnología para facilitar el acceso a información confiable y actualizada.</span></li>
                </ul>
              </div>
              <div className="w-full md:w-[50%]">
                <img loading="lazy" src="/images/Sobre_Nosotros/ecoturismo.webp" alt="Nuestros Valores" className="w-full h-80 object-cover rounded-lg border border-emerald-100 shadow-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Closing */}
        <section className="py-12 px-6 md:px-12 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-2">Únete a nosotros y conviértete en un viajero consciente. Descubre, respeta y disfruta de la naturaleza — ¡tu</p>
            <p className="text-base md:text-lg text-slate-700 leading-relaxed">próxima gran aventura te espera!</p>
          </div>
        </section>
      </main>

      {/* Footer (estilo Home) */}
      <Footer 
        onNavigateSobreNosotros={() => window.location.href = '/sobre-nosotros'}
        onNavigatePrivacidad={() => window.location.href = '/privacidad'}
        onNavigateQueOfrecemos={() => window.location.href = '/que-ofrecemos'}
      />
    </div>
  );
}

export default SobreNosotrosPage;
