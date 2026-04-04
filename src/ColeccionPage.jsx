import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Footer from './components/Footer';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { getAllPlaces } from './services/placesApi';
import { api, fetchRecommendations } from './services/api';
import SitioCard from './components/SitioCard';
import SearchBar from './components/SearchBar';

// (HU005): Importamos nuestro Componente Cartográfico Limpio
import InteractiveMap from './components/InteractiveMap';
import RecomendacionesCarrusel from './components/RecomendacionesCarrusel';

export default function ColeccionPage({ onNavigateHome, onNavigateLogin, onNavigatePrivacidad, onNavigateSobreNosotros }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [scrollToTop, setScrollToTop] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState([0, 0, 0]);
  const [sitiosAPI, setSitiosAPI] = useState([]);
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [tagMenuOpen, setTagMenuOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const tagMenuRef = useRef(null);
  const sortMenuRef = useRef(null);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [randomRecommendations, setRandomRecommendations] = useState([]);

  // Toda la basura cartográfica (mapRef, containers, icons, Leaflet) fue EXTERNALIZADA con éxito! 🚀

  const loadSites = useCallback(async () => {
    try {
      setLoading(true);
      setApiError(null);
      const data = await getAllPlaces('');
      setSitiosAPI(data);
      if (!Array.isArray(data) || data.length === 0) {
        setApiError('La API respondió vacío o no hay sitios disponibles.');
      }
    } catch (error) {
      setApiError('Error cargando sitios: ' + (error?.message || 'Error desconocido'));
      setSitiosAPI([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSites();
  }, [user, location.pathname, loadSites]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tagMenuRef.current && !tagMenuRef.current.contains(event.target)) setTagMenuOpen(false);
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) setSortMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (location.hash !== '#recomendaciones') return;
    const target = document.getElementById('recomendaciones');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.hash]);

  const isTourist = user && user.role !== 'admin' && user.role !== 'operator';
  const isAdminOrOperator = user && (user.role === 'admin' || user.role === 'operator');
  const isGuest = !user;
  const shortText = (value, max = 110) => {
    if (!value) return '';
    const text = value.toString().trim();
    return text.length > max ? `${text.slice(0, max - 3)}...` : text;
  };

  const loadFavorites = useCallback(async () => {
    if (!isTourist) return;
    try {
      const response = await api.get('/api/favorites');
      const ids = new Set((response.data || []).map((fav) => fav.id));
      setFavoriteIds(ids);
    } catch (error) {
      console.error('Error cargando favoritos:', error);
    }
  }, [isTourist]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  useEffect(() => {
    const loadRecommendations = async () => {
      if (!isTourist) return;
      try {
        setRecommendationsLoading(true);
        const data = await fetchRecommendations();
        setRecommendations(Array.isArray(data) ? data : []);
      } catch (error) {
        setRecommendations([]);
      } finally {
        setRecommendationsLoading(false);
      }
    };
    loadRecommendations();
  }, [isTourist]);

  useEffect(() => {
    if (isTourist) {
      if (recommendations.length > 0) { setRandomRecommendations([]); return; }
      if (sitiosAPI.length === 0) return;
      setRandomRecommendations([...sitiosAPI].sort(() => Math.random() - 0.5));
      return;
    }
    if (!isAdminOrOperator && !isGuest) return;
    if (sitiosAPI.length === 0) { setRandomRecommendations([]); return; }
    setRandomRecommendations([...sitiosAPI].sort(() => Math.random() - 0.5));
  }, [isTourist, isAdminOrOperator, isGuest, recommendations, sitiosAPI]);

  const handleToggleFavorite = async (event, sitioId) => {
    event.stopPropagation();
    if (!user) { onNavigateLogin?.(); return; }
    if (!isTourist) return;
    const isFavorite = favoriteIds.has(sitioId);
    try {
      if (isFavorite) await api.delete(`/api/places/${sitioId}/favorite`);
      else await api.post(`/api/places/${sitioId}/favorite`);
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (isFavorite) next.delete(sitioId); else next.add(sitioId);
        return next;
      });
    } catch (error) {
      console.error('Error actualizando favorito:', error);
    }
  };

  const uniqueTags = useMemo(() => {
    const tags = new Set();
    sitiosAPI.forEach(sitio => {
      const labelNames = Array.isArray(sitio.label) ? sitio.label.map((l) => l?.name ?? l) : Array.isArray(sitio.labels) ? sitio.labels.map((l) => l?.name ?? l) : [];
      labelNames.forEach(t => { if (t) tags.add(t); });
    });
    return Array.from(tags).sort();
  }, [sitiosAPI]);

  const searchSuggestions = useMemo(() => {
    if (!searchText.trim()) return [];
    const lower = searchText.toLowerCase();
    return sitiosAPI.filter(s => {
      const nameMatches = (s.name || s.nombre || '').toLowerCase().includes(lower);
      const textMatches = (s.slogan || s.description || '').toLowerCase().includes(lower) || (s.localization || '').toLowerCase().includes(lower);
      return nameMatches || textMatches;
    }).slice(0, 5);
  }, [sitiosAPI, searchText]);

  const filteredSitios = useMemo(() => {
    let result = [...sitiosAPI];
    if (searchText.trim()) {
       const lower = searchText.toLowerCase();
       result = result.filter(s => {
         const nameMatches = (s.name || s.nombre || '').toLowerCase().includes(lower);
         const textMatches = (s.slogan || s.description || '').toLowerCase().includes(lower) || (s.localization || '').toLowerCase().includes(lower);
         return nameMatches || textMatches;
       });
    }
    if (selectedTag) {
       result = result.filter(s => {
          const tags = Array.isArray(s.label) ? s.label.map(t => t?.name || t) : Array.isArray(s.labels) ? s.labels.map(t => t?.name || t) : [];
          return tags.includes(selectedTag);
       });
    }
    if (sortBy === 'recent') { result.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)); }
    else if (sortBy === 'az') { result.sort((a, b) => (a.name || a.nombre || '').localeCompare(b.name || b.nombre || '')); }
    else if (sortBy === 'za') { result.sort((a, b) => (b.name || b.nombre || '').localeCompare(a.name || a.nombre || '')); }
    return result;
  }, [sitiosAPI, searchText, selectedTag, sortBy]);

  // Datos de sitios fake...
  const sitios = [{ id: 1, nombre: 'Santuario Fauna Flora Otún', ubicación: 'Via Pereira', imagen: '/images/Pagina_inicio/Santuario-Fauna-Flora-Otun-Quimbaya-Ucumari-13.webp' }];
  const recomendaciones = [{ id: 1, nombre: 'Ecoturismo local', imagen: '/images/Pagina_inicio/Santuario-Fauna-Flora-Otun-Quimbaya-Ucumari-13.webp' }];
  const heroShots = [
    { id: 'h1', nombre: 'Palmas de cera', imagen: '/images/Coleccion_sitios_ecoturisticos/paisaje_01.webp' },
    { id: 'h2', nombre: 'Bandera', imagen: '/images/Coleccion_sitios_ecoturisticos/paisaje_02.webp' },
    { id: 'h3', nombre: 'Colibrí', imagen: '/images/Coleccion_sitios_ecoturisticos/paisaje_03.webp' },
  ];

  const baseFallback = recommendations.length === 0 ? randomRecommendations : sitiosAPI;
  const fallbackRecommendations = baseFallback.filter((item) => item?.id && !recommendations.some((rec) => rec.id === item.id));
  const recommendedList = isTourist ? [...recommendations, ...fallbackRecommendations].slice(0, 8) : ((isAdminOrOperator || isGuest) ? randomRecommendations.slice(0, 8) : recomendaciones);
  const storageUrl = (path) => (path ? `${import.meta.env.VITE_API_URL}/api/files/${path}` : '');

  return (
    <div className="min-h-screen coleccion-shell text-slate-900 overflow-x-hidden pt-14">
      <main className="pt-0">
        {/* Sección 1: Hero */}
        <section className="relative w-full pt-16 pb-28 sm:py-16 md:py-12 lg:py-20 coleccion-hero z-40">
          <div className="relative z-10 flex flex-col items-center gap-12 px-6 xl:flex-row xl:items-center xl:justify-center xl:gap-16 2xl:gap-24 md:px-12 max-w-[1536px] mx-auto">
            <div className="w-full xl:w-auto flex justify-center">
              <div className="flex w-full md:w-auto gap-4 lg:gap-6 xl:gap-8 justify-center">
                {heroShots.map((shot, idx) => (
                  <div key={shot.id} className="flex items-end w-[30vw] sm:w-[130px] md:w-[150px] lg:w-[180px] xl:w-[210px]">
                    <img fetchpriority="high" decoding="async" src={shot.imagen} alt={shot.nombre} style={{ opacity: 0, transition: `opacity 0.8s ease ${idx * 0.2}s, transform 0.8s ease ${idx * 0.2}s`, transform: 'translateY(18px)' }}
                      onLoad={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
                      className={`object-cover rounded-[18px] sm:rounded-[22px] shadow-lg w-full h-[220px] min-[400px]:h-[320px] md:h-[260px] lg:h-[440px] xl:h-[480px] ${idx === 1 ? 'h-[240px] min-[400px]:h-[340px] md:h-[290px] lg:h-[470px] xl:h-[510px]' : ''}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-[60] w-full xl:w-[500px] flex flex-col items-center xl:items-start gap-6 xl:gap-8 shrink-0">
              <div className="text-center xl:text-left space-y-2">
                <h1 className="text-3xl min-[400px]:text-4xl md:text-3xl lg:text-5xl font-bold text-slate-900 leading-tight">Explora y conecta con la naturaleza</h1>
                <p className="text-slate-700 md:text-sm lg:text-base">Busca sitios, actividades y experiencias sostenibles.</p>
              </div>
              <div className="flex flex-col gap-3 md:gap-4 w-full max-w-[500px]">
                <SearchBar onSearch={(val) => setSearchText(val)} suggestions={searchSuggestions} onSelectSuggestion={(item) => setSearchText(item.nombre || item.name || '')} />
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full relative z-[50]">
                  {/* Flitros Ocultos en el componente por legibilidad */}
                  <div className="relative flex-1" ref={tagMenuRef}>
                    <button type="button" onClick={() => setTagMenuOpen((prev) => !prev)} className="inline-flex w-full items-center justify-between gap-2 rounded-full bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-emerald-200 transition hover:bg-emerald-50 shadow-sm">
                      <span className="truncate">{selectedTag || 'Todas las etiquetas'}</span>
                      <svg className={`h-4 w-4 shrink-0 transition-transform duration-200 ${tagMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {tagMenuOpen && (
                      <div className="absolute left-0 right-0 mt-2 rounded-xl bg-white text-slate-800 shadow-lg ring-1 ring-slate-200/60 dropdown-open max-h-[80px] sm:max-h-[180px] overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-200">
                        <button type="button" onClick={() => { setSelectedTag(''); setTagMenuOpen(false); }} className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500">Todas las etiquetas</button>
                        {uniqueTags.map(tag => (
                          <button key={tag} type="button" onClick={() => { setSelectedTag(tag); setTagMenuOpen(false); }} className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500">{tag}</button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative flex-1" ref={sortMenuRef}>
                    <button type="button" onClick={() => setSortMenuOpen((prev) => !prev)} className="inline-flex w-full items-center justify-between gap-2 rounded-full bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-emerald-200 transition hover:bg-emerald-50 shadow-sm">
                      <span className="truncate">{sortBy === 'recent' ? 'Más recientes' : sortBy === 'az' ? 'A - Z' : 'Z - A'}</span>
                      <svg className={`h-4 w-4 shrink-0 transition-transform duration-200 ${sortMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {sortMenuOpen && (
                      <div className="absolute left-0 right-0 mt-2 rounded-xl overflow-hidden bg-white text-slate-800 shadow-lg ring-1 ring-slate-200/60 dropdown-open max-h-[80px] sm:max-h-[180px] overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-200">
                        <button type="button" onClick={() => { setSortBy('recent'); setSortMenuOpen(false); }} className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500">Más recientes</button>
                        <button type="button" onClick={() => { setSortBy('az'); setSortMenuOpen(false); }} className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500">A - Z</button>
                        <button type="button" onClick={() => { setSortBy('za'); setSortMenuOpen(false); }} className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500">Z - A</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección 3: Recomendaciones */}
        <RecomendacionesCarrusel 
            loading={recommendationsLoading} 
            list={recommendedList} 
            user={user} 
        />

        {/* (HU005): Sección Cartográfica Extremadamente Limpia */}
        <section className="w-full bg-white pb-20">
          <div className="px-6 md:px-12 mb-6">
            <h2 className="text-3xl font-bold">Mapa de sitios turísticos</h2>
            <p className="text-slate-600 mt-2">Explora los sitios agregados interactuando con el mapa.</p>
          </div>
          <div className="px-6 md:px-12">
            
            {/* INVOCACIÓN DEL COMPONENTE DE MAPA */}
            <InteractiveMap sitios={sitiosAPI} />
            
          </div>
        </section>

      </main>

      <Footer onNavigateSobreNosotros={() => window.location.href = '/sobre-nosotros'} onNavigatePrivacidad={() => window.location.href = '/privacidad'} onNavigateQueOfrecemos={() => window.location.href = '/que-ofrecemos'} onNavigateColeccion={() => window.location.href = '/coleccion'} onNavigateLogin={() => window.location.href = '/login'} onNavigateInicio={() => window.location.href = '/'} />
    </div>
  );
}