/* Client for the ATP/ORDS backend. Requests use text/plain so no CORS preflight is needed. */
(function () {
  const cfg = window.BESPOKE_CONFIG || {};
  const base = (cfg.API_BASE || '').replace(/\/?$/, '/');
  const live = !!cfg.API_BASE;

  async function post(path, payload) {
    if (!live) return { ok: false, preview: true, message: 'Preview mode: the API is not connected yet.' };
    try {
      const r = await fetch(base + path, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify(payload)
      });
      const j = await r.json().catch(() => ({}));
      return { ok: r.ok && j.ok !== false, message: j.message || (r.ok ? 'Done.' : 'Request failed.'), data: j, status: r.status };
    } catch (e) {
      return { ok: false, message: 'Network error. Please try again.' };
    }
  }

  async function jobs() {
    try {
      if (live) {
        const r = await fetch(base + 'jobs');
        if (r.ok) return (await r.json()).items || [];
      }
      const r = await fetch('data/jobs.json');
      return (await r.json()).items || [];
    } catch (e) { return []; }
  }

  const fileToBase64 = file => new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(String(fr.result).split(',')[1] || '');
    fr.onerror = rej;
    fr.readAsDataURL(file);
  });

  window.BespokeAPI = { live, post, jobs, fileToBase64 };
})();
