import { useState, useEffect } from 'react';
import Footer from './components/Footer';
import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api, fetchRecommendations, fetchUpcomingEvents } from './services/api';

function HomePage({ onNavigateLogin, onNavigateRegister, onNavigateColeccion, onNavigateOferta, onNavigatePrivacidad, onNavigateSobreNosotros }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const [populareIndex, setPopularesIndex] = useState(0);
  const [eventosIndex, setEventosIndex] = useState(0);
  const [eventosTimer, setEventosTimer] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [eventCardIndex, setEventCardIndex] = useState(0);
  const [eventCardVisible, setEventCardVisible] = useState(true);
  const [loadingNextEvent, setLoadingNextEvent] = useState(false);
  const [recommendedCount, setRecommendedCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sitios populares de ejemplo (reemplazar con fetch si es necesario)
  const sitios = [
    { id: 1, nombre: "Nevado del Tolima", municipio: "Municipio de Santa Isabel", imagen: "/images/Coleccion_sitios_ecoturisticos/paisaje_01.webp" },
    { id: 2, nombre: "Laguna del Otún", municipio: "Municipio de Pereira", imagen: "/images/Coleccion_sitios_ecoturisticos/paisaje_02.webp" },
    { id: 3, nombre: "Termales de Santa Rosa", municipio: "Municipio de Santa Rosa de Cabal", imagen: "/images/Coleccion_sitios_ecoturisticos/paisaje_03.webp" },
    { id: 4, nombre: "Cascada del Amor", municipio: "Municipio de Marsella", imagen: "/images/Coleccion_sitios_ecoturisticos/paisaje_04.webp" },
    { id: 5, nombre: "Parque Ucumarí", municipio: "Municipio de Pereira", imagen: "/images/Coleccion_sitios_ecoturisticos/paisaje_05.webp" },
  ];

  const beneficios = [
    {
      id: 1,
      title: 'Explora destinos únicos y auténticos',
      image: '/images/Pagina_inicio/marcador.webp',
      desc: 'Descubre lugares ecoturísticos verificados, con información detallada, fotos y consejos locales para todos los viajeros.'
    },
    {
      id: 2,
      title: 'Recibe alertas y eventos en tiempo real',
      image: '/images/Pagina_inicio/activo.webp',
      desc: 'Mantente informado sobre nuevos eventos, actividades y experiencias cerca de ti.'
    },
    {
      id: 3,
      title: 'Comparte y califica tus experiencias',
      image: '/images/Pagina_inicio/chat-bot.webp',
      desc: 'Deja reseñas, comparte recomendaciones y ayuda a otros a vivir mejores aventuras en la naturaleza.'
    },
  ];

  // ...existing code...

  // Carousel populares
  const visibleItems = 3;
  const totalItems = sitios.length;
  const canGoNext = populareIndex < totalItems - visibleItems;
  const canGoPrev = populareIndex > 0;

  const handlePopularesNext = () => {
    if (canGoNext) setPopularesIndex(populareIndex + 1);
  };

  const handlePopularesPrev = () => {
    if (canGoPrev) setPopularesIndex(populareIndex - 1);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPopularesIndex((prev) => (prev < totalItems - visibleItems ? prev + 1 : prev));
    }, 5000);
    return () => clearInterval(interval);
  }, [totalItems]);

  // Carousel eventos
  const handleEventosChange = (index) => {
    if (upcomingEvents.length === 0) return;
    setFadeIn(false);
    setTimeout(() => {
      setEventosIndex(index);
      setFadeIn(true);
    }, 300);
    clearInterval(eventosTimer);
    const timer = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setEventosIndex((prev) => (prev + 1) % upcomingEvents.length);
        setFadeIn(true);
      }, 300);
    }, 5000);
    setEventosTimer(timer);
  };

  useEffect(() => {
    if (upcomingEvents.length === 0) return undefined;
    const timer = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setEventosIndex((prev) => (prev + 1) % upcomingEvents.length);
        setFadeIn(true);
      }, 300);
    }, 5000);
    setEventosTimer(timer);
    return () => clearInterval(timer);
  }, [upcomingEvents.length]);

  useEffect(() => {
    let active = true;
    const loadNextEvent = async () => {
      try {
        setLoadingNextEvent(true);
        const data = await fetchUpcomingEvents(6);
        if (active) {
          setUpcomingEvents(Array.isArray(data) ? data : []);
          setEventCardIndex(0);
          setEventCardVisible(true);
        }
      } catch (_) {
        if (active) setUpcomingEvents([]);
      } finally {
        if (active) setLoadingNextEvent(false);
      }
    };

    loadNextEvent();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    if (!user || user.role !== 'user') {
      setRecommendedCount(0);
      return undefined;
    }

    const loadRecommendationCount = async () => {
      try {
        const [recommendations, favoritesResponse] = await Promise.all([
          fetchRecommendations(),
          api.get('/api/favorites'),
        ]);
        if (!active) return;
        const favorites = Array.isArray(favoritesResponse?.data) ? favoritesResponse.data : [];
        const favoriteIds = new Set(favorites.map((fav) => Number(fav.id)));
        const recs = Array.isArray(recommendations) ? recommendations : [];
        const newCount = recs.filter((rec) => !favoriteIds.has(Number(rec.id))).length;
        setRecommendedCount(newCount);
      } catch (_) {
        if (active) setRecommendedCount(0);
      }
    };

    loadRecommendationCount();

    return () => {
      active = false;
    };
  }, [user]);

  useEffect(() => {
    if (!user || upcomingEvents.length <= 1) return undefined;
    let mounted = true;
    const interval = setInterval(() => {
      if (!mounted) return;
      setEventCardVisible(false);
      setTimeout(() => {
        if (!mounted) return;
        setEventCardIndex((prev) => (prev + 1) % upcomingEvents.length);
        setEventCardVisible(true);
      }, 250);
    }, 5000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [user, upcomingEvents.length]);

  const formatEventDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const day = date.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const time = date.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return `${day} ${time}`;
  };

  const storageUrl = (path) => (path ? `${import.meta.env.VITE_API_URL}/api/files/${path}` : '');

  const activeEvent = upcomingEvents[eventCardIndex] || null;
  const activeEventPlaceId = activeEvent?.place?.id || activeEvent?.place_id || null;
  const handleEventClick = () => {
    if (!activeEventPlaceId) return;
    if (user?.role === 'admin') {
      navigate(`/admin/sitio/${activeEventPlaceId}`);
      return;
    }
    if (user?.role === 'operator') {
      navigate(`/operador/sitio/${activeEventPlaceId}`);
      return;
    }
    if (user?.role) {
      navigate(`/turista/sitio/${activeEventPlaceId}`);
      return;
    }
    navigate(`/sitio/${activeEventPlaceId}`);
  };

  const activeCarouselEvent = upcomingEvents[eventosIndex] || null;
  const activeCarouselPlaceId = activeCarouselEvent?.place?.id || activeCarouselEvent?.place_id || null;
  const handleCarouselEventClick = () => {
    if (!activeCarouselPlaceId) return;
    if (user?.role === 'admin') {
      navigate(`/admin/sitio/${activeCarouselPlaceId}`);
      return;
    }
    if (user?.role === 'operator') {
      navigate(`/operador/sitio/${activeCarouselPlaceId}`);
      return;
    }
    if (user?.role) {
      navigate(`/turista/sitio/${activeCarouselPlaceId}`);
      return;
    }
    navigate(`/sitio/${activeCarouselPlaceId}`);
  };

  // Altura del header: 56px (h-14)
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white text-slate-900 pt-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(76,175,80,0.08),transparent_35%)]" />

      {/* Back to top button */}
      {scrollY > 100 && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 rounded-full bg-emerald-500 px-3 py-3 text-white shadow-lg shadow-emerald-500/40 transition hover:scale-110 hover:bg-emerald-600"
          aria-label="Volver arriba"
        >
          ↑
        </button>
      )}

      <main className="relative z-10">
        <section
          className="relative flex items-center overflow-hidden bg-cover bg-center min-h-[80vh]"
          style={{
            backgroundImage: "url(/images/Pagina_inicio/ecoturismo.webp)",
            minHeight:
              typeof window !== 'undefined'
                ? (window.innerWidth === 390 && window.innerHeight === 844
                    ? '85vh'
                    : window.innerWidth === 375 && window.innerHeight === 667
                      ? '110vh'
                      : undefined)
                : undefined
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/50 md:from-white md:via-white/60 md:to-black/20 opacity-100" />
          <div className="relative z-10 flex flex-col justify-center items-start px-6 md:px-12 w-full max-w-2xl" style={{minHeight:'60vh'}}>
            <div className="inline-flex items-center gap-3 rounded-full bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {user ? 'Bienvenido' : 'Ecoturismo'}
            </div>
            <div className="mt-4 max-w-2xl space-y-4 drop-shadow-[0_0_12px_rgba(255,255,255,1)] sm:drop-shadow-none">
              {user ? (
                <>
                  <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl flex flex-wrap items-center gap-2">
                    <span>Hola,</span>
                    <span className="whitespace-nowrap md:ml-1 md:mt-0.5 align-middle" title={user.name}>
                      {user.name ? (user.name.length > 24 ? user.name.slice(0, 24) + '...' : user.name) : 'usuario'}
                    </span>
                  </h1>
                  <p className="text-lg text-slate-700">
                    Nos alegra tenerte de regreso. Inspírate con nuevos destinos, guarda tus rutas preferidas
                    y descubre eventos cercanos para vivir la naturaleza con propósito.
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
                    Explora, guarda y personaliza tus rutas ecoturísticas en Risaralda
                  </h1>
                  <p className="text-lg text-slate-700">
                    Conecta con la naturaleza, recibe eventos cercanos y guarda tus sitios favoritos. Todo sincronizado con tu perfil y preferencias.
                  </p>
                </>
              )}
            </div>
            <div className="mt-6 flex flex-wrap gap-4">
              <button
                onClick={onNavigateColeccion}
                className="rounded-full bg-emerald-500 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:bg-emerald-400"
              >
                Explorar colección
              </button>
            </div>
          </div>
          
          {/* Cards flotantes a la derecha */}
          <div className="absolute bottom-4 right-2 z-40 flex flex-row items-center justify-end gap-2 md:bottom-8 md:right-8 md:items-end md:gap-3">
            {user && (
              <button
                type="button"
                onClick={handleEventClick}
                disabled={!activeEventPlaceId}
                className={`flex flex-col border border-white/30 bg-white/15 backdrop-blur-lg shadow-2xl transition-all duration-500 
                  px-4 py-2 rounded-full w-auto min-h-0 justify-center items-center text-center /* Mobile pill */
                  md:w-auto md:max-w-xs md:min-w-[140px] md:min-h-[110px] md:rounded-lg md:p-3 md:items-end md:text-right /* Desktop card */
                  ${activeEventPlaceId ? 'cursor-pointer hover:-translate-y-0.5 hover:bg-white/20' : 'cursor-default'} 
                  ${eventCardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                style={{ fontSize: '0.91rem' }}
              >
                {/* Desktop Version */}
                <div className="hidden md:flex md:flex-col md:items-end">
                  <p className="text-xs uppercase tracking-wide text-white font-bold">PRÓXIMO EVENTO</p>
                  {loadingNextEvent ? (
                    <p className="mt-1 text-xs text-white/90">Cargando evento...</p>
                  ) : activeEvent ? (
                    <>
                      <p className="mt-1 text-base font-bold text-white line-clamp-1">{activeEvent.title || 'Evento ecoturistico'}</p>
                      <p className="text-xs text-white/90 line-clamp-1">{activeEvent.place?.name || 'Sitio ecoturistico'}</p>
                      <p className="text-xs text-white">{formatEventDate(activeEvent.starts_at)}</p>
                    </>
                  ) : (
                    <p className="mt-1 text-xs text-white/90">No hay eventos proximos, mantente atento.</p>
                  )}
                </div>
                {/* Mobile Pill Version */}
                <div className="md:hidden flex items-center justify-center">
                  {loadingNextEvent ? (
                    <p className="text-sm font-medium text-slate-700">Cargando...</p>
                  ) : activeEvent ? (
                    <p className="text-sm font-medium text-slate-700 line-clamp-1 max-w-[130px] sm:max-w-[180px]">{activeEvent.title || 'Evento ecoturistico'}</p>
                  ) : (
                    <p className="text-sm font-medium text-slate-700">Sin eventos</p>
                  )}
                </div>
              </button>
            )}
            {user?.role === 'user' && (
              <button
                type="button"
                onClick={() => navigate('/turista/coleccion#recomendaciones')}
                className="flex flex-col border border-white/30 bg-white/15 backdrop-blur-lg shadow-2xl transition hover:-translate-y-0.5 hover:bg-white/20
                  px-4 py-2 rounded-full w-auto min-h-0 justify-center items-center text-center /* Mobile pill */
                  md:w-auto md:max-w-xs md:min-w-[140px] md:min-h-[110px] md:rounded-lg md:p-3 md:items-end md:text-right /* Desktop card */"
                style={{ fontSize: '0.91rem' }}
              >
                {/* Desktop Version */}
                <div className="hidden md:flex md:flex-col md:items-end">
                  <p className="text-xs uppercase tracking-wide text-white font-bold">FAVORITOS</p>
                  <p className="mt-1 text-base font-bold text-white">
                    {recommendedCount} {recommendedCount === 1 ? 'nuevo sitio' : 'nuevos sitios'}
                  </p>
                  <p className="text-xs text-white">Listos para explorar</p>
                </div>
                {/* Mobile Pill Version */}
                <div className="md:hidden flex items-center justify-center">
                  <p className="text-sm font-medium text-slate-700">
                    {recommendedCount} {recommendedCount === 1 ? 'nuevo sitio' : 'nuevos sitios'}
                  </p>
                </div>
              </button>
            )}
          </div>
        </section>

        {/* FEATURES STRIP */}
        <section className="py-10 mt-8">
          <div className="mx-auto grid max-w-6xl gap-6 px-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'Preferencias inteligentes',
                desc: 'Recibe sugerencias y alertas según lo que te gusta explorar.',
              },
              {
                title: 'Colección personal',
                desc: 'Guarda sitios, crea rutas y accede offline cuando lo necesites.',
              },
              {
                title: 'Eventos verificados',
                desc: 'Calendario eco con curaduría local y notificaciones oportunas.',
              },
              {
                title: 'Seguridad y acompañamiento',
                desc: 'Consejos de acceso, clima y contactos de apoyo en cada lugar.',
              },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* EVENTOS */}
        <section className="w-full py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-emerald-700">Agenda viva</p>
                <h2 className="text-3xl font-semibold text-slate-900">Nuevos eventos</h2>
                <p className="mt-2 text-slate-600">Explora los eventos disponibles del momento.</p>
              </div>
            </div>

            {upcomingEvents.length > 0 ? (
              <>
                {/* Carousel eventos */}
                <button
                  type="button"
                  onClick={handleCarouselEventClick}
                  disabled={!activeCarouselPlaceId}
                  className={`group relative w-full overflow-hidden rounded-lg border border-emerald-100 shadow-lg shadow-emerald-100/50 min-h-96 bg-slate-900 text-left transition ${activeCarouselPlaceId ? 'cursor-pointer hover:-translate-y-0.5' : 'cursor-default'}`}
                >
                  {/* Background image con crossfade */}
                  <div
                    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1200ms] ease-in-out ${fadeIn ? 'opacity-100 event-carousel-bg-zoom' : 'opacity-0'}`}
                    style={{ backgroundImage: upcomingEvents[eventosIndex]?.image ? `url(${storageUrl(upcomingEvents[eventosIndex]?.image)})` : 'none' }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />

                  <div className={`relative flex h-full flex-col items-start justify-start gap-2 px-8 pb-8 pt-4 transition-all duration-[900ms] transform ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}> 
                    <p className="text-xs uppercase tracking-[0.2em] text-white/80">Próximo evento</p>
                    <h3 className="text-2xl md:text-3xl font-bold text-white line-clamp-2 max-w-full break-all sm:break-words">
                      {upcomingEvents[eventosIndex]?.title || 'Evento ecoturistico'}
                    </h3>
                    <p className="text-white/90">Recibe alertas y guarda en tu agenda.</p>
                  </div>

                  {/* Flechas navegación sutiles y pequeñas */}
                  <span
                    onClick={e => { e.stopPropagation(); handleEventosChange((eventosIndex - 1 + upcomingEvents.length) % upcomingEvents.length); }}
                    className="z-20 absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 backdrop-blur-sm border border-emerald-900/20 px-2 py-1 text-lg font-bold text-emerald-100 shadow-md opacity-0 group-hover:opacity-85 transition-opacity duration-200 hover:bg-black/60 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-900/30 cursor-pointer select-none"
                    aria-label="Evento anterior"
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); handleEventosChange((eventosIndex - 1 + upcomingEvents.length) % upcomingEvents.length); } }}
                    style={{ pointerEvents: 'auto' }}
                  >
                    &#60;
                  </span>
                  <span
                    onClick={e => { e.stopPropagation(); handleEventosChange((eventosIndex + 1) % upcomingEvents.length); }}
                    className="z-20 absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 backdrop-blur-sm border border-emerald-900/20 px-2 py-1 text-lg font-bold text-emerald-100 shadow-md opacity-0 group-hover:opacity-85 transition-opacity duration-200 hover:bg-black/60 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-900/30 cursor-pointer select-none"
                    aria-label="Siguiente evento"
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); handleEventosChange((eventosIndex + 1) % upcomingEvents.length); } }}
                    style={{ pointerEvents: 'auto' }}
                  >
                    &#62;
                  </span>
                </button>

                {/* Dots fuera de la card */}
                <div className="mt-4 flex justify-center gap-3">
                  {upcomingEvents.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleEventosChange(idx)}
                      className={`h-2.5 w-2.5 rounded-full transition ${idx === eventosIndex ? 'bg-emerald-600' : 'bg-emerald-200'}`}
                      aria-label={`Ir al evento ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-6 text-center text-sm text-slate-600">
                No hay eventos disponibles en este momento.
              </div>
            )}
          </div>
        </section>

        {/* BENEFICIOS */}
        <section className="pb-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-10 text-center">
              <p className="text-sm uppercase tracking-[0.25em] text-emerald-700">Por qué usar Conexión EcoRisaralda</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">Diseñado para viajeros conscientes</h2>
              <p className="mt-3 text-slate-600">Configura, guarda y comparte experiencias sostenibles mientras recibes la mejor curaduría local.</p>
            </div>

            <div className="grid gap-10 md:grid-cols-3">
              {beneficios.map((beneficio) => (
                <div key={beneficio.id} className="flex min-h-64 w-full flex-col gap-4 rounded-lg border border-emerald-100 bg-emerald-50/30 p-6 text-center shadow-sm shadow-emerald-100/50">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-emerald-100/50">
                    <img loading="lazy" src={beneficio.image} alt={beneficio.title} className="h-10 w-10" />
                  </div>
                  <p className="text-base font-semibold text-slate-900 leading-snug">{beneficio.title}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{beneficio.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-col items-center gap-4 rounded-lg bg-transparent px-6 py-8 text-center">
              <h3 className="text-2xl font-semibold text-slate-900">Configura tus preferencias en minutos</h3>
              <p className="max-w-2xl text-slate-700">Activa notificaciones, selecciona categorías de interés y guarda sitios para recibir recordatorios antes de tus salidas.</p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={onNavigateOferta}
                  className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-700"
                >
                  Ver cómo funciona
                </button>
                {!user && (
                  <button
                    onClick={onNavigateRegister}
                    className="rounded-full border border-emerald-300 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-emerald-50"
                  >
                    Crear cuenta ahora
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <Footer 
        onNavigateSobreNosotros={onNavigateSobreNosotros}
        onNavigatePrivacidad={onNavigatePrivacidad}
        onNavigateQueOfrecemos={() => window.location.href = '/que-ofrecemos'}
        onNavigateColeccion={() => window.location.href = '/coleccion'}
        onNavigateLogin={() => window.location.href = '/login'}
        onNavigateInicio={() => window.location.href = '/'}
      />
    </div>
  );
}

export default HomePage;
