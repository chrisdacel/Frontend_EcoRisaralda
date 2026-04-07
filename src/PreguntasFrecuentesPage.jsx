import { useEffect, useState } from 'react';
import Footer from './components/Footer';

function PreguntasFrecuentesPage() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden pt-14">
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <div className="mb-16 flex flex-col gap-4 text-left">
            <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">Preguntas Frecuentes (FAQ)</h1>
            <p className="text-lg text-gray-600 md:text-xl">Resolver tus dudas también hace parte de nosotros</p>
          </div>

          <div className="flex flex-col gap-12">
            {/* Preguntas frecuentes, cada una como bloque */}
            {/* ... */}
            <div className="space-y-10">
              {/* Aquí se insertan todas las preguntas y respuestas */}
              <article>
                <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2">¿Qué es Conexión EcoRisaralda?</h2>
                <p className="text-base md:text-lg text-slate-700 leading-relaxed">Conexión EcoRisaralda es una plataforma digital dedicada al <span className="italic">ecoturismo</span>, donde los usuarios pueden informarse sobre distintos destinos, conocer proyectos ecológicos, opinar, calificar sitios y enterarse de eventos relacionados con el turismo sostenible en la región.</p>
              </article>
              <div className="border-t border-slate-200" />
              <article>
                <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2">¿Necesito registrarme para usar la página?</h2>
                <p className="text-base md:text-lg text-slate-700 leading-relaxed">Sí. Aunque algunas secciones básicas están disponibles para visitantes, <span className="font-semibold">la mayor parte de la información de los sitios ecoturísticos está restringida a usuarios registrados</span>. El registro permite garantizar una mejor experiencia y una comunidad más segura.</p>
              </article>
              <div className="border-t border-slate-200" />
              <article>
                <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2">¿Quiénes pueden registrarse?</h2>
                <p className="text-base md:text-lg text-slate-700 leading-relaxed">Pueden registrarse personas <span className="font-semibold">mayores de 16 años</span>. Durante el proceso de registro se valida la fecha de nacimiento y <span className="italic">no se permite crear cuentas a menores de esta edad</span>.</p>
              </article>
              <div className="border-t border-slate-200" />
              <article>
                <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2">¿Qué datos necesito para registrarme?</h2>
                <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-2">Para crear una cuenta se solicitan datos básicos como:</p>
                <ul className="list-disc list-inside space-y-1 text-base md:text-lg text-slate-700 leading-relaxed mb-2">
                  <li>Nombre y correo electrónico</li>
                  <li>Fecha de nacimiento</li>
                  <li>País</li>
                  <li>Nombre de usuario y contraseña</li>
                </ul>
                <p className="text-base md:text-lg text-slate-700 leading-relaxed">También podrás elegir <span className="italic">preferencias e intereses</span> relacionados con el ecoturismo, los cuales servirán para personalizar tu experiencia.</p>
              </article>
              <div className="border-t border-slate-200" />
              <article>
                <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2">¿Debo confirmar mi correo electrónico?</h2>
                <p className="text-base md:text-lg text-slate-700 leading-relaxed">Sí. Para activar tu cuenta es necesario <span className="font-semibold">confirmar tu correo electrónico</span> mediante un enlace que recibirás después del registro. Esto ayuda a proteger tu cuenta y evitar registros falsos.</p>
              </article>
              <div className="border-t border-slate-200" />
              <article>
                <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2">¿Qué hago si olvidé mi contraseña?</h2>
                <p className="text-base md:text-lg text-slate-700 leading-relaxed">Puedes usar la opción <span className="italic">“Olvidé mi contraseña”</span> en la pantalla de inicio de sesión. Te enviaremos un correo con los pasos para restablecerla de forma segura.</p>
              </article>
              <div className="border-t border-slate-200" />
              <article>
                <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2">¿Qué puedo hacer una vez que me registro?</h2>
                <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-2">Como usuario registrado puedes:</p>
                <ul className="list-disc list-inside space-y-1 text-base md:text-lg text-slate-700 leading-relaxed mb-2">
                  <li>Acceder a la información completa de los sitios ecoturísticos</li>
                  <li>Guardar sitios en <span className="italic">favoritos</span></li>
                  <li>Calificar y comentar cada sitio</li>
                  <li>Recibir notificaciones sobre eventos y novedades</li>
                  <li>Personalizar tus preferencias de contenido</li>
                </ul>
              </article>
              <div className="border-t border-slate-200" />
              <article>
                <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2">¿Qué son los favoritos?</h2>
                <p className="text-base md:text-lg text-slate-700 leading-relaxed">Los favoritos te permiten <span className="font-semibold">guardar los sitios que más te interesan</span> para acceder a ellos fácilmente más adelante desde tu perfil.</p>
              </article>
              <div className="border-t border-slate-200" />
              <article>
                <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2">¿Puedo comentar y calificar los sitios?</h2>
                <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-2">Sí. Los usuarios registrados pueden:</p>
                <ul className="list-disc list-inside space-y-1 text-base md:text-lg text-slate-700 leading-relaxed mb-2">
                  <li>Dejar comentarios y opiniones</li>
                  <li>Calificar los sitios según su experiencia</li>
                </ul>
                <p className="text-base md:text-lg text-slate-700 leading-relaxed">Los comentarios deben ser respetuosos y relacionados con el contenido del sitio.</p>
              </article>
              <div className="border-t border-slate-200" />
              <article>
                <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2">¿Qué son los eventos?</h2>
                <p className="text-base md:text-lg text-slate-700 leading-relaxed">Los eventos son actividades, celebraciones o fechas especiales que ocurren en los sitios ecoturísticos en la vida real. Estos eventos son publicados por el <span className="font-semibold">Operador o el administrador</span> del sitio.</p>
              </article>
              <div className="border-t border-slate-200" />
              <article>
                <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2">¿Cómo funcionan las notificaciones de eventos?</h2>
                <p className="text-base md:text-lg text-slate-700 leading-relaxed">Si un evento está relacionado con un sitio cuyas <span className="font-semibold">etiquetas coinciden con tus preferencias</span>, recibirás una notificación para mantenerte informado.</p>
                <p className="text-base md:text-lg text-slate-700 leading-relaxed">Puedes ajustar tus preferencias en cualquier momento desde tu perfil.</p>
              </article>
              <div className="border-t border-slate-200" />
              <article>
                <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2">¿Quién publica los sitios y eventos?</h2>
                <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-2">Los sitios y eventos son publicados por <span className="font-semibold">Operadores</span>, que son usuarios colaboradores encargados de compartir información sobre destinos ecoturísticos.</p>
                <p className="text-base md:text-lg text-slate-700 leading-relaxed">Los Operadores <span className="font-semibold">no son empleados</span> de Conexión EcoRisaralda y publican contenido con fines informativos y de divulgación.</p>
              </article>
              <div className="border-t border-slate-200" />
              <article>
                <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2">¿Puedo publicar un sitio ecoturístico?</h2>
                <p className="text-base md:text-lg text-slate-700 leading-relaxed">Sí. Si deseas compartir información sobre un sitio o proyecto ecoturístico, puedes solicitar el rol de <span className="font-semibold">Operador</span>. El contenido publicado será revisado para garantizar que cumpla con las normas de la plataforma.</p>
              </article>
              <div className="border-t border-slate-200" />
              <article>
                <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2">¿Conexión EcoRisaralda organiza o vende planes turísticos?</h2>
                <p className="text-base md:text-lg text-slate-700 leading-relaxed">No. Conexión EcoRisaralda <span className="font-semibold">no es una agencia de viajes</span> ni vende paquetes turísticos. La información publicada es de carácter informativo.</p>
              </article>
              <div className="border-t border-slate-200" />
              <article>
                <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2">¿Puedo modificar o eliminar mi cuenta?</h2>
                <p className="text-base md:text-lg text-slate-700 leading-relaxed">Sí. Desde tu perfil puedes actualizar tus datos personales. Si deseas eliminar tu cuenta, recuerda, esta acción es enteramente su responsabilidad y Conexion Ecorisaralda no se hace responsable por sus datos eliminados</p>
              </article>
              <div className="border-t border-slate-200" />
              <article>
                <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2">¿Cómo se protegen mis datos personales?</h2>
                <p className="text-base md:text-lg text-slate-700 leading-relaxed">Tus datos son tratados conforme a la legislación colombiana de protección de datos personales. Implementamos medidas de seguridad técnicas y organizativas para proteger tu información.</p>
              </article>
              <div className="border-t border-slate-200" />
              <article>
                <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2">¿Dónde puedo hacer una consulta o reportar un problema?</h2>
                <p className="text-base md:text-lg text-slate-700 leading-relaxed">Si tienes dudas, sugerencias o necesitas reportar algún inconveniente, puedes contactarnos a través del correo <span className="font-semibold">conexion@ecorisaralda.co.com</span> o al <span className="font-semibold">+57 314 635 5214</span> o mediante los formularios de contacto disponibles en la plataforma.</p>
              </article>
            </div>
          </div>

          <div className="border-t border-slate-200 mt-12 mb-8" />
          <p className="text-base md:text-lg text-slate-700 leading-relaxed text-center mb-8">
            Esperamos que esta sección te ayude a entender mejor cómo funciona <span className="font-semibold">Conexión EcoRisaralda</span> y a disfrutar al máximo de la experiencia ecoturística.
          </p>
        </div>
      </main>

      {showScrollTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-6 right-6 z-[9999] rounded-full bg-emerald-500 px-3 py-3 text-white shadow-lg shadow-emerald-500/40 transition hover:scale-110 hover:bg-emerald-600" aria-label="Subir">↑</button>
      )}

      <Footer 
        onNavigateSobreNosotros={() => window.location.href = '/sobre-nosotros'}
        onNavigatePrivacidad={() => window.location.href = '/privacidad'}
        onNavigateQueOfrecemos={() => window.location.href = '/que-ofrecemos'}
      />
    </div>
  );
}

export default PreguntasFrecuentesPage;
