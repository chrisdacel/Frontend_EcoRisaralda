import React from 'react';

export default function NotificationModal({
  notifications,
  notificationsLoading,
  notificationsError,
  setNotificationsOpen,
  formatNotificationDate,
  navigate,
  goNotifications
}) {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-72 rounded-xl overflow-hidden bg-white text-slate-800 shadow-lg ring-1 ring-slate-200/60 dropdown-open animate-fadeInDown md:left-auto md:right-0 md:translate-x-0">
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
      
      {!notificationsLoading && !notificationsError && notifications.length === 0 && (
        <div className="px-4 pb-3 text-sm text-slate-600">
          Sin novedades por ahora.
        </div>
      )}
      
      {!notificationsLoading && !notificationsError && notifications.length > 0 && (
        <div className="px-2 pb-2">
          {notifications.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setNotificationsOpen(false);
                const suffix = `?notification=${item.id}`;
                if (item.target_type === "event") {
                  navigate(`/turista/evento/${item.target_id}${suffix}`);
                  return;
                }
                navigate(`/turista/sitio/${item.target_id}${suffix}`);
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
  );
}
