# Riset gaya animasi & warna — Koder Cilik (2026-10-25)

Dasar: aturan "storybook" (SVG digambar kode + tekstur kertas) dari owner, video contoh `Downloads/Hn1VfpfK.mp4` (7 dtk).
Yang DIAMBIL dari aturan itu hanya gaya gambar & gerak. Palet malam/hujan, letterbox, font Poppins, dan pola cerita "menguping" TIDAK dipakai.

## Catatan video contoh HN1
Bagus: bentuk sederhana, tekstur kertas, mata besar berkilau, pipi merona, kontras dingin–hangat yang mengarahkan mata.
Bisa ditingkatkan:
- wajah datar (tanpa bayangan 1 nada / cahaya tepi), jadi terlihat seperti tempelan;
- gerak cuma mata & mulut (rambut, baju, tangan diam);
- butiran (grain) di seluruh layar + berkas cahaya di depan wajah membuat gambar buram;
- subtitle menimpa badan tokoh.

## Sumber
1. **Valdez & Mehrabian 1994**, *J. Exp. Psychology: General* — emosi lebih ditentukan kecerahan & kejenuhan warna daripada jenis warnanya. Rasa senang ≈ .69 × kecerahan + .22 × kejenuhan. https://pubmed.ncbi.nlm.nih.gov/7996122/
2. **Wilms & Oberfeld 2018**, *Psychological Research* (replikasi, desain faktorial) — warna jenuh & terang = gairah/perhatian lebih tinggi; efek dari ketiga dimensi (hue, saturasi, kecerahan), bukan hue saja. https://pubmed.ncbi.nlm.nih.gov/28612080/
3. **Ralph Eggleston** (art director Toy Story, Pixar) — "color script": seluruh film dipetakan dulu dalam potongan warna kecil. John Lasseter: intensitas warna naik saat emosi naik, lebih kusam saat momen sedih. Sejak itu Pixar membuat color script untuk tiap film. https://hyperallergic.com/610771/the-art-of-pixar-chronicle-books/
4. **Labrecque & Milne 2011/2012**, *J. Academy of Marketing Science* — "Exciting red and competent blue": warna menggeser kepribadian merek, kesukaan, dan niat beli; saturasi & kecerahan memperkuat efeknya (isi lengkap belum dibaca, pemetaan merah=semangat/biru=kompeten baru dari judul). https://colab.ws/articles/10.1007/s11747-010-0245-y
5. **Headspace** (Anna Charity, pemimpin desain merek & animasi sejak 2011) — kepribadian merek dibawa oleh tokoh & animasinya; tokoh dari bentuk padat + warna berani. Studio Moth (seri Netflix) memakai mata & mulut khas Headspace + palet merek. https://dribbble.com/stories/2017/06/21/team-timeout-headspace · https://www.lbbonline.com/news/moth-does-mindfulness-for-headspace-and-netflix-animated-series
6. **Kurzgesagt** — bentuk bulat + warna cerah berani (sumber sekunder, belum ada wawancara art director). https://artsatmichigan.umich.edu/ink/2019/09/27/simple-bright-beautiful-the-work-of-kurzgesagt

## Keputusan untuk format kita
- Dunia TERANG (pagi/siang, latar krem/biru muda), bukan malam. Fokus cerita diberi warna paling jenuh (aksen) — prinsip Valdez & Mehrabian + Wilms & Oberfeld.
- Pakai **color script** per video: hook riset = cerah & penasaran; masalah anak = warna sedikit lebih kusam/abu; solusi Koder Cilik = paling cerah & jenuh; CTA = warna merek (Eggleston/Lasseter).
- Tokoh: bentuk padat bulat, mata & mulut khas yang konsisten di semua video (Headspace) + bayangan 1 nada & cahaya tepi (perbaikan dari HN1).
- Grain tipis hanya di dalam bentuk (filter Paper), bukan di seluruh layar.

## Kontras untuk titik fokus (owner setuju 2026-10-25; menggantikan cara "abu-abu")
- **Itten, 7 kontras warna** (*The Art of Color*, 1961): warna, gelap-terang, hangat-dingin, komplementer, simultan, kejenuhan (= campur abu-abu, yang ditolak owner), luas (Goethe). Dipakai: hangat-dingin + luas. https://en.wikipedia.org/wiki/Johannes_Itten
- **Bruce Block, *The Visual Story***: Kontras & Afinitas; kontras di titik fokus, sisanya mirip; kuning jenuh menarik mata pertama. https://www.routledge.com/The-Visual-Story/Block/p/book/9781138014152
- **James Gurney, gamut mask "Dominant Hue With Accent"** (*Color and Light*). https://docs.krita.org/user_manual/gamut_masks.html
- **Perspektif udara**: jauh = lebih terang, kebiruan, kontras kecil, tepi lembut (kecuali senja/subuh). https://binus.ac.id/bandung/dkv/2025/11/04/backgrounds-that-breathe-creating-depth-in-flat-worlds/
- **Itti, Koch & Niebur 1998** (model saliency): mata ditarik oleh PERBEDAAN warna/terang/arah, diuji dengan pelacak mata; efek warna saja belum dipisahkan. https://sites.krieger.jhu.edu/cns/files/2021/08/Itti_etal98.pdf
- Belum dibaca isinya: Hans Bacher, *Dream Worlds* (bab Value and Color).
Penerapan: latar satu keluarga warna dingin (biru pucat / biru-hijau tua lembut) + kabut + sedikit buram; fokus hangat, detail paling banyak, garis tepi tegas.

## Skema harmoni warna di animasi terkenal (2026-10-25)
Belum ada studi akademik yang membandingkan Pixar/Disney; sumbernya analisis praktisi/blog — perlakukan sebagai praktik industri, bukan riset.
- **Komplementer oranye–teal**: kulit manusia jatuh di spektrum oranye, jadi bayangan/latar teal membuat wajah menonjol; pasangan komplementer = pemisahan warna terkuat; meniru golden hour. Kritik: kalau berlebihan kulit tampak tidak alami. https://petapixel.com/2017/02/23/orange-teal-look-popular-hollywood/
- **Triad**: tiga warna berjarak sama; satu dominan, dua aksen. https://openlab.citytech.cuny.edu/rosenspevackfylcf15/author/afernandez432 · **Gurney, gamut segitiga**: tiga "primer subjektif" di sudut segitiga, makin kecil segitiga makin harmonis; "harmoni, bukan memainkan semua instrumen sekaligus". https://gurneyjourney.blogspot.com/2011/09/part-2-gamut-masking-method.html
- Analog (tetangga di roda warna, mis. adegan Finding Nemo merah-oranye-ungu) juga umum; Pixar memetakan suasana per adegan dengan color script (Ratatouille: selokan lembap vs dunia manusia yang hangat). https://www.baianat.com/articles/the-power-of-color-in-animation
Penerapan: komposisi GayaAB / GayaD-OranyeTeal / GayaE-Triad — tiap gaya punya palet TENANG + INTENS (gelap-terang, sorotan) yang berganti halus di momen tegang ("nilainya rendah", "padahal belum sempat berpikir").

## Gerak tidak alay (2026-10-25)
- Thomas & Johnston, *The Illusion of Life* (12 prinsip): utamakan pose, bukan transisi; gerakan sekunder tidak boleh bersaing dengan aksi utama; eksagerasi dikurangi untuk aksi realistis. https://en.wikipedia.org/wiki/Twelve_basic_principles_of_animation · https://www.pluralsight.com/resources/blog/software-development/understanding-12-principles-animation
- Material Design motion: transisi cepat tapi bisa diikuti, umumnya ±200–300 ms, >400 ms terasa lambat; gaya "tenang" = durasi pendek + easing standar. https://m1.material.io/motion/duration-easing.html
Penerapan: elemen muncul 0,9→1 dalam ±7 frame (tanpa pantulan besar), satu aksi per momen, tanpa sinar berputar/ledakan "TAP!".
