import { useEffect, Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

import Header from './components/Header';
import AccessibilityButton from './components/AccessibilityButton';
import ScrollToTopFab from './components/ScrollToTopFab';

// Lazy loaded pages (HU001: Flujo de Autenticación)
const LoginPage = lazy(() => import('./LoginPage'));
const RegisterPage = lazy(() => import('./RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./ResetPasswordPage'));
const ConfirmAccountPage = lazy(() => import('./ConfirmAccountPage'));
const EmailVerifiedPage = lazy(() => import('./EmailVerifiedPage'));
const RolesPage = lazy(() => import('./RolesPage'));
const RegistroOperador1 = lazy(() => import('./RegistroOperador1'));
const RegistroOperador2 = lazy(() => import('./RegistroOperador2'));
const RegistroTurista1 = lazy(() => import('./RegistroTurista1'));
const RegistroTurista2 = lazy(() => import('./RegistroTurista2'));

// (HU002): Importamos la Colección Ecoturística
const ColeccionPage = lazy(() => import('./ColeccionPage'));

// Protector para no dejar entrar al login si ya estás logueado
const GuestRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'operator') return <Navigate to="/operador/home" replace />;
    return <Navigate to="/turista/home" replace />;
  }
  return children;
};

// Loading fallback para suspense
const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-white">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
  </div>
);

function AppRoutes() {
  const navigate = useNavigate();
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage
                onNavigateHome={() => navigate('/')}
                onNavigateRegister={() => navigate('/register')}
                onNavigateForgot={() => navigate('/forgot-password')}
              />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <RegisterPage
                onNavigateHome={() => navigate('/')}
                onNavigatePreferences={() => navigate('/preferencias')}
                onNavigateLogin={() => navigate('/login')}
                onNavigateConfirm={(email) => navigate('/confirmar-cuenta', { state: { email } })}
              />
            </GuestRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <GuestRoute>
              <ForgotPasswordPage
                onNavigateLogin={() => navigate('/login')}
                onNavigateRegister={() => navigate('/register')}
              />
            </GuestRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <GuestRoute>
              <ResetPasswordPage onNavigateLogin={() => navigate('/login')} />
            </GuestRoute>
          }
        />
        <Route
          path="/confirmar-cuenta"
          element={
            <ConfirmAccountPage
              onNavigateHome={() => navigate('/')}
              onNavigateLogin={() => navigate('/login')}
            />
          }
        />
        <Route
          path="/email-verified"
          element={
            <EmailVerifiedPage 
              onNavigateHome={() => navigate('/')} 
              onNavigateLogin={() => navigate('/login')} 
            />
          }
        />
        
        {/* Rutas adicionales de Roles y Pasos de Registro que traíste */}
        <Route path="/roles" element={<RolesPage />} />
        <Route path="/registro-operador-1" element={<RegistroOperador1 />} />
        <Route path="/registro-operador-2" element={<RegistroOperador2 />} />
        <Route path="/registro-turista-1" element={<RegistroTurista1 />} />
        <Route path="/registro-turista-2" element={<RegistroTurista2 />} />

        {/* HU002): Ruta pública para acceder a la colección de sitios */}
        <Route path="/coleccion" element={<ColeccionPage />} />

        {/* Como aún no hemos migrado el HomePage "/", redirigimos a login temporalmente */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}

// Funciones de utilidad visuales de tu proyecto original
function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);
  return null;
}

function PageTransition({ children }) {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-enter">
      {children}
    </div>
  );
}

function ScrollReveal() {
  const location = useLocation();
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll('main section, main article'));
    if (targets.length === 0) return undefined;

    targets.forEach((el) => {
      if (!el.classList.contains('scroll-reveal')) {
        el.classList.add('scroll-reveal');
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );

    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [location.pathname]);
  return null;
}

// Estructura principal exactamente igual a tu original
function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-b from-[#0b2f2a] via-[#0f3f38] to-[#0b2f2a] text-white">
        <ScrollToTop />
        <ScrollReveal />
        <ScrollToTopFab />
        <Header />
        <PageTransition>
          <AppRoutes />
        </PageTransition>
        <AccessibilityButton />
      </div>
    </AuthProvider>
  );
}

export default App;
