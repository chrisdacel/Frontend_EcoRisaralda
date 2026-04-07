import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faLinkedin, faYoutube, faInstagram } from '@fortawesome/free-brands-svg-icons';

function HomePageOperador({ userName = "Jane Mar", onNavigateColeccion, onNavigateSobreNosotros, onNavigatePrivacidad, onNavigateOferta }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Carousels state
  const [popularesIndex, setPopularesIndex] = useState(0);
  const [eventosIndex, setEventosIndex] = useState(0);

  const sitiosPopulares = [
    { id: 1, nombre: "Nevado del Tolima", municipio: "Municipio de Santa Isabel" },
    { id: 2, nombre: "Laguna del Otún", municipio: "Municipio de Pereira" },
    { id: 3, nombre: "Termales de Santa Rosa", municipio: "Municipio de Santa Rosa de Cabal" },
    { id: 4, nombre: "Parque Natural Ucumarí", municipio: "Municipio de Pereira" },
    { id: 5, nombre: "Santuario de Fauna y Flora Otún Quimbaya", municipio: "Municipio de Pereira" },
    { id: 6, nombre: "Cascada del Fraile", municipio: "Municipio de Marsella" },
    { id: 7, nombre: "Reserva Natural Barbas Bremen", municipio: "Municipio de Filandia" },
    { id: 8, nombre: "Bioparque Ukumarí", municipio: "Municipio de Pereira" },
    { id: 9, nombre: "Alto del Nudo", municipio: "Municipio de Santuario" },
    { id: 10, nombre: "Cerro de Quinchía", municipio: "Municipio de Quinchía" }
  ];

  const eventos = [
    { id: 1, titulo: "Festival del Bambú", imagen: "/images/Pagina_inicio/fondo ciudad.webp" },
    { id: 2, titulo: "Semana Cultural", imagen: "/images/Pagina_inicio/ecoturismo.webp" },
    { id: 3, titulo: "Feria Ecológica", imagen: "/images/Pagina_inicio/fondo ciudad.webp" },
    { id: 4, titulo: "Caminata Verde", imagen: "/images/Pagina_inicio/ecoturismo.webp" },
    { id: 5, titulo: "Expo Naturaleza", imagen: "/images/Pagina_inicio/fondo ciudad.webp" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setShowScrollTop(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-play carousels
  useEffect(() => {
    const popularesTimer = setInterval(() => {
      setPopularesIndex((prev) => (prev + 1) % Math.max(1, sitiosPopulares.length - 2));
    }, 5000);

    const eventosTimer = setInterval(() => {
      setEventosIndex((prev) => (prev + 1) % eventos.length);
    }, 5000);

    return () => {
      clearInterval(popularesTimer);
      clearInterval(eventosTimer);
    };
  }, [sitiosPopulares.length, eventos.length]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPopulares = () => {
    setPopularesIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextPopulares = () => {
    setPopularesIndex((prev) => Math.min(sitiosPopulares.length - 3, prev + 1));
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full bg-white shadow-md">
        <div className="flex items-center justify-between px-6 py-4 md:px-12">
          <div className="flex items-center gap-2">
            <img loading="lazy" src="/images/Pagina_inicio/nature-svgrepo-com.svg" alt="Logo" className="h-8 w-8" />
            <div>
              <h3 className="text-sm font-bold">Conexion</h3>
              <p className="text-xs text-slate-600">EcoRisaralda</p>
              <p className="text-xs font-semibold text-[#267E1B]">OPERADOR</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex items-center gap-2 hover:opacity-80"
            >
              <img loading="lazy" src="/images/roles/search-svgrepo-com.svg" alt="Buscar" className="h-6 w-6" />
              <span className="hidden md:inline text-sm">Buscar</span>
            </button>

            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100">
              <img loading="lazy" src="/images/Coleccion_sitios_ecoturisticos/user.svg" alt="Usuario" className="h-6 w-6" />
              <span className="text-sm font-medium">{userName}</span>
            </div>

            <button className="hidden md:block">
              <img loading="lazy" src="/images/Coleccion_sitios_ecoturisticos/favourites.webp" alt="Favoritos" className="h-6 w-6" />
            </button>

            <button className="md:hidden">
              <img loading="lazy" src="/images/Pagina_inicio/img_drop_down.webp" alt="Menu" className="h-8 w-8" />
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-gray-200 bg-white px-6 py-4 md:px-12">
            <input
              type="text"
              placeholder="Escribe tu búsqueda..."
              className="w-full rounded-lg border-2 border-[#267E1B] px-4 py-2 text-lg outline-none focus:border-[#267E1B]"
            />
          </div>
        )}
      </header>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 rounded-full bg-white shadow-lg transition hover:scale-110"
          title="Volver arriba"
        >
          <img loading="lazy" src="/images/Coleccion_sitios_ecoturisticos/arrow-up2.svg" alt="Arriba" className="h-12 w-12" />
        </button>
      )}

      {/* Main Content */}
      <main className="mt-16">
        {/* Hero Section */}
        <section className="hero-viewport relative bg-cover bg-center" style={{ backgroundImage: "url('/images/Pagina_inicio/ecoturismo.webp')" }}>
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative flex h-full flex-col items-start justify-center px-8 text-white md:px-20">
            <h1 className="mb-4 text-4xl font-bold md:text-6xl">Descubre los mejores</h1>
            <h1 className="mb-6 text-4xl font-bold md:text-6xl">
              sitios <span className="text-[#4caf50]">ecoturísticos</span>
            </h1>
            <p className="mb-2 text-lg md:text-xl">Explora rutas y lugares únicos donde disfrutar de la</p>
            <p className="mb-2 text-lg md:text-xl">naturaleza de manera sostenible. ¡Tu próxima aventura</p>
            <p className="mb-8 text-lg md:text-xl">verde te espera!</p>
            <button
              onClick={onNavigateColeccion}
              className="rounded-lg bg-[#267E1B] px-8 py-3 text-lg font-semibold transition hover:bg-[#1d5f14]"
            >
              Ver más
            </button>
          </div>
        </section>

        {/* Section 2 - Populares */}
        <section className="bg-white px-8 py-16 md:px-20">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">¡Mantente al día con los sitios más populares y eventos</h1>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">siempre actualizados!</h1>
          </div>

          <div className="flex flex-col gap-8 md:flex-row md:justify-between">
            {/* Carousel */}
            <div className="relative w-full overflow-hidden md:w-2/3">
              <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${popularesIndex * 33.33}%)` }}>
                {sitiosPopulares.map((sitio) => (
                  <div key={sitio.id} className="min-w-[33.33%] px-2">
                    <div className="rounded-lg bg-white p-6 shadow-lg transition hover:shadow-xl">
                      <div className="mb-4 h-48 rounded-lg bg-gray-300"></div>
                      <h3 className="mb-2 text-xl font-bold text-[#267E1B]">{sitio.nombre}</h3>
                      <p className="text-sm text-gray-600">{sitio.municipio}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handlePrevPopulares}
                disabled={popularesIndex === 0}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-3 shadow-lg disabled:opacity-30 hover:bg-white"
              >
                <span className="text-3xl text-[#267E1B]">‹</span>
              </button>
              <button
                onClick={handleNextPopulares}
                disabled={popularesIndex >= sitiosPopulares.length - 3}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-3 shadow-lg disabled:opacity-30 hover:bg-white"
              >
                <span className="text-3xl text-[#267E1B]">›</span>
              </button>
            </div>

            {/* Sidebar */}
            <div className="w-full md:w-1/3">
              <h2 className="mb-4 text-2xl font-bold text-[#267E1B]">POPULARES</h2>
              <p className="text-gray-600">Explora los destinos más visitados y queridos por nuestra comunidad.</p>
            </div>
          </div>
        </section>

        {/* Section 3 - Eventos */}
        <section className="bg-gray-100 px-8 py-16 md:px-20">
          <h3 className="mb-8 text-center text-3xl font-bold text-slate-900">EVENTOS</h3>

          <div className="relative mx-auto max-w-4xl">
            <div className="overflow-hidden rounded-lg">
              {eventos.map((evento, index) => (
                <div
                  key={evento.id}
                  className={`transition-opacity duration-500 ${index === eventosIndex ? 'block' : 'hidden'}`}
                >
                  <div className="relative h-96 bg-cover bg-center" style={{ backgroundImage: `url('${evento.imagen}')` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-8 left-8 text-white">
                      <h2 className="text-3xl font-bold">{evento.titulo}</h2>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-center gap-2">
              {eventos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setEventosIndex(index)}
                  className={`h-3 w-3 rounded-full transition ${index === eventosIndex ? 'bg-[#267E1B]' : 'bg-gray-400'}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Section 4 - Beneficios */}
        <section className="bg-white px-8 py-16 md:px-20">
          <h1 className="mb-12 text-center text-4xl font-bold text-slate-900">Descubre todos los beneficios</h1>

          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-gray-50 p-8 shadow-md transition hover:shadow-xl">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#267E1B]">
                <img loading="lazy" src="/images/loqueofrecemos/marcadorrr.webp" alt="Guardar" className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-[#267E1B]">Guardar sitios favoritos</h3>
              <p className="text-gray-600">Crea tu colección personal de destinos y accede a ellos cuando quieras.</p>
            </div>

            <div className="rounded-lg bg-gray-50 p-8 shadow-md transition hover:shadow-xl">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#267E1B]">
                <img loading="lazy" src="/images/loqueofrecemos/notificacion.webp" alt="Notificaciones" className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-[#267E1B]">Notificaciones</h3>
              <p className="text-gray-600">Recibe alertas sobre eventos y novedades en tus destinos favoritos.</p>
            </div>

            <div className="rounded-lg bg-gray-50 p-8 shadow-md transition hover:shadow-xl">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#267E1B]">
                <img loading="lazy" src="/images/loqueofrecemos/customer-reviewww.webp" alt="Reseñas" className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-[#267E1B]">Reseñas</h3>
              <p className="text-gray-600">Comparte tu experiencia y lee opiniones de otros viajeros.</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={onNavigateOferta}
              className="rounded-lg bg-[#267E1B] px-8 py-3 text-lg font-semibold text-white transition hover:bg-[#1d5f14]"
            >
              Leer más
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#267E1B] bg-gray-200 px-6 py-12 md:px-12">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h2 className="mb-1 text-xl font-bold text-slate-900">Conexion</h2>
            <p className="mb-4 text-sm text-gray-700">EcoRisaralda</p>
            <div className="flex gap-4 text-lg text-[#4caf50]">
              <a href="#" className="transition hover:scale-125"><FontAwesomeIcon icon={faFacebook} /></a>
              <a href="#" className="transition hover:scale-125"><FontAwesomeIcon icon={faLinkedin} /></a>
              <a href="#" className="transition hover:scale-125"><FontAwesomeIcon icon={faYoutube} /></a>
              <a href="#" className="transition hover:scale-125"><FontAwesomeIcon icon={faInstagram} /></a>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span>🌐</span>
              <select className="rounded border px-2 py-1 text-sm">
                <option>Español</option>
                <option>English</option>
              </select>
            </div>
          </div>

          <div>
            <h4 className="mb-3 font-bold text-slate-900">Información</h4>
            <ul className="space-y-2 text-sm text-gray-700">
                <li><button onClick={onNavigateSobreNosotros} className="hover:underline">Sobre nosotros</button></li>
                <li><button onClick={onNavigatePrivacidad} className="hover:underline">Privacidad</button></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-bold text-slate-900">Navegación rápida</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><a href="#" className="hover:underline">Inicio</a></li>
              <li><button onClick={onNavigateSobreNosotros} className="hover:underline text-left">Sobre nosotros</button></li>
              <li><button onClick={onNavigatePrivacidad} className="hover:underline text-left">Políticas</button></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-bold text-slate-900">Contacto y soporte</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><a href="mailto:ecorisaralda@contacto.com" className="hover:underline">ecorisaralda@contacto.com</a></li>
              <li><a href="#" className="hover:underline">300 445 80055</a></li>
              <li><a href="#" className="hover:underline">Preguntas</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-400 pt-6 text-center text-sm text-gray-700">
          <p className="mb-2"><em>Conectando viajeros con la naturaleza. Explora, guarda y comparte experiencias únicas.</em></p>
          <p>© 2025 Conexión EcoRisaralda – Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePageOperador;
