# Pre-launch checklist — The Web Initiative Ltd website

Tick each item before going live. **✅ = already done and checked in the code** (16 Nov 2026); everything else needs a person to check, decide or set up. Items marked **(Nico)** involve the backend.

---

## 1. Content and accuracy

- [ ] Proofread every page aloud (Home, About, Medical Services, Medical Camps + 3 camp pages, Our Team, Gallery, Contact, Donate)
- [ ] Team names, roles, countries and photos are correct and approved by each person
- [ ] Sponsorship prices are correct: sickle cell $75, malnutrition $65, HIV $75 per month
- [ ] Contact details work — send a test email to webinitiative26@gmail.com, call +256 769 608 518, and message WhatsApp +45 71 87 10 32
- [ ] P.O. Box 903588 and "Jinja, Uganda" are the address you want public
- [ ] Upcoming events: add real dates, or confirm the "New dates are on the way" message is fine for launch
- [ ] Show the NGO registration number somewhere (footer or About). Donors look for it
- [ ] Add a **Privacy Policy** page (the forms and donations collect names, emails and phone numbers)
- [ ] Add a **Donation and refund policy** page (payment providers such as Pesapal usually ask for one)
- [x] ✅ Photo captions and descriptions match the photos (checked after the latest photo swaps)
- [x] ✅ Dotted labels removed from headings

## 2. Donations (most important for conversion)

- [ ] **(Nico)** Live test of every payment method with a small real gift: card, MTN Mobile Money, Airtel Money, PayPal
- [ ] **(Nico)** The donor sees a clear thank-you or confirmation after paying, and a failed payment shows a helpful message
- [ ] **(Nico)** Donors get a receipt email
- [ ] **(Nico)** Confirm what "Monthly" does in practice: does Pesapal charge again each month, or is it one gift? Make the page wording match
- [ ] **(Nico)** On Vercel: `VITE_API_URL` points to the production backend, and the backend allows the live domain (CORS)
- [x] ✅ "Donate" button stays in the header on phones and tablets (it used to be hidden inside the menu)
- [x] ✅ If the payment service is down, the page offers "Email us your gift" instead of failing

## 3. Forms and enquiries

- [ ] **Decide:** the Contact form and the footer "Get updates" signup currently open the visitor's email app. Many phone users have no email app set up, so some enquiries are lost. Recommended: have Nico add a backend endpoint, or use a form service (e.g. Formspree) and a mailing service (e.g. Mailchimp) for the signup
- [x] ✅ WhatsApp, Call and Email cards on the Contact page (one tap each)

## 4. Speed

- [x] ✅ All fonts load in one request (was 10 separate ones); the extra Poppins font was removed
- [x] ✅ Each page downloads only its own code; other pages load quietly in the background
- [x] ✅ Phones get 1080px photo copies (about 40% of the weight). The photos the Home page loads on a phone: 5.8 MB → 2.2 MB
- [x] ✅ Logo 420 KB → 65 KB; footer logo 82 KB → 27 KB; footer card photo 423 KB → 192 KB
- [x] ✅ Photos lower down the page load only when scrolled to
- [ ] After launch, test the live site at https://pagespeed.web.dev (Mobile). Aim for 90+ on Performance
- [ ] When adding new photos: save them as JPEG (not PNG renamed to .jpg), about 1600px wide, and add a 1080px copy in `public/images/sm/` (see `src/utils/responsiveImage.js`)
- [ ] Keep these out of git and off the server: `public/images/vid.mov`, `public/images/download.png`, the `wallpaper/` folder

## 5. SEO (Google and link previews)

- [x] ✅ Every page has its own title and description; each camp page has its own title
- [x] ✅ One main heading per page, headings in order, every photo has a description
- [x] ✅ Sitemap lists all 11 pages (the removed "Our Impact" page was taken out)
- [x] ✅ Google gets full organisation details (charity, email, phone, Jinja address)
- [x] ✅ Link previews on WhatsApp/Facebook show a real photo (1200×630) instead of the logo
- [ ] Connect the domain **thewebinitiativeltd.org** and check that `https://` works, and that `www` and non-`www` reach the same site
- [ ] Add the site to **Google Search Console**, submit `https://www.thewebinitiativeltd.org/sitemap.xml`, and check for errors after 2–3 days
- [ ] Create a **Google Business Profile** for the Jinja office (helps people find you on Google Maps)
- [ ] Add your Facebook, Instagram, LinkedIn, YouTube and X links in `src/config.js`. The footer icons then switch on and Google links them to the site
- [ ] Optional, later: pre-render the pages, so link previews on WhatsApp/Facebook show each page's own title and description (today every shared link shows the Home page preview)

## 6. Mobile and accessibility

- [x] ✅ Every link and button is at least 44px to tap on phones (footer links were 22px)
- [x] ✅ Form fields use 16px text, so iPhones don't zoom in when you tap them
- [x] ✅ No sideways scrolling on any page from 320px to 2560px
- [x] ✅ Animations are switched off for visitors who turn on "reduce motion" on their device
- [ ] Test on real phones: an iPhone (Safari), an Android phone (Chrome), a small Android (360px wide), and a tablet
- [ ] Test on a slow connection (Chrome DevTools → Network → "Slow 4G")
- [ ] Check with VoiceOver (iPhone) or TalkBack (Android): headings, buttons and photos read sensibly
- [ ] Use the site with only the keyboard (Tab / Enter / Esc) on a computer

## 7. Measuring results (analytics)

- [ ] **Decide:** add analytics. Nothing measures visits or donations today. Options: Google Analytics 4 (free; needs a cookie notice) or Plausible (paid; no cookie notice needed)
- [ ] Track these actions: Donate button taps, completed donations, WhatsApp / call / email taps, contact form sends, newsletter signups

## 8. Technical checks

- [ ] Click every link in the navbar, footer, search and buttons on the live site (no dead links)
- [ ] Refresh a deep page (e.g. `/medical-camps/health-awareness`) on the live site: it should load, not show a 404
- [ ] Check in Safari, Chrome, Firefox and Edge
- [ ] Open the browser console on the live site: no red errors
- [ ] Make sure the Vercel and backend environment variables are set for production, not test keys

## 9. Launch day

- [ ] Merge the latest code to `main` and confirm Vercel deployed it
- [ ] Make a small real donation yourself and confirm it arrives
- [ ] Share the link on WhatsApp and Facebook and check the preview looks right
- [ ] Ask 2–3 people to visit on their phones and report anything odd
- [ ] Two days later: check Search Console and (if added) analytics
