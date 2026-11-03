// Upcoming events shown on the Home page.
// Add one object per confirmed event. Past events are hidden automatically.
//
// {
//   id: 'jinja-health-camp-2026-12',      // unique, used as the React key
//   title: 'Free Community Health Camp',
//   category: 'Medical Camp',
//   date: '2026-12-05',                   // YYYY-MM-DD
//   time: '9:00 AM – 4:00 PM',            // optional
//   location: 'Jinja, Uganda',
//   description: 'Health screening, blood pressure checks and health education.',
//   link: '/medical-camps/community-health', // optional, defaults to /contact
// }
export const events = [];

function toLocalDate(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function getUpcomingEvents(limit = 3, now = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return events
    .map((event) => ({ ...event, dateValue: toLocalDate(event.date) }))
    .filter((event) => event.dateValue >= today)
    .sort((a, b) => a.dateValue - b.dateValue)
    .slice(0, limit);
}
