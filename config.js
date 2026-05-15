// ============================================================
//  SiARSIP — config.js
//  Konfigurasi koneksi ke Google Apps Script API
// ============================================================

const SIARSIP = {
  API_URL: 'https://script.google.com/macros/s/AKfycbxoeZa-EaPEyBW_5se_STKub0H-qgoaLhcBuRAKnvGaoveVBCq9aUtyG6pngQro5YFIJg/exec',

  // Panggil API POST
  async post(action, data = {}) {
    try {
      const res = await fetch(this.API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...data }),
      });
      return await res.json();
    } catch (e) {
      return { error: e.message };
    }
  },

  // Panggil API GET
  async get(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${this.API_URL}?${query}`);
      return await res.json();
    } catch (e) {
      return { error: e.message };
    }
  },

  // Simpan sesi login
  simpanSesi(data) {
    sessionStorage.setItem('siarsip_sesi', JSON.stringify(data));
  },

  // Baca sesi login
  getSesi() {
    const d = sessionStorage.getItem('siarsip_sesi');
    return d ? JSON.parse(d) : null;
  },

  // Hapus sesi (logout)
  hapusSesi() {
    sessionStorage.removeItem('siarsip_sesi');
    sessionStorage.removeItem('siarsip_step');
    sessionStorage.removeItem('siarsip_foto');
  },

  // Simpan step login
  setStep(step) {
    sessionStorage.setItem('siarsip_step', step);
  },

  getStep() {
    return sessionStorage.getItem('siarsip_step') || 'login';
  },

  // Cek apakah sudah login
  cekLogin() {
    const sesi = this.getSesi();
    if (!sesi) { window.location.href = 'index.html'; return null; }
    return sesi;
  },

  // Format tanggal Indonesia
  formatTgl(str) {
    if (!str) return '-';
    const d = new Date(str);
    const bln = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
    return `${d.getDate()} ${bln[d.getMonth()]} ${d.getFullYear()}`;
  },

  // Format waktu lengkap
  formatWaktu(str) {
    if (!str) return '-';
    const d = new Date(str);
    return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  },

  // Toast notifikasi
  toast(pesan, tipe = 'sukses') {
    const warna = tipe === 'sukses' ? '#0E7B62' : tipe === 'error' ? '#DC2626' : '#B45309';
    const icon  = tipe === 'sukses' ? '✅' : tipe === 'error' ? '❌' : '⚠️';
    const el = document.createElement('div');
    el.style.cssText = `position:fixed;bottom:24px;right:24px;background:${warna};color:#fff;
      padding:12px 20px;border-radius:12px;font-size:13px;font-weight:600;z-index:9999;
      box-shadow:0 8px 24px rgba(0,0,0,0.25);display:flex;align-items:center;gap:8px;
      animation:slideIn .3s ease;max-width:320px;`;
    el.innerHTML = `<span>${icon}</span><span>${pesan}</span>`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  },
};

// CSS animasi toast
const style = document.createElement('style');
style.textContent = `@keyframes slideIn{from{transform:translateX(120%);opacity:0}to{transform:translateX(0);opacity:1}}`;
document.head.appendChild(style);
