# 🔊 DIRECTOR O.S. — MODULE 05: AUDIO, DIALOGUE & PROSODY CODEX

---

## 1. FLUENT DIALOGUE ANCHOR & MULTI-GENRE VOCAL TONE MANDATES V20.5

- **Blok 1 vs Blok 7 Dialogue Separation Law (SSOT Dialogue Rule):**
  - **Blok 1 (`[PROSE]`):** Pemilik TUNGGAL isi teks tuturan dialog murni (`"Teks dialog..."`). Seluruh kalimat ucapan karakter wajib ditulis di Blok 1.
  - **Blok 7 (`[AUDIO]`):** DILARANG MEMBUAT KALIMAT DIALOG BARU. Tugas Blok 7 HANYA MEMPERKUAT DETAIL AUDITORI dari dialog Blok 1: penekanan kata (*word stress*), jeda mikro-napas (*micro-pauses*), infleksi nada, komposisi skoring, akustik ruang, dan Foley soundscape.
- **Clean Prompt Purification Rule (No Meta-Block Leakage):** DILARANG KERAS menulis frasa meta seperti `"from Block 1"`, `"as written in Prose"`, atau `"seperti di Blok 3"` di dalam prompt final!
- **Fluent Lip-Sync Anchor:** Every spoken line MUST explicitly include "fluent": `"speaks rapidly in fluent native [Language]"`.
- **Multi-Genre Vocal & Presentation Modes:**
  - **Feature Film Mode:** `"speaks in fluent native [Language] with natural feature film cadence, Bressonian emotional restraint, organic conversational overlap, zero TV commercial tone"`.
  - **Viral Mobile UGC & Creator Mode:** `"speaks in fluent casual [Language] with punchy high-energy UGC creator cadence, spontaneous conversational flow, direct eye-contact vocal delivery"`.
  - **TVC Commercial & Brand Manifesto Mode:** `"speaks in fluent polished [Language] with premium TVC commercial enunciation, authoritative resonance, crisp articulation"`.
  - **Intimate ASMR & Whispering Mode:** `"speaks in fluent intimate close-mic whisper, high-sensitivity vocal airiness, 0% vocal strain, delicate binaural proximity"`.
  - **Podcast & Interview Mode:** `"speaks in fluent natural conversational broadcast tone, subtle laughter micro-pauses, relaxed unscripted cadence, Shure SM7B broadcast warmth"`.

## 1B. THE TRIPARTITE PHONETIC ANTI-TYPO & SYLLABIC ANCHORING ENGINE (HUKUM ANTI-SALAH NGOMONG & PEMENGGALAN SUKU KATA)

Untuk melenyapkan 100% bug salah ucap, kata terpeleset (*misal: 'Agustusan' menjadi 'Agustuan'*), kata terpotong, atau bicara ngawur pada AI:
1. **Tripartite 3-Layer Block Defense:**
   - **Blok 1 (`[PROSE]`):** Menulis teks dialog murni di dalam tanda kutip (`"..."`) + jendela detik bicara eksak $\le 2.0$ kata/detik.
   - **Blok 2/3 (`[ACTING]`):** Mengunci motorik bibir & viseme pemenggalan suku kata (*visemes locked to distinct Indonesian syllabic articulation [A-gus-tu-san], firm bilabial closure on 'm/b/p', sharp alveolar 's' & dental 't', 0% dropped syllables, 0% mouth morphing*).
   - **Blok 7 (`[AUDIO]`):** Mengunci penekanan nada silabel auditori (*clean native syllable stress on [a-gus-TU-san], -4dB background scoring ducking at 2.5kHz vocal frequency, zero audio hallucinations, zero slurred phonemes, 0.8s tail-buffer silence hold*).
2. **Hukum Pemenggalan Suku Kata (Syllable Hyphenation Bracket):**
   - Untuk kata-kata non-Inggris, bahasa daerah Nusantara, atau istilah khusus, Blok `[ACTING]` dan `[AUDIO]` WAJIB menyertakan panduan pemenggalan suku kata di dalam kurung siku `[...]` agar text encoder AI tidak salah memotong token huruf.
3. **The Strict 2.0 Words/Second Budget:**
   - Jendela durasi bicara WAJIB memberikan alokasi minimal 0.5 detik per 1 kata (maksimal 2.0 kata/detik) agar mulut AI memiliki jumlah frame yang cukup untuk membuka dan menutup pada setiap suku kata.
4. **Hukum Penalaran Wajib E-Taling (é) vs E-Pepet (e/ə) Bahasa Indonesia:**
   - Untuk seluruh dialog bahasa Indonesia, AI Agent **WAJIB MEMANGGIL PROTOKOL PENALARAN DI MODUL 05B ([`rules/05b_indonesian_phonetics_and_etaling_codex.md`](05b_indonesian_phonetics_and_etaling_codex.md))**: memindai setiap huruf "e", mereasoning apakah itu e-taling (*énak, bélok, bésok, témbok, mérah*) vs e-pepet (*segar, teman, benar*), dan membubuhkan tanda diakritik `é` pada teks serta mengunci fonetik di Blok `[ACTING]` dan `[AUDIO]`.
5. **The Global Punctuation Cadence & Breath-Pause Law (Hukum Tanda Baca Berjeda Global):**
   - **Tanda Seru Berjeda (`!, ` atau `! ...`):** Wajib membubuhkan koma/jeda napas setelah tanda seru jika masih dalam 1 tarikan bicara (*contoh: "Hei Rian!, kamu jangan pergi!"*), dan mengunci jeda napas eksplisit `[0.3s respiratory micro-pause after '!']` di Blok `[ACTING]` dan `[AUDIO]` untuk melenyapkan bug AI bicara terburu-buru tanpa napas.
   - **Elipsis (`...`):** Mengunci jeda hening bernyawa 0.4s–0.6s (*living breath hold*).

---

## 2. DUAL-PLATFORM AUDIO REALISM, HARMONIOUS SCORING & HIGH-GAIN MASTERING V20.5

1. **Multi-Platform Mastering Targets:**
   - **A. Cinema & Feature Film Target:** `-14 LUFS Target` (-1.0 dBFS True Peak), dynamic headroom, wide cinematic dynamic range.
   - **B. Viral Mobile UGC (TikTok / Shorts / Reels):** `-9 to -11 LUFS High-Density Mobile Target` (-0.1 dBFS Peak Maximizer), high-intelligibility vocal punch for smartphone speakers.
   - **C. Tactile ASMR / Sensory Mode:** `-12 LUFS Binaural Sensitivity Target`, amplified micro-textures (whisper, cloth rustle, tapping).

2. **The Harmonious Cinematic Scoring & Backsound Mandate (Hukum Skoring & Backsound Harmonis):**
   - Skoring musik latar (*cinematic score*) dan backsound atmosferik **WAJIB SELALU ADA DAN DIKOMPOSISIKAN SECARA HARMONIS** dengan dialog dan foley (*zero naked empty audio*)!
   - **Dynamic Sidechain Ducking & Vocal Pocketing (2.5kHz Frequency Carving):** Musik latar secara cerdas diturunkan volumenya (*ducking -4dB pada rentang vokal 1kHz–4kHz*) saat karakter sedang berbicara, sehingga kata-kata dialog terdengar jernih dan berwibawa di latar depan tanpa tenggelam oleh musik.
   - **The 4-Stage Dynamic Scoring Progression (Kurva Musik 4-Tahap):**
     * **Tahap 1 (Atmospheric Base):** *Low-frequency 40Hz sub-drone, subtle cello ostinato, delicate piano arpeggio, or moody analog synth bed.*
     * **Tahap 2 (Escalating Tension):** *Rhythmic ticking clock 90 BPM, pulsing modular bass, building string staccato.*
     * **Tahap 3 (Climax Accelerando):** *Hybrid orchestral choir swells, soaring brass chords, syncopated taiko percussion locked to scene cuts.*
     * **Tahap 4 (Vacuum Drop & Title Impact):** *Instant 0.8s vacuum silence mute 0dB for key punchline, followed by massive sub-impact chord.*
   - **Genre-Adaptive Score Palettes:**
     * *Action / Blockbuster / Trailer:* Hybrid brass ostinato + modular analog synth pulse (Hans Zimmer / Ludwig Göransson style).
     * *Psychological Noir / Thriller:* Dissonant micro-tonal strings + low sub-rumble 35Hz (Trent Reznor / Jóhann Jóhannsson style).
     * *Anime Sakuga / Action 2D:* Symphonic rock + soaring emotive piano leads (Hiroyuki Sawano / Kensuke Ushio style).
     * *Prestige Drama / Romance:* Lush chamber string quartet + warm acoustic woodwinds (Max Richter / Joe Hisaishi style).
     * *Viral UGC / Creator:* Dynamic upbeat acoustic/electronic groove with punchy rhythmic bounce.

---

## 3. THE DYNAMIC 4-TIER MOTIVATED CINEMATIC HOOK MATRIX (ANTI-MONOTONY OPENING LAW)

DILARANG MEMAKSAKAN AKSI KINETIK PADA GENRE YANG TIDAK COCOK! Detik 0.0s s/d 2.0s WAJIB memilih 1 dari 4 Tipe Hook:
1. **Tier A (Kinetic Action Hook):** Untuk Laga, Kejar-kejaran, Parkour — meledak dengan aksi fisik atau benturan di <2 detik pertama.
2. **Tier B (Verbal Curiosity Hook):** Untuk Komedi, Debat, Podcast, UGC — dimulai dengan pertanyaan mengejutkan atau dialog provokatif di detik pertama.
3. **Tier C (Atmospheric Sensory Hook):** Untuk Horor, Thriller, Drama Puitis — dimulai dengan visual sensorik detail (tetesan air di pisau, detak jam dinding, bayangan).
4. **Tier D (Micro-Gag & Magic Hook):** Untuk Zach King, Ilusi, B-Roll — dimulai dengan trik visual instan dalam 1.5 detik.

---

## 4. THE 6 MASTER LINGUISTIC & VOCABULARY REGISTERS BY MEDIA FORMAT V20.5

1. **CINEMA FEATURE MODE (SUBTEXTUAL NATURALISM & LACONIC REALISM):**
   - *Diksi:* Realistis, padat, sarat keheningan bermakna (*pregnant pauses*), kalimat sering terpotong alami, 0% gaya iklan TV.
2. **PURE 2D ANIME & SAKUGA MODE (THEATRICAL PRONOMINAL DRAMA):**
   - *Diksi:* Teatrikal, hierarki kata ganti (`Ore`, `Boku`, `Kisama`, `Temee`), deklarasi determinasi batin, orasi filosofis hidup-mati.
3. **VIRAL MOBILE UGC & CREATOR MODE (CASUAL SLANG & DIRECT PARASOCIAL):**
   - *Diksi:* Spontan, santai, bahasa gaul internet (*"No cap"*, *"Literally"*, *"Guys jujurly"*), menyapa penonton langsung ke lensa kamera.
4. **TVC COMMERCIAL & BRAND MANIFESTO MODE (PUNCHY PERSUASIVE COPYWRITING):**
   - *Diksi:* Padat (*punchy*), puitis berima, persuasif, membakar motivasi, diksi mewah berkelas (*prestige*).
5. **DOCUMENTARY & INVESTIGATIVE MODE (JOURNALISTIC GRAVITAS & FACTUAL CLARITY):**
   - *Diksi:* Objektif, berwibawa, intelektual, reflektif, tempo bicara tenang dengan jarak pengamatan (*observational distance*).
6. **SITCOM & COMEDIC BANTER MODE (SARCASTIC IRONY & VERBAL SLAPSTICK):**
   - *Diksi:* Adu mulut cepat (*ping-pong banter*), pembelokan logika (*delayed punchline*), keluhan hiperbolis tapi jujur.

---

## 5. THE 8-TIER DYNAMIC DIALOGUE-ACTION CADENCE & SYNCHRONIZATION MATRIX V20.5

1. **Pola 1: The Classic Action-Triggered Dialogue (`[Aksi ➔ Dialog]`):** Karakter melakukan aksi di `[0s-2s]`, lalu menatap lawan dan bicara di `[2s-6s]`.
2. **Pola 2: The Verbal Ignition Trigger (`[Dialog ➔ Aksi]`):** Kalimat tajam di `[0s-3s]`, lalu aksi mengejutkan di `[3s-6s]` (membanting berkas / mencabut senjata).
3. **Pola 3: The Split-Sentence Action Sandwich (`[Dialog 1 ➔ Aksi ➔ Dialog 2]`):** Kalimat dipotong di tengah oleh aksi fisik penegas.
4. **Pola 4: The Simultaneous Kinetic Delivery (`[Bicara Sambil Aksi]`):** Aktor berbicara terus-menerus sembari melakukan tugas fisik aktif (menyetir / mengikat perban).
5. **Pola 5: The Overlapping Interruption (`[Dialog Saling Tabrak]`):** Karakter A baru bicara langsung dipotong kasar oleh Karakter B.
6. **Pola 6: The Rapid-Fire Asymmetrical Ping-Pong (`[AB-AB Banter]`):** Sahut-sahutan kilat 1–3 kata per karakter.
7. **Pola 7: The Silent Subtext Action Hold (`[Aksi Hening Menahan Respons]`):** Provokasi berat di `[0s-3s]`, hening total `[3s-7s]`, bisikan dingin di `[7s-9s]`.
8. **Pola 8: The Self-Interrupted Trailing Beat (`[Kalimat Menggantung Sadar Bahaya]`):** Bicara santai lalu mendadak menggantung karena melihat ancaman.

---

## 6. THE HIGH-DENSITY HYBRID MULTI-VOICE DIALOGUE TAPESTRY V20.5

1. **Komposisi 4 Lapis Dialog Padat (The 4-Layer Dense Multi-Voice Mix):**
   - **A. On-Screen Direct Clash (Lip-Sync Debat Langsung):** 2 karakter saling melempar kalimat berhadapan.
   - **B. Off-Screen (O.S.) Ambient Commands & Radio Intercom:** Suara komando handy-talkie atau interkom gedung.
   - **C. Rapid Staccato Ping-Pong Bites:** Sahut-sahutan 1–2 kata cepat tanpa basa-basi.
   - **D. Subtextual Whisper / Short V.O. Punch:** Bisikan rahasia atau baris batin filosofis pendek.

---

## 7. THE 0.8-SECOND TAIL-BUFFER & TEMPORAL SETTLE RESOLUTION MANDATE V20.5

1. **Hukum Batas Aman 0.8 Detik Ekor (*The 0.8s Safe Tail Buffer Law*):**
   - DILARANG KERAS menjadwalkan ucapan dialog vokal berakhir di detik paling akhir dari total durasi klip!
   - **Seluruh kalimat dialog dan aksi fisik utama WAJIB SELESAI di `(Total Durasi - 0.8 Detik)`:**
     * **Klip 10 Detik:** Dialog wajib selesai di detik **`9.2s`**. Detik `9.2s - 10.0s` adalah zona *Tail-Buffer* (tatapan mata mengunci & mulut menutup).
     * **Klip 15 Detik:** Dialog wajib selesai di detik **`14.2s`**. Detik `14.2s - 15.0s` adalah zona *Tail-Buffer* (resolusi foley & peluruhan musik).
2. **Batas Rasio Kata Matematis (*The Natural Speech-Rate Budget*):**
   - Kecepatan bicara alami manusia: **Maksimal 2.5 kata per detik** (atau 4 suku kata per detik).

---

## 8. THE MASTER VOCAL PROSODY, INTONATION & DIALOGUE DELIVERY MANDATE V20.5

1. **Wajib Deskriptor Intonasi Emosional di Blok 1 & Blok 7 (Explicit Prosody Descriptors):**
   - Prompt DILARANG HANYA MENULIS: `"speaking in Indonesian: '...'"`!
   - Prompt WAJIB MENYERTAKAN DESKRIPTOR PROSODI NADA:
     * *Contoh:* `"speaking strictly from 3.8s to 7.0s in fluent Indonesian with a lively colloquial teasing lilt and playful upward pitch inflection: 'Kamu harus mulai belajar nyangu lah, masa aku mulu... aku kan mau nikah bentar lagi.'"`
2. **6 Matriks Arketipe Intonasi Vokal:**
   - **A. Playful Domestic Banter (Bercanda Akrab):** Nada naik ringan di akhir kata penegas (`lah/dong/sih`), tawa kecil di tengah kalimat, rahang rileks.
   - **B. Suppressed Bittersweet Vulnerability (Menahan Luka / Sendu):** Resonansi napas tipis, nada merendah, jeda mikro 0.2s sebelum kata kunci.
   - **C. Cold Threat & Intimidating Authority (Ancaman Dingin):** Monoton tajam, 0% nada meninggi, artikulasi konsonan tegas dan kering.
   - **D. Flustered / Romantic Hesitation (Gugup / Malu-Malu Manis):** Irama sedikit tersandung, intonasi naik turun cepat, tarikan napas pendek.
   - **E. Urgent Staccato / High-Stakes Panic (Panik Terdesak):** Suku kata terpotong cepat, napas dangkal di dada atas, tempo 2.5 kata/detik.
   - **F. Maternal & Paternal Warmth (Kasih Sayang Hangat):** Nada membulat ramah, resonansi 250Hz empuk, mengalun lembut.
3. **Punctuation-Driven Lip-Sync Cadence (Tanda Baca Bernapas):**
   - Setiap dialog WAJIB menggunakan tanda baca emosional (`...` untuk jeda menahan napas batin, `,` untuk jeda ambil napas, `!` untuk hentakan energi).

---

## 9. THE UNIVERSAL NATIVE PROSODY, CAESURA & SUBTEXTUAL PRAGMATICS CODEX V20.5

1. **Hukum Partikel Rasa & Pragmatika Penutur Asli (Native Pragmatic Particles):**
   - *Bahasa Indonesia & Daerah:* Partikel *kan, lah, sih, dong, deh, mah, atuh, rek, teuing* wajib ditempatkan presisi.
   - *Jepang (Nihongo 🇯🇵):* Partikel *ne, yo, n da, wa, sa*, tarikan napas (*suikomi*), jeda hening (*Ma* / 間).
   - *Inggris (US / UK 🇺🇸🇬🇧):* *Stress-timed syllable focus* dan *contrastive pitch accent*.
   - *Prancis (Français 🇫🇷):* Aliran *liaison*, partikel *enfin, quoi, bah*.
   - *Korea (Hangul 🇰🇷):* Akhiran partikel *-ji, -deon, -yo*, aspirasi napas 'k/t/p'.
2. **Hukum Jeda Mikro Pengubah Makna (The 0.2s - 0.4s Micro-Caesura Law):**
   - Letak tanda jeda mikro (`...`) menentukan psikologi batin karakter.
3. **Mandat Sintaks Prosodi di Blok 1 & Blok 7:**
   - *Sintaks Wajib:* `speaking strictly from Xs to Ys with authentic native [Language] prosody, [Emotional Delivery Archetype], [Pitch Contour & Micro-Pause]: "[Kalimat Ber-Tanda Baca Bernapas]"`

---

## 10. THE SPATIAL ROOM IMPULSE RESPONSE (RIR) & SUB-BASS PRESENCE ENGINE (AKUSTIK RUANG NYATA & INFRASONIK)

Untuk memusnahkan audio dialog yang terdengar seperti "rekaman radio studio steril / terisolasi artifisial":

1. **ROOM IMPULSE RESPONSE & EARLY REFLECTIONS:**
   - Dialog vokal dan foley berinteraksi dengan material dinding ruangan: pantulan awal 15-30ms untuk ruangan sempit (kamar kos/lorong), dan 60-100ms untuk aula/katedral.
   - *Perisai Anti-Lebay (Anti-Overdose Threshold):* `"natural acoustic room impulse response matching architectural dimensions, strictly 0% muddy reverb wash, 0% artificial cathedral echo in small spaces"`.

2. **BOOM MIC PROXIMITY EFFECT & INFRASONIC FLOOR PRESENCE:**
   - Vokal jarak dekat menangkap kehangatan resonansi dada (*+2dB at 150-200Hz proximity chest warmth*).
   - Ruangan ditopang oleh getaran gemuruh halus lantai 20-40Hz (*subtle infrasound room tone presence*) yang memberikan bobot fisik nyata.
   - *Perisai Anti-Lebay:* `"clean dialogue intelligibility with subtle 20-40Hz low-frequency room grounding, strictly 0% boomy low-end mud, 0% mic clipping"`.

---

## 11. THE UNIVERSAL MULTI-LANGUAGE PHONETIC ANTI-TYPO & VISEME SYNCHRONIZATION ENGINE (RAMUAN MUTLAK ANTI-TYPO UCAPAN & FONETIK LINTAS BAHASA V20.5)

**DOKTRIN ANTI-PENGURANGAN BUDGET DIALOG (ZERO-WORD-REDUCTION PRINCIPLE):**  
Mencegah typo ucapan (*phonetic typos, slurred syllables, garbled words, mispronounced accents*) **BUKAN DENGAN MEMOTONG/MENGURANGI KATA-KATA DIALOG**, melainkan dengan **MENYUNTIKKAN MEKANIKA ARTIKULASI ANATOMI MULUT (VISEMES), AKUSTIK INTELLIGIBILITY BAND, DAN JANGKAR FONEMIK LINTAS BAHASA DUNIA**!

### 🧬 5 RAMUAN MUTLAK ANTI-TYPO FONETIK MULTI-BAHASA:

1. **RAMUAN 1: ANATOMICAL VISEME-PHONEME SYNCHRONIZATION (MEKANIKA MULUT & BIBIR TEGAS):**
   - Di Blok 3 (atau Blok 7), sambungkan setiap ucapan dengan mekanika viseme mulut fisik:
   - *Sintaks Wajib:*  
     `"Mouth viseme mechanics: crisp bilabial plosives (/p/, /b/, /m/) with complete firm lip seal before release, sharp labiodental (/f/, /v/) upper-teeth on lower-lip contact, precise alveolar tongue-tip tap for (/t/, /d/, /n/, /l/), wide open resonant oral cavity for (/a/, /i/, /u/, /e/, /o/), settling cleanly into firm resting lip closure, strictly 0% slurred syllables, 0% garbled phonetic mush, 0% missing letters, 0% dental lisp."`

2. **RAMUAN 2: MULTI-LANGUAGE PHONEMIC ACCENT & REGIONAL RESONANCE (RAMUAN KHUSUS BERBAGAI BAHASA DUNIA):**
   - 🇮🇩 **Bahasa Indonesia & Bahasa Daerah (Nusantara):**
     * *Jangkar Fonemik:* Suku kata bervokal murni terpisah jelas (*crisp syllable-timed articulation*), hentakan konsonan /k/, /t/, /p/ tegas, letupan glottal stop /ʔ/ di akhir kata berakhiran 'k' (misal: *ti-dak* [ti.daʔ], *ba-pak* [ba.paʔ]), getaran 'r' apikal tunggal bersih (*single alveolar tap /ɾ/*), 0% aksen bule kaleng-kaleng.
   - 🇺🇸🇬🇧 **English (General American / British RP):**
     * *Jangkar Fonemik:* Stress-timed syllable rhythm, crisp aspiration on initial voiceless plosives (/pʰ/, /tʰ/, /kʰ/), articulate consonant clusters (*str-, spl-, -ngths*), clear diphthong glide (/aɪ/, /oʊ/, /eɪ/), rhotic /r/ articulation (US) / non-rhotic vowel length (UK), zero swallowed word endings.
   - 🇯🇵 **Japanese (日本語 / Nihongo):**
     * *Jangkar Fonemik:* Strict mora-timed pacing, clean de-voiced high vowels (/u/, /i/ in *desu/mashita*), crisp 100ms glottal pause on geminate stops (sokuon っ), unslurred Tokyo/Kansai pitch-accent contours, 0% robotic flattening.
   - 🇨🇳 **Mandarin Chinese (中文 / Putonghua):**
     * *Jangkar Fonemik:* Precise 4-tone pitch trajectory contour, distinct retroflex consonants (*zh, ch, sh, r* vs *z, c, s*), crisp alveolar nasal /-n/ vs velar nasal /-ng/ codas, un-swallowed vowel triphthongs.
   - 🇸🇦 **Arabic (العربية / Fusha & Dialects):**
     * *Jangkar Fonemik:* Deep pharyngeal friction (/ʕ/ ع, /ħ/ ح), crisp velarized emphatic plosives (/tˤ/ ط, /dˤ/ ض, /sˤ/ ص, /ðˤ/ ظ), sharp hamzah glottal attacks /ʔ/, distinct 2-beat long vowel durations (madd).
   - 🇫🇷 **French (Français):**
     * *Jangkar Fonemik:* Smooth euphonic *liaison* across word boundaries, pure nasal vowels (*an, on, in, un*), uvular fricative /ʁ/, cadence berirama ringan di suku kata akhir.
   - 🇩🇪 **German (Deutsch):**
     * *Jangkar Fonemik:* Crisp glottal stop attack (*Knacklaut* /ʔ/) before every root-initial vowel, sharp ich-Laut /ç/ and ach-Laut /x/, precise final consonant devoicing (*Auslautverhärtung*).
   - 🇪🇸🇮🇹 **Spanish & Italian (Español / Italiano):**
     * *Jangkar Fonemik:* Rapid syllable-timed flow, crisp alveolar trill /r/ (*rr*), pure 5-vowel inventory (/a, e, i, o, u/) with 0% vowel reduction or central schwa slurring.

3. **RAMUAN 3: PUNCTUATION-DRIVEN MICRO-CAESURA PACING (TANDA BACA PENJAGA KETUKAN FONETIK):**
   - Penulisan naskah WAJIB menggunakan tanda baca cerdas untuk mengatur ritme komputasi audio:
     * Koma (`,`) = Jeda mikro napas 80ms (mencegah dua kata bertabrakan).
     * Em-dash (`—`) atau Titik Dua (`:`) = Jeda penegas 120ms (mencegah kata kunci tertelan).
     * Elipsis (`...`) = Tarikan napas batin 200ms (mencegah kalimat terburu-buru).

4. **RAMUAN 4: INTELLIGIBILITY BAND EQUALIZATION & DE-ESSING (AKUSTIK SPEKTRUM JERNIH):**
   - Di Blok 7, selalu kunci parameter mastering vokal jernih:
     `"Vocal spectrum mastering: +3dB presence boost in the 2.5kHz–5kHz speech intelligibility window, dynamic surgical de-essing at 6.5kHz–8kHz taming harsh sibilance, 0% microphone clipping, studio broadcast intelligibility."`

5. **RAMUAN 5: THE PHONETIC INTEGRITY IMMUNITY SHIELD (PERISAI ANTI-GLITCH MUTLAK):**
   - Di setiap prompt dialog, suntikkan klausul perisai kebal typo:
     `"[PHONETIC INTEGRITY SHIELD]: 100% intelligible native phoneme articulation, strictly 0% slurred syllables, 0% phonetic typos, 0% swallowed consonants, 0% stuttering loops, 0% audio-visual desynchronization across the entire speech window."`

---

## 12. THE UNIVERSAL UNSCRIPTED DOCUMENTARY & CINEMA-VÉRITÉ DIALOGUE CODEX (THE NATURAL SPEECH CHEAT CODE FOR ALL LANGUAGES V20.5)

**DOKTRIN ANTI-KEKAKUAN DIALOG AI (THE ZERO-AI-STIFFNESS CHEAT CODE):**  
Kelemahan terbesar dialog yang digenerate AI adalah **"Theatrical Scripted Stiffness"** (terdengar seperti aktor amatir membaca buku teks pelajaran). Untuk menghasilkan dialog yang **1.000% terdengar hidup, spontan, bernyawa, dan seperti rekaman nyata (*cinema-vérité / documentary realism*)**, AI Agent WAJIB menerapkan **7 Formula Rahasia Unscripted Speech** untuk seluruh bahasa di dunia:

### 🧪 1. THE 7-ELEMENT UNSCRIPTED NATURALISM MECHANICS:

1. **The Organic "False Start" & Self-Correction (`—`):**  
   Manusia asli sering memulai dengan kata yang salah, memotong diri sendiri dengan tanda pisah (`—`), lalu memperbaiki maksudnya secara spontan.
   - 🇮🇩 *Indo:* `"Gini—eh tunggu, bukan itu maksud gue!"`
   - 🇬🇧 *English:* `"Look—wait, no, that's not what I'm trying to say..."`
   - 🇯🇵 *Japanese:* `"いや、あの…そうじゃなくて、違うんだよ！"`
   - 🇫🇷 *French:* `"Écoute—enfin non, c'est pas du tout ça..."`

2. **The Pre-Speech Breath Inhale & Emotional Micro-Vocalizations:**  
   Sebelum kata pertama meluncur, manusia selalu menarik napas atau menyelipkan tawa getir/keluhan kecil. Di prompt, ini memicu AI menggerakkan otot laring, rahang, dan pita suara jauh lebih biologis (*100ms pre-speech laryngeal swallow*).
   - 🇮🇩 *Indo:* `[tarikan napas mikro 0.2s]` *"Hhh... lu beneran gak ngerti ya?!"`
   - 🇬🇧 *English:* `[sharp micro-inhale + dry half-laugh]` *"Ha... you honestly think this works?!"`
   - 🇪🇸 *Spanish:* `[suspiro breve]` *"Ay... es que tú no entiendes nada, ¿verdad?"`

3. **Mid-Sentence Thought Search Ellipses (`...`, `--`):**  
   Kalimat terpecah di tengah saat otak sedang memproses ide, bukan berhenti hanya di ujung tanda titik.
   - 🇮🇩 *Indo:* `"Kalau sampai bos tahu... yah, lu tahu sendiri lah apa yang bakal kejadian."`
   - 🇬🇧 *English:* `"If the director finds out... well, you know exactly how that goes down."`
   - 🇰🇷 *Korean:* `"만약에 그 사람들이 알게 되면... 어, 어떻게 될지 알잖아."`

4. **Asymmetrical Pacing (Staccato Burst ➔ Thought Drag):**  
   Pola kecepatan bicara yang tidak konstan kaku: 3 kata pembuka meledak cepat (*rapid staccato burst*), 2 kata tengah melambat/terseret saat berpikir (*thought drag*), 1 kata penutup mantap dan mengunci (*settle*).

5. **Conversational Colloquial Glue & Pragmatic Particles:**  
   Menyisipkan kata-kata "pelumas percakapan alami" yang langsung meyakinkan telinga manusia bahwa ini adalah rekaman orang asli (lihat Tabel Partikel di bawah).

6. **The Overlapping Verbal Collision (Saling Sambung / Tabrakan Suara):**  
   Karakter kedua masuk bicara saat karakter pertama masih mengucapkan suku kata terakhir, memicu benturan frekuensi organik (*micro-overlap*).

7. **Zero-Exposition Somatic Realism (Anti-Khotbah & Anti-Menjelaskan Fakta Terlihat):**  
   Karakter dokumenter murni merespons emosi yang sedang terjadi di depan mata (0% pidato kaku menjelaskan hal yang sudah tampak di layar).

---

### 🌐 2. UNIVERSAL PRAGMATIC CONVERSATIONAL PARTICLE MATRIX BY LANGUAGE:

| Bahasa | Partikel Lem Spontan Unscripted | Contoh Kalimat Sinematik Nyata |
| :--- | :--- | :--- |
| **🇮🇩 Indonesia** | *kan, sih, tuh, lho, deh, ya, dong, kok, nih, lah, emang* | `"Ya kan emang dari awal tuh bukan urusan gue, Mas!"` |
| **🇬🇧 English** | *like, you know, honestly, I mean, wait, look, right, come on* | `"I mean, like, honestly, what did you expect him to do?"` |
| **🇯🇵 Japanese** | *ano, nanka, desho, tteba, sa, nante iu ka, hora* | `"なんかさ…あの人が言うこと、ちょっと変じゃない？"` |
| **🇰🇷 Korean** | *geunikka, jeogi, marya, jinjja, geunde, itjanha* | `"그니까 내 말은… 이게 진짜 말이 된다고 생각해?"` |
| **🇪🇸 Spanish** | *o sea, mira, bueno, pues, sabes, es que, fíjate* | `"O sea, mira, es que yo no quería meterme en eso, ¿sabes?"` |
| **🇫🇷 French** | *enfin, genre, quoi, bah, écoute, tu vois, bon* | `"Bah écoute, genre... c'était pas du tout prévu comme ça, quoi."` |
| **🇩🇪 German** | *also, quasi, halt, na ja, sag mal, weißt du* | `"Also pass mal auf... das war so überhaupt nicht geplant, weißt du?"` |
| **🇨🇳 Mandarin** | *nàge (那个), jiùshì (就是), zěnme shuō ne (怎么说呢), duì ba (对吧)* | `"就是说啊…那个事情本来就不是这么搞的，对吧？"` |
| **🇸🇦 Arabic** | *ya'ni (يعني), shuf (شوف), ya akhi (يا أخي), wallah (والله)* | `"يعني شوف يا أخي... الموضوع مش كدا خالص والله!"` |

---

### 🛡️ 3. PURE INTEGRATION LAW (ANTI-CLUTTER PROSE):
- Gaya *Unscripted Documentary* ini diintegrasikan **LANGSUNG PADA STRUKTUR TEKS DIALOG DI DALAM TANDA PETIK** (menggunakan tanda pisah `—`, elipsis `...`, dan partikel lem alami).
- **DILARANG KERAS menyuntikkan kurung penjelasan teoritis di luar tanda petik di dalam blok `[PROSE]`!** Teks dialog itu sendiri yang berbicara secara alami.

---

## 13. THE ADAPTIVE MOTIVATED SPEECH FLUENCY MATRIX: DUAL-CADENCE ARCHITECTURE V20.5

**HUKUM FLEKSIBILITAS SUTRADARA (ANTI-GENERALISASI MUTLAK):**  
DILARANG KERAS memaksakan gaya *Unscripted False-Start* pada semua jenis karakter dan adegan! Pilihan irama bicara (*dialogue cadence*) WAJIB 100% didasarkan pada **Status Sosial, Kondisi Psikologis, Jabatan, dan Urgensi Dramatis Adegan**:

### 🏛️ DUA PILAR IRAMA DIALOG SINEMATIK (THE DUAL-CADENCE SPECTRUM):

#### 🟢 KELAS 1: THE UNSCRIPTED & EMOTIONAL CADENCE (SPONTAN, CASUAL, PANIK & BERGELIAT)
* **Kapan Wajib Digunakan:**
  - Percakapan santai sehari-hari antar teman, kekasih, atau keluarga.
  - Adegan panik, tertekan, ketakutan, kebingungan, atau terkejut (*under psychological duress*).
  - Debat emosional panas, pertengkaran spontan, atau obrolan komedi.
  - Format dokumenter, *cinema-vérité*, wawancara lepas, atau *native* UGC.
* **Karakteristik Linguistik:** Mengaktifkan 7 Formula Unscripted (*False Starts `—`, tarikan napas mikro, elipsis jeda berpikir `...`, dan partikel lem percakapan alami per bahasa*).

#### 🔵 KELAS 2: THE RAZOR-SHARP FLUENT & ELOQUENT CADENCE (LANCAR TOTAL, DINGIN, BERWIBAWA & ARTIKULATIF)
* **Kapan Wajib Digunakan:**
  - **Pemimpin Negara, Hakim, Jaksa & Orator:** Pidato kepresidenan, pledoi ruang sidang, orasi resmi, konferensi pers diplomatik.
  - **Karakter Dingin, Assassin & Master Strategist:** Pembunuh bayaran profesional, detektif jenius, antagonis dingin intelek (*John Wick, Sherlock Holmes, Hannibal Lecter, Thanos, Gus Fring*) — berbicara tanpa keraguan, kalimat tajam berbobot, presisi matematis, **0% gagap, 0% false start**.
  - **Komando Taktis & Militer:** Perintah tempur pasukan khusus (*"Breach and clear!", "Target locked, fire on my mark!"*) — staccato cepat, tegas, tanpa partikel basa-basi.
  - **News Anchor & Broadcaster Resmi:** Pembacaan berita studio berkecepatan tinggi, tempo stabil metronomis, artikulasi kristal jernih.
  - **Profesor, Dokter Spesialis & Presenter Bisnis:** Pemaparan ilmiah bedah medis darurat, pitching korporat papan atas.
  - **Deklarasi Sumpah, Ikrar, Doa Khidmat & Puisi:** Ritmik mengalir megah, lancar, dan berbobot (*sonorous flowing cadence*).
* **Karakteristik Linguistik:** **0% false start, 0% kata terbata-bata, 0% partikel gaul santai**. Kalimat terstruktur utuh, berwibawa, tempo terkendali penuh, dan artikulasi viseme mulut sempurna (*commanding sovereign presence*).

---

## 🎼 11. STANDALONE AUDIO GENERATION ENGINE (ELEVENLABS, SUNO, UDIO — V20.5)

> [!NOTE]
> Bagian ini berlaku HANYA jika user meminta proyek audio/voiceover mandiri terpisah dari pipeline video. Dalam workflow video standar, audio diproses native dari teks prose prompt.

### 11.1 Voice Acting Engine (ElevenLabs/Play.ht)

**Struktur Prompt Voice:**
`[Character Type], [Emotional State], [Vocal Timbre], [Pacing/Flow], [Micro-expressions/Breathing]. [Technical Spec].`

**Aturan Wajib:**
- **Language & Phonetic Lock:** Jika dialog bukan Inggris, WAJIB sebutkan bahasa aslinya secara eksplisit (contoh: "Speaking in fluent native Indonesian"). Untuk TTS Indonesia, terapkan penandaan é-taling dari  5b_indonesian_phonetics_and_etaling_codex.md.
- **Timbre Options:** Raspy, booming, breathy, squeaky, resonant, nasal.
- **Pacing/Flow:** Machine-gun fast, slow and deliberate, trembling, hesitant, arrogant flow.
- **Micro-expressions:** Sertakan vokalisasi fisik ("heavy breathing between words", "stifling a sob", "gritting teeth").
- **Technical Spec (WAJIB):** Akhiri setiap voice prompt dengan: Wide dynamic range audio, uncompressed HDR mix, zero audio clipping.

**Contoh:**
> *"Middle-aged gruff male voice, suppressed rage. Raspy and resonant timbre. Slow, deliberate pacing in fluent native Indonesian with heavy breathing between words like he is gritting his teeth. Wide dynamic range audio, uncompressed HDR mix, zero audio clipping."*

---

### 11.2 Foley & SFX Engine (ElevenLabs SFX)

**Struktur Prompt SFX:**
`[Primary Sound Action], [Material Collision], [Reverb/Environment], [Technical Spec].`

**Aturan Wajib:**
- **Material Collision:** Apa yang berbenturan dengan apa? ("Heavy metal boot scraping against wet asphalt and rusted iron").
- **Frequency Layers:** Selalu kombinasikan frekuensi rendah (sub-bass, heavy thud) dengan frekuensi tinggi (glass shatter, sharp hiss).
- **Technical Spec (WAJIB):** Akhiri setiap SFX prompt dengan: Cinematic theatrical mix, heavy sub-bass, Dolby Atmos style spatial panning.

**Contoh:**
> *"Massive cinematic sci-fi explosion. High-frequency electrical glass shattering followed immediately by a deafening low-frequency sub-bass shockwave. Ominous metallic debris raining down on wet asphalt and oxidized steel. Cinematic theatrical mix, heavy sub-bass, Dolby Atmos style spatial panning."*

---

### 11.3 Musical Scoring Engine (Suno/Udio)

**Aturan Wajib:**
- **BPM:** Tentukan kecepatan eksak. (60 BPM = sad/ambient, 140+ BPM = action/fight).
- **Instrumentation:** Sebutkan instrumen eksak ("distorted electric cello", "808 sub-bass synth", "massive taiko drums").
- **Structure Tags:** Gunakan [Build up], [Drop], [Crescendo] untuk memandu AI.

**Contoh:**
> *"[Instrumental] Epic cyberpunk battle theme. 145 BPM. Aggressive distorted 808 sub-bass, frantic analog synth arpeggios, and massive taiko drums. [Build up] into a chaotic [Drop] with soaring distorted electric cello."*

---

### 11.4 Master Audio Loudness & Spatial Glue Engine

**1. Maximum Perceived Loudness Protocol:**
- Selalu sertakan: Maximum perceived loudness master, punchy high-gain audio mix, full-bodied uncompressed master, clean peak limiter, zero digital distortion.
- Analog Warmth: Warm Neve 1073 preamp saturation, De-Essed silky highs, zero digital sibilance, full-bodied 200Hz chest resonance.

**2. Audio Glue & Dialogue Dominance Protocol:**
- **Matched Acoustic Environment:** SELURUH audio prompt dalam 1 adegan WAJIB menggunakan tanda akustik lingkungan yang identik (contoh: Acoustic Reverb Lock: Humid Teak Warehouse, 1.4s Decay, Early Reflections).
- **Dialogue Dominance:** Primary Vocal Priority, center channel vocal anchor, crystal-clear dialogue presence, dynamic frequency separation for speech intelligibility.
- **Master Bus Glue:** VCA Master Bus Compression (2:1 Ratio, 30ms Attack), cohesive spatial glue, integrated 3D soundstage.
