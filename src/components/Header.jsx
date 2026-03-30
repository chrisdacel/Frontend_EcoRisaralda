import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchNotifications } from "../services/api";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState("");
  const menuRef = useRef(null);
  const notificationsRef = useRef(null);
  const authPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/confirmar-cuenta",
    "/email-verified",
  ];
  const isAuthPage = authPaths.includes(location.pathname);
  const isTourist = user && user.role !== "admin" && user.role !== "operator";
  const isOperator = user && user.role === "operator";

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    
    if (mobileOpen) {
      root.style.overflow = "hidden";
      document.body.classList.add("mobile-menu-open");
    } else {
      root.style.overflow = "";
      document.body.classList.remove("mobile-menu-open");
    }
    
    return () => {
      root.style.overflow = "";
      document.body.classList.remove("mobile-menu-open");
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!notificationsOpen || !isTourist) return;
    let active = true;

    const loadNotifications = async () => {
      try {
        setNotificationsLoading(true);
        const data = await fetchNotifications(4);
        if (active) {
          setNotifications(Array.isArray(data) ? data : []);
          setNotificationsError("");
        }
      } catch (err) {
        if (active) {
          setNotificationsError(err?.message || "No se pudieron cargar");
        }
      } finally {
        if (active) setNotificationsLoading(false);
      }
    };

    loadNotifications();

    return () => {
      active = false;
    };
  }, [notificationsOpen, isTourist]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (_) {}
  };

  const goProfile = () => {
    setMenuOpen(false);
    if (user?.role === "admin") {
      navigate("/admin/profile");
    } else if (user?.role === "operator") {
      navigate("/operador/profile");
    } else {
      navigate("/turista/profile");
    }
  };

  const goAdminPanel = () => {
    setMenuOpen(false);
    navigate("/admin/dashboard");
  };

  const goOperatorSites = () => {
    setMenuOpen(false);
    navigate("/operador/mis-sitios");
  };

  const goOperatorEvents = () => {
    setMenuOpen(false);
    navigate("/operador/mis-eventos");
  };

  const goOperatorStats = () => {
    setMenuOpen(false);
    navigate("/operador/estadisticas");
  };

  const goFavoritos = () => {
    setMenuOpen(false);
    navigate("/turista/favoritos");
  };

  const goPreferencias = () => {
    setMenuOpen(false);
    if (!user) {
      navigate("/login");
      return;
    }
    navigate("/turista/preferencias");
  };

  const goHistorial = () => {
    setMenuOpen(false);
    navigate("/turista/historial");
  };

  const goNotifications = () => {
    setMenuOpen(false);
    setNotificationsOpen(false);
    setMobileOpen(false);
    navigate("/turista/notificaciones");
  };

  const closeMobile = () => {
    setMobileOpen(false);
  };

  // Siempre fija y visible, color adaptativo en todos los dispositivos
  const isColeccionPage = location.pathname.includes("/coleccion");
  const isMobileOrTablet = typeof window !== 'undefined' && window.innerWidth < 1024;
  const isScrolled = isAuthPage ? false : (scrollY > 20);
  const textColor = isScrolled ? "text-slate-900" : "text-white";
  const secondaryTextColor = isScrolled ? "text-slate-700" : "text-emerald-100/80";
  const dotColor = isScrolled ? "bg-emerald-500" : "bg-emerald-400";
  const baseLink = (isActive) =>
    `px-3 py-2 text-sm font-medium transition ${isActive ? "text-emerald-500" : isScrolled ? "text-slate-700 hover:text-emerald-500" : "text-emerald-100/80 hover:text-emerald-500"}`;

  const navLinks =
    user?.role === "admin"
      ? [
          { to: "/admin/home", label: "Inicio" },
          { to: "/admin/coleccion", label: "Colección" },
          { to: "/admin/que-ofrecemos", label: "Qué ofrecemos" },
          { to: "/admin/sobre-nosotros", label: "Sobre nosotros" },
          { to: "/admin/privacidad", label: "Privacidad" },
        ]
      : isOperator
        ? [
            { to: "/operador/home", label: "Inicio" },
            { to: "/operador/coleccion", label: "Colección" },
            { to: "/operador/que-ofrecemos", label: "Qué ofrecemos" },
            { to: "/operador/sobre-nosotros", label: "Sobre nosotros" },
            { to: "/operador/privacidad", label: "Privacidad" },
          ]
        : isTourist
          ? [
              { to: "/turista/home", label: "Inicio" },
              { to: "/turista/coleccion", label: "Colección" },
              { to: "/turista/que-ofrecemos", label: "Qué ofrecemos" },
              { to: "/turista/sobre-nosotros", label: "Sobre nosotros" },
              { to: "/turista/privacidad", label: "Privacidad" },
            ]
          : [
              { to: "/", label: "Inicio" },
              { to: "/coleccion", label: "Colección" },
              { to: "/que-ofrecemos", label: "Qué ofrecemos" },
              { to: "/sobre-nosotros", label: "Sobre nosotros" },
              { to: "/privacidad", label: "Privacidad" },
            ];

  const roleLabel = user
    ? user.role === "admin"
      ? "ADMINISTRADOR"
      : user.role === "operator"
        ? "OPERADOR"
        : "TURISTA"
    : null;
  const dropdownWidth = "w-40";
  const formatNotificationDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
    });
  };
  const unreadCount = notifications.filter((item) => !item.read_at).length;

  // Siempre fixed y visible en móvil/tablet, color adaptativo en todos los dispositivos
  const headerBg = `fixed top-0 left-0 right-0 z-[9999] w-full transition-all duration-[1200ms] ease-in-out ${
    mobileOpen
      ? "bg-transparent"
      : scrollY <= 20
        ? (isAuthPage ? "bg-transparent" : `bg-emerald-950/90 ${isMobileOrTablet ? "shadow-md" : ""}`)
        : `backdrop-blur supports-[backdrop-filter]:bg-white/5 bg-white/5 ${isColeccionPage ? "" : "ring-1 ring-white/10"}`
  }`;

  return (
    <>
    <header className={headerBg}>
      <div className="relative z-[70] mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Logo izquierda */}
        <Link to="/" className={`inline-flex items-center gap-2 flex-shrink-0 transition-all duration-500 ease-in-out ${mobileOpen ? '-translate-y-8 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
          <img loading="lazy"
            src="/images/Pagina_inicio/nature-svgrepo-com.svg"
            alt="Logo"
            className="h-6 w-6"
          />
          <div className="flex flex-col leading-tight">
            <span className={`text-xs font-bold transition ${textColor}`}>
              Conexion
            </span>
            <span className={`text-xs font-light transition ${textColor}`}>
              EcoRisaralda
            </span>
            {roleLabel && (
              <span
                className={`text-[10px] font-semibold tracking-wide transition ${secondaryTextColor}`}
              >
                {roleLabel}
              </span>
            )}
          </div>
        </Link>

        {/* Nav centro */}
        <nav
          className="hidden xl:flex justify-center gap-6 mx-auto">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => baseLink(isActive)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Botones derecha */}
        <div className="flex items-center gap-3 md:gap-2 flex-shrink-0">
          {/* Avatar exclusivo para móvil y tablet */}
          {user && (
            <button
              type="button"
              onClick={() => {
                closeMobile();
                goProfile();
              }}
              className={`xl:hidden inline-flex items-center justify-center rounded-full w-8 h-8 ring-1 transition-all duration-300 focus:outline-none ${mobileOpen ? 'opacity-0 scale-75 pointer-events-none' : isScrolled ? 'ring-slate-300 opacity-100 scale-100' : 'ring-white/30 opacity-100 scale-100'}`}
            >
              {user.avatar_url ? (
                <img loading="lazy" src={user.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                <div className="w-full h-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white rounded-full">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setMobileOpen((value) => !value);
              setMenuOpen(false);
              setNotificationsOpen(false);
            }}
            className={`xl:hidden relative inline-flex h-10 w-10 items-center justify-center transition-colors focus:outline-none ${mobileOpen ? "text-slate-900" : textColor}`}
            aria-label="Toggle menu">
            <div className="relative w-5 h-[12px]">
              <span className={`absolute left-0 block h-[2px] w-full bg-current rounded-full transition-all duration-300 ease-in-out ${mobileOpen ? 'top-[5px] rotate-45' : 'top-0 rotate-0'}`} />
              <span className={`absolute left-0 block h-[2px] w-full bg-current rounded-full transition-all duration-300 ease-in-out ${mobileOpen ? 'bottom-[5px] -rotate-45' : 'bottom-0 rotate-0'}`} />
            </div>
          </button>

          {user ? (
            <div className="flex items-center gap-2" ref={menuRef}>
              {isTourist && (
                <div className="relative hidden xl:block" ref={notificationsRef}>
                  <button
                    type="button"
                    onClick={() => setNotificationsOpen((value) => !value)}
                    className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full ring-1 transition ${
                      isScrolled
                        ? "bg-slate-100/60 text-slate-700 ring-slate-200 hover:bg-slate-100"
                        : "bg-white/10 text-emerald-100 ring-white/10 hover:bg-white/20"
                    }`}
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 00-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0a3 3 0 01-6 0"
                      />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 text-[10px] font-semibold text-white grid place-items-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  {notificationsOpen && (
                    <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-72 rounded-xl overflow-hidden bg-white text-slate-800 shadow-lg ring-1 ring-slate-200/60 dropdown-open animate-fadeInDown
                      md:left-auto md:right-0 md:translate-x-0">
                      <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Notificaciones
                      </div>
                      {notificationsLoading && (
                        <div className="px-4 pb-3 text-sm text-slate-600">
                          Cargando...
                        </div>
                      )}
                      {!notificationsLoading && notificationsError && (
                        <div className="px-4 pb-3 text-sm text-rose-600">
                          {notificationsError}
                        </div>
                      )}
                      {!notificationsLoading &&
                        !notificationsError &&
                        notifications.length === 0 && (
                          <div className="px-4 pb-3 text-sm text-slate-600">
                            Sin novedades por ahora.
                          </div>
                        )}
                      {!notificationsLoading &&
                        !notificationsError &&
                        notifications.length > 0 && (
                          <div className="px-2 pb-2">
                            {notifications.map((item) => (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                  setNotificationsOpen(false);
                                  const suffix = `?notification=${item.id}`;
                                  if (item.target_type === "event") {
                                    navigate(
                                      `/turista/evento/${item.target_id}${suffix}`,
                                    );
                                    return;
                                  }
                                  navigate(
                                    `/turista/sitio/${item.target_id}${suffix}`,
                                  );
                                }}
                                className="w-full rounded-lg px-2 py-2 text-left text-sm transition hover:bg-slate-100"
                              >
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-600">
                                  {formatNotificationDate(item.created_at)}
                                </p>
                                <p className="truncate text-slate-800">
                                  {item.title || item.place_name || item.name}
                                </p>
                                {item.preview && (
                                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                                    {item.preview}
                                  </p>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      <button
                        type="button"
                        onClick={goNotifications}
                        className="w-full border-t border-slate-200 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
                      >
                        Ver todas
                      </button>
                    </div>
                  )}
                </div>
              )}
              {/* Dropdown para todos los usuarios */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className={`hidden xl:inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold ring-1 transition ${
                    isScrolled
                      ? "bg-slate-100/50 text-slate-700 ring-slate-200 hover:bg-slate-100"
                      : "bg-white/10 text-emerald-100 ring-white/10 hover:bg-white/20"
                  }`}
                >
                  {user?.avatar_url ? (
                    <img loading="lazy"
                      src={user.avatar_url}
                      alt="Avatar"
                      className="h-6 w-6 rounded-full object-cover ring-1 ring-white/20"
                    />
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-bold text-white ring-1 ring-white/20">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                  <span style={{maxWidth:120,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',display:'inline-block'}} title={user.name}>
                    {user.name
                      ? (user.name.length > 20
                          ? user.name.slice(0, 20) + '...'
                          : user.name)
                      : "Usuario"}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {menuOpen && (
                  <div
                    className={`absolute right-0 mt-2 ${dropdownWidth} rounded-xl overflow-hidden bg-white text-slate-800 shadow-lg ring-1 ring-slate-200/60 dropdown-open`}
                  >
                    <button
                      onClick={goProfile}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 hover:text-emerald-500 transition-colors first:rounded-t-xl last:rounded-b-xl"
                    >
                      Perfil
                    </button>
                    {isTourist && (
                      <button
                        onClick={goFavoritos}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 hover:text-emerald-500 transition-colors first:rounded-t-xl last:rounded-b-xl"
                      >
                        Favoritos
                      </button>
                    )}
                    {isTourist && (
                      <button
                        onClick={goPreferencias}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 hover:text-emerald-500 transition-colors first:rounded-t-xl last:rounded-b-xl"
                      >
                        Preferencias
                      </button>
                    )}
                    {isTourist && (
                      <button
                        onClick={goHistorial}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 hover:text-emerald-500 transition-colors first:rounded-t-xl last:rounded-b-xl"
                      >
                        Historial
                      </button>
                    )}
                    {isTourist && (
                      <button
                        onClick={goNotifications}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 hover:text-emerald-500 transition-colors first:rounded-t-xl last:rounded-b-xl"
                      >
                        Notificaciones
                      </button>
                    )}
                    {user.role === "admin" && (
                      <button
                        onClick={goAdminPanel}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 hover:text-emerald-500 transition-colors first:rounded-t-xl last:rounded-b-xl"
                      >
                        Panel de Administración
                      </button>
                    )}
                    {user.role === "operator" && (
                      <button
                        onClick={goOperatorSites}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 hover:text-emerald-500 transition-colors first:rounded-t-xl last:rounded-b-xl"
                      >
                        Gestionar mis sitios
                      </button>
                    )}
                    {user.role === "operator" && (
                      <button
                        onClick={goOperatorEvents}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 hover:text-emerald-500 transition-colors first:rounded-t-xl last:rounded-b-xl"
                      >
                        Gestionar mis eventos
                      </button>
                    )}
                    {user.role === "operator" && (
                      <button
                        onClick={goOperatorStats}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 hover:text-emerald-500 transition-colors first:rounded-t-xl last:rounded-b-xl"
                      >
                        Estadisticas
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Preferencias removed */}
              <button
                onClick={handleLogout}
                className="hidden xl:inline-flex items-center rounded-full bg-emerald-500 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className={`hidden xl:inline-flex items-center rounded-full px-3 py-2 text-sm font-semibold ring-1 transition ${
                  isScrolled
                    ? "bg-slate-100/50 text-slate-700 ring-slate-200 hover:bg-slate-100"
                    : "bg-white/10 text-emerald-100 ring-white/10 hover:bg-white/20"
                }`}
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="hidden xl:inline-flex items-center rounded-full bg-emerald-500 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
              >
                Crear cuenta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>

      {/* Mobile Menu Full Screen Overlay */}
      <div 
        className={`fixed inset-0 z-[9998] xl:hidden flex flex-col backdrop-blur-md bg-white/80 supports-[backdrop-filter]:bg-white/80 border-b border-slate-200/50 text-slate-900 overflow-y-auto transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
          mobileOpen ? "translate-y-0" : "-translate-y-full pointer-events-none"
        }`}
      >
        <div className="h-24 flex-shrink-0" /> {/* Spacer for header / X button */}

        <div className="flex flex-col px-8 pb-12 items-center">
          <nav className="flex flex-col items-center gap-6 text-center">
            {navLinks.map((link, idx) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMobile}
                style={{ transitionDelay: mobileOpen ? `${150 + idx * 40}ms` : '0ms' }}
                className={({ isActive }) =>
                  `text-3xl font-bold tracking-tight transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform will-change-transform ${
                    mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                  } ${
                    isActive ? "text-emerald-500" : "text-slate-800 hover:text-emerald-500"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div 
            className={`mt-12 w-full border-t border-slate-200/60 pt-8 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform will-change-transform ${
              mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}
            style={{ transitionDelay: mobileOpen ? `${150 + navLinks.length * 40 + 50}ms` : '0ms' }}
          >
            {user ? (
              <div className="flex flex-col items-center gap-5 text-center">
                <button
                  type="button"
                  onClick={() => {
                    closeMobile();
                    goProfile();
                  }}
                  className="text-center text-lg font-medium text-slate-600 hover:text-emerald-500 transition-colors"
                >
                  Perfil
                </button>
                {isTourist && (
                  <>
                    <button
                      type="button"
                      onClick={() => { closeMobile(); goFavoritos(); }}
                      className="text-center text-lg font-medium text-slate-600 hover:text-emerald-500 transition-colors"
                    >
                      Favoritos
                    </button>
                    <button
                      type="button"
                      onClick={() => { closeMobile(); goPreferencias(); }}
                      className="text-center text-lg font-medium text-slate-600 hover:text-emerald-500 transition-colors"
                    >
                      Preferencias
                    </button>
                    <button
                      type="button"
                      onClick={() => { closeMobile(); goHistorial(); }}
                      className="text-center text-lg font-medium text-slate-600 hover:text-emerald-500 transition-colors"
                    >
                      Historial
                    </button>
                    <button
                      type="button"
                      onClick={() => { closeMobile(); goNotifications(); }}
                      className="text-center text-lg font-medium text-slate-600 hover:text-emerald-500 transition-colors"
                    >
                      Notificaciones
                    </button>
                  </>
                )}
                {user.role === "admin" && (
                  <button
                    type="button"
                    onClick={() => { closeMobile(); goAdminPanel(); }}
                    className="text-center text-lg font-medium text-slate-600 hover:text-emerald-500 transition-colors"
                  >
                    Panel de Administración
                  </button>
                )}
                {user.role === "operator" && (
                  <>
                    <button
                      type="button"
                      onClick={() => { closeMobile(); goOperatorSites(); }}
                      className="text-center text-lg font-medium text-slate-600 hover:text-emerald-500 transition-colors"
                    >
                      Gestionar mis sitios
                    </button>
                    <button
                      type="button"
                      onClick={() => { closeMobile(); goOperatorEvents(); }}
                      className="text-center text-lg font-medium text-slate-600 hover:text-emerald-500 transition-colors"
                    >
                      Gestionar mis eventos
                    </button>
                    <button
                      type="button"
                      onClick={() => { closeMobile(); goOperatorStats(); }}
                      className="text-center text-lg font-medium text-slate-600 hover:text-emerald-500 transition-colors"
                    >
                      Estadísticas
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => {
                    closeMobile();
                    handleLogout();
                  }}
                  className="text-center text-xl font-bold text-emerald-600 border-b-2 border-emerald-500 pb-1 mt-4 hover:text-emerald-500 hover:border-emerald-400 transition-colors"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6 pt-2 text-center">
                <Link
                  to="/login"
                  onClick={closeMobile}
                  className="text-center text-xl font-medium text-slate-600 hover:text-emerald-500 transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  onClick={closeMobile}
                  className="text-center text-xl font-bold text-emerald-600 border-b-2 border-emerald-500 pb-1 hover:text-emerald-500 hover:border-emerald-400 transition-colors"
                >
                  Crear cuenta
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
