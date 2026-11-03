// Everything the navbar search can find. Each entry opens a page, or a
// section of a page when the path has a #section. `keywords` holds other
// words people might type for the same thing.

export const SEARCH_INDEX = [
  {
    title: 'Home',
    description: 'Community health care for children in Uganda',
    path: '/',
    keywords: 'home start welcome main',
  },
  {
    title: 'Upcoming events',
    description: 'Our next medical camps and outreach dates',
    path: '/#home-events-title',
    keywords: 'events dates calendar schedule next upcoming when',
  },
  {
    title: 'About us',
    description: 'Who we are and why we started',
    path: '/about#who-we-are',
    keywords: 'about who we are organisation organization ngo jinja story',
  },
  {
    title: 'Mission and vision',
    description: 'What we are working towards',
    path: '/about#mission-vision',
    keywords: 'mission vision purpose goal aim',
  },
  {
    title: 'Our story',
    description: 'How The Web Initiative began',
    path: '/about#our-history',
    keywords: 'history story beginning founded',
  },
  {
    title: 'Our objectives',
    description: 'How we turn our purpose into action',
    path: '/about#objectives',
    keywords: 'objectives goals plans focus',
  },
  {
    title: 'Core values',
    description: 'Compassion, trust, service and commitment',
    path: '/about#core-values',
    keywords: 'values compassion trust service commitment principles',
  },
  {
    title: 'Medical services',
    description: 'Care for malnutrition, sickle cell disease and HIV',
    path: '/medical-services',
    keywords:
      'services healthcare health care treatment medical malnutrition sickle cell hiv screening education outreach',
  },
  {
    title: 'Medical camps',
    description: 'Health checks and screening close to home',
    path: '/medical-camps',
    keywords: 'camps camp outreach clinic health checks screening growth monitoring nutrition',
  },
  {
    title: 'Community Health Outreach',
    description: 'Medical camp',
    path: '/medical-camps/community-health',
    keywords: 'camp outreach community healthcare',
  },
  {
    title: 'Health Awareness Campaign',
    description: 'Medical camp',
    path: '/medical-camps/health-awareness',
    keywords: 'camp awareness education campaign',
  },
  {
    title: 'Community Medical Outreach',
    description: 'Medical camp',
    path: '/medical-camps/medical-outreach',
    keywords: 'camp medical outreach',
  },
  {
    title: 'Gallery',
    description: 'Photos from our camps and outreach',
    path: '/gallery',
    keywords: 'gallery photos pictures images camps',
  },
  {
    title: 'Our team',
    description: 'Leadership and board',
    path: '/our-team#ot-teams-title',
    keywords:
      'team people staff leadership board directors founder mukisa george william vicky woods joakim julia birgit dave kwagala uganda usa denmark germany kenya tanzania',
  },
  {
    title: 'Volunteer or partner with us',
    description: 'Ways to join our work',
    path: '/our-team#ot-join-title',
    keywords: 'volunteer join partner partnership help work with us careers',
  },
  {
    title: 'Our impact',
    description: 'Where we focus and our work in action',
    path: '/impact',
    keywords: 'impact results difference work action',
  },
  {
    title: 'Sponsor a patient',
    description: 'Give monthly care to a child: from $65 a month',
    path: '/donate#give',
    keywords:
      'donate donation give gift sponsor support money monthly sickle cell hiv malnutrition malnourished child patient',
  },
  {
    title: 'Donation questions',
    description: 'How to pay, one-time gifts and more',
    path: '/donate#donate-faq-title',
    keywords: 'faq questions pay payment how to give one-time cancel change',
  },
  {
    title: 'Contact us',
    description: 'Send us a message or email our team',
    path: '/contact#contact-form',
    keywords: 'contact message email enquiry inquiry phone talk reach',
  },
  {
    title: 'Find us in Jinja',
    description: 'Our location in Jinja, Uganda',
    path: '/contact#contact-location-title',
    keywords: 'location address map directions jinja uganda office p.o. box',
  },
];

// Shown before anything is typed
export const POPULAR_SEARCHES = ['Sponsor a patient', 'Medical camps', 'Our team', 'Contact us'];

// Returns the best matches for what was typed: every word must appear in
// the title, keywords or description; title matches rank highest.
export function searchSite(query, limit = 6) {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  return SEARCH_INDEX.map((entry) => {
    const title = entry.title.toLowerCase();
    const keywords = entry.keywords.toLowerCase();
    const description = entry.description.toLowerCase();
    let score = 0;

    for (const word of words) {
      if (title.startsWith(word)) score += 5;
      else if (title.includes(word)) score += 3;
      else if (keywords.includes(word)) score += 2;
      else if (description.includes(word)) score += 1;
      else return null;
    }

    return { entry, score };
  })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ entry }) => entry);
}
