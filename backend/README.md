# 🎬 ZERO CINEMA (Director O.S. V21.0) — Portable Desktop & Web Cinema Studio

Studio penyutradaraan AI presisi tinggi untuk memproduksi naskah film, spesifikasi kamera optik Panavision DXL2, referensi karakter 4-Panel UGC Solid White, dan Master Video Prompt (3-Blok / 9-Blok Extended) siap pakai untuk video generator AI (Runway Gen-3, Kling AI, Sora, Wan2.1).

---

## 📖 PANDUAN LENGKAP INTEGRASI & ADOPSI (DEVELOPER GUIDE)
Bagi Anda atau developer eksternal yang ingin **mengadopsi REST API, memasang iFrame di WordPress/Webflow, atau mendeploy ke Cloud publik**, silakan baca dokumen resmi:
👉 **[`INTEGRATION_GUIDE.md`](INTEGRATION_GUIDE.md)**

---

## 🚀 Cara Menjalankan Aplikasi

### 🖥️ Opsi 1: Aplikasi Desktop PC Mandiri (Rekomendasi)
Klik ganda pada file launcher di folder ini:
* **`LAUNCH_ZERO_CINEMA.bat`** (Launcher 1-klik standar)
* **`LAUNCH_ZERO_CINEMA.vbs`** (Mode senyap tanpa jendela CMD)

### 🌐 Opsi 2: Web Browser Lokal & Swagger Docs
1. Jalankan terminal:
   ```bash
   pip install -r requirements.txt
   python server.py
   ```
2. Buka di browser:
   * **Studio Antarmuka:** [http://localhost:8000](http://localhost:8000)
   * **Dokumentasi Interaktif REST API (Swagger):** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 📁 Struktur File Bersih (Clean Production Directory)

* **`INTEGRATION_GUIDE.md`**: Panduan lengkap integrasi REST API, iFrame, dan Cloud Deployment.
* **`requirements.txt`**: Daftar dependensi Python resmi.
* **`LAUNCH_ZERO_CINEMA.bat` / `.vbs`**: File launcher desktop 1-klik.
* **`app_desktop.py`**: Mesin GUI Desktop native WebView2.
* **`server.py`**: Backend FastAPI server lokal (11 Endpoint REST API).
* **`agent_core.py`**: Core AI reasoning engine & aturan sutradara.
* **`atlas_cloud_helper.py`**: Bridge multimodal image generator (`openai/gpt-image-2`).
* **`static/`**: Antarmuka Monokrom Sinema murni (HTML, CSS, JS, Backdrop).
* **`rules/`**: 6 Modul Aturan Master Sinematografi.
* **`skills/`**: Library keahlian khusus naskah dan sinematografi.

---

## 📡 Ringkasan 11 Endpoint REST API

1. `POST /api/chat-stream` — Alur interaktif 6-step via real-time SSE streaming.
2. `POST /api/v1/screenplay` — Generator naskah skenario format Hollywood.
3. `POST /api/v1/assets/charsheet` — Generator prompt 4-panel raw UGC solid white (100% rambut terlihat).
4. `POST /api/v1/assets/envsheet` — Generator prompt single-wall environment.
5. `POST /api/v1/prompts/9block` — Generator Master Video Prompt 9-Blok Extended (1 blok kode tunggal).
6. `POST /api/v1/prompts/3block` — Generator Standard Prompt 3-Blok.
7. `POST /api/v1/audit` — Audit kepatuhan sinematik 23-poin zero-defect.
8. `POST /api/v1/generate-image` — Render visual langsung via Atlas Cloud `gpt-image-2`.
9. `GET /api/v1/models` — Daftar model AI unggulan (*DeepSeek V3.1, Claude Sonnet 4.6, Gemini 2.5 Flash*).
10. `GET /docs` — Halaman interaktif Swagger UI.
11. `GET /` — Antarmuka Web Studio ZERO CINEMA.
