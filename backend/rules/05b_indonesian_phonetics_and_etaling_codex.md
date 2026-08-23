# 🇮🇩 DIRECTOR O.S. — MODULE 05B: INDONESIAN PHONETICS, E-TALING ENGINE & LINGUISTIC CODEX V20.5

---

## 🏛️ 1. HUKUM DUAL-'E' FONOLOGI BAHASA INDONESIA (KBBI & PUEBI STANDARD)

Berdasarkan **KBBI (Kamus Besar Bahasa Indonesia)** dan **PUEBI (Pedoman Umum Ejaan Bahasa Indonesia)**, huruf **"e"** dalam bahasa Indonesia terbagi menjadi **2 FONEM BERBEDA**:

```text
===========================================================================================================
📊 MATRIKS 2 FONEM VOKAL 'E' BAHASA INDONESIA (KBBI STANDARD):
===========================================================================================================
1. E-PEPET [ə]     ➔ Simbol Diakritik PUEBI: 'ê' (Sirkumfleks)
                       Dalam Teks Dialog: Tetap ditulis 'e' biasa (tanpa aksen)
                       Bukaan Mulut: Netral / Rileks, hampir tertutup, tanpa effort
                       Akustik: Samar, pendek, lemah — seperti "uh" sangat singkat
                       Lip-Sync: Mulut nyaris datar, tanpa gerakan bibir signifikan

2. E-TALING [e]    ➔ Simbol Diakritik PUEBI: 'é' (Aksen Akut / Acute)
                       Dalam Teks Dialog: Ditulis 'é' untuk presisi lip-sync
                       Bukaan Mulut: Jelas terbuka, bibir artikulasi aktif
                       Akustik: Bersih, nyaring, tegas — bunyi 'e' yang jelas terdengar
                       Lip-Sync: Mulut terbuka jelas dengan artikulasi aktif
===========================================================================================================

⚠️ CATATAN PENTING:
- KBBI hanya membedakan 2 jenis: pepet (ê/e biasa) dan taling (é).
- KBBI TIDAK membedakan "taling sempit" (é) vs "taling lebar" (è).
- Seluruh 'e' taling di KBBI ditulis dengan SATU simbol: é (acute accent).
- Contoh: "bebek" = /bébék/ (BUKAN /bèbèk/), "enak" = /énak/, "merah" = /mérah/.
- Variasi sempit [e] vs lebar [ɛ] adalah ALOFON OTOMATIS (bukan pilihan),
  ditentukan oleh struktur suku kata, TIDAK perlu dibedakan dalam penandaan.
```

**SUMBER OTORITAS:** KBBI Daring (kbbi.kemdikbud.go.id), PUEBI, Badan Pengembangan dan Pembinaan Bahasa.

---

## 🛑 2. THE PURE DIACRITIC EMBEDDING MANDATE (ANTI-CLUTTER & ZERO EXPLANATORY BRACKETS IN PROSE)

**DILARANG KERAS MENYUNTIKKAN TEKS KETERANGAN FONETIK, KURUNG PENJELASAN, ATAU TAG KAMUS DI DALAM BLOK `[PROSE]` MAUPUN PETIK DIALOG!**

Cukup bubuhkan tanda diakritik `é` (taling) atau `e` (pepet) **LANGSUNG PADA HURUF KATA DI DALAM TANDA PETIK DIALOG**. Teks di luar dialog di dalam `[PROSE]` HARAM dikotori oleh tanda kurung keterangan fonetik!

```text
===========================================================================================================
❌ CONTOH SALAH (BOROS TOKEN, MENGOTORI PROMPT & BERISIKO DIBACA MODEL AI VIDEO):
"...Adél... ini tugas bésok dikumpul!, kamu bawél banget sih!" (phonetic lip sync: "Adél" [é-taling], "bésok" [é-taling], "bawél" [é-taling])
"...Jawab aku Mas!..." [standard 'e' taling pronunciation in 'cebok' /cɛbok/]

✅ CONTOH BENAR (100% BERSIH, PRESISI, RAMPING & RAMAH MODEL GENERATIF):
"...Adél... ini tugas bésok dikumpul!, kamu bawél banget sih!"
===========================================================================================================
```

**HUKUM KEMURNIAN DIALOG:**
1. Penandaan huruf `é` pada kata sudah menjadi instruksi fonetis implisit yang dibaca langsung oleh TTS dan Audio Engine (Sora/Kling/Seedance/ElevenLabs).
2. Segala bentuk keterangan seperti `(phonetic lip sync: ...)`, `[é-taling]`, atau `[pepet]` di belakang dialog adalah **REDUNDAN & MEMBAHAYAKAN BUDGET TOKEN**.

---

## 🔬 3. PROTOKOL ALGORITMA BEDAH POSISIONAL MULTI-'E' (SURGICAL POSITIONAL DISSECTION)

Jika sebuah kata memuat lebih dari satu huruf "e", AI Agent **WAJIB MEMBEDAH SETIAP POSISI 'E' SECARA INDIVIDUAL (e1, e2, e3...)** menggunakan algoritma berikut:

```text
[ALGORITMA BEDAH POSISI DUAL-'E']:
1. Ekstraksi Kata      → Pindai seluruh kata yang memiliki huruf 'e'.
2. Penomoran Posisi    → Indeks posisi huruf 'e' dalam kata (e1, e2, e3...).
3. Lookup Dictionary   → PRIORITAS UTAMA: Cari kata di data/e_taling_dictionary.json.
                         Jika ditemukan → gunakan klasifikasi dari dictionary (VERIFIED).
                         Jika tidak ditemukan → cek Tier 2 Morphological Rules.
                         Jika masih tidak ditemukan → tandai [⚠️ UNVERIFIED] + inferensi.
4. Penandaan Diakritik →
   - Jika PEPET [ə]  → Biarkan 'e' biasa (tanpa aksen)
   - Jika TALING [e]  → Ganti menjadi 'é' (acute accent)
```

### TIER 2 — MORPHOLOGICAL INFERENCE RULES:

Jika kata tidak ada di dictionary, cek apakah itu bentuk berafiks dari kata yang ada:

```text
HUKUM PREFIX (AWALAN):
- Huruf 'e' di dalam prefix me-, men-, mem-, meny-, meng-, ber-, per-, ter-,
  di-, ke-, se- → SELALU PEPET [ə], tanpa pengecualian.
- Contoh: "menembak" → me[ə]-né[é]-mbak. Prefix 'me-' pepet, root 'tembak' lookup.

HUKUM SUFFIX (AKHIRAN):
- Suffix -kan, -an, -i, -nya TIDAK mengubah klasifikasi 'e' pada kata dasar.
- Contoh: "méja" → "méjanya" (é tetap é).
```

---

## 🛑 3. DAFTAR JEBAKAN KATA: "FALSE-TALING TRAPS" (SERING DIKIRA TALING PADAHAL PEPET)

DILARANG KERAS menandai kata-kata di bawah ini dengan `é`. Kata-kata berikut **100% ADALAH E-PEPET [ə]** berdasarkan KBBI:

* **Kata Sifat & Perilaku:** *pelit, pedas, peka, penuh, perih, lelah, lelap, cemas, tenang, senang, cerah, tebal, berat, sedih, sempit, tegang*.
* **Kata Kerja & Benda:** *pegang, tekan, tegak, lepas, remas, rekam, rekat, sebar, serap, serak, sekat, celah, derita, derap, kencan, kenal, lentur, negara, petang, rehat, rebah, rekan, sedan, selat, sepak, seram, tetangga*.
* **Kata Umum Sering Salah:** *emas (/êmas/), keras (/kêras/), gelap (/gêlap/), benar (/bênar/), belum (/bêlum/), telah (/têlah/), dekat (/dêkat/), selamat (/sêlamat/), percaya (/pêrcaya/), kembali (/kêmbali/)*.
* **Hukum Vowel Shift '-an':**
  - Kata berakar 'a' yang bergeser ke 'e' dalam lisan santai (*catat → catetan, coret → coretan*) → **HURUF 'E' HASIL SHIFT TETAP PEPET [ə]** → ditulis **`catetan`**, **`coretan`** *(BUKAN 'catétan')*.

---

## 📚 4. MASTER LEKSIKON VERIFIED (SUMBER: KBBI DARING)

### 🔘 A. KATALOG VERIFIED E-PEPET [ə] (TETAP DITULIS `e`):
* *segar, teman, benar, gelap, berat, pergi, selamat, tenang, sekarang, percaya, betapa, kembali, dekat, telah, belum, tentu, senang, lelah, pelan, rebah, tebal, sedih, besar, kecil, lebih, kemari, kejar, pelit, catetan, pedas, penuh, perih, emas, keras, peta, geram, tetap, segar, semua, dengan*.

### 🟢 B. KATALOG VERIFIED E-TALING [é] (WAJIB DITULIS `é`):
* *méja, bésok, bélok, témbok, désa, saté, kafé, mérah, bébék, énak, séhat, béli, héran, lébar, bébas, cépat, bésar (BUKAN — ini pepet!), pésta, cétak, rébut, éja, élus, bélang, mélati, métode, rélatif, téori, hélm, sérbu, réndah, gélap (BUKAN — ini pepet!), séndok, émbér, bolé, capé, jélas, gélas, modél, militér*.

> **⚠️ PERINGATAN:** Katalog di atas harus SELALU diverifikasi silang dengan `data/e_taling_dictionary.json`. Jika ada konflik, dictionary JSON yang menang (karena bersumber langsung dari KBBI).

### 🧩 C. KATALOG HYBRID (KATA DENGAN PEPET DAN TALING SEKALIGUS):
* **sepéda:** `e1` = Pepet [ə], `e2` = Taling [é] → **`sepéda`**
* **keméja:** `e1` = Pepet [ə], `e2` = Taling [é] → **`keméja`**
* **menémbak:** `e1` = Pepet [ə] (prefix me-), `e2` = Taling [é] → **`menémbak`**
* **berédar:** `e1` = Pepet [ə] (prefix ber-), `e2` = Taling [é] → **`berédar`**
* **meréka:** `e1` = Pepet [ə] (prefix me-), `e2` = Taling [é] → **`meréka`**
* **menépuk:** `e1` = Pepet [ə] (prefix me-), `e2` = Taling [é] → **`menépuk`**

---

## ⏱️ 5. THE MATHEMATICAL SPEECH-RATE & WORD-BUDGET CALCULATOR (ANTI-OVERLOAD)

Untuk menjamin suara AI tidak terdengar seperti rekaman dipercepat 2x / kumur-kumur:

$$\text{Batas Maksimal Kata} = \text{Durasi Jendela Bicara (detik)} \times 2.0\text{ kata/detik}$$

```text
===========================================================================================================
📊 TABEL BEBAN KATA MAKSIMAL MENURUT DURASI:
===========================================================================================================
• Durasi 1.0s – 2.0s → Maksimal 3 – 4 Kata
• Durasi 2.5s – 3.5s → Maksimal 5 – 7 Kata
• Durasi 4.0s – 5.0s → Maksimal 8 – 10 Kata
• Total Klip 10.0s (Durasi Bicara Bersih 9.2s) → MAKSIMAL 18 – 22 KATA TOTAL KESELURUHAN KLIP!
• Total Klip 15.0s (Durasi Bicara Bersih 14.2s) → MAKSIMAL 28 – 30 KATA TOTAL KESELURUHAN KLIP!
===========================================================================================================
```

---

## 📋 6. MANDATORY CHAIN-OF-THOUGHT PRODUCTION LOG (TURN 3 NASKAH ONLY — HARAM DI DALAM PROSE TURN 5)

Log penalaran fonetik HANYA dicetak di Turn 3 sebelum naskah skenario untuk proses review sutradara. **DILARANG KERAS mencetak atau menyisipkan log ini di dalam codeblock `[PROSE]` Turn 5!** Di Turn 5, prompt cukup memuat dialog bertanda diakritik bersih tanpa embel-embel keterangan apapun.

```text
[LOG PENALARAN FONETIK DUAL-'E' & SPEECH BUDGET (TURN 3 ONLY)]:
• "merah"     → e1: TALING [mé] (KBBI: /mérah/)                              => "mérah"     [VERIFIED]
• "bebek"     → e1: TALING [bé] | e2: TALING [bék] (KBBI: /bébék/)           => "bébék"     [VERIFIED]
• "enak"      → e1: TALING [é] (KBBI: /énak/)                                => "énak"      [VERIFIED]
• "pelit"     → e1: PEPET [pə] (KBBI: /pêlit/) [False Taling Trap]           => "pelit"     [VERIFIED]
• "sepeda"    → e1: PEPET [sə] | e2: TALING [pé] (KBBI: /sepéda/)           => "sepéda"    [VERIFIED]
• "catetan"   → e1: PEPET [tə] (Vowel Shift Trap)                            => "catetan"   [VERIFIED]
• "menembak"  → e1: PEPET [mə] (prefix me-) | e2: TALING [né]               => "menémbak"  [VERIFIED]
• Speech Budget: 21 kata / 9.2s bicara = 2.28 wps → ⚠️ OVER BUDGET (MAX 2.0 wps)!
```

---

## 🛑 7. THE GLOBAL PUNCTUATION CADENCE & BREATH-PAUSE LAW

1. **Tanda Seru Berjeda (`!, ` atau `! ...`):** Wajib diberi koma/spasi jeda napas (`"Hei Rian!, kamu jangan bélok ke sana!"`) dan jeda napas mikro `[0.3s respiratory pause after '!']`.
2. **Elipsis (`...`):** Jeda hening bernapas 0.4s–0.6s (*living breath hold*).
3. **Tanda Tanya (`?`):** Intonasi menaik (*rising inflection*) + jeda 0.3 detik tatapan mata.

---

## 🛡️ MANDAT MUTLAK SISTEM
Modul ini adalah Hukum Tertinggi Fonetik Bahasa Indonesia di Director O.S. V20.5.
- Sumber otoritas TUNGGAL: **KBBI** (bukan tebakan LLM).
- Sistem: **2-Tier (Pepet vs Taling)** — BUKAN 3-tier.
- Agen WAJIB lookup dari `data/e_taling_dictionary.json` sebelum menandai aksen.
- Jika kata tidak ada di dictionary: tandai `[⚠️ UNVERIFIED]`.
