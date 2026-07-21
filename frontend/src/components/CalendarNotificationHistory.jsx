import { useState } from 'react';
import { Bell, ChevronDown, ChevronUp } from 'lucide-react';
import { formatCalendarNotificationTime } from '../utils/calendarNotifications';


export default function CalendarNotificationHistory({
  day,
  notifications = [],
  isKid,
}) {
  const [expanded, setExpanded] = useState(false);
  if (notifications.length === 0) return null;

  const buttonId = `calendar-notifications-button-${day}`;
  const regionId = `calendar-notifications-${day}`;

  return (
    <div className="mt-3 border-t border-border/50 pt-2 min-w-0">
      <button
        id={buttonId}
        type="button"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        aria-controls={regionId}
        className="w-full flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-xs text-muted hover:bg-surface-raised/40 hover:text-cream transition-colors"
      >
        <span className="flex items-center gap-1.5 min-w-0">
          <Bell size={13} className="flex-shrink-0" />
          <span>Notifications</span>
          <span>({notifications.length})</span>
        </span>
        {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>

      {expanded ? (
        <div
          id={regionId}
          role="region"
          aria-labelledby={buttonId}
          className="mt-2 max-h-64 space-y-2 overflow-y-auto overflow-x-hidden pr-1"
        >
          {notifications.map((notification) => (
            <article
              key={notification.id}
              className={`rounded-md border p-2 min-w-0 ${
                notification.is_read
                  ? 'border-border/40 bg-surface-raised/20'
                  : 'border-accent/40 bg-accent/10'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-cream text-xs font-medium break-words min-w-0">
                  {notification.title}
                </p>
                <time className="text-[10px] text-muted flex-shrink-0">
                  {formatCalendarNotificationTime(notification.created_at)}
                </time>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-muted break-words">
                {notification.message}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-muted">
                <span>{notification.is_read ? 'Read' : 'Unread'}</span>
                {!isKid && notification.recipient_name ? (
                  <span className="break-words">
                    <span>Recipient</span>
                    <span aria-hidden="true">:</span>{' '}
                    {notification.recipient_name}
                  </span>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}
