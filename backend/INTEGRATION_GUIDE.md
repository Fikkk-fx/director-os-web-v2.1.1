# 🎬 PANDUAN LENGKAP INTEGRASI & ADOPSI — ZERO CINEMA (V21.0)
### *The Master Directing REST API & Cinema Studio Integration Guide*

Dokumen ini adalah panduan resmi bagi developer, creator, atau tim teknis yang ingin **mengadopsi, mengintegrasikan, atau mendeploy sistem ZERO CINEMA** ke dalam website, aplikasi mobile, dashboard internal, atau produk SaaS pihak ketiga.

---

## 📑 DAFTAR ISI
1. [Arsitektur Sistem & Spesifikasi](#1-arsitektur-sistem--spesifikasi)
2. [Instalasi Cepat (Quick Start)](#2-instalasi-cepat-quick-start)
3. [Skenario Adopsi 1: Integrasi REST API (React, Next.js, Vue, Laravel)](#3-skenario-adopsi-1-integrasi-rest-api)
4. [Skenario Adopsi 2: Pasang via iFrame & Widget (WordPress / Webflow)](#4-skenario-adopsi-2-pasang-via-iframe--widget)
5. [Skenario Adopsi 3: Aplikasi Desktop PC Mandiri (Windows Native)](#5-skenario-adopsi-3-aplikasi-desktop-pc-mandiri)
6. [Skenario Adopsi 4: Deployment ke Cloud Publik (Railway / VPS / Vercel)](#6-skenario-adopsi-4-deployment-ke-cloud-publik)
7. [Daftar Lengkap 11 Endpoint REST API](#7-daftar-lengkap-11-endpoint-rest-api)
8. [Konfigurasi API Key & Keamanan](#8-konfigurasi-api-key--keamanan)
9. [FAQ & Troubleshooting](#9-faq--troubleshooting)

---

## 🏛️ 1. ARSITEKTUR SISTEM & SPESIFIKASI

ZERO CINEMA dibangun dengan pendekatan **Modular & Decoupled Architecture**:
* **Backend Core (`agent_core.py` & `server.py`):** FastAPI + Python dengan sistem dynamic rules loader yang membaca 6 modul aturan penyutradaraan (`rules/01_omni_pipeline.md` s/d `06_auteur_cinematography_codex.md`).
* **Frontend UI (`static/`):** Pure HTML5, Vanilla CSS Monokrom Sinema, dan Javascript ES6 tanpa framework berat.
* **Desktop Engine (`app_desktop.py`):** Microsoft Edge WebView2 native hardware acceleration via Python.
* **Inference Bridge (`atlas_cloud_helper.py`):** Terhubung ke Atlas Cloud API (DeepSeek-V3.1, Claude Sonnet 4.6, Gemini 2.5 Flash, GPT-Image-2).

---

## ⚡ 2. INSTALASI CEPAT (QUICK START)

### Kebutuhan Sistem:
* Python 3.10 atau versi lebih baru
* Windows 10/11 (untuk Desktop GUI) atau Linux/macOS (untuk Server Mode)

### Langkah Menjalankan:
1. **Clone / Buka Folder Proyek:**
   ```bash
   cd "Director_OS_V19 (1)"
   ```
2. **Install Dependensi:**
   ```bash
   pip install fastapi uvicorn requests pydantic pywebview
   ```
3. **Jalankan Server Lokal:**
   ```bash
   python server.py
   ```
4. **Buka Aplikasi:**
   * Antarmuka Web Studio: [http://localhost:8000](http://localhost:8000)
   * Dokumentasi Interaktif Swagger: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 💻 3. SKENARIO ADOPSI 1: INTEGRASI REST API
*Gunakan skenario ini jika Anda membangun website sendiri (React, Next.js, Vue, Svelte, Laravel, Flutter, iOS/Android).*

### A. Alur Chat Interaktif 6-Step (Real-Time SSE Streaming)
Endpoint: `POST /api/chat-stream`

```javascript
// Contoh implementasi di React / Next.js / Vanilla JS
async function streamDirectingSession(messagesHistory, onChunk, onActivity) {
    const response = await fetch('http://localhost:8000/api/chat-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            messages: messagesHistory, // [{ role: 'user', content: 'Film silat 15 detik' }]
            model: 'deepseek-ai/DeepSeek-V3.1',
            language: 'id', // 'id' atau 'en'
            temperature: 0.7
        })
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop();

        for (const evt of events) {
            if (evt.startsWith('data: ')) {
                const data = JSON.parse(evt.replace('data: ', ''));
                if (data.type === 'token') {
                    onChunk(data.text); // Render teks ke layar
                } else if (data.type === 'activity') {
                    onActivity(data.text); // Update status (misal: "Mengunci Optik...")
                }
            }
        }
    }
}
```

---

### B. Generate Naskah Langsung (Direct Screenplay)
Endpoint: `POST /api/v1/screenplay`

```javascript
const res = await fetch('http://localhost:8000/api/v1/screenplay', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        concept: "Duel silat 15 detik di atap gedung hujan",
        auteur_style: "Gareth Evans",
        duration: "15s",
        language: "id"
    })
});
const data = await res.json();
console.log(data.screenplay);
```

---

### C. Generate Character Sheet 4-Panel UGC Solid White
Endpoint: `POST /api/v1/assets/charsheet`

```javascript
const res = await fetch('http://localhost:8000/api/v1/assets/charsheet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        character_name: "Sari",
        age: 28,
        gender: "female",
        ethnicity: "Indonesian",
        wardrobe: "Gaun malam sutra hitam belahan paha",
        details: "tatapan tajam elegan, makeup bold"
    })
});
const data = await res.json();
console.log(data.prompt); 
// Output: Prompt 4-panel solid white dengan rambut 100% utuh siap copas!
```

---

### D. Generate Master 9-Block Extended Prompt
Endpoint: `POST /api/v1/prompts/9block`

```javascript
const res = await fetch('http://localhost:8000/api/v1/prompts/9block', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        screenplay: "EXT. ATAP GEDUNG - MALAM\nBima bersiap duel...",
        duration: "15s",
        camera_spec: "Panavision Millennium DXL2 70mm Primo"
    })
});
const data = await res.json();
console.log(data.master_9block_prompt);
```

---

## 🌐 4. SKENARIO ADOPSI 2: PASANG VIA IFRAME & WIDGET
*Gunakan skenario ini jika ingin menyematkan studio langsung ke WordPress, Webflow, Shopify, atau Notion tanpa koding backend.*

### Responsive Studio Embed:
```html
<div style="position: relative; width: 100%; height: 850px; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.8);">
    <iframe 
        src="http://localhost:8000" 
        width="100%" 
        height="100%" 
        style="border: none;"
        allow="clipboard-write">
    </iframe>
</div>
```

---

## 🖥️ 5. SKENARIO ADOPSI 3: APLIKASI DESKTOP PC MANDIRI

Untuk pengguna studio film yang menginginkan aplikasi software mandiri di Windows:
* **Launcher Standar:** Cukup klik ganda **`LAUNCH_ZERO_CINEMA.bat`**.
* **Launcher Mode Senyap:** Klik ganda **`LAUNCH_ZERO_CINEMA.vbs`** (tanpa jendela hitam CMD).
* **Portabilitas:** Aplikasi otomatis membuka jendela WebView2 hardware-accelerated dan otomatis mematikan backend lokal saat jendela ditutup.

---

## 🚀 6. SKENARIO ADOPSI 4: DEPLOYMENT KE CLOUD PUBLIK

Agar API dan Studio dapat diakses publik di internet 24/7:

### Opsi A: Deploy ke Railway.app / Render.com (Paling Praktis)
1. Hubungkan repository GitHub Anda ke Railway / Render.
2. Set Build Command: `pip install -r requirements.txt` (atau `pip install fastapi uvicorn requests pydantic pywebview`).
3. Set Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`
4. Set Environment Variable: `ATLAS_API_KEY=apikey-anda-disini`.

### Opsi B: Tunneling Instan via Cloudflare Tunnel (Tanpa Sewa VPS)
1. Install Cloudflare Tunnel di PC Anda.
2. Jalankan:
   ```bash
   cloudflared tunnel --url http://localhost:8000
   ```
3. Anda langsung mendapatkan domain HTTPS publik resmi (misal: `https://zero-cinema.trycloudflare.com`) yang bisa dipanggil dari seluruh dunia.

---

## 📋 7. DAFTAR LENGKAP 11 ENDPOINT REST API

| No | Endpoint | Method | Kategori | Deskripsi |
| :---: | :--- | :---: | :--- | :--- |
| **1** | `/api/chat-stream` | `POST` | Full Pipeline | Interaksi 6-Step Sutradara via Real-Time SSE Token Stream |
| **2** | `/api/v1/screenplay` | `POST` | Naskah | Pembuat Naskah Skenario Sinematik & Motivated Cuts |
| **3** | `/api/v1/assets/charsheet` | `POST` | Aset Karakter | Pembuat Prompt 4-Panel UGC Solid White (0% Rambut Terpotong) |
| **4** | `/api/v1/assets/envsheet` | `POST` | Aset Lokasi | Pembuat Prompt Single-Wall Environment 16:9 |
| **5** | `/api/v1/prompts/9block` | `POST` | Master Video | Konversi Naskah ke 1 Master Prompt 9-Blok Extended |
| **6** | `/api/v1/prompts/3block` | `POST` | Master Video | Konversi Naskah ke Standar 3-Blok (`[PROSE]`, `[ACTING]`, `[CAMERA]`) |
| **7** | `/api/v1/audit` | `POST` | Quality Control | Audit Kepatuhan Sinematik 23-Poin Zero-Defect |
| **8** | `/api/v1/generate-image` | `POST` | Visual AI | Render Gambar Visual Langsung via Atlas Cloud `gpt-image-2` |
| **9** | `/api/v1/models` | `GET` | Meta Data | Daftar Model AI Unggulan yang Didukung |
| **10**| `/docs` | `GET` | Dokumentasi | Interactive OpenAPI 3.0 Swagger UI Explorer |
| **11**| `/` | `GET` | Web Studio | Antarmuka ZERO CINEMA Slate Noir Studio |

---

## 🔑 8. KONFIGURASI API KEY & KEAMANAN

API Key Atlas Cloud tidak boleh dibagikan secara publik. Anda dapat mengatur API Key melalui 2 cara:

1. **Via Environment Variable (Direkomendasikan di Server/Cloud):**
   * Windows CMD: `set ATLAS_API_KEY=apikey-anda-disini`
   * Windows PowerShell: `$env:ATLAS_API_KEY="apikey-anda-disini"`
   * Linux / macOS: `export ATLAS_API_KEY="apikey-anda-disini"`
2. **Via File [`agent_core.py`](file:///c:/Users/apilp/Documents/Director_OS_V19%20%281%29-20260813T102230Z-1-001/Director_OS_V19%20%281%29/agent_core.py):**
   * Edit variabel `ATLAS_API_KEY` di baris 20.

---

## ❓ 9. FAQ & TROUBLESHOOTING

* **T: Apakah backend mengizinkan CORS dari domain website saya?**  
  *J:* Ya. `server.py` sudah dilengkapi `CORSMiddleware` dengan konfigurasi `allow_origins=["*"]`, sehingga dapat dipanggil langsung dari localhost manapun maupun domain web produksi Anda.

* **T: Bagaimana jika port 8000 bentrok dengan software lain di PC?**  
  *J:* Anda dapat menjalankan server di port lain:
  ```bash
  uvicorn server:app --host 0.0.0.0 --port 8080 --reload
  ```
  *(Mode Desktop GUI `app_desktop.py` sudah dilengkapi pendeteksi port otomatis jika port 8000 terpakai).*

* **T: Apakah prompt yang dihasilkan cocok untuk semua AI Video Generator?**  
  *J:* Ya. Format 9-Blok Extended dan 3-Blok dirancang 100% kompatibel dan teruji untuk **Runway Gen-3 Alpha, Kling AI (1.0/1.5), OpenAI Sora, Wan2.1, Luma Dream Machine, dan Pika 2.0**.

---
*© 2026 ZERO CINEMA — Studio Production & Directorial OS Architecture.*
