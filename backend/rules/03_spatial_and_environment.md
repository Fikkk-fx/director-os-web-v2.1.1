# 🏛️ DIRECTOR O.S. — MODULE 03: SPATIAL BLUEPRINT & ENVIRONMENT MANDATES

## 1. SPATIAL BLUEPRINT V2 (ANTI-HALLUCINATED URBAN TOPOLOGY)
- Every spatial location MUST define a 4-Vector Architectural Grid (`[NORTH VECTOR]`, `[SOUTH VECTOR]`, `[EAST VECTOR]`, `[WEST VECTOR]`).
- Specify exact door/window counts, dimensions (e.g. `2.1m x 0.9m`), lever handle heights (`1.0m`), thresholds, and curb stone heights (`150mm vertical concrete curb stone`).

## 2. THE SINGLE-VECTOR FOCUSED ENVIRONMENT LAW (THE SINGLE-WALL FRAMING LAW)
- When a multi-clip sequence takes place along or facing a single dominant direction/wall across >2 consecutive clips (e.g. fighting against a single brick wall along a narrow alleyway), the `EnvSheet` prompt MUST focus 100% strictly on that single background wall/side perspective.
- **Benefit:** Eliminates unwanted 180-degree camera flipping and prevents AI video engines from hallucinating non-existent opposite walls.

## 3. THE DYNAMIC DIRECTIONAL SUB-ENVIRONMENT & MOTIVATED REVERSE CUT
- **Panning Right/Left (Max 45°-90° Pivot Arc):** Create separate directional sub-environment sheets (`@image_env_center`, `@image_env_right`, `@image_env_left`) and tag the explicit spatial movement path in `[PROSE]`: `"camera pans smoothly from center perspective @image_env_center toward right-hand wall @image_env_right"`.
- **180° Reverse Perspective (Split into Motivated Reverse Cut):** Sesuai Hukum Batas Rotasi 90°, dilarang memaksakan putaran kamera 180° di dalam 1 klip. Buat Reverse Environment Sheet (`@image_env_reverse`) dan pecah menjadi 2 Klip terpisah: Klip 1 (Frontal View) $\rightarrow$ Cut ke Klip 2 (Reverse Angle Over-The-Shoulder View @image_env_reverse).

## 4. THE MANDATORY FLOOR ANCHOR & WIDE-SHOT TOPOLOGY MANDATE
- **Mandatory Floor Pavement Reference:** Every environment sheet (`EnvSheet`), whether 1-side, 2-side, 3-side, or 4-side, MUST MANDATORILY include explicit floor pavement architectural details (`@image_env_floor` or dedicated floor material anchor). Specifying floor pavement physics eliminates floating feet, melting pavement, and foot clipping glitches.
- **Wide Shot & Top-Down Composite:** For Wide Shots, Overhead High-Angle / Top-Down Bird's Eye View, or Full 360° Shots, generate a 4-side stitched composite environment sheet (`@image_env_full`) using Atlas Cloud Image Edit (`openai/gpt-image-2`) combining the 4 wall directions and floor pavement into a single unified architectural layout.

## 5. THE UNIVERSAL 6-PLANE BOUNDARY ENVELOPE MANDATE
- **6 Spatial Boundary Planes:** Spatial environments consist of 6 flexible boundary planes: **Ground/Bottom Plane** (wet cement, mud, deck, clouds, ocean, void), **Ceiling/Canopy/Top Plane** (concrete ceiling, wooden beams, blue tarp, open sky, storm clouds, foliage), and **4 Lateral Boundary Vectors** (North, South, East, West — walls, horizons, trees, containers, vehicle panels).
- **Dynamic Plane Selection Law:** Based on camera framing:
  - **Low-Angle Tilt Up:** Include Ceiling/Top Plane reference `@image_env_ceiling` (concrete ceiling / tarp / sky).
  - **High-Angle / Top-Down:** Include Ground/Bottom Plane `@image_env_ground` (wet pavement / floor).
  - **360° Orbital:** Include 4-Side Lateral Composite `@image_env_full`.

## 6. THE IN-VERSE EXPANSIVE MULTI-ZONE & TEMPORAL HARD-CUT CODEX V20.5

1. **Prinsip Skala Sesuai Semesta Cerita (*In-Verse Scale Principle*):**
   - Skala luas **TIDAK HARUS selalu antar-benua/keliling dunia**, melainkan dieksplorasi **DI DALAM SEMESTA/DUNIA CERITA ITU SENDIRI (*In-Verse Scope*)**.
   - Apapun genrenya, dalam video berdurasi pendek **30 detik sekalipun**, sistem WAJIB memperkaya cerita dengan **3 hingga 5 sudut dunia kontras di dalam semesta tersebut** yang dihubungkan oleh *Hard-Cut* lintas waktu (pagi, siang, sore, malam, beda hari/minggu):

2. **Matriks Contoh Skala Multi-Zona Lintas Semesta Cerita (30 Detik / 5 Klip):**
   - **A. Semesta Urban Crime / Mafia Lokal:**
     * `[Klip 1 (Sore)]: Warung kopi remang-remang pinggir rel (Merencanakan kudeta).`
     * `[Klip 2 (2 Hari Kemudian - Tengah Malam)]: Gudang kontainer pelabuhan basah hujan deras.`
     * `[Klip 3 (1 Minggu Kemudian - Siang Terik)]: Penthouse kaca lantai 40 menghadap gedung pencakar langit.`
     * `[Klip 4 (3 Minggu Kemudian - Malam)]: Ruang interogasi sel polisi temaram berlampu neon kedip.`
     * `[Klip 5 (Subuh Berkabut)]: Gang sempit pasar becek basah subuh (Adu tembak terakhir).`
   - **B. Semesta Desa / Folklore Tradisional:**
     * `[Klip 1 (Siang)]: Bale desa kayu di bawah pohon beringin panas.`
     * `[Klip 2 (Senja Emas)]: Pinggiran sungai berbatu air deras berembun.`
     * `[Klip 3 (Malam Gulita)]: Hutan bambu lebat berangin dingin.`
     * `[Klip 4 (Subuh)]: Dapur rumah panggung tua berlampu minyak teplok mengepulkan asap.`
   - **C. Semesta Remaja / Drama Sekolah (High School Verse):**
     * `[Klip 1 (Sore)]: Ruang kelas kosong berdebu saat bel pulang sekolah.`
     * `[Klip 2 (Malam)]: Lapangan basket luar berpagar kawat di bawah lampu jalan temaram.`
     * `[Klip 3 (Beda Hari - Siang)]: Atap sekolah (rooftop) berangin kencang menghadap awan cerah.`
     * `[Klip 4 (Tengah Malam)]: Kamar tidur berantakan dengan lampu meja belajar temaram.`
     * `[Klip 5 (Pagi Hari)]: Lorong deretan loker ramai siswa saat hujan deras di luar jendela.`
   - **D. Semesta Perang Militer / Taktis:**
     * `[Klip 1 (Pagi)]: Barak baris-berbaris debu kering.`
     * `[Klip 2 (Sore)]: Ruang komando bawah tanah di depan layar radar.`
     * `[Klip 3 (Malam)]: Pos jaga perbatasan tebing batu berangin badai.`
     * `[Klip 4 (Fajar Subuh)]: Parit pertahanan lumpur basah berjelaga mesiu.`

3. **Multi-Wardrobe & Chronological Evolution Sesuai Semesta:**
   - Karakter berganti pakaian secara logis mengikuti waktu dan situasi di semestanya (Seragam bersih $\rightarrow$ jaket lusuh $\rightarrow$ pakaian basah lumpur).
4. **Thematic Dialogue / V.O. Glued Narrative:**
   - Dialog *Voiceover (V.O.)* atau percakapan lintas klip merekatkan pergantian tempat dan waktu di semesta tersebut menjadi satu alur cerita yang berbobot dan padat!
5. **Multi-Zone Environment Reference Sheets (Fase 3):**
   - Setiap latar unik di semesta tersebut memiliki `EnvSheet` independen yang siap diproduksi tanpa tercampur.

## 7. THE MANDATORY 100% 2D ANIME PAINTED ENVIRONMENT LAW (THE ZERO-3D-TOKEN MANDATE)
- Dalam seluruh proyek bergenre Anime, Sakuga, atau Kartun 2D:
  - **DILARANG KERAS** menggunakan deskriptor fotorealistik live-action (`35mm lens`, `photorealistic`, `unreal engine`, `hyper-realistic photography`) pada environment sheet maupun prompt video!
  - **DILARANG KERAS MENYEBUT KATA "3D", "CGI", ATAU "RENDER" SAMA SEKALI** (termasuk dilarang menulis "no 3D" atau "0% 3D", karena Text Encoder model AI justru akan mengaktifkan bobot atensi positif pada kata '3D' tersebut!).
  - **WAJIB HANYA MENGGUNAKAN 100% PURE POSITIVE 2D SPECIFICATION TOKENS:** `traditional hand-painted Japanese anime background illustration`, `Kyoto Animation and Makoto Shinkai background art aesthetic`, `2D cel animation layout`, `traditional poster color scenery painting`, `gouache matte textures`, `crisp hand-drawn line-art scenery`.

---

## 8. THE ANTI-GHOST SILHOUETTE & ASPECT-RATIO PARITY LAW (ENVSHEET ZERO-DEFECT) V20.5

1. **Anti-Ghost Silhouette Mandate (Zero Phantom Humans):**
   - Generator gambar (Midjourney / Flux / GPT-Image) DILARANG KERAS memunculkan siluet manusia atau orang berjalan di latar belakang gambar arsitektur.
   - Setiap prompt `EnvSheet` WAJIB mengunci: `"Pure uninhabited architectural set, 100% devoid of human presence, zero human figures, zero silhouettes, zero pedestrians, completely vacant empty space"`.
2. **Aspect Ratio Parity Mandate (Anti-Anamorphic Pinch):**
   - Rasio aspek gambar `EnvSheet` WAJIB 100% identik dengan rasio aspek target video final (Gunakan `--ar 9:16` untuk format vertikal TikTok/Reels UGC, dan `--ar 16:9` atau `--ar 2.39:1` untuk sinema layar lebar), mencegah distorsi dinding terkompresi atau pintu gepeng.

---

## 9. THE CINEMATIC ENVIRONMENT UGC ISOLATION & MASTER STYLE INHERITANCE LAW V20.5

1. **Hukum Isolasi Total Antara Kulit Karakter vs Sensor Kamera Lingkungan (Anti-Token Bleed & Anti-UGC EnvSheet):**
   - **DILARANG KERAS token "Raw UGC", "4-Panel UGC", "smartphone photo", maupun "Solid White Background" bocor ke dalam `EnvSheet`!**
   - Format "Raw UGC photo pada solid white background" HANYA EKSKLUSIF untuk `CharSheet` (karakter).
   - `EnvSheet` WAKTU HUKUMNYA WAJIB 100% berupa **Set Arsitektur Sinematik / Lanskap Lingkungan Kosong Tanpa Manusia** (`pure uninhabited architectural set, 100% devoid of human presence, completely vacant empty space`) dengan tata pencahayaan atmosferik nyata (*Panavision/ARRI 24mm wide angle, motivated lighting, volumetric depth*).
   - Deskripsi kulit alami pada karakter (*visible micro-pores, biological dermals*) adalah urusan anatomi karakter di Blok 3/CharSheet, BUKAN alasan untuk mengubah sensor kamera ruangan menjadi rekaman HP. Lingkungan film bioskop WAJIB 100% menggunakan optik prima dan tata cahaya volumetrik independen (*Panavision / Arri Alexa 35, 3200K / 5600K motivated keylight*).
2. **Hukum Kekekalan Memori Gaya (The Hermetic Master Style Persistence Mandate):**
   - Gaya sinematik / Auteur Power Duo yang telah dipilih user pada **Turn 2 (Phase 0)** **WAKTU HUKUMNYA WAJIB DIINGAT DAN DIWARISKAN 100% SECARA PERSISTEN PADA SEMUA STEP, SESI, DAN KLIP BERIKUTNYA**:
     - Pada Turn 3 (Naskah) $\rightarrow$ Struktur dialog dan subteks batin wajib mencerminkan sutradara terpilih.
     - Pada Turn 4 (Assets) $\rightarrow$ `CharSheet`, `EnvSheet`, dan `PropSheet` wajib mewarisi color science dan tata pencahayaan sutradara terpilih.
     - Pada Turn 5 (Prompts) $\rightarrow$ Blok 5 (Optik), Blok 6 (Lighting), dan Blok 10 (Editorial) wajib setia 100% pada sutradara terpilih tanpa mengalami *style drift* atau *aesthetic amnesia*.

---

## 10. THE GLOBAL ILLUMINATION RADIOSITY & BROWNIAN ATMOSPHERIC PARTICLE CODEX (FISIKA UDARA & PANTULAN CAHAYA GLOBAL)

Untuk memusnahkan kesan "karakter seperti ditempel di latar belakang / CGI steril" dan menghadirkan atmosfer ruang fisik nyata tanpa efek berlebihan:

1. **VOLUMETRIC TYNDALL SCATTERING & BROWNIAN DUST DYNAMICS:**
   - Di dalam berkas cahaya matahari atau lampu sorot (*motivated volumetric light beam*), sertakan butiran debu mikro yang melayang lambat secara organik (*Brownian motion dynamics*).
   - *Perisai Anti-Lebay (Anti-Overdose Threshold):* `"sparse 3 to 5 subtle atmospheric dust motes gently drifting across light shaft, strictly 0% heavy fog, 0% industrial smoke, 0% dust storm overload"`.

2. **RADIOSITY COLOR BLEEDING & GLOBAL ILLUMINATION EQUILIBRIUM:**
   - Permukaan kain/benda berpigmen kuat memancarkan pantulan cahaya sekunder halus (*subtle motivated secondary radiosity color bounce*) ke dinding atau lantai di dekatnya (misal: pantulan hijau zamrud gaun sutra ke lantai marmer basah).
   - *Perisai Anti-Lebay:* `"subtle organic radiosity color bounce adhering strictly to Inverse-Square Law (1/d^2), 0% cartoon glowing outline, 0% unnatural neon color contamination"`.

---

## 11. THE SPATIAL SIGHTLINE & ARRIVAL VECTOR ALIGNMENT LAW (HUKUM KESELARASAN VEKTOR KEDATANGAN SPASIAL)

Untuk memusnahkan bug fatal di mana karakter menyambut/memanggil orang yang justru muncul di belakang punggungnya:

1. **SIGHTLINE & ARRIVAL COHERENCE MANDATE:**
   - Jika Karakter A (misal: anak/ibu) sedang menunggu, melompat, atau memanggil Karakter B (misal: ayah yang baru tiba di bandara/stasiun/pintu):
   - **ARAH PANDANG KARAKTER A WAJIB SEJAJAR DENGAN VEKTOR KEDATANGAN KARAKTER B.**
   - **DILARANG KERAS** menempatkan pintu kedatangan / Karakter B di latar belakang (*background*) di belakang punggung Karakter A jika Karakter A sedang menghadap ke kamera! (Hal ini membuat Karakter A tampak membelakangi ayahnya namun melambai ke arah sebaliknya).

2. **2 STRUKTUR KAMERA YANG SAH UNTUK ADEGAN MENUNGGU & REUNI:**
   - **Setup A (Over-The-Shoulder / Profile Sightline):** Kamera berada di samping/belakang Karakter A membidik ke arah pintu kedatangan, sehingga penonton melihat Karakter A menatap lurus ke arah pintu di mana Karakter B muncul di kejauhan (*foreground-to-background spatial depth*).
   - **Setup B (Frontal Sightline with Off-Screen Foreground Arrival):** Kamera membidik wajah Karakter A yang sedang melambai ke depan (ke arah lensa), dan Karakter B tiba dari arah depan kamera (*entering frame from foreground/screen-right*) menuju Karakter A.
