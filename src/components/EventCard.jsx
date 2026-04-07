// src/components/EventCard.jsx
import React from 'react';

export default function EventCard({
  eventData,
  isOperatorOwner,
  isAdmin,
  approvalStatusLabels,
  approvalStatusStyles,
  eventEditBasePath,
  formatEventDate,
  navigate,
  storageUrl,
  eventSectionRef,
  eventRefs
}) {
  if (!eventData) return null;

  return (
    <section
      id={`evento-${eventData.id}`}
      ref={el => {
        if (eventSectionRef) eventSectionRef.current = el;
        if (eventData.id && eventRefs) eventRefs.current[eventData.id] = el;
      }}
      className="bg-white px-6 pb-16"
    >
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-emerald-100 bg-emerald-50/40 p-8 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">Evento disponible</p>
              {(isOperatorOwner || isAdmin) && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide shadow-lg transition ${
                      approvalStatusStyles[eventData.approval_status || 'pending']
                      || 'bg-slate-500/90 text-white shadow-slate-500/30 hover:bg-slate-400'
                    }`}
                  >
                    {approvalStatusLabels[eventData.approval_status || 'pending'] || 'Pendiente'}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate(`${eventEditBasePath}/evento/${eventData.id}/editar`)}
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-700 transition hover:bg-emerald-50"
                  >
                    Editar evento
                  </button>
                </div>
              )}
              <h2 className="mt-2 text-2xl font-bold text-slate-900">{eventData.title || 'Evento ecoturistico'}</h2>
              <p className="mt-2 text-sm text-slate-600">
                <span className="font-semibold">Inicio:</span> {formatEventDate(eventData.starts_at)}<br />
                <span className="font-semibold">Finalización:</span> {(() => {
                  const parsed = new Date(eventData && eventData.ends_at);
                  if (!eventData || !eventData.ends_at) {
                    return <span style={{color:'gray'}}>No disponible</span>;
                  }
                  if (!Number.isNaN(parsed.getTime())) {
                    return formatEventDate(eventData.ends_at);
                  } else {
                    return eventData.ends_at;
                  }
                })()}<br />
              </p>
            </div>
            {eventData.image && (
              <img loading="lazy"
                src={storageUrl(eventData.image)}
                alt={eventData.title || 'Evento'}
                className="h-40 w-full max-w-sm rounded-2xl object-cover shadow-md"
              />
            )}
          </div>
          {eventData.description && (
            <p className="mt-5 text-sm text-slate-700 leading-relaxed">{eventData.description}</p>
          )}
        </div>
      </div>
    </section>
  );
}