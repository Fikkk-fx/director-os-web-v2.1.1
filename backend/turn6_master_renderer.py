"""
DIRECTOR O.S. V20.1 — TURN 6 MASTER VIDEO RENDERER
================================================================================
Automated Multi-Clip Reference-to-Video Rendering Suite via Atlas Cloud API
Supported Models:
  [A] Seedance 2.0 Standard Reference-to-Video (bytedance/seedance-2.0/reference-to-video)
  [B] Seedance 2.5 Pro Reference-to-Video (bytedance/seedance-2.5/reference-to-video)
  [C] Seedance 2.0 Mini Multi-Shot Compiler & Ingestion (bytedance/doubao-seed-2.0-mini-260428)

Image Reference Directory: C:\\Users\\apilp\\Downloads\\SHEET
  - IMAGE1.png -> @image1 (Ren Base: clean face, frail, slate-gray blazer, knuckle bandages)
  - IMAGE2.png -> @image2 (Ren State B: split lip at left corner, resolute stare, chalk dust)
  - IMAGE3.png -> @image3 (Marcus Base: navy-blue gold-embroidered jacket, sleek blonde hair, sneer)
  - IMAGE4.png -> @image4 (Marcus State B: shocked defeat, cold sweat, disheveled hair, collapsed)
  - IMAGE5.png -> @image5 (Env Auditorium Zone 1: honey-oak parquet, arched Komorebi windows)
  - IMAGE6.png -> @image6 (Env Blackboard Zone 2: 6m slate blackboard densely covered in chalk proofs)
================================================================================
"""

import os
import requests
import json
import time
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

ATLAS_KEY = os.environ.get("ATLAS_API_KEY", "apikey-3547226b757043bdb2175f63bfe7622c")
BASE_URL = "https://api.atlascloud.ai/api/v1/model"
UPLOAD_URL = f"{BASE_URL}/uploadMedia"
GEN_URL = f"{BASE_URL}/generateVideo"

HEADERS_UPLOAD = {"Authorization": f"Bearer {ATLAS_KEY}"}
HEADERS_JSON = {"Authorization": f"Bearer {ATLAS_KEY}", "Content-Type": "application/json"}

SHEET_DIR = r"C:\Users\apilp\Downloads\SHEET"

# 100% Verified Per-Clip Specification Database
CLIPS_SPEC = {
    1: {
        "title": "KLIP 1 (00:00 - 00:15) — THE BRUTAL HUMILIATION & 5W1H CRISIS",
        "duration": 15,
        "images": ["IMAGE1.png", "IMAGE3.png", "IMAGE5.png"],
        "prompt": (
            "2D anime screencap, 9:16 vertical 720x1280, 12fps hand-drawn ni-koma. "
            "Inside classical academy auditorium @image3 aggressively shoves frail Ren @image1 onto polished honey-oak floor. "
            "Ren slams down, coughing violently into bandaged fist as calculation blueprints scatter across floor @image5. "
            "Marcus kicks Ren's medical inhaler into corner and stomps on paper, sneering downward: "
            "[Marcus speaking in fluent English: 'Look at you, Ren! A coughing weakling dragging down our elite academy! You're broken junk!'] "
            "Ren lies on left side, lower lip split bleeding, clutching wood planks in icy defiance while 4 static students watch on West Wall. "
            "Warm Komorebi window sunlight, 2-tone flat cel shading, G-pen outlines, 100% diegetic Foley, zero non-diegetic music, zero 3D CGI."
        )
    },
    2: {
        "title": "KLIP 2 (00:15 - 00:30) — THE CRUEL MOCKERY & THE RETORT",
        "duration": 15,
        "images": ["IMAGE2.png", "IMAGE3.png", "IMAGE5.png"],
        "prompt": (
            "2D anime screencap, 9:16 vertical 720x1280, 12fps hand-drawn ni-koma. "
            "Marcus @image3 grabs blueprint from auditorium floor @image5, crumples it into a tight ball, and hurls it at Ren's @image2 chest. "
            "[Marcus speaking in fluent English: 'You think these scribbles make you a scholar? You can't grasp the Core Proof!'] "
            "4 West Wall students snicker. Ren halts coughing, pushes palms firmly into floorboards, and lifts head upright with split lip visible: "
            "[Ren speaking in fluent English: 'Tearing my paper won't make you smarter, Marcus! You memorized formulas... I wrote the solution!'] "
            "Ren wipes left lip with sleeve, piercing Marcus with gray-blue eyes. Marcus's smirk twitches in shock, room falls dead silent. "
            "Warm Komorebi raking sunlight, 2-tone flat cel shading, G-pen outlines, 100% diegetic Foley, zero non-diegetic music, zero 3D CGI."
        )
    },
    3: {
        "title": "KLIP 3 (00:30 - 00:45) — SOMATIC STAND & THE CHALLENGE",
        "duration": 15,
        "images": ["IMAGE2.png", "IMAGE3.png", "IMAGE5.png"],
        "prompt": (
            "2D anime screencap, 9:16 vertical 720x1280, 12fps hand-drawn ni-koma. "
            "Ren @image2 grips edge of wooden podium with bandaged knuckles, trembling knees locking straight as he forces frail body upright on floor @image5. "
            "Ren stands tall, wiping blood from lip. Marcus @image3 steps forward aggressively pointing finger: "
            "[Marcus speaking in fluent English: 'How dare you speak back! You can't even stand without shaking!'] "
            "Ren strides calmly past Marcus toward north wall, picking up solid white chalk from wooden tray with steady fingers: "
            "[Ren speaking in fluent English: 'My body is fragile. But my mind never bowed to you. Step aside.'] "
            "Marcus freezes choked of words, 4 static students watch silently on West Wall. "
            "Warm golden sunset rim-light, 2-tone flat cel shading, G-pen outlines, 100% diegetic Foley, zero non-diegetic music, zero 3D CGI."
        )
    },
    4: {
        "title": "KLIP 4 (00:45 - 01:00) — THE RAPID MASTERSTROKE EXECUTION",
        "duration": 15,
        "images": ["IMAGE2.png", "IMAGE4.png", "IMAGE5.png", "IMAGE6.png"],
        "prompt": (
            "2D anime screencap, 9:16 vertical 720x1280, 12fps hand-drawn ni-koma. "
            "Ren @image2 rapidly scribbles complex calculus proofs and vector mechanics across 6-meter blackboard @image6 in auditorium @image5, "
            "chalk tapping slate in rhythmic velocity with white dust plumes. "
            "Pan reveals Marcus @image4 clutching temples in sheer disbelief, tie loose, cold sweat on brow: "
            "[Marcus speaking in fluent English: 'Th-that's impossible! Nobody solved the Core Proof in fifty years!'] "
            "Ren completes derivation with flawless strokes, crossing out flawed theory: "
            "[Ren speaking in fluent English: 'Your fifth theorem failed due to thermal drag! It's basic physics!'] "
            "4 students stand with jaws dropped on West Wall. "
            "Golden Komorebi sunbeams lighting chalk dust, 2-tone flat cel shading, G-pen outlines, 100% diegetic Foley, zero non-diegetic music, zero 3D CGI."
        )
    },
    5: {
        "title": "KLIP 5 (01:00 - 01:15) — ABSOLUTE CATHARSIS & TRANSCENDENT REBIRTH",
        "duration": 15,
        "images": ["IMAGE2.png", "IMAGE4.png", "IMAGE5.png", "IMAGE6.png"],
        "prompt": (
            "2D anime screencap, 9:16 vertical 720x1280, 12fps hand-drawn ni-koma. "
            "Ren @image2 taps final solid chalk dot on completed blackboard @image6, dropping chalk into wooden tray with sharp click before turning 180 degrees. "
            "Marcus @image4 stumbles backward hitting wooden desk @image5, dropping papers, and collapsing onto knees in total humiliation. "
            "Ren addresses frozen room from podium with majestic dignity: "
            "[Ren speaking in fluent English: 'You called me broken junk. Today, the invalid just rewrote your entire world!'] "
            "Ren buttons slate-gray jacket and strides down center aisle through parted reverent students, exiting double doors into golden sunset. "
            "Heroic backlight contour, 2-tone flat cel shading, G-pen outlines, 100% diegetic Foley of footsteps and vacuum room tone, zero non-diegetic music, zero 3D CGI."
        )
    }
}

# Image Cache to avoid re-uploading
UPLOADED_CACHE = {}

def upload_image(filename):
    if filename in UPLOADED_CACHE:
        return UPLOADED_CACHE[filename]
    path = os.path.join(SHEET_DIR, filename)
    if not os.path.exists(path):
        raise FileNotFoundError(f"Missing image: {path}")
    with open(path, "rb") as f:
        res = requests.post(UPLOAD_URL, headers=HEADERS_UPLOAD, files={"file": (filename, f, "image/png")}, timeout=30)
        url = res.json()["data"]["download_url"]
        UPLOADED_CACHE[filename] = url
        print(f"  [UPLOAD OK] {filename} -> {url}")
        return url

def render_clip(clip_num, model_choice="bytedance/seedance-2.0/reference-to-video"):
    spec = CLIPS_SPEC[clip_num]
    print(f"\n=======================================================")
    print(f"🎬 INITIATING RENDER: {spec['title']}")
    print(f"Target Model: {model_choice}")
    print(f"=======================================================")
    
    # Upload required images
    image_urls = [upload_image(img) for img in spec["images"]]
    
    payload = {
        "model": model_choice,
        "prompt": spec["prompt"],
        "images": image_urls,
        "image_urls": image_urls,
        "reference_images": image_urls,
        "aspect_ratio": "9:16",
        "ratio": "9:16",
        "resolution": "720p",
        "width": 720,
        "height": 1280,
        "duration": spec["duration"]
    }
    
    print(f"\nDispatching payload for Clip {clip_num}...")
    res = requests.post(GEN_URL, headers=HEADERS_JSON, json=payload, timeout=20)
    data = res.json()
    if data.get("code") != 200:
        print(f"Error submitting Clip {clip_num}: {data}")
        return None
    
    pid = data["data"]["id"]
    print(f"Task submitted! Prediction ID: {pid}")
    
    # Polling
    poll_url = f"{BASE_URL}/prediction/{pid}"
    for i in range(40):
        time.sleep(5)
        r = requests.get(poll_url, headers=HEADERS_JSON, timeout=20)
        pdata = r.json().get("data", {})
        status = pdata.get("status")
        outputs = pdata.get("outputs")
        print(f"  [Clip {clip_num} | {(i+1)*5}s] Status: {status}")
        
        if status in ["succeeded", "completed", "done"] and outputs:
            vurl = outputs[0] if isinstance(outputs, list) else outputs
            print(f"\n✅ CLIP {clip_num} RENDER COMPLETED!")
            print(f"Direct Cloud URL: {vurl}")
            
            # Download file locally
            out_file = f"KLIP_{clip_num}_SEEDANCE_720P_916.mp4"
            print(f"Downloading to {out_file}...")
            v_content = requests.get(vurl, timeout=60).content
            with open(out_file, "wb") as f_out:
                f_out.write(v_content)
            print(f"Saved locally: {os.path.abspath(out_file)} ({len(v_content)} bytes)\n")
            return {"clip": clip_num, "url": vurl, "file": os.path.abspath(out_file)}
        elif status in ["failed", "error"]:
            print(f"❌ Clip {clip_num} failed: {pdata.get('error')}")
            return None
    print(f"⚠️ Clip {clip_num} polling timeout. Check server status later.")
    return None

if __name__ == "__main__":
    if len(sys.argv) > 1:
        clip_target = int(sys.argv[1])
        model_arg = sys.argv[2] if len(sys.argv) > 2 else "bytedance/seedance-2.0/reference-to-video"
        render_clip(clip_target, model_arg)
    else:
        print("Director O.S. Turn 6 Master Renderer Ready.")
        print("Usage: python turn6_master_renderer.py <clip_number_1_to_5> [model_name]")
