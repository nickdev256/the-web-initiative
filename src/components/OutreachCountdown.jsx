import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { events } from '../data/events.js';

// Live countdown to the next medical camp, shown in the navbar top bar.
// Dates come from src/data/events.js. Times are East Africa Time (UTC+3),
// so every visitor counts down to the same moment wherever they are.
const EAT_OFFSET_HOURS = 3;
const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

// Midnight at the start of a YYYY-MM-DD day, in Uganda time
function ugandaMidnight(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number);
  return Date.UTC(year, month - 1, day) - EAT_OFFSET_HOURS * HOUR;
}

// The whole round of camps (e.g. 1st–13th March) counts as one outreach
function getOutreach(now) {
  const camps = events
    .map((event) => ({
      ...event,
      startsAt: ugandaMidnight(event.date),
      endsAt: ugandaMidnight(event.endDate || event.date) + DAY,
    }))
    .filter((event) => event.endsAt > now)
    .sort((a, b) => a.startsAt - b.startsAt);

  if (camps.length === 0) return null;

  // Camps in the same place that follow on from the first one
  const first = camps[0];
  const round = camps.filter((camp) => camp.location === first.location);
  const endsAt = Math.max(...round.map((camp) => camp.endsAt));
  const place = first.location.split(',')[0];

  return { first, startsAt: first.startsAt, endsAt, place };
}

const pad = (value) => String(value).padStart(2, '0');

function OutreachCountdown({ tabIndex }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), SECOND);
    return () => window.clearInterval(timer);
  }, []);

  const outreach = getOutreach(now);

  // No camps planned: keep the usual link to ask about camps
  if (!outreach) {
    return (
      <Link to="/contact" className="navbar-topbar-cta" tabIndex={tabIndex}>
        <CalendarDays size={14} aria-hidden="true" />
        Ask about upcoming medical camps
        <ArrowRight size={14} aria-hidden="true" />
      </Link>
    );
  }

  const link = outreach.first.camp ? `/medical-camps/${outreach.first.camp}` : '/medical-camps';

  // Camps are running now
  if (now >= outreach.startsAt) {
    return (
      <Link to="/medical-camps" className="navbar-topbar-cta outreach-countdown is-live" tabIndex={tabIndex}>
        <span className="outreach-live-dot" aria-hidden="true" />
        <span>
          Outreach happening now in <strong>{outreach.place}</strong>
        </span>
        <ArrowRight size={14} aria-hidden="true" />
      </Link>
    );
  }

  const left = outreach.startsAt - now;
  const days = Math.floor(left / DAY);
  const hours = Math.floor((left % DAY) / HOUR);
  const minutes = Math.floor((left % HOUR) / MINUTE);
  const seconds = Math.floor((left % MINUTE) / SECOND);

  return (
    <Link
      to={link}
      className="navbar-topbar-cta outreach-countdown"
      tabIndex={tabIndex}
      aria-label={`${outreach.place} outreach starts in ${days} ${days === 1 ? 'day' : 'days'}. View camp details.`}
    >
      <CalendarDays size={14} aria-hidden="true" />
      <span className="outreach-countdown-label">
        <span className="outreach-countdown-long">{outreach.place} outreach starts in</span>
        <span className="outreach-countdown-short">Outreach in</span>
      </span>
      <span className="outreach-countdown-time" aria-hidden="true">
        <span>
          <strong>{days}</strong>
          <span className="outreach-unit-long"> {days === 1 ? 'day' : 'days'}</span>
          <span className="outreach-unit-short">d</span>
        </span>
        <span><strong>{pad(hours)}</strong>h</span>
        <span><strong>{pad(minutes)}</strong>m</span>
        <span><strong>{pad(seconds)}</strong>s</span>
      </span>
      <ArrowRight size={14} aria-hidden="true" />
    </Link>
  );
}

export default OutreachCountdown;
