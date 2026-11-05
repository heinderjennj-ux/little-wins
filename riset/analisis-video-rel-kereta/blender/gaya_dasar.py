"""Scene uji gaya "tokoh 2D di dunia 3D bergaya" (resep dari 03-panduan-blender.md).

Jalankan:
  blender -b -P gaya_dasar.py -- --render hasil_uji/      # headless, render frame ke folder
  atau tempel di Text Editor / kirim lewat BlenderMCP (execute_blender_code)

STATUS: belum pernah dijalankan di Blender (ditulis untuk Blender 4.2+ / 5.x).
Bagian yang beda antar versi dibungkus try/except. Laporkan error baris pertama ke Claude untuk diperbaiki.

Isi scene:
  - tebing strata (Wave + Noise -> ColorRamp), tanah gurun, kerikil low-poly acak, bantalan + rel
  - rel "termal": custom property `suhu` 0..1 -> warna biru..kuning-putih + emission (driver)
  - kabut volumetrik dunia + kabut tebal di dasar (Map Range Z)
  - tokoh kartu 2D (placeholder digambar numpy) dengan Locked Track ke kamera, ada bayangan
  - sistem ekspresi: plane per varian, ganti dengan keyframe CONSTANT (pasang_ekspresi)
  - kamera: dorong pelan + noise "napas" -> whip pan -> orbit -> crane naik (motion blur ON)
"""
import math, random, sys
import bpy
import numpy as np

random.seed(7)
FPS = 30
DETIK = 6

# ---------------------------------------------------------------- utilitas
def bersihkan():
    bpy.ops.wm.read_factory_settings(use_empty=True)

def hex_rgba(h, a=1.0):
    h = h.lstrip("#"); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    lin = [x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c]  # sRGB -> linear
    return (*lin, a)

def material(nama):
    m = bpy.data.materials.new(nama); m.use_nodes = True
    return m, m.node_tree.nodes, m.node_tree.links

def ramp(nodes, warna_posisi):
    r = nodes.new("ShaderNodeValToRGB"); el = r.color_ramp.elements
    for i, (pos, hx) in enumerate(warna_posisi):
        e = el[i] if i < 2 else el.new(pos)
        e.position = pos; e.color = hex_rgba(hx)
    return r

def kubus(nama, lok, skala, mat=None):
    bpy.ops.mesh.primitive_cube_add(location=lok); o = bpy.context.object; o.name = nama
    o.scale = skala
    if mat: o.data.materials.append(mat)
    return o

# ---------------------------------------------------------------- render
def atur_render():
    sc = bpy.context.scene
    for eng in ("BLENDER_EEVEE_NEXT", "BLENDER_EEVEE"):
        try:
            sc.render.engine = eng; break
        except TypeError:
            continue
    sc.render.resolution_x, sc.render.resolution_y = 1080, 1920
    sc.render.fps = FPS; sc.frame_start = 1; sc.frame_end = FPS * DETIK
    try:
        sc.render.use_motion_blur = True; sc.render.motion_blur_shutter = 0.5
    except AttributeError:
        sc.eevee.use_motion_blur = True
    try:
        sc.view_settings.view_transform = "AgX"; sc.view_settings.look = "AgX - Punchy"
    except TypeError:
        sc.view_settings.view_transform = "Standard"
    try:
        sc.eevee.volumetric_tile_size = "4"; sc.eevee.volumetric_end = 400
    except (AttributeError, TypeError):
        pass

# ---------------------------------------------------------------- dunia
def langit_dan_kabut():
    w = bpy.data.worlds.new("Dunia"); bpy.context.scene.world = w; w.use_nodes = True
    n, l = w.node_tree.nodes, w.node_tree.links; out = n["World Output"]; bg = n["Background"]
    try:
        sky = n.new("ShaderNodeTexSky")
        try: sky.sky_type = "NISHITA"
        except TypeError: pass
        sky.sun_elevation = math.radians(35); l.new(sky.outputs[0], bg.inputs[0])
    except Exception:
        bg.inputs[0].default_value = hex_rgba("#5b8fe0")
    bg.inputs[1].default_value = 1.0
    vol = n.new("ShaderNodeVolumeScatter"); vol.inputs["Density"].default_value = 0.004
    vol.inputs["Color"].default_value = hex_rgba("#9fb4ff")
    l.new(vol.outputs[0], out.inputs["Volume"])
    bpy.ops.object.light_add(type="SUN", rotation=(math.radians(50), 0, math.radians(35)))
    s = bpy.context.object; s.data.energy = 4.0; s.data.angle = math.radians(3)
    s.data.color = hex_rgba("#fff1dc")[:3]

def tebing():
    m, n, l = material("Tebing_strata")
    tc = n.new("ShaderNodeTexCoord"); noise = n.new("ShaderNodeTexNoise"); noise.inputs["Scale"].default_value = 3
    wave = n.new("ShaderNodeTexWave"); wave.wave_type = "BANDS"; wave.bands_direction = "Z"
    wave.inputs["Scale"].default_value = 1.2; wave.inputs["Distortion"].default_value = 6
    l.new(tc.outputs["Object"], noise.inputs["Vector"]); l.new(tc.outputs["Object"], wave.inputs["Vector"])
    l.new(noise.outputs["Fac"], wave.inputs["Phase Offset"]) if "Phase Offset" in wave.inputs else None
    r = ramp(n, [(0.0, "#5a1222"), (0.3, "#c3361c"), (0.55, "#f07a2c"), (0.75, "#b2283a"), (1.0, "#6b2a6e")])
    l.new(wave.outputs["Fac"], r.inputs["Fac"]); bsdf = n["Principled BSDF"]
    l.new(r.outputs["Color"], bsdf.inputs["Base Color"]); bsdf.inputs["Roughness"].default_value = 0.85
    o = kubus("Tebing", (0, 6, 15), (40, 1.5, 15), m)
    mod = o.modifiers.new("Bagi", "SUBSURF"); mod.levels = mod.render_levels = 3; mod.subdivision_type = "SIMPLE"
    tex = bpy.data.textures.new("tonjolan", "CLOUDS"); tex.noise_scale = 1.5
    d = o.modifiers.new("Tonjolan", "DISPLACE"); d.texture = tex; d.strength = 0.6

def tanah_kerikil_rel():
    m, n, l = material("Gurun"); n["Principled BSDF"].inputs["Base Color"].default_value = hex_rgba("#d8743c")
    # jalur tanah sempit di bibir ngarai: sisi -Y dibiarkan kosong (jurang berkabut)
    bpy.ops.mesh.primitive_plane_add(size=1, location=(10, 1, 0)); g = bpy.context.object
    g.scale = (80, 10, 1); g.data.materials.append(m)
    # kerikil low-poly (palet dari referensi: merah bata, abu, krem)
    palet = ["#8e4b3c", "#b56a52", "#9c9aa6", "#d9b48f", "#6d3b33"]
    mats = []
    for i, h in enumerate(palet):
        mm, nn, _ = material(f"Batu{i}"); nn["Principled BSDF"].inputs["Base Color"].default_value = hex_rgba(h)
        nn["Principled BSDF"].inputs["Roughness"].default_value = 0.9; mats.append(mm)
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=1); dasar = bpy.context.object; dasar.name = "Batu_dasar"
    for _ in range(500):
        b = dasar.copy(); b.data = dasar.data.copy(); bpy.context.collection.objects.link(b)
        b.location = (random.uniform(-6, 30), random.uniform(-1.6, 1.6), 0.03)
        s = random.uniform(0.04, 0.12); b.scale = (s * random.uniform(.8, 1.4), s, s * random.uniform(.5, .9))
        b.rotation_euler = [random.uniform(0, 6.28) for _ in range(3)]
        b.data.materials.append(random.choice(mats))
    bpy.data.objects.remove(dasar)
    # bantalan kayu
    mk, nk, _ = material("Kayu"); nk["Principled BSDF"].inputs["Base Color"].default_value = hex_rgba("#7a6a5c")
    bt = kubus("Bantalan", (-6, 0, 0.08), (0.13, 1.3, 0.06), mk)
    arr = bt.modifiers.new("Array", "ARRAY"); arr.count = 60; arr.relative_offset_displace = (0, 0, 0)
    arr.use_constant_offset = True; arr.use_relative_offset = False; arr.constant_offset_displace = (0.6, 0, 0)
    # rel termal
    for y in (-0.72, 0.72):
        rel_termal(kubus(f"Rel{y:+.0f}", (12, y, 0.2), (18, 0.04, 0.07)))

def rel_termal(o):
    """Warna rel mengikuti custom property `suhu` (0 dingin biru -> 1 panas kuning-putih)."""
    m, n, l = material(f"Termal_{o.name}"); o.data.materials.append(m)
    o["suhu"] = 0.0
    val = n.new("ShaderNodeValue")
    r = ramp(n, [(0.0, "#2b4cff"), (0.25, "#7a2bff"), (0.45, "#e02bd0"), (0.6, "#ff5aa0"), (0.75, "#ff9a3a"), (0.9, "#ffe23a"), (1.0, "#fff7e0")])
    l.new(val.outputs[0], r.inputs["Fac"]); b = n["Principled BSDF"]
    l.new(r.outputs["Color"], b.inputs["Base Color"]); b.inputs["Metallic"].default_value = 0.6
    em = "Emission Color" if "Emission Color" in b.inputs else "Emission"
    l.new(r.outputs["Color"], b.inputs[em])
    mul = n.new("ShaderNodeMath"); mul.operation = "MULTIPLY"; mul.inputs[1].default_value = 3.0
    l.new(val.outputs[0], mul.inputs[0]); l.new(mul.outputs[0], b.inputs["Emission Strength"])
    fc = val.outputs[0].driver_add("default_value"); dv = fc.driver; dv.type = "AVERAGE"
    v = dv.variables.new(); v.targets[0].id = o; v.targets[0].data_path = '["suhu"]'
    # contoh: memanas dari detik 2 ke 5
    o["suhu"] = 0.0; o.keyframe_insert('["suhu"]', frame=2 * FPS)
    o["suhu"] = 1.0; o.keyframe_insert('["suhu"]', frame=5 * FPS)

def kabut_jurang():
    """Kubus volume: tebal di bawah (Z rendah), tipis di atas -> dasar ngarai hilang ke biru."""
    m, n, l = material("Kabut_jurang"); n.remove(n["Principled BSDF"])
    pv = n.new("ShaderNodeVolumePrincipled"); pv.inputs["Color"].default_value = hex_rgba("#1f3dbf")
    tc = n.new("ShaderNodeTexCoord"); sep = n.new("ShaderNodeSeparateXYZ"); mr = n.new("ShaderNodeMapRange")
    mr.inputs["From Min"].default_value = -30; mr.inputs["From Max"].default_value = -2
    mr.inputs["To Min"].default_value = 0.25; mr.inputs["To Max"].default_value = 0.0
    l.new(tc.outputs["Object"], sep.inputs[0]); l.new(sep.outputs["Z"], mr.inputs["Value"])
    l.new(mr.outputs["Result"], pv.inputs["Density"]); l.new(pv.outputs[0], n["Material Output"].inputs["Volume"])
    kubus("Kabut_jurang", (10, -40, -16), (60, 30, 16), m)

# ---------------------------------------------------------------- tokoh 2D
def gambar_placeholder(nama, warna_badan="#2ba39a", ukuran=512):
    """Tokoh kepala bulat putih + badan kacang, garis hitam tebal. Ganti dengan PNG asli (bpy.data.images.load)."""
    img = bpy.data.images.new(nama, ukuran, ukuran * 2, alpha=True)
    H, W = ukuran * 2, ukuran; yy, xx = np.mgrid[0:H, 0:W]; px = np.zeros((H, W, 4), np.float32)
    def isi(mask, rgba): px[mask] = rgba
    kep = (xx - W / 2) ** 2 + (yy - H * 0.72) ** 2; bad = ((xx - W / 2) / (W * 0.3)) ** 2 + ((yy - H * 0.42) / (H * 0.17)) ** 2
    isi(bad < 1.12, (0, 0, 0, 1)); isi(bad < 1, hex_rgba(warna_badan))
    isi(kep < (W * 0.34) ** 2, (0, 0, 0, 1)); isi(kep < (W * 0.31) ** 2, (1, 1, 1, 1))
    for x in (W * 0.42, W * 0.58):  # kaki stick
        isi((abs(xx - x) < 6) & (yy > H * 0.05) & (yy < H * 0.3), (0, 0, 0, 1))
    img.pixels = px.ravel(); img.pack()
    return img

def kartu(nama, img, tinggi=1.6, lok=(0, 0, 0)):
    bpy.ops.mesh.primitive_plane_add(size=1, location=lok); o = bpy.context.object; o.name = nama
    me = o.data; asp = img.size[0] / img.size[1]
    for v in me.vertices:  # berdiri di XZ, alas di Z=0, normal menghadap -Y
        x, y, _ = v.co; v.co = (x * tinggi * asp, 0, (y + 0.5) * tinggi)
    m, n, l = material(f"Kartu_{nama}"); t = n.new("ShaderNodeTexImage"); t.image = img; t.interpolation = "Closest"
    b = n["Principled BSDF"]; em = "Emission Color" if "Emission Color" in b.inputs else "Emission"
    l.new(t.outputs["Color"], b.inputs["Base Color"]); l.new(t.outputs["Color"], b.inputs[em])
    b.inputs["Emission Strength"].default_value = 0.6  # warna tetap datar seperti kartun
    l.new(t.outputs["Alpha"], b.inputs["Alpha"])
    for attr, val in (("surface_render_method", "DITHERED"), ("blend_method", "HASHED")):
        try: setattr(m, attr, val); break
        except (AttributeError, TypeError): pass
    me.materials.append(m)
    return o

def hadapkan_ke(o, cam):
    c = o.constraints.new("LOCKED_TRACK"); c.target = cam; c.track_axis = "TRACK_NEGATIVE_Y"; c.lock_axis = "LOCK_Z"

def pasang_ekspresi(varian, jadwal):
    """varian: {nama: objek plane}. jadwal: [(detik, nama)]. Hanya satu terlihat; ganti tanpa interpolasi."""
    for nama, o in varian.items():
        for t, aktif in jadwal:
            f = int(t * FPS) + 1; sembunyi = (aktif != nama)
            o.hide_render = o.hide_viewport = sembunyi
            o.keyframe_insert("hide_render", frame=f); o.keyframe_insert("hide_viewport", frame=f)
        if o.animation_data and o.animation_data.action:
            try:
                for fc in o.animation_data.action.fcurves:
                    for k in fc.keyframe_points: k.interpolation = "CONSTANT"
            except AttributeError:
                pass  # Blender 5.x (layered action): interpolasi bool sudah konstan

# ---------------------------------------------------------------- kamera
def kamera(target):
    bpy.ops.object.camera_add(location=(-4, -3.2, 0.45)); cam = bpy.context.object; cam.data.lens = 18
    cam.data.clip_start = 0.01; bpy.context.scene.camera = cam
    pivot = bpy.data.objects.new("Pivot_orbit", None); bpy.context.collection.objects.link(pivot)
    pivot.location = target.location; cam.parent = pivot
    tt = cam.constraints.new("TRACK_TO"); tt.target = target; tt.track_axis = "TRACK_NEGATIVE_Z"; tt.up_axis = "UP_Y"
    K = lambda d: int(d * FPS) + 1
    # 0-2 dtk: dorong pelan maju (rendah, lensa lebar)
    cam.location = (-4, -3.2, 0.45); cam.keyframe_insert("location", frame=K(0))
    cam.location = (-3.0, -2.6, 0.55); cam.keyframe_insert("location", frame=K(2))
    # 2-2,3 dtk: whip pan = pivot berputar cepat 80 derajat (motion blur yang menyembunyikan "potongan")
    pivot.rotation_euler = (0, 0, 0); pivot.keyframe_insert("rotation_euler", frame=K(2))
    pivot.rotation_euler = (0, 0, math.radians(80)); pivot.keyframe_insert("rotation_euler", frame=K(2.3))
    # 2,3-4 dtk: orbit pelan
    pivot.rotation_euler = (0, 0, math.radians(130)); pivot.keyframe_insert("rotation_euler", frame=K(4))
    # 4-6 dtk: crane naik tinggi (mengungkap skala)
    cam.location = (-3.0, -2.6, 0.55); cam.keyframe_insert("location", frame=K(4))
    cam.location = (-6, -8, 7); cam.keyframe_insert("location", frame=K(6))
    try:  # "napas kamera": noise kecil di lokasi
        for fc in cam.animation_data.action.fcurves:
            nz = fc.modifiers.new("NOISE"); nz.strength = 0.03; nz.scale = 40
    except AttributeError:
        print("Blender 5.x: tambahkan noise lewat channelbag/F-curve UI jika diperlukan")
    return cam

# ---------------------------------------------------------------- main
def main():
    bersihkan(); atur_render(); langit_dan_kabut(); tebing(); tanah_kerikil_rel(); kabut_jurang()
    badan = kartu("Insinyur", gambar_placeholder("insinyur"), lok=(0, 0, 0))
    cam = kamera(badan); hadapkan_ke(badan, cam)
    # contoh ekspresi: dua plane wajah sederhana di depan kepala (ganti dengan PNG mata/mulut asli)
    varian = {}
    for nama, w in (("smug", "#2ba39a"), ("kaget", "#e0b43a")):
        o = kartu(f"wajah_{nama}", gambar_placeholder(f"w_{nama}", w, 128), tinggi=0.35, lok=(0, -0.02, 1.0))
        o.parent = badan; varian[nama] = o
    pasang_ekspresi(varian, [(0, "smug"), (1.2, "kaget"), (1.6, "smug"), (4.2, "kaget")])
    if "--render" in sys.argv:
        out = sys.argv[sys.argv.index("--render") + 1]
        bpy.context.scene.render.filepath = out.rstrip("/") + "/f_"
        bpy.ops.render.render(animation=True)

main()
