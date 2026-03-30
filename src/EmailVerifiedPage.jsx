export default function EmailVerifiedPage({ onNavigateLogin, onNavigateHome }) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0b2f2a] via-[#0f3f38] to-[#0b2f2a] text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-12 md:px-10">
        <div className="w-full md:w-[520px] mx-auto">
          <div className="rounded-lg bg-white/10 backdrop-blur-md ring-1 ring-white/10 p-6 md:p-8 shadow-xl text-center">
            <span className="text-emerald-300/80 text-xs tracking-[0.4em]">ECOTURISMO</span>
            <h1 className="mt-4 text-4xl font-semibold">¡Correo verificado!</h1>
            <p className="mt-3 text-emerald-100/80">
              Tu cuenta ya está activa. Ahora puedes iniciar sesión y continuar explorando.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <button
                type="button"
                onClick={onNavigateLogin}
                className="w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              >
                Ir a iniciar sesión
              </button>
              <button
                type="button"
                onClick={onNavigateHome}
                className="w-full rounded-lg border border-emerald-400/40 bg-white/10 px-4 py-2.5 text-sm font-semibold text-emerald-100 shadow-sm transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
