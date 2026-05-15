// ============================================================
//  SiARSIP — config.js
//  Versi 1.1 — Fix CORS untuk GitHub Pages → GAS
// ============================================================

const SIARSIP = {
  API_URL: 'https://script.google.com/macros/s/AKfycbzsFjf8H9OX2DOYzGwhWZ1_nEE-undVu-4BnPSTQS2XXuklzvklacd4nbhH9d66-oq1MQ/exec',

  // POST ke GAS — pakai text/plain agar tidak kena CORS preflight
  async post(action, data = {}) {
    try {
      const body = JSON.stringify({ action, ...data });
      const res  = await fetch(this.API_URL, {
        method : 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body,
      });
      const text = await res.text();
      try { return JSON.parse(text); }
      catch { return { error: 'Response tidak valid: ' + text.substring(0, 100) }; }
    } catch(e) {
      return { error: e.message };
    }
  },

  async get(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res   = await fetch(`${this.API_URL}?${query}`);
      const text  = await res.text();
      try { return JSON.parse(text); }
      catch { return { error: 'Response tidak valid' }; }
    } catch(e) {
      return { error: e.message };
    }
  },

  simpanSesi(data) { sessionStorage.setItem('siarsip_sesi', JSON.stringify(data)); },
  getSesi()        { const d = sessionStorage.getItem('siarsip_sesi'); return d ? JSON.parse(d) : null; },
  hapusSesi()      { sessionStorage.removeItem('siarsip_sesi'); sessionStorage.removeItem('siarsip_step'); sessionStorage.removeItem('siarsip_foto'); },
  setStep(s)       { sessionStorage.setItem('siarsip_step', s); },
  getStep()        { return sessionStorage.getItem('siarsip_step') || 'login'; },

  cekLogin() {
    const sesi = this.getSesi();
    if (!sesi) { window.location.href = 'index.html'; return null; }
    return sesi;
  },

  formatTgl(str) {
    if (!str) return '—';
    const d   = new Date(str);
    const bln = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
    return `${d.getDate()} ${bln[d.getMonth()]} ${d.getFullYear()}`;
  },

  formatWaktu(str) {
    if (!str) return '—';
    const d = new Date(str);
    return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  },

  toast(pesan, tipe = 'sukses') {
    const warna = tipe === 'sukses' ? '#0E7B62' : tipe === 'error' ? '#DC2626' : '#B45309';
    const icon  = tipe === 'sukses' ? '✅' : tipe === 'error' ? '❌' : '⚠️';
    const el    = document.createElement('div');
    el.style.cssText = `position:fixed;bottom:24px;right:24px;background:${warna};color:#fff;
      padding:12px 20px;border-radius:12px;font-size:13px;font-weight:600;z-index:9999;
      box-shadow:0 8px 24px rgba(0,0,0,.3);display:flex;align-items:center;gap:8px;
      animation:slideIn .3s ease;max-width:320px;line-height:1.4;`;
    el.innerHTML = `<span style="flex-shrink:0">${icon}</span><span>${pesan}</span>`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  },
};

const _s = document.createElement('style');
_s.textContent = `@keyframes slideIn{from{transform:translateX(120%);opacity:0}to{transform:translateX(0);opacity:1}}`;
document.head.appendChild(_s);
