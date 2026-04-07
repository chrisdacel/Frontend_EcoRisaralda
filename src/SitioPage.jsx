import React from 'react';
import Footer from './components/Footer';

export default function SitioPage({ 
  onNavigateHome,
  onNavigateLogin,
  onNavigateRegister,
  onNavigateSobreNosotros,
  onNavigatePrivacidad
}) {

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white text-slate-900 pt-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(76,175,80,0.08),transparent_35%)]" />


      <main>
        {/* Hero Section */}
        <section
          className="relative min-h-[70vh] bg-cover bg-center flex items-center"
          style={{ backgroundImage: "url('/images/sitios/mesmerizing-scenery-beautiful-green-mountains-with-cloudy-sky.webp')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent"></div>
          <div className="relative z-10 w-full">
            <div className="mx-auto max-w-7xl px-6 py-16">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-3 rounded-full bg-emerald-50/20 px-4 py-2 text-sm text-emerald-100 ring-1 ring-white/20">
                  Ecoturismo
                </span>
                <h1 className="mt-4 text-4xl md:text-5xl font-bold leading-tight text-white">Reserva natural parque la Nona</h1>
                <p className="mt-3 text-lg md:text-xl text-emerald-100/90 max-w-xl">
              ¡Conéctate con la naturaleza y descubre la magia de La Virginia, Risaralda — un paraíso ecoturístico por explorar!
                </p>
                <div className="mt-6">
                  <button className="rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-700">
                    Conoce más
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Description Section */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-slate-600 leading-relaxed">
              La Reserva Natural Parque La Nona es un destino ideal para los amantes del ecoturismo.
              Rodeada de exuberante vegetación y rica biodiversidad, esta reserva ofrece una experiencia
              única de conexión con la naturaleza. Los visitantes pueden disfrutar de caminatas ecológicas,
              avistamiento de aves, y recorridos interpretativos que promueven la conservación del medio ambiente.
              Es un espacio perfecto para quienes buscan tranquilidad, aire puro y un contacto respetuoso con los ecosistemas locales.
            </p>
          </div>
        </section>

        {/* Localización Section */}
        <section className="py-16 px-6 bg-emerald-50/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-3xl font-semibold text-emerald-700 mb-4">Localización</h2>
                <p className="text-slate-600 leading-relaxed">
                  La Reserva Natural Parque La Nona se encuentra en el municipio de Marsella, en el departamento de Risaralda, Colombia.
                  Está ubicada a aproximadamente 7 kilómetros del casco urbano de Marsella.
                </p>
              </div>
              <div className="order-1 md:order-2">
                <img loading="lazy"
                  src="/images/sitios/Captura de pantalla 2025-04-09 235939.webp"
                  alt="Mapa de localización"
                  className="w-full h-80 object-cover rounded-lg border border-emerald-100 shadow-sm shadow-emerald-100/50"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Clima Section */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-1">
                <img loading="lazy"
                  src="/images/sitios/LA-VIRGINIA-540X370.webp"
                  alt="Vegetación y clima"
                  className="w-full h-80 object-cover rounded-lg border border-emerald-100 shadow-sm shadow-emerald-100/50"
                />
              </div>
              <div className="order-2">
                <h2 className="text-3xl font-semibold text-emerald-700 mb-4">Clima</h2>
                <p className="text-slate-600 leading-relaxed">
                  Tiene un clima templado y húmedo, con temperaturas entre 17°C y 26°C. Llueve con frecuencia durante todo el año,
                  lo que favorece su vegetación exuberante. Se recomienda llevar ropa impermeable y calzado adecuado para caminatas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Características Section */}
        <section className="py-16 px-6 bg-emerald-50/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-3xl font-semibold text-emerald-700 mb-4">Características</h2>
                <p className="text-slate-600 leading-relaxed">
                  La Reserva Natural Parque La Nona está ubicada en Marsella, Risaralda, y tiene unas 505 hectáreas de bosque andino entre los 1.700 y 2.100 m s. n. m.
                  Es rica en biodiversidad, fuente de varias quebradas y cuenta con alojamiento, zona de camping y senderos ecológicos ideales para caminatas y avistamiento de aves.
                </p>
              </div>
              <div className="order-1 md:order-2">
                <img loading="lazy"
                  src="/images/sitios/unnamed.webp"
                  alt="Vista de montaña y reserva natural"
                  className="w-full h-80 object-cover rounded-lg border border-emerald-100 shadow-sm shadow-emerald-100/50"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Flora y Fauna Section */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-1">
                <img loading="lazy"
                  src="/images/sitios/Departamento-Risaralda-de-Colombia-10.webp"
                  alt="Flora y fauna del parque"
                  className="w-full h-80 object-cover rounded-lg border border-emerald-100 shadow-sm shadow-emerald-100/50"
                />
              </div>
              <div className="order-2">
                <h2 className="text-3xl font-semibold text-emerald-700 mb-4">Flora y Fauna</h2>
                <p className="text-slate-600 leading-relaxed">
                  El parque alberga una gran variedad de especies vegetales como árboles de yarumo, cedro y guadua.
                  También es hogar de aves como tucanes, tangaras, y búhos, además de mamíferos como zarigüeyas, armadillos
                  y pequeños felinos, lo que lo convierte en un espacio vital para la conservación de la biodiversidad.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Infraestructura Section */}
        <section className="py-16 px-6 bg-emerald-50/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-3xl font-semibold text-emerald-700 mb-4">Infraestructura</h2>
                <p className="text-slate-600 leading-relaxed">
                  El parque cuenta con cabañas, zonas de camping, baños ecológicos, miradores y senderos señalizados.
                  Estas infraestructuras están diseñadas para minimizar el impacto ambiental y ofrecer comodidad a los visitantes,
                  fomentando una experiencia segura y respetuosa con el entorno natural.
                </p>
              </div>
              <div className="order-1 md:order-2">
                <img loading="lazy"
                  src="/images/sitios/maxresdefault.webp"
                  alt="Infraestructura del parque"
                  className="w-full h-80 object-cover rounded-lg border border-emerald-100 shadow-sm shadow-emerald-100/50"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Recomendaciones Section */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-semibold text-emerald-700 mb-6">Recomendaciones</h2>
            <p className="text-slate-600 leading-relaxed">
              Se sugiere llevar ropa cómoda, calzado para caminatas, impermeable, repelente, protector solar, 
              cámara fotográfica, y agua. Es importante respetar las normas del parque, no dejar residuos y 
              mantener una actitud responsable con el medio ambiente para preservar este tesoro natural.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer 
        onNavigateSobreNosotros={() => window.location.href = '/sobre-nosotros'}
        onNavigatePrivacidad={() => window.location.href = '/privacidad'}
        onNavigateQueOfrecemos={() => window.location.href = '/que-ofrecemos'}
        onNavigateColeccion={() => window.location.href = '/coleccion'}
        onNavigateLogin={() => window.location.href = '/login'}
        onNavigateInicio={() => window.location.href = '/'}
      />
    </div>
  );
}
