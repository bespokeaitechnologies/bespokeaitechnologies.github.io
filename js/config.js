// Set API_BASE to the API gateway, e.g.
//   the Cloudflare Worker gateway URL (gateway/), never the raw ATP host
// Leave empty to run in preview mode (forms show a notice, jobs load from data/jobs.json).
window.BESPOKE_CONFIG = {
  API_BASE: 'https://api.bespokeaitechnologies.com/',
  TURNSTILE_SITEKEY: ''   // optional Cloudflare Turnstile site key
};

