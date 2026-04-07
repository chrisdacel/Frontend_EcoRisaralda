import { useEffect, useState } from 'react';
import Footer from './components/Footer';

function PrivacidadPage({ onNavigateHome, onNavigateLogin, onNavigateRegister }) {
  const [heroVisible, setHeroVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 100);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 overflow-x-hidden pt-14">
      {/* Hero: más alto, texto inferior izquierda, overlay con crossfade */}
      <section className="relative min-h-[70vh] w-full overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('/images/Sobre_Nosotros/fondo ciudad.webp')" }}>
        <div className={`absolute inset-0 bg-gradient-to-r from-white via-white/70 to-transparent md:from-white md:via-white/50 md:to-black/10 transition-opacity duration-500 ${heroVisible ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute bottom-8 left-6 md:bottom-12 md:left-12 z-10 transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900">Política de Privacidad</h1>
          <p className="mt-3 max-w-2xl text-base md:text-lg text-slate-700 leading-relaxed">Cómo protegemos tus datos y qué derechos tienes.</p>
        </div>
      </section>

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-[9999] rounded-full bg-emerald-500 px-3 py-3 text-white shadow-lg shadow-emerald-500/40 transition hover:scale-110 hover:bg-emerald-600"
          aria-label="Volver arriba"
        >
          ↑
        </button>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 max-w-4xl mx-auto">
        <h1 className="mb-8 text-3xl md:text-4xl font-bold text-slate-900">Política de Privacidad y Protección de Datos</h1>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl md:text-3xl font-semibold text-slate-900">¿Quiénes somos?</h2>
          <p className="text-base md:text-lg text-slate-700 leading-relaxed">
            Somos <span className="font-semibold">Conexion EcoRisaralda</span>, responsables de la plataforma web y móvil de ecoturismo en Risaralda. Puedes contactarnos en <span className="font-semibold">monsalvealzatecristiandavid@gmail.com</span> o al <span className="font-semibold">+57 314 635 5214</span>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl md:text-3xl font-semibold text-slate-900">¿Qué datos personales recolectamos?</h2>
          <ul className="list-inside list-disc space-y-2 text-base md:text-lg text-slate-700 leading-relaxed">
            <li><span className="font-semibold">Datos de registro:</span> nombre, correo electrónico, contraseña.</li>
            <li><span className="font-semibold">Datos de uso:</span> páginas visitadas, búsquedas, favoritos, comentarios, eventos creados o reservados.</li>
            <li><span className="font-semibold">Datos técnicos:</span> dirección IP, tipo de dispositivo, sistema operativo, navegador.</li>
            <li><span className="font-semibold">Datos opcionales:</span> foto de perfil, preferencias, intereses turísticos.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl md:text-3xl font-semibold text-slate-900">¿Para qué usamos tus datos?</h2>
          <ul className="list-inside list-disc space-y-2 text-base md:text-lg text-slate-700 leading-relaxed">
            <li>Permitir tu registro, acceso y gestión de cuenta.</li>
            <li>Personalizar tu experiencia y mostrarte contenido relevante.</li>
            <li>Facilitar la reserva y gestión de eventos o sitios turísticos.</li>
            <li>Enviar notificaciones, avisos o información relevante sobre la plataforma.</li>
            <li>Mejorar la seguridad, prevenir fraudes y garantizar el buen uso del sistema.</li>
            <li>Analizar el uso de la plataforma para mejorar nuestros servicios.</li>
            <li>Enviarte comunicaciones promocionales solo si lo autorizas.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl md:text-3xl font-semibold text-slate-900">¿Con quién compartimos tu información?</h2>
          <ul className="list-inside list-disc space-y-2 text-base md:text-lg text-slate-700 leading-relaxed">
            <li>No vendemos tus datos personales.</li>
            <li>Podemos compartir información con proveedores tecnológicos (hosting, correo, analítica) bajo acuerdos de confidencialidad.</li>
            <li>Solo compartiremos datos con autoridades si existe obligación legal.</li>
            <li>Si participas en promociones conjuntas, solo compartiremos tus datos con terceros si lo autorizas expresamente.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl md:text-3xl font-semibold text-slate-900">¿Cuáles son tus derechos?</h2>
          <ul className="list-inside list-disc space-y-2 text-base md:text-lg text-slate-700 leading-relaxed">
            <li>Acceder a tus datos personales y conocer cómo los tratamos.</li>
            <li>Rectificar datos inexactos o incompletos.</li>
            <li>Solicitar la eliminación de tus datos (“derecho al olvido”).</li>
            <li>Oponerte al tratamiento de tus datos en determinadas circunstancias.</li>
            <li>Solicitar la portabilidad o limitación del tratamiento.</li>
          </ul>
          <p className="mt-2 text-base md:text-lg text-slate-700 leading-relaxed">
            Para ejercer tus derechos, escríbenos a <span className="font-semibold">conexion@ecorisaralda.co.com</span> con el asunto “Protección de Datos”.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl md:text-3xl font-semibold text-slate-900">¿Por cuánto tiempo conservamos tus datos?</h2>
          <ul className="list-inside list-disc space-y-2 text-base md:text-lg text-slate-700 leading-relaxed">
            <li>Mientras mantengas tu cuenta activa.</li>
            <li>Datos de uso y navegación se conservarán de forma anonimizada hasta 24 meses para fines estadísticos.</li>
            <li>Si solicitas la eliminación, borraremos tu información en un plazo máximo de 30 días salvo obligación legal.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl md:text-3xl font-semibold text-slate-900">¿Cómo protegemos tu información?</h2>
          <ul className="list-inside list-disc space-y-2 text-base md:text-lg text-slate-700 leading-relaxed">
            <li>Utilizamos cifrado SSL y servidores seguros.</li>
            <li>Aplicamos controles de acceso y medidas técnicas para evitar accesos no autorizados.</li>
            <li>Revisamos periódicamente nuestros sistemas y protocolos de seguridad.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl md:text-3xl font-semibold text-slate-900">¿Qué pasa si eres menor de edad?</h2>
          <p className="text-base md:text-lg text-slate-700 leading-relaxed">
            Nuestra plataforma no está dirigida a menores de 16 años. Si eres menor, no debes registrarte ni usar nuestros servicios. Si detectamos datos de menores sin consentimiento, los eliminaremos de inmediato.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl md:text-3xl font-semibold text-slate-900">Cookies y tecnologías similares</h2>
          <ul className="list-inside list-disc space-y-2 text-base md:text-lg text-slate-700 leading-relaxed">
            <li>Usamos cookies propias y de terceros para mejorar tu experiencia y analizar el uso de la plataforma.</li>
            <li>Puedes configurar o desactivar las cookies desde tu navegador, aunque algunas funciones podrían verse afectadas.</li>
            <li>Solo usaremos cookies de publicidad si lo autorizas.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl md:text-3xl font-semibold text-slate-900">Cambios en la política</h2>
          <p className="text-base md:text-lg text-slate-700 leading-relaxed">
            Podemos actualizar esta política en cualquier momento. Publicaremos la versión vigente y, si los cambios son importantes, te avisaremos por correo o en la plataforma.
          </p>
        </section>

        <section>
          <p className="text-base md:text-lg text-slate-700 leading-relaxed">
            Si tienes dudas o quieres ejercer tus derechos, contáctanos en <span className="font-semibold">conexion@ecorisaralda.co.com</span> o al <span className="font-semibold">+57 314 635 5214</span>.
          </p>
        </section>
      </main>

      {/* Footer (estilo Home) */}
      <Footer 
        onNavigateSobreNosotros={() => window.location.href = '/sobre-nosotros'}
        onNavigatePrivacidad={() => window.location.href = '/privacidad'}
        onNavigateQueOfrecemos={() => window.location.href = '/que-ofrecemos'}
      />
    </div>
  );
}

export default PrivacidadPage;
