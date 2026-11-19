// Upcoming medical camps. This is the one place to change camp dates:
// the Home page "Upcoming events", the Medical Camps cards and each camp
// page all read from here. Past camps are hidden automatically.
//
// {
//   id: 'community-health-2027-03',   // unique, used as the React key
//   camp: 'community-health',          // camp page id (/medical-camps/<camp>)
//   title: 'Community Health Outreach',
//   category: 'Medical Camp',
//   date: '2027-03-01',                // first day, YYYY-MM-DD
//   endDate: '2027-03-04',             // last day (optional for one-day events)
//   note: 'No camp on Sunday 7th March', // optional
//   time: '9:00 AM – 4:00 PM',         // optional
//   location: 'Alebtong District, Uganda',
//   flag: 'ug',                         // optional: file in public/images/flags/
//   description: 'Short summary for the Home page card.',
// }
//
// March 2027 round: 1st–14th March in Alebtong District, three camps of four
// days each, with no camp on the Sundays (7 and 14 March).
export const events = [
  {
    id: 'community-health-2027-03',
    camp: 'community-health',
    title: 'Community Health Outreach',
    category: 'Medical Camp',
    date: '2027-03-01',
    endDate: '2027-03-04',
    location: 'Alebtong District, Uganda',
    flag: 'ug',
    description:
      'Community health education and guidance on where to seek appropriate care.',
  },
  {
    id: 'health-awareness-2027-03',
    camp: 'health-awareness',
    title: 'Health Awareness Campaign',
    category: 'Medical Camp',
    date: '2027-03-05',
    endDate: '2027-03-09',
    note: 'No camp on Sunday 7th March',
    location: 'Alebtong District, Uganda',
    flag: 'ug',
    description:
      'Practical health information and preventive health awareness for families.',
  },
  {
    id: 'medical-outreach-2027-03',
    camp: 'medical-outreach',
    title: 'Community Medical Outreach',
    category: 'Medical Camp',
    date: '2027-03-10',
    endDate: '2027-03-13',
    location: 'Alebtong District, Uganda',
    flag: 'ug',
    description:
      'Malnutrition, sickle cell and HIV screening, and enrolment on our medical care plan.',
  },
];

function toLocalDate(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function withDates(event) {
  return {
    ...event,
    link: event.link || (event.camp ? `/medical-camps/${event.camp}` : undefined),
    dateValue: toLocalDate(event.date),
    endValue: toLocalDate(event.endDate || event.date),
  };
}

function startOfToday(now) {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

// 1 → "1st", 2 → "2nd", 3 → "3rd", 4 → "4th", 11 → "11th", 22 → "22nd"
export function ordinal(day) {
  const lastTwo = day % 100;
  if (lastTwo >= 11 && lastTwo <= 13) return `${day}th`;
  return `${day}${{ 1: 'st', 2: 'nd', 3: 'rd' }[day % 10] || 'th'}`;
}

// The "st", "nd", "rd" or "th" on its own (for the big date box)
export function ordinalSuffix(day) {
  return ordinal(day).replace(String(day), '');
}

const monthName = (date) => date.toLocaleDateString('en-GB', { month: 'long' });

// "1st–4th March 2027", "28th February – 3rd March 2027", or "5th March 2027"
export function formatDateRange(event) {
  const start = event.dateValue;
  const end = event.endValue;
  const endText = `${ordinal(end.getDate())} ${monthName(end)} ${end.getFullYear()}`;

  if (start.getTime() === end.getTime()) return endText;
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${ordinal(start.getDate())}–${endText}`;
  }
  const startText = start.getFullYear() === end.getFullYear()
    ? `${ordinal(start.getDate())} ${monthName(start)}`
    : `${ordinal(start.getDate())} ${monthName(start)} ${start.getFullYear()}`;
  return `${startText} – ${endText}`;
}

// Camps still to come (or running today), soonest first
export function getUpcomingEvents(limit = 3, now = new Date()) {
  const today = startOfToday(now);

  return events
    .map(withDates)
    .filter((event) => event.endValue >= today)
    .sort((a, b) => a.dateValue - b.dateValue)
    .slice(0, limit);
}

// The next dates for one camp page (e.g. 'health-awareness'), or null
export function getNextCampEvent(campId, now = new Date()) {
  return getUpcomingEvents(Infinity, now).find((event) => event.camp === campId) || null;
}
