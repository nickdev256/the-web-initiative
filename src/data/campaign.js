// The current fundraising campaign, shown on the Home and Donate pages
// (src/components/Campaign.jsx).
//
// To update the progress, change `raised` (US dollars) and `donors`, then
// push. While `raised` is 0 the section invites people to be the first to
// give instead of showing an empty total.

export const campaign = {
  id: 'medical-camps',
  title: 'Medical camps campaign',
  goal: 14000,
  raised: 1,
  donors: 0,

  // What the money covers, in the order given by the team
  uses: [
    { icon: 'pill', title: 'Medicines and medical supplies' },
    {
      icon: 'stethoscope',
      title: 'Medical equipment',
      detail: 'BP machines, thermometers, glucometers, weighing scales, stethoscopes and patient cards',
    },
    { icon: 'bus', title: 'Transport', detail: 'Van hire and fuel' },
    { icon: 'tent', title: 'Logistics and venue' },
    { icon: 'bed', title: 'Accommodation, feeding and welfare' },
    { icon: 'landmark', title: 'Local government fees' },
    { icon: 'hands', title: 'Volunteer allowances' },
  ],

  // Quick amounts offered on the campaign (US dollars)
  amounts: [25, 50, 100, 250, 500],
};

export function campaignProgress({ goal, raised } = campaign) {
  return Math.min(100, Math.round((raised / goal) * 100));
}

export const formatUsd = (value) =>
  `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

// Link to the Donate form with the campaign (and optionally an amount) chosen
export function campaignDonateLink(amount) {
  const params = new URLSearchParams({ campaign: campaign.id });
  if (amount) params.set('amount', String(amount));
  return `/donate?${params}#donate-widget`;
}
