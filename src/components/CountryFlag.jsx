// Small country flag shown next to a place name, e.g. <CountryFlag code="ug" />.
// Flags live in public/images/flags/ (the same set the phone picker uses).
// The place name next to it already says the country, so screen readers skip it.
function CountryFlag({ code }) {
  if (!code) return null;

  return (
    <img
      className="country-flag"
      src={`/images/flags/${code}.svg`}
      alt=""
      width="20"
      height="14"
      loading="lazy"
      decoding="async"
    />
  );
}

export default CountryFlag;
