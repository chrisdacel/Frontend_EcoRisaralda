import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faLinkedin, faYoutube } from '@fortawesome/free-brands-svg-icons';

export default function SobreNosotrosPageTurista({ 
  userName = "Jane Mar",
  onNavigateHome,
  onNavigatePrivacidad
}) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
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
    <div className="min-h-screen bg-white font-['Albert_Sans'] pt-14">

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition z-[9999]"
        >
          <img loading="lazy" src="/images/Pagina_inicio/arrow-up2.svg" alt="Arriba" className="h-6 w-6" />
        </button>
      )}

      <main>
        {/* Hero Section más alta, texto en inferior izquierda */}
        <section
          className="relative overflow-hidden bg-cover bg-center min-h-[80vh]"
          style={{ backgroundImage: "url('/images/Sobre_Nosotros/fondo ciudad.webp')" }}
        >
          <div className={`absolute inset-0 bg-gradient-to-r from-white via-white/70 to-transparent md:from-white md:via-white/50 md:to-black/10 transition-opacity duration-500 ${heroVisible ? 'opacity-100' : 'opacity-0'}`} />
          <div className={`absolute bottom-8 left-6 md:bottom-12 md:left-12 z-10 transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900">Sobre Nosotros</h1>
            <p className="mt-3 max-w-2xl text-base md:text-lg text-slate-700 leading-relaxed">Conectamos viajeros con experiencias sostenibles y auténticas en Risaralda.</p>
          </div>
        </section>

        {/* Description Intro */}
        <section className="py-12 px-6 md:px-12 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-2">
              En Conexión EcoRisaralda somos un equipo de apasionados por la naturaleza y el turismo responsable.
            </p>
            <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-2">
              Nacimos con la misión de acercarte los rincones más auténticos y sostenibles del mundo, aquellos que
            </p>
            <p className="text-base md:text-lg text-slate-700 leading-relaxed">
              muchos desconocen pero que ofrecen experiencias inolvidables
            </p>
          </div>
        </section>

        {/* Row 1 - Nuestra Misión */}
        <section className="py-16 px-6 md:px-12 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              {/* Text column - 45% width */}
              <div className="w-full md:w-[45%]">
                <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-6">Nuestra Misión</h2>
                <p className="text-gray-700 leading-relaxed">
                  Te ayudamos a descubrir destinos ecoturísticos
                  cuidadosamente seleccionados, ofreciéndote
                  toda la información práctica que necesitas: 
                  cómo llegar, actividades disponibles, 
                  alojamientos sostenibles y recomendaciones 
                  locales. Queremos que planifiques tu aventura 
                  con confianza y que, al mismo tiempo, 
                  contribuyas al cuidado del medio ambiente y al 
                  desarrollo de las comunidades anfitrionas.
                </p>
              </div>
              {/* Image column - 50% width */}
              <div className="w-full md:w-[50%]">
                <img loading="lazy"
                  src="/images/Sobre_Nosotros/fondo ciudad.webp"
                  alt="Nuestra Misión"
                  className="w-full h-80 object-cover rounded-lg border border-emerald-100 shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Row 2 - ¿Qué Ofrecemos? */}
        <section className="py-16 px-6 md:px-12 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              {/* Text column - 45% width */}
              <div className="w-full md:w-[45%]">
                <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-6">¿Qué Ofrecemos?</h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">•</span>
                    <span>Guías completas de cada lugar: datos de interés, horarios, tarifas y consejos de conservación.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">•</span>
                    <span>Recomendaciones personalizadas según tus gustos y nivel de aventura.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">•</span>
                    <span>Notificaciones actuales sobre eventos y novedades en tus destinos favoritos.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">•</span>
                    <span>Opiniones de otros viajeros, para que conozcas de primera mano experiencias reales.</span>
                  </li>
                </ul>
              </div>
              {/* Image column - 50% width */}
              <div className="w-full md:w-[50%]">
                <img loading="lazy"
                  src="/images/Sobre_Nosotros/ecoturismo.webp"
                  alt="Qué Ofrecemos"
                  className="w-full h-80 object-cover rounded-lg border border-emerald-100 shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Row 3 - Nuestros Valores */}
        <section className="py-16 px-6 md:px-12 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              {/* Text column - 45% width */}
              <div className="w-full md:w-[45%]">
                <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-6">Nuestros Valores</h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">•</span>
                    <span>Sostenibilidad: promovemos prácticas que minimizan el impacto ambiental.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">•</span>
                    <span>Autenticidad: destacamos proyectos y comunidades locales de verdadera riqueza cultural.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">•</span>
                    <span>Responsabilidad: educamos sobre el respeto a la flora, fauna y tradiciones locales.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">•</span>
                    <span>Innovación: usamos tecnología para facilitar el acceso a información confiable y actualizada.</span>
                  </li>
                </ul>
              </div>
              {/* Image column - 50% width */}
              <div className="w-full md:w-[50%]">
                <img loading="lazy"
                  src="/images/Sobre_Nosotros/ecoturismo.webp"
                  alt="Nuestros Valores"
                  className="w-full h-80 object-cover rounded-lg border border-emerald-100 shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Description Closing */}
        <section className="py-12 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-2">
              Únete a nosotros y conviértete en un viajero consciente. Descubre, respeta y disfruta de la naturaleza — ¡tu
            </p>
            <p className="text-base md:text-lg text-slate-700 leading-relaxed">
              próxima gran aventura te espera!
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      {/* Footer (estilo Home) */}
      <footer className="border-t border-emerald-100 bg-emerald-50/50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          {/* Column 1 */}
          <div>
            <h2 className="text-2xl font-bold mb-2">Conexion</h2>
            <p className="text-gray-400 mb-4">EcoRisaralda</p>
            <div className="flex gap-4 mb-4">
                <a href="#"><FontAwesomeIcon icon={faFacebook} /></a>
                <a href="#"><FontAwesomeIcon icon={faLinkedin} /></a>
                <a href="#"><FontAwesomeIcon icon={faYoutube} /></a>
                <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
            </div>
            <div className="flex items-center gap-2">
              <span>🌐</span>
              <select className="bg-gray-800 text-white px-2 py-1 rounded">
                <option>Español</option>
                <option>English</option>
              </select>
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Información</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition">Conexión EcoRisaralda</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Descripción</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Lema</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Navegación rápida</h4>
            <ul className="space-y-2">
              <li><button onClick={onNavigateHome} className="text-gray-400 hover:text-white transition">Inicio</button></li>
              <li><button onClick={onNavigatePrivacidad} className="text-gray-400 hover:text-white transition">Políticas</button></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto y soporte</h4>
            <ul className="space-y-2">
              <li><a href="mailto:ecorisaralda@contacto.com" className="text-gray-400 hover:text-white transition">ecorisaralda@contacto.com</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">300 445 80055</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Preguntas</a></li>
            </ul>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p className="mb-2"><em>Conectando viajeros con la naturaleza. Explora, guarda y comparte experiencias únicas.</em></p>
          <p>© 2025 Conexión EcoRisaralda – Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
