function RolesPage({ onNavigateHome, onNavigateLogin, onNavigateRegistroOp, onNavigateRegistroTur }) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* HEADER */}
      <header className="fixed top-0 z-50 w-full bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 md:px-12">
          {/* Logo */}
          <button onClick={onNavigateHome} className="flex items-center gap-2 hover:opacity-80">
            <img loading="lazy" src="/images/Pagina_inicio/nature-svgrepo-com.svg" alt="Logo" className="h-8 w-8" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Conexion</h3>
              <p className="text-xs text-slate-600">EcoRisaralda</p>
            </div>
          </button>

          {/* Center - Buscador */}
          <div className="hidden gap-4 md:flex">
            <button className="flex items-center gap-2 text-slate-700 hover:text-[#267E1B]">
              <img loading="lazy" src="/images/roles/search-svgrepo-com.svg" alt="Buscar" className="h-5 w-5" />
              <span className="text-sm">Buscar</span>
            </button>
          </div>

          {/* Right - Botón */}
          <div className="flex items-center gap-4">
            <button
              onClick={onNavigateLogin}
              className="hidden h-10 rounded-lg bg-[#267E1B] px-6 text-sm font-semibold text-white transition hover:bg-[#1f6517] md:block"
            >
              ¿Ya tienes una cuenta?
            </button>

            {/* Dropdown mobile */}
            <button className="md:hidden">
              <img loading="lazy" src="/images/roles/menu-alt-2-svgrepo-com.webp" alt="Menu" className="h-8 w-8" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 pt-20 md:flex-row md:gap-12">
        {/* OPERARIO */}
        <button
          onClick={onNavigateRegistroOp}
          className="group flex flex-col items-center justify-center text-center transition-transform duration-300 hover:scale-105"
        >
          <div className="mb-4">
            <img loading="lazy" src="/images/roles/apreton-de-manos.webp" alt="Operario" className="h-56 w-56 object-cover" />
          </div>
          <h1 className="mb-4 text-4xl font-bold text-[#267E1B] drop-shadow-lg">Operario</h1>
          <p className="w-72 rounded-lg border border-slate-500 bg-white px-3 py-2 text-sm text-slate-700 shadow-md transition-all duration-300 group-hover:block">
            Este usuario se caracteriza por colaborar con las empresas para subir información de los sitios, recuerde que necesita un identificador tributario para poder registrarse con este rol
          </p>
        </button>

        {/* SEPARATOR */}
        <div className="hidden h-48 w-1 bg-[#267E1B] md:block"></div>
        <div className="h-1 w-48 bg-[#267E1B] md:hidden"></div>

        {/* TURISTA */}
        <button
          onClick={onNavigateRegistroTur}
          className="group flex flex-col items-center justify-center text-center transition-transform duration-300 hover:scale-105"
        >
          <div className="mb-4">
            <img loading="lazy" src="/images/roles/caminante.webp" alt="Turista" className="h-56 w-56 object-cover" />
          </div>
          <h1 className="mb-4 text-4xl font-bold text-[#267E1B] drop-shadow-lg">Turista</h1>
          <p className="w-72 rounded-lg border border-slate-500 bg-white px-3 py-2 text-sm text-slate-700 shadow-md transition-all duration-300 group-hover:block">
            El usuario estándar de Conexión EcoRisaralda, podrás tener acceso a elegir tus preferencias y se te recomendarán los sitios de tu gusto, guardar tus sitios favoritos y dejar tus reseñas
          </p>
        </button>
      </main>
    </div>
  );
}

export default RolesPage;
