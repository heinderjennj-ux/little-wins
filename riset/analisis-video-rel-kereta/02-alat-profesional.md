# Alat untuk menganalisis video referensi (dan dipakai di `alat/`)

Tujuan: mengganti tebakan dengan **angka**: gerak kamera, transisi, kedalaman, warna, komposisi, timing ekspresi, dan audio.
Kolom "Status" berarti: ✅ sudah dijalankan di sesi ini · 🧪 skrip tersedia, jalankan di localhost · 📚 alat GUI/manual (tidak bisa diotomatisasi penuh).

## A. Hasil pencarian skill/plugin/connector (sesi 2026-11-05)
| Sumber | Kata kunci | Hasil |
|---|---|---|
| `npx skills find` (direktori skill GitHub / skills.sh) | video analysis, blender, motion graphics, cinematography, camera movement, frame analysis, depth estimation, animation | **Tidak ada** yang ditemukan |
| Skill claude.ai | video analysis, motion graphics, cinematography, depth estimation… | Tidak ada |
| Plugin directory claude.ai | sama | `animation-studio`, `Tweenkit`, `Sticklore`: semuanya membuat animasi 2D dari kode, **bukan** untuk menganalisis video atau Blender |
| MCP registry | video analysis, computer vision… | **Roboflow** (computer vision, belum terpasang), vidIQ (sudah terhubung, untuk data YouTube, bukan analisis frame) |
| Web | Blender + Claude | **BlenderMCP** (ahujasid/blender-mcp): Claude mengendalikan Blender, termasuk tool `execute_blender_code` untuk menjalankan bpy |

Kesimpulan: belum ada skill siap pakai untuk analisis sinematografi. Karena itu toolkit di `alat/` dirakit dari pustaka standar industri dan riset.

## B. Peta alat per pertanyaan

### 1. Ambil frame & lembar kontak
| Alat | Mengukur/menghasilkan | Status |
|---|---|---|
| **FFmpeg / ffprobe** | Frame tiap 0,2 dtk (`fps=5`), audio WAV, metadata (resolusi, fps, durasi) | ✅ `alat/01_ekstrak.sh` |
| **Pillow** | Lembar kontak 5×2 dengan cap waktu, untuk dibaca Claude/manusia | ✅ `alat/02_lembar_kontak.py` |

### 2. Potongan & transisi
| Alat | Mengukur | Status |
|---|---|---|
| **PySceneDetect** (`detect-adaptive`, `detect-content`, `detect-threshold`) | Potongan keras, perubahan konten, fade ke hitam/putih | ✅ hasil: 1 potongan keras (44,03 dtk), 34 perubahan konten. Skrip: `alat/03_adegan.sh` |
| **TransNetV2** (soCzech/TransNetV2, neural) | Potongan + **dissolve/transisi bertahap** lebih akurat | 🧪 opsional (lihat README) |
| Deteksi dissolve berbasis campuran frame (`alat/04_ukur.py`) | Frame t ≈ α·frame(t−k) + (1−α)·frame(t+k) → dissolve | 🧪 |

### 3. Gerak kamera
| Alat | Mengukur | Status |
|---|---|---|
| **OpenCV ORB + RANSAC (affine)** | Per frame: pan (geser X), tilt (geser Y), zoom/dolly (skala), roll (rotasi). Area caption di-mask | 🧪 `alat/04_ukur.py` |
| **OpenCV Farneback optical flow** | Energi gerak, whip pan (flow sangat tinggi + blur), paralaks atas vs bawah (dolly vs pan) | 🧪 `alat/04_ukur.py` |
| **RAFT** (torchvision) | Optical flow neural, lebih akurat untuk blur | 🧪 opsional |
| **Blender Motion Tracking (Camera Solver)** | **Jalur kamera 3D + focal length** dari video referensi, langsung jadi objek kamera di Blender | 📚 paling berguna untuk Blender (lihat 03-panduan-blender.md) |
| **fSpy** (+ add-on importer Blender) | Focal length, posisi, dan rotasi kamera dari **satu frame** lewat titik hilang (vanishing points) | 📚 |
| **COLMAP / GLOMAP**, **VGGT**, **MegaSaM** | Structure-from-Motion / estimasi pose kamera dan depth dari video (riset) | 📚 cek repo masing-masing, belum diverifikasi di sesi ini |

### 4. Kedalaman & kabut
| Alat | Mengukur | Status |
|---|---|---|
| **Depth Anything V2** (HF `depth-anything/Depth-Anything-V2-Small-hf`) | Peta kedalaman relatif per frame → seberapa "dalam" komposisi, lapisan depan/tengah/belakang | 🧪 `alat/05_kedalaman.py` (diblokir di cloud, jalan di localhost) |
| **Video Depth Anything** | Depth yang konsisten antar frame | 🧪 opsional |
| **Dark Channel Prior** (He, Sun, Tang, CVPR 2009) | Peta transmisi kabut = **kedalaman relatif dari kabut** tanpa model AI; mengukur kekuatan kabut atmosfer | 🧪 `alat/04_ukur.py` (kolom `haze_*`) |

### 5. Warna & cahaya
| Alat | Mengukur | Status |
|---|---|---|
| **DaVinci Resolve scopes**: Waveform, RGB Parade, Vectorscope, Histogram | Waveform = kecerahan/kontras/clipping per posisi; Parade = cast warna per kanal; Vectorscope = hue (sudut) & saturasi (jarak dari pusat) | 📚 GUI (gratis) |
| **K-means di ruang Lab** (scikit-learn) | Palet dominan per segmen → kode HEX untuk material Blender (**color script** ala Pixar) | 🧪 `alat/06_palet.py` |
| Statistik HSV/Lab (OpenCV) | Saturasi, kecerahan, kontras, rasio hangat/dingin per frame | 🧪 `alat/04_ukur.py` |

### 6. Komposisi
| Alat | Mengukur | Status |
|---|---|---|
| **OpenCV Saliency (Spectral Residual)** | Titik pusat perhatian per frame → seberapa dekat dengan garis sepertiga / tengah | 🧪 `alat/04_ukur.py` (`sal_x`, `sal_y`) |
| Overlay sepertiga/golden ratio (Resolve, Photoshop) | Cek manual | 📚 |

### 7. Gerak tokoh & timing ekspresi
| Alat | Mengukur | Status |
|---|---|---|
| **Kinovea** (gratis, alat analisis gerak olahraga) | Lacak titik (kepala/tangan) frame per frame, ukur kecepatan/sudut, buat **spacing chart** | 📚 |
| Lembar kontak + log ekspresi (tabel di 01-analisis-frame.md) | Kapan mata/mulut berganti (resolusi 0,2 dtk) | ✅ |
| Pose estimation (MediaPipe/OpenPose) | **Tidak cocok**: tokoh stick-figure kartun tidak terdeteksi | ✗ |

### 8. Kualitas gambar / estetika
| Alat | Mengukur | Status |
|---|---|---|
| **pyiqa**: MUSIQ, NIMA, CLIP-IQA, LAION-aesthetic, BRISQUE/NIQE | Skor kualitas teknis & estetika per frame, untuk membandingkan render Blender Anda dengan referensi | 🧪 `alat/07_kualitas.py` |
| Laplacian variance (OpenCV) | Ketajaman vs motion blur | 🧪 `alat/04_ukur.py` (`sharp`) |

### 9. Audio & narasi
| Alat | Mengukur | Status |
|---|---|---|
| **faster-whisper / WhisperX** | Transkrip + **cap waktu per kata** → sinkron ekspresi & caption | 🧪 `alat/08_audio.py` |
| **librosa** | Kekerasan suara (RMS), onset (hit SFX), tempo | 🧪 `alat/08_audio.py` |

### 10. Sisi Blender (produksi oleh Claude lewat kode)
| Alat | Fungsi |
|---|---|
| **BlenderMCP** | Claude mengendalikan Blender yang sedang terbuka: membuat objek, mengambil screenshot viewport, menjalankan kode bpy |
| **bpy dari PyPI** (`pip install bpy`, versi 5.2.x tersedia untuk Python 3.13) | Blender sebagai modul Python, untuk render headless & uji otomatis tanpa GUI |
| Motion Tracking, fSpy importer, Image as Plane, Grease Pencil, EEVEE volumetrics, Mist pass, Compositor | Lihat `03-panduan-blender.md` |

## Sumber
- PySceneDetect: https://www.scenedetect.com · FilmAnalyzerKit (frame + shot + palet + ECC): https://github.com/Miiha/FilmAnalyzerKit · ShotDetector: https://github.com/yasinyildirim/ShotDetection · OpenIMAJ video: https://openimaj.org/openimaj-video/video-processing/project-summary.html
- Dark Channel Prior: He, Sun, Tang, CVPR 2009, https://people.csail.mit.edu/kaiming/publications/cvpr09.pdf · versi PAMI: https://people.csail.mit.edu/kaiming/publications/pami10dehaze.pdf
- Scopes Resolve: https://davinciresolveclub.com/davinci-resolve-scopes-explained/ · https://photography.tutsplus.com/tutorials/how-to-read-scopes-in-resolve-waveform-parade-histogram-vectorscope--cms-41868 · https://www.tourboxtech.com/en/news/davinci-resolve-scopes.html
- fSpy: https://github.com/stuffmatic/fSpy · https://www.blendernation.com/2018/11/28/perfect-photo-and-camera-match-with-fspy-and-blender-2-79/
- BlenderMCP: https://yuv.ai/blog/blender-mcp · https://archestra.ai/mcp-catalog/ahujasid__blender-mcp · https://lobehub.com/it/mcp/ahujasid-blender-mcp
- Depth Anything V2, RAFT, COLMAP, VGGT, MegaSaM, TransNetV2, pyiqa, Kinovea, faster-whisper: nama dari pengetahuan umum, **cek halaman resmi masing-masing** sebelum dipakai (belum diverifikasi lewat web di sesi ini).
