import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { api } from './services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faLinkedin, faYoutube, faInstagram } from '@fortawesome/free-brands-svg-icons';
import Alert from './components/Alert';
import ConfirmDialog from './components/ConfirmDialog';
import Pagination from './components/Pagination';

export default function FavoritosPage({ onNavigateSobreNosotros, onNavigatePrivacidad }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmState, setConfirmState] = useState({ open: false });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const response = await api.get('/api/favorites');
      setFavoritos(response.data);
    } catch (err) {
      setError(err.message || 'Error cargando favoritos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRemoveFavorite = async (id) => {
    setConfirmState({
      open: true,
      title: 'Eliminar favorito',
      message: '¿Eliminar este sitio de favoritos?',
      confirmLabel: 'Eliminar',
      tone: 'danger',
      onConfirm: async () => {
        try {
          await api.delete(`/api/places/${id}/favorite`);
          setFavoritos((prev) => prev.filter((fav) => fav.id !== id));
          setError(null);
        } catch (err) {
          setError(err.message || 'Error eliminando favorito');
        } finally {
          setConfirmState({ open: false });
        }
      },
    });
  };

  const handleNavigateToSite = (id) => {
    const prefix = user?.role === 'admin' ? '/admin' : user?.role === 'operator' ? '/operador' : '/turista';
    navigate(`${prefix}/sitio/${id}`);
  };

  const storageUrl = (path) => (path ? `${import.meta.env.VITE_API_URL}/api/files/${path}` : '');

  if (loading) {
    return (
      <div className="relative min-h-screen bg-white grid place-items-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-400/30 border-t-emerald-500" />
      </div>
    );
  }

  const ITEMS_PER_PAGE = 20;
  const totalPages = Math.ceil(favoritos.length / ITEMS_PER_PAGE);
  const currentFavoritos = favoritos.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="relative min-h-screen bg-white overflow-x-hidden pt-14">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
                    {error && (
                      <Alert type="error" className="mb-6 max-w-2xl mx-auto">
                        {error}
                      </Alert>
                    )}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Mis Favoritos
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {user?.name}, aquí encontrarás todos los sitios que has guardado como favoritos
            </p>
          </div>

          {/* Contador de favoritos */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <svg className="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
            </svg>
            <span className="text-slate-600 text-sm">
              {favoritos.length} {favoritos.length === 1 ? 'sitio guardado' : 'sitios guardados'}
            </span>
          </div>

          {/* Grid de Favoritos */}
          {favoritos.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-24 h-24 mx-auto mb-6 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
              </svg>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Aún no tienes favoritos
              </h3>
              <p className="text-slate-600 mb-6">
                Explora nuestra colección y guarda los sitios que más te gusten
              </p>
              <button
                onClick={() => {
                  const prefix = user?.role === 'admin' ? '/admin' : user?.role === 'operator' ? '/operador' : '/turista';
                  navigate(`${prefix}/coleccion`);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-emerald-600 transition"
              >
                Explorar colección
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentFavoritos.map((fav, index) => (
                <div
                  key={fav.id}
                  className="group relative bg-white rounded-2xl overflow-hidden ring-1 ring-slate-200 hover:ring-emerald-500 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 stagger-item"
                  style={{ '--stagger-delay': `${Math.min(index, 12) * 40}ms` }}
                >
                  {/* Imagen */}
                  <div className="relative h-48 overflow-hidden">
                    <img loading="lazy"
                      src={storageUrl(fav.cover) || fav.img}
                      alt={fav.name || fav.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Overlay con botones */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleNavigateToSite(fav.id)}
                        className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Ver detalles
                      </button>
                      <button
                        onClick={() => handleRemoveFavorite(fav.id)}
                        className="inline-flex items-center rounded-full bg-red-500/90 backdrop-blur p-2 text-white hover:bg-red-600 transition"
                        title="Eliminar de favoritos"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-1">
                      {fav.name || fav.title}
                    </h3>
                    <div className="flex items-center gap-1 text-emerald-700 text-sm mb-3">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="line-clamp-1">{fav.localization || fav.location}</span>
                    </div>
                    <p className="text-slate-600 text-sm line-clamp-2">
                      {fav.description}
                    </p>
                  </div>

                  {/* Badge de favorito */}
                  <div className="absolute top-3 right-3">
                    <div className="bg-emerald-600 rounded-full p-2 shadow-lg">
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {favoritos.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </section>



      {/* Botón scroll to top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-[9999] rounded-full bg-emerald-500 p-3 text-white shadow-2xl transition hover:bg-emerald-600 hover:scale-110"
          aria-label="Volver arriba"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
      <ConfirmDialog
        open={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        confirmLabel={confirmState.confirmLabel}
        tone={confirmState.tone}
        onClose={() => setConfirmState({ open: false })}
        onConfirm={confirmState.onConfirm}
      />
    </div>
  );
}
