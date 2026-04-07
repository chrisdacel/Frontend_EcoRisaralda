import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { getAllPlaces } from './services/placesApi';

export default function ColeccionPageTurista({ 
  userName = "Jane Mar",
  onNavigateHome,
  onNavigateSobreNosotros,
  onNavigatePrivacidad,
  onNavigateSitio
}) {
  const location = useLocation();
  const { user } = useAuth ? useAuth() : { user: null };
  const [carouselIndex, setCarouselIndex] = useState([0, 0, 0]);
  const [searchText, setSearchText] = useState('');
  const [sitios, setSitios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSitios() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllPlaces();
        // Adaptar los datos a la estructura esperada por el componente
        const adaptados = (Array.isArray(data) ? data : []).map(sitio => ({
          img: sitio.cover || sitio.portada || sitio.imagen || '/images/Coleccion_sitios_ecoturisticos/paisaje_01.webp',
          title: sitio.name || sitio.title || 'Sitio',
          location: sitio.localization || sitio.ubicacion || sitio.location || '',
        }));
        setSitios(adaptados);
      } catch (e) {
        setError('Error cargando sitios');
        setSitios([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSitios();
  }, [user, location.pathname]);

  const recomendaciones = [
    { img: '/images/Coleccion_sitios_ecoturisticos/paisaje_01.webp', title: 'Reserva La Nona', desc: 'Experiencia única en naturaleza' },
    { img: '/images/Coleccion_sitios_ecoturisticos/paisaje_02.webp', title: 'Cascada del Amor', desc: 'Belleza natural incomparable' },
    { img: '/images/Coleccion_sitios_ecoturisticos/paisaje_03.webp', title: 'Parque Ucumarí', desc: 'Aventura en la montaña' },
    { img: '/images/Coleccion_sitios_ecoturisticos/paisaje_04.webp', title: 'Laguna del Otún', desc: 'Espejo natural de los Andes' }
  ];

  const filteredSitios = useMemo(() => {
    if (!searchText.trim()) return sitios;
    const lower = searchText.toLowerCase();
    return sitios.filter(s => 
      (s.title || '').toLowerCase().includes(lower) || 
      (s.location || '').toLowerCase().includes(lower)
    );
  }, [sitios, searchText]);

  const handleCarouselNext = (carouselIdx) => {
    setCarouselIndex(prev => {
      const newIndexes = [...prev];
      if (filteredSitios.length === 0) return newIndexes;
      newIndexes[carouselIdx] = (newIndexes[carouselIdx] + 1) % Math.max(filteredSitios.length, 1);
      return newIndexes;
    });
  };

  const handleCarouselPrev = (carouselIdx) => {
    setCarouselIndex(prev => {
      const newIndexes = [...prev];
      if (filteredSitios.length === 0) return newIndexes;
      newIndexes[carouselIdx] = (newIndexes[carouselIdx] - 1 + Math.max(filteredSitios.length, 1)) % Math.max(filteredSitios.length, 1);
      return newIndexes;
    });
  };

  const getVisibleItems = (startIndex) => {
    const items = [];
    for (let i = 0; i < 4; i++) {
      if (filteredSitios.length > 0) {
        items.push(filteredSitios[(startIndex + i) % filteredSitios.length]);
      }
    }
    return items;
  };

  return (
    <div className="min-h-screen coleccion-shell font-['Albert_Sans'] pt-14">
      {loading && (
        <div className="w-full flex justify-center items-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-400/30 border-t-emerald-400"></div>
        </div>
      )}
      {error && (
        <div className="w-full text-center text-rose-600 font-semibold py-8">{error}</div>
      )}
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={onNavigateHome}>
            <img loading="lazy" src="/images/Pagina_inicio/nature-svgrepo-com.svg" alt="Logo" className="h-12 w-12" />
            <div className="flex flex-col leading-tight">
              <h3 className="text-lg font-bold text-gray-800">Conexion</h3>
              <h5 className="text-sm text-gray-600">EcoRisaralda</h5>
              <h6 className="text-xs text-green-600 font-semibold">USUARIO</h6>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* User display */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50">
              <img loading="lazy" src="/images/Coleccion_sitios_ecoturisticos/user.svg" alt="User" className="h-6 w-6" />
              <span className="text-sm font-medium text-gray-800">{userName}</span>
            </div>

            {/* Favorites icon */}
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <img loading="lazy" src="/images/Coleccion_sitios_ecoturisticos/favourites.webp" alt="Favoritos" className="h-6 w-6" />
            </button>

            {/* Dropdown menu */}
            <div className="md:hidden">
              <img loading="lazy" src="/images/Pagina_inicio/img_drop_down.webp" alt="Menu" className="h-6 w-6 cursor-pointer" />
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section with Search */}
        <section
          className="coleccion-hero relative h-96 bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: "url('/images/Coleccion_sitios_ecoturisticos/paisaje_01.webp')" }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="relative z-10 w-full max-w-2xl px-4">
            <div className="flex w-full max-w-2xl items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 shadow-sm">
              <svg className="h-5 w-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.6-4.15a7.75 7.75 0 11-15.5 0 7.75 7.75 0 0115.5 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar destinos asombrosos..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
              />
            </div>
          </div>
        </section>

        {/* Carousels Section */}
        <section className="py-16 px-4 sm:px-8 md:px-20 bg-gray-50">
          <div className="max-w-7xl mx-auto space-y-16">
            {/* Carousel 1 - Destinos Populares */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Destinos Populares</h2>
              <div className="relative">
                <button
                  onClick={() => handleCarouselPrev(0)}
                  disabled={carouselIndex[0] === 0}
                  className="coleccion-carousel-nav absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg disabled:cursor-not-allowed"
                >
                  <span className="text-2xl font-bold text-gray-700">&lsaquo;</span>
                </button>
                <button
                  onClick={() => handleCarouselNext(0)}
                  disabled={carouselIndex[0] >= sitios.length - 4}
                  className="coleccion-carousel-nav absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg disabled:cursor-not-allowed"
                >
                  <span className="text-2xl font-bold text-gray-700">&rsaquo;</span>
                </button>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {getVisibleItems(carouselIndex[0]).map((sitio, index) => (
                    <div
                      key={index}
                      onClick={onNavigateSitio}
                      className="coleccion-card bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition stagger-item"
                      style={{ '--stagger-delay': `${index * 40}ms` }}
                    >
                      <img loading="lazy" src={sitio.img} alt={sitio.title} className="w-full h-48 object-cover" />
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-800 mb-1" style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{sitio.title}</h3>
                        <p className="text-sm text-gray-600">{sitio.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Carousel 2 - Reservas Naturales */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Reservas Naturales</h2>
              <div className="relative">
                <button
                  onClick={() => handleCarouselPrev(1)}
                  disabled={carouselIndex[1] === 0}
                  className="coleccion-carousel-nav absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg disabled:cursor-not-allowed"
                >
                  <span className="text-2xl font-bold text-gray-700">&lsaquo;</span>
                </button>
                <button
                  onClick={() => handleCarouselNext(1)}
                  disabled={carouselIndex[1] >= sitios.length - 4}
                  className="coleccion-carousel-nav absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg disabled:cursor-not-allowed"
                >
                  <span className="text-2xl font-bold text-gray-700">&rsaquo;</span>
                </button>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {getVisibleItems(carouselIndex[1]).map((sitio, index) => (
                    <div
                      key={index}
                      onClick={onNavigateSitio}
                      className="coleccion-card bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition stagger-item"
                      style={{ '--stagger-delay': `${index * 40}ms` }}
                    >
                      <img loading="lazy" src={sitio.img} alt={sitio.title} className="w-full h-48 object-cover" />
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-800 mb-1">{sitio.title}</h3>
                        <p className="text-sm text-gray-600">{sitio.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Carousel 3 - Cascadas y Ríos */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Cascadas y Ríos</h2>
              <div className="relative">
                <button
                  onClick={() => handleCarouselPrev(2)}
                  disabled={carouselIndex[2] === 0}
                  className="coleccion-carousel-nav absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg disabled:cursor-not-allowed"
                >
                  <span className="text-2xl font-bold text-gray-700">&lsaquo;</span>
                </button>
                <button
                  onClick={() => handleCarouselNext(2)}
                  disabled={carouselIndex[2] >= sitios.length - 4}
                  className="coleccion-carousel-nav absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg disabled:cursor-not-allowed"
                >
                  <span className="text-2xl font-bold text-gray-700">&rsaquo;</span>
                </button>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {getVisibleItems(carouselIndex[2]).map((sitio, index) => (
                    <div
                      key={index}
                      onClick={onNavigateSitio}
                      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition stagger-item"
                      style={{ '--stagger-delay': `${index * 40}ms` }}
                    >
                      <img loading="lazy" src={sitio.img} alt={sitio.title} className="w-full h-48 object-cover" />
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-800 mb-1">{sitio.title}</h3>
                        <p className="text-sm text-gray-600">{sitio.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recomendaciones Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Recomendaciones</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-hidden pr-4 md:pr-6 lg:pr-8">
              {(() => {
                const cards = recomendaciones.map((item, index) => {
                  // Add extra right margin to the last card
                  return (
                    <div
                      key={index}
                      onClick={onNavigateSitio}
                      className={"coleccion-reco-card relative group cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-xl transition stagger-item min-w-0"}
                      style={{ '--stagger-delay': `${Math.min(index, 10) * 50}ms` }}
                    >
                      <img loading="lazy" src={item.img} alt={item.title} className="w-full h-64 object-cover" />
                      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                          <p className="text-sm">{item.desc}</p>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 z-20 p-4 text-white bg-gradient-to-t from-black to-transparent group-hover:opacity-0 transition-opacity">
                        <h3 className="text-lg font-bold">{item.title}</h3>
                      </div>
                    </div>
                  );
                });
                // Add invisible placeholder cards to fill the last row if needed
                const cols = 4;
                const remainder = cards.length % cols;
                if (remainder !== 0) {
                  for (let i = 0; i < cols - remainder; i++) {
                    cards.push(<div key={`placeholder-${i}`} className="invisible" />);
                  }
                }
                return cards;
              })()}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 text-center md:text-left justify-items-center md:justify-items-start">
          {/* Column 1 */}
          <div>
            <h2 className="text-2xl font-bold mb-2">Conexion</h2>
            <p className="text-gray-400 mb-4">EcoRisaralda</p>
            <div className="flex gap-4 mb-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <i className="fab fa-linkedin text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <i className="fab fa-youtube text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <i className="fab fa-instagram text-xl"></i>
              </a>
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
                <li><button onClick={onNavigateSobreNosotros} className="text-gray-400 hover:text-white transition">Sobre nosotros</button></li>
                <li><button onClick={onNavigatePrivacidad} className="text-gray-400 hover:text-white transition">Privacidad</button></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Navegación rápida</h4>
            <ul className="space-y-2">
              <li><button onClick={onNavigateHome} className="text-gray-400 hover:text-white transition">Inicio</button></li>
              <li><button onClick={onNavigateSobreNosotros} className="text-gray-400 hover:text-white transition">Sobre nosotros</button></li>
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
