import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BedDouble,
  Bus,
  CalendarDays,
  Check,
  HandCoins,
  Heart,
  Landmark,
  Lock,
  Pill,
  Share2,
  Stethoscope,
  Tent,
  Users,
} from 'lucide-react';

import {
  campaign,
  campaignDonateLink,
  campaignProgress,
  formatUsd,
} from '../data/campaign.js';
import { formatDateRange, getUpcomingEvents } from '../data/events.js';
import CountryFlag from './CountryFlag.jsx';
import { responsiveImage } from '../utils/responsiveImage.js';
import { startCampaignMotion } from './campaignMotion.js';
import './Campaign.css';

const ICONS = {
  pill: Pill,
  stethoscope: Stethoscope,
  bus: Bus,
  tent: Tent,
  bed: BedDouble,
  landmark: Landmark,
  hands: HandCoins,
};

const DAY = 24 * 60 * 60 * 1000;

// The next round of camps (first upcoming camp to the last one in the same
// place) and the whole days left until it starts, in Uganda time (UTC+3)
function nextCamps() {
  const upcoming = getUpcomingEvents(10);
  if (!upcoming.length) return null;
  const first = upcoming[0];
  const round = upcoming.filter((event) => event.location === first.location);
  const last = round[round.length - 1];
  const [year, month, day] = first.date.split('-').map(Number);
  const startsAt = Date.UTC(year, month - 1, day) - 3 * 60 * 60 * 1000;
  return {
    dates: formatDateRange({ dateValue: first.dateValue, endValue: last.endValue }),
    place: first.location.split(',')[0],
    flag: first.flag,
    count: round.length,
    daysLeft: Math.max(0, Math.ceil((startsAt - Date.now()) / DAY)),
  };
}

// A dollar figure that counts up from zero when it scrolls into view, and
// rolls on to the new figure if the total changes while the page is open. GSAP writes
// the text, so React leaves the element's content alone.
function AnimatedAmount({ value, className }) {
  const ref = useRef(null);
  const shown = useRef({ value: 0 });
  const revealed = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    const write = () => {
      element.textContent = formatUsd(Math.round(shown.current.value));
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      shown.current.value = value;
      write();
      return undefined;
    }

    const roll = (duration) =>
      gsap.to(shown.current, { value, duration, ease: 'power2.out', overwrite: true, onUpdate: write });

    if (revealed.current) {
      const tween = roll(1.4);
      return () => tween.kill();
    }

    write();
    const trigger = ScrollTrigger.create({
      trigger: element,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        revealed.current = true;
        roll(1.8);
      },
    });
    return () => trigger.kill();
  }, [value]);

  return <strong ref={ref} className={className} aria-hidden="true" />;
}

function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = `${window.location.origin}${campaignDonateLink()}`;
    const text = `Help The Web Initiative raise ${formatUsd(campaign.goal)} for its community medical camps in Uganda.`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'The Web Initiative: medical camps campaign', text, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // Sharing was cancelled, or the clipboard is not available
    }
  }

  return (
    <button type="button" className="campaign-btn campaign-btn-outline" onClick={share}>
      {copied ? <Check size={18} aria-hidden="true" /> : <Share2 size={18} aria-hidden="true" />}
      <span aria-live="polite">{copied ? 'Link copied' : 'Share'}</span>
    </button>
  );
}

function Progress({ raised, dark = false }) {
  const percent = campaignProgress({ goal: campaign.goal, raised });
  const started = raised > 0;

  return (
    <div className={`campaign-progress${dark ? ' is-dark' : ''}`}>
      <div className="campaign-progress-figures">
        <p className="campaign-figure">
          <AnimatedAmount className="campaign-figure-number" value={started ? raised : campaign.goal} />
          <span className="sr-only">
            {started
              ? `${formatUsd(raised)} raised of a ${formatUsd(campaign.goal)} goal`
              : `Goal: ${formatUsd(campaign.goal)}`}
          </span>
          <span className="campaign-figure-label" aria-hidden="true">
            {started ? `raised of ${formatUsd(campaign.goal)}` : 'goal'}
          </span>
        </p>
        <span className="campaign-percent" aria-hidden="true">
          {started ? `${percent}% funded` : 'Just launched'}
        </span>
      </div>

      <div
        className="campaign-bar"
        role="progressbar"
        aria-label="Campaign progress"
        aria-valuemin={0}
        aria-valuemax={campaign.goal}
        aria-valuenow={raised}
        aria-valuetext={`${formatUsd(raised)} of ${formatUsd(campaign.goal)}`}
      >
        <span className="campaign-bar-fill" style={{ '--progress': `${Math.max(percent, started ? 2 : 0)}%` }} />
        <span className="campaign-bar-tick" style={{ left: '25%' }} />
        <span className="campaign-bar-tick" style={{ left: '50%' }} />
        <span className="campaign-bar-tick" style={{ left: '75%' }} />
      </div>

      {!started && (
        <p className="campaign-first">
          <Heart size={15} aria-hidden="true" />
          Be one of the first to give
        </p>
      )}
    </div>
  );
}

function Campaign({ variant = 'full', onGive }) {
  const rootRef = useRef(null);
  const camps = nextCamps();
  const { raised, donors } = campaign;

  useEffect(() => startCampaignMotion(rootRef.current), []);

  if (variant === 'compact') {
    return (
      <aside className="campaign-compact" ref={rootRef} aria-labelledby="campaign-compact-title">
        <div className="campaign-compact-main">
          <span className="campaign-live">
            <span className="campaign-live-dot" aria-hidden="true" />
            Live campaign
          </span>
          <h2 id="campaign-compact-title">
            Help us fund our next medical camps
          </h2>
          <Progress raised={raised} dark />
        </div>

        <ul className="campaign-compact-uses" aria-label="What the money covers">
          {campaign.uses.map((use) => {
            const Icon = ICONS[use.icon];
            return (
              <li key={use.title}>
                <Icon size={15} aria-hidden="true" />
                {use.title}
              </li>
            );
          })}
        </ul>

        {onGive ? (
          <button type="button" className="campaign-btn campaign-btn-light" onClick={onGive}>
            Give to this campaign
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        ) : (
          <Link to={campaignDonateLink()} className="campaign-btn campaign-btn-light">
            Give to this campaign
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        )}
      </aside>
    );
  }

  return (
    <section className="campaign" ref={rootRef} data-own-motion aria-labelledby="campaign-title">
      <div className="campaign-container">
        <article className="campaign-card">
          <figure className="campaign-media">
            <img
              {...responsiveImage('/images/camps/nurse-with-baby.jpg', '(max-width: 900px) 100vw, 560px')}
              alt="A volunteer with a stethoscope holding a baby at one of our medical camps"
              loading="lazy"
            />
            <span className="campaign-live">
              <span className="campaign-live-dot" aria-hidden="true" />
              Live campaign
            </span>
            {camps && (
              <figcaption className="campaign-media-caption">
                <span>Next medical camps</span>
                <strong>
                  <CalendarDays size={16} aria-hidden="true" />
                  {camps.dates}
                </strong>
                <span className="campaign-media-place">
                  {camps.place}
                  <CountryFlag code={camps.flag} />
                </span>
              </figcaption>
            )}
          </figure>

          <div className="campaign-body">
            <span className="campaign-kicker">Fundraising campaign</span>
            <h2 id="campaign-title">
              Help us raise <span className="campaign-goal-word">{formatUsd(campaign.goal)}</span> to
              bring care to communities in need
            </h2>
            <p className="campaign-lead">
              Your gift pays for the medicines, equipment, transport and volunteers that make our
              community medical camps possible.
            </p>

            <Progress raised={raised} />

            <ul className="campaign-stats">
              {/* Donors and % funded once the first gifts are in */}
              {raised > 0 && (
                <>
                  <li>
                    <Users size={18} aria-hidden="true" />
                    <span>
                      <strong>{donors.toLocaleString('en-US')}</strong>
                      {donors === 1 ? 'donor' : 'donors'}
                    </span>
                  </li>
                  <li>
                    <Heart size={18} aria-hidden="true" />
                    <span>
                      <strong>{campaignProgress({ goal: campaign.goal, raised })}%</strong>
                      funded
                    </span>
                  </li>
                </>
              )}
              {camps && (
                <li>
                  <CalendarDays size={18} aria-hidden="true" />
                  <span>
                    <strong>{camps.daysLeft}</strong>
                    {camps.daysLeft === 1 ? 'day to camps' : 'days to camps'}
                  </span>
                </li>
              )}
              {camps && raised === 0 && (
                <li>
                  <Stethoscope size={18} aria-hidden="true" />
                  <span>
                    <strong>{camps.count}</strong>
                    {camps.count === 1 ? 'medical camp' : 'medical camps'}
                  </span>
                </li>
              )}
            </ul>

            <div className="campaign-amounts" role="group" aria-label="Choose an amount to give">
              {campaign.amounts.map((amount) => (
                <Link key={amount} to={campaignDonateLink(amount)} className="campaign-amount">
                  {formatUsd(amount)}
                </Link>
              ))}
            </div>

            <div className="campaign-actions">
              <Link to={campaignDonateLink()} className="campaign-btn campaign-btn-primary">
                <Heart size={18} aria-hidden="true" />
                Donate now
              </Link>
              <ShareButton />
            </div>

            <p className="campaign-secure">
              <Lock size={14} aria-hidden="true" />
              Secure card checkout, or give by bank transfer
            </p>
          </div>
        </article>

        <div className="campaign-uses">
          <div className="campaign-uses-heading">
            <span className="campaign-kicker">Where your gift goes</span>
            <h3>The {formatUsd(campaign.goal)} will cover</h3>
          </div>

          <div className="campaign-uses-grid">
          <ol className="campaign-uses-list">
            {campaign.uses.map((use, index) => {
              const Icon = ICONS[use.icon];
              return (
                <li key={use.title} className="campaign-use">
                  <span className="campaign-use-number" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="campaign-use-icon" aria-hidden="true">
                    <Icon size={22} />
                  </span>
                  <strong>{use.title}</strong>
                  {use.detail && <span className="campaign-use-detail">{use.detail}</span>}
                </li>
              );
            })}
          </ol>

          <Link to={campaignDonateLink()} className="campaign-use-cta">
            <span className="campaign-use-cta-icon" aria-hidden="true">
              <Heart size={22} />
            </span>
            <strong>Every gift moves us closer to {formatUsd(campaign.goal)}</strong>
            <span className="campaign-use-cta-link">
              Give now
              <ArrowRight size={17} aria-hidden="true" />
            </span>
          </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Campaign;
