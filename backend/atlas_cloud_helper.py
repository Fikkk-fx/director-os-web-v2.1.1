"""
Director O.S. & ZERO CINEMA - Unified Atlas Cloud Generation & Sync Engine (V21.1)
Ported and synchronized with director_new / Atlas Cloud API Specifications.

Supports:
1. Multi-Provider Image Generation (ByteDance Seedream, Google Nano Banana, OpenAI, FLUX, Wan, Midjourney/Youchuan)
2. Multi-Provider Video Generation (ByteDance Seedance 2.5, Kling V3 Turbo, MiniMax H3, Wan 2.7, Gemini Omni Flash)
3. Provider-Specific Parameter Auto-Mapping (ratio vs aspect_ratio, sound vs generate_audio, W*H vs WxH)
4. Reference Image & Multipart Media Uploads (/api/v1/model/uploadMedia)
5. Prediction Status Tracking & Polling (/api/v1/model/prediction/{id})
6. Synchronous GPT Image 2 Multimodal Generator (/v1/chat/completions)
"""

import os
import requests
import json
import re
import time
from typing import Dict, Any, Optional, List, Union
from dotenv import load_dotenv

load_dotenv()

ATLAS_API_KEY = os.environ.get("ATLAS_API_KEY", "apikey-3547226b757043bdb2175f63bfe7622c")
ATLAS_BASE_URL = os.environ.get("ATLAS_BASE_URL", "https://api.atlascloud.ai")

CHAT_URL = f"{ATLAS_BASE_URL}/v1/chat/completions"
GENERATE_IMAGE_URL = f"{ATLAS_BASE_URL}/api/v1/model/generateImage"
GENERATE_VIDEO_URL = f"{ATLAS_BASE_URL}/api/v1/model/generateVideo"
UPLOAD_MEDIA_URL = f"{ATLAS_BASE_URL}/api/v1/model/uploadMedia"
PREDICTION_URL = f"{ATLAS_BASE_URL}/api/v1/model/prediction"

HEADERS = {
    "Authorization": f"Bearer {ATLAS_API_KEY}",
    "Content-Type": "application/json"
}

# ─────────────────────────────────────────────────────────────────────────────
# PROVIDER IDENTIFIERS & PARAMETER GROUPS (From director_new/backend/routers/atlas.py)
# ─────────────────────────────────────────────────────────────────────────────

KLING_I2V_MODELS = {
    "kwaivgi/kling-v3.0-pro/image-to-video", "kwaivgi/kling-v3.0-std/image-to-video",
    "kwaivgi/kling-v3.0-4k/image-to-video",  "kwaivgi/kling-v3.0-turbo/image-to-video",
    "kwaivgi/kling-video-o3-pro/image-to-video", "kwaivgi/kling-video-o3-std/image-to-video",
    "kwaivgi/kling-video-o3-4k/image-to-video",  "kwaivgi/kling-video-o1/image-to-video",
    "kwaivgi/kling-v2.6-pro/image-to-video",
}

MULTI_IMAGE_ARRAY_MODELS = {
    "openai/gpt-image-2/edit", "openai/gpt-image-2-developer/edit",
    "openai/gpt-image-1.5/edit", "openai/gpt-image-1/edit", "openai/gpt-image-1-mini/edit",
    "alibaba/wan-2.7/reference-to-video", "atlascloud/wan-2.7-spicy/reference-to-video",
    "alibaba/happyhorse-1.1/reference-to-video", "alibaba/happyhorse-1.0/reference-to-video",
    "google/gemini-omni-flash/reference-to-video", "google/gemini-omni-flash/reference-to-video-developer",
    "vidu/q3/reference-to-video", "vidu/q3-mix/reference-to-video", "vidu/q1/reference-to-video",
    "vidu/q2/reference-to-video", "vidu/q2-pro/reference-to-video"
}

SEEDANCE_REFS_MODELS = {
    "bytedance/seedance-2.5/reference-to-video", "bytedance/seedance-2.0-mini/reference-to-video",
    "bytedance/seedance-2.0/reference-to-video", "bytedance/seedance-2.0-fast/reference-to-video"
}

MINIMAX_REFS_MODELS = {
    "minimax/h3/reference-to-video"
}

# ─────────────────────────────────────────────────────────────────────────────
# PROMPT SANITIZER & URL PARSER
# ─────────────────────────────────────────────────────────────────────────────

def clean_prompt_for_atlas(prompt: str) -> str:
    """Sanitizes Midjourney flags (--ar, --style) and cleans tags into natural language."""
    cleaned = re.sub(r'--ar\s+\d+:\d+', '', prompt)
    cleaned = re.sub(r'--style\s+\w+', '', cleaned)
    cleaned = re.sub(r'--\w+\s*\S*', '', cleaned)
    cleaned = cleaned.strip()
    if "16:9" not in cleaned:
        cleaned += ", Widescreen 16:9 aspect ratio."
    return cleaned

def extract_image_url(content: str) -> Optional[str]:
    """Extracts image URL from markdown link or plain text URL."""
    match = re.search(r'\((https?://[^\)\s]+)\)', content)
    if match:
        return match.group(1)
    match_plain = re.search(r'(https?://[^\s\)\"\'>]+)', content)
    if match_plain:
        return match_plain.group(1)
    return None

# ─────────────────────────────────────────────────────────────────────────────
# PROVIDER PAYLOAD BUILDER (100% Synced with Atlas Cloud Parameter Specs)
# ─────────────────────────────────────────────────────────────────────────────

def build_atlas_payload(
    model: str,
    prompt: str,
    gen_type: str = "Video",
    aspect_ratio: str = "16:9",
    duration: Union[int, str] = 5,
    resolution: Optional[str] = "720p",
    generate_audio: bool = True,
    image_url: Optional[str] = None,
    image_url_2: Optional[str] = None,
    negative_prompt: Optional[str] = None,
    seed: Optional[int] = None,
    extra_params: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Constructs a 100% compliant, provider-mapped JSON payload for Atlas Cloud generation.
    Handles field discrepancies across ByteDance, Kling, MiniMax, Wan, Google, OpenAI, FLUX, etc.
    """
    clean_p = clean_prompt_for_atlas(prompt) if gen_type == "Image" else prompt.strip()
    payload: Dict[str, Any] = {
        "model": model,
        "prompt": clean_p
    }

    # 1. Aspect Ratio / Ratio Mapping
    # "aspect_ratio" = Kling, Veo, Gemini, Nano, Imagen, Youchuan, FLUX
    # "ratio"        = ByteDance, Wan, MiniMax, HappyHorse
    if any(k in model for k in ["bytedance", "wan", "minimax", "happyhorse"]):
        payload["ratio"] = aspect_ratio
    else:
        payload["aspect_ratio"] = aspect_ratio

    # 2. Duration (For Video)
    if gen_type == "Video":
        try:
            dur_int = int(str(duration).replace("s", "").strip())
        except ValueError:
            dur_int = 5
        payload["duration"] = dur_int

    # 3. Resolution & Size Mapping
    if gen_type == "Video":
        if "minimax" in model:
            mm_map = {"768p": "768P", "720p": "768P", "2k": "2K", "1080p": "2K", "2K": "2K", "768P": "768P"}
            payload["resolution"] = mm_map.get(resolution or "2K", "2K")
        elif "bytedance" in model:
            # ByteDance: 480p, 720p, 720p-esr, 1080p-esr, 1440p-esr, 4k-esr
            payload["resolution"] = resolution or "720p"
            payload["output_format"] = "mp4"
            payload["watermark"] = False
            payload["return_last_frame"] = False
        else:
            if resolution:
                payload["resolution"] = resolution
    else:
        # Image Models Resolution / Size Format Mapping
        if "bytedance" in model:
            bd_img_map = {
                "1:1": "2048*2048", "16:9": "2720*1530", "9:16": "1530*2720",
                "4:3": "2304*1728", "3:4": "1728*2304", "3:2": "2496*1664", "2:3": "1664*2496",
                "1080p": "1024*1024", "2k": "2048*2048"
            }
            payload["size"] = bd_img_map.get(aspect_ratio, "2048*2048")
            payload["output_format"] = "jpeg"
        elif "flux" in model:
            flux_map = {
                "16:9": "1280*720", "9:16": "720*1280", "1:1": "1024*1024",
                "4:3": "1024*768", "3:4": "768*1024", "720p": "1280*720",
                "1080p": "1920*1080", "2k": "2048*2048"
            }
            payload["size"] = flux_map.get(aspect_ratio, "1024*1024")
        elif "openai" in model:
            openai_map = {
                "1:1": "1024x1024", "16:9": "1536x1024", "9:16": "1024x1536",
                "4:3": "1024x768", "3:4": "768x1024", "2:3": "1024x1536",
                "720p": "1024x768", "1080p": "1024x1024", "2k": "2048x2048"
            }
            payload["size"] = openai_map.get(aspect_ratio, "1024x1024")
        elif "wan" in model:
            payload["size"] = "2K" if resolution in ["1080p", "2k", "2K"] else "1K"
        elif "google/nano-banana" in model:
            payload["resolution"] = "1k"
            payload["thinking_level"] = "default"

    # 4. Audio Control: "generate_audio" (ByteDance/Veo/Google) vs "sound" (Kling)
    if gen_type == "Video":
        if "kling" in model:
            payload["sound"] = bool(generate_audio)
            payload["cfg_scale"] = 0.5
        elif "bytedance" in model or "veo" in model or "gemini" in model:
            payload["generate_audio"] = bool(generate_audio)

    # 5. Reference Image Mapping
    if image_url:
        if model in KLING_I2V_MODELS:
            payload["image"] = image_url
            if image_url_2:
                payload["end_image"] = image_url_2
        elif model in MULTI_IMAGE_ARRAY_MODELS:
            imgs = [image_url]
            if image_url_2:
                imgs.append(image_url_2)
            payload["images"] = imgs
        elif model in SEEDANCE_REFS_MODELS:
            imgs = [image_url]
            if image_url_2:
                imgs.append(image_url_2)
            payload["reference_images"] = imgs
        elif model in MINIMAX_REFS_MODELS:
            refers = [{"url": image_url, "type": "image"}]
            if image_url_2:
                refers.append({"url": image_url_2, "type": "image"})
            payload["refers"] = refers
        else:
            payload["image"] = image_url
            payload["image_url"] = image_url

    # 6. Negative Prompt & Seed
    if negative_prompt:
        payload["negative_prompt"] = negative_prompt
    if seed is not None:
        payload["seed"] = seed

    # 7. Merge Extra Parameters
    if extra_params:
        payload.update(extra_params)

    return payload

# ─────────────────────────────────────────────────────────────────────────────
# MEDIA UPLOAD HELPER (/model/uploadMedia)
# ─────────────────────────────────────────────────────────────────────────────

def upload_media_to_atlas(file_bytes: bytes, filename: str, content_type: str = "image/jpeg") -> Dict[str, Any]:
    """Uploads a local media file to Atlas Cloud CDN storage."""
    try:
        resp = requests.post(
            UPLOAD_MEDIA_URL,
            headers={"Authorization": f"Bearer {ATLAS_API_KEY}"},
            files={"file": (filename, file_bytes, content_type)},
            timeout=45
        )
        if resp.status_code in (200, 201):
            res_json = resp.json()
            data_obj = res_json.get("data", {})
            download_url = data_obj.get("download_url") or data_obj.get("url") or res_json.get("url")
            if download_url:
                return {"status": "success", "url": download_url}
            return {"status": "error", "msg": "Atlas returned no URL after upload."}
        return {"status": "error", "code": resp.status_code, "msg": resp.text}
    except Exception as e:
        return {"status": "error", "exception": str(e)}

# ─────────────────────────────────────────────────────────────────────────────
# SYNCHRONOUS GPT IMAGE 2 GENERATOR (Turn 4a Direct Visuals)
# ─────────────────────────────────────────────────────────────────────────────

def generate_image_gpt2(prompt: str, model: str = "openai/gpt-image-2") -> Dict[str, Any]:
    """Generates an image synchronously via OpenAI GPT Image 2 model on Atlas Cloud."""
    sanitized_prompt = clean_prompt_for_atlas(prompt)
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": sanitized_prompt}]
    }
    try:
        response = requests.post(CHAT_URL, headers=HEADERS, json=payload, timeout=60)
        if response.status_code == 200:
            data = response.json()
            content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
            img_url = extract_image_url(content)
            if img_url:
                return {"status": "success", "url": img_url, "sanitized_prompt": sanitized_prompt, "model": model}
            return {"status": "success", "content": content, "sanitized_prompt": sanitized_prompt, "model": model}
        return {"status": "error", "code": response.status_code, "msg": response.text}
    except Exception as e:
        return {"status": "error", "exception": str(e)}

def edit_image_multimodal_gpt2(image_url: str, edit_instruction: str, model: str = "openai/gpt-image-2") -> Dict[str, Any]:
    """Edits an existing image via Multimodal Array format."""
    payload = {
        "model": model,
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": edit_instruction},
                    {"type": "image_url", "image_url": {"url": image_url}}
                ]
            }
        ]
    }
    try:
        response = requests.post(CHAT_URL, headers=HEADERS, json=payload, timeout=60)
        if response.status_code == 200:
            data = response.json()
            content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
            img_url = extract_image_url(content)
            if img_url:
                return {"status": "success", "url": img_url, "edit_instruction": edit_instruction}
            return {"status": "success", "content": content}
        return {"status": "error", "code": response.status_code, "msg": response.text}
    except Exception as e:
        return {"status": "error", "exception": str(e)}

# ─────────────────────────────────────────────────────────────────────────────
# ASYNC DIFFUSION / DiT IMAGE GENERATION (/model/generateImage)
# ─────────────────────────────────────────────────────────────────────────────

def generate_image_diffusion(
    prompt: str,
    model: str = "google/nano-banana-2-lite/text-to-image",
    aspect_ratio: str = "16:9",
    resolution: Optional[str] = "1k",
    image_url: Optional[str] = None,
    negative_prompt: Optional[str] = None,
    seed: Optional[int] = None
) -> Dict[str, Any]:
    """Submits a DiT/Diffusion image generation task to Atlas Cloud."""
    payload = build_atlas_payload(
        model=model,
        prompt=prompt,
        gen_type="Image",
        aspect_ratio=aspect_ratio,
        resolution=resolution,
        image_url=image_url,
        negative_prompt=negative_prompt,
        seed=seed
    )
    try:
        resp = requests.post(GENERATE_IMAGE_URL, headers=HEADERS, json=payload, timeout=30)
        if resp.status_code in (200, 201):
            res_json = resp.json()
            data = res_json.get("data", res_json)
            pred_id = data.get("id") or data.get("prediction_id")
            return {"status": "success", "prediction_id": pred_id, "model": model, "data": data}
        return {"status": "error", "code": resp.status_code, "msg": resp.text}
    except Exception as e:
        return {"status": "error", "exception": str(e)}

# ─────────────────────────────────────────────────────────────────────────────
# ASYNC CINEMATIC VIDEO GENERATION (/model/generateVideo)
# ─────────────────────────────────────────────────────────────────────────────

def generate_video_task(
    prompt: str,
    model: str = "bytedance/seedance-2.5/text-to-video",
    duration: Union[int, str] = 5,
    resolution: str = "720p",
    ratio: str = "16:9",
    generate_audio: bool = True,
    image_url: Optional[str] = None,
    image_url_2: Optional[str] = None,
    negative_prompt: Optional[str] = None,
    seed: Optional[int] = None
) -> Dict[str, Any]:
    """Submits a video generation task to Atlas Cloud Video models."""
    payload = build_atlas_payload(
        model=model,
        prompt=prompt,
        gen_type="Video",
        aspect_ratio=ratio,
        duration=duration,
        resolution=resolution,
        generate_audio=generate_audio,
        image_url=image_url,
        image_url_2=image_url_2,
        negative_prompt=negative_prompt,
        seed=seed
    )
    try:
        resp = requests.post(GENERATE_VIDEO_URL, headers=HEADERS, json=payload, timeout=30)
        if resp.status_code in (200, 201):
            res_json = resp.json()
            data = res_json.get("data", res_json)
            pred_id = data.get("id") or data.get("prediction_id")
            return {"status": "success", "prediction_id": pred_id, "model": model, "data": data}
        return {"status": "error", "code": resp.status_code, "msg": resp.text}
    except Exception as e:
        return {"status": "error", "exception": str(e)}

# ─────────────────────────────────────────────────────────────────────────────
# PREDICTION POLLING & MONITORING (/model/prediction/{id})
# ─────────────────────────────────────────────────────────────────────────────

def get_prediction_status(prediction_id: str) -> Dict[str, Any]:
    """Queries current prediction task status."""
    url = f"{PREDICTION_URL}/{prediction_id}"
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        if resp.status_code == 200:
            res_json = resp.json()
            data = res_json.get("data", {})
            status = data.get("status", "processing")
            outputs = data.get("outputs") or []
            return {
                "status": "success",
                "task_status": status,
                "prediction_id": prediction_id,
                "outputs": outputs,
                "model": data.get("model", ""),
                "error": data.get("error", "")
            }
        return {"status": "error", "code": resp.status_code, "msg": resp.text}
    except Exception as e:
        return {"status": "error", "exception": str(e)}

def poll_prediction(prediction_id: str, max_wait_seconds: int = 180, interval: int = 3) -> Dict[str, Any]:
    """Polls a task until finished or timeout."""
    elapsed = 0
    while elapsed < max_wait_seconds:
        res = get_prediction_status(prediction_id)
        if res.get("status") == "success":
            task_status = res.get("task_status")
            if task_status in ["completed", "succeeded"]:
                outputs = res.get("outputs", [])
                output_url = outputs[0] if outputs else None
                return {
                    "status": "success",
                    "task_status": "completed",
                    "prediction_id": prediction_id,
                    "url": output_url,
                    "outputs": outputs
                }
            elif task_status in ["failed", "canceled", "error"]:
                return {
                    "status": "error",
                    "task_status": task_status,
                    "prediction_id": prediction_id,
                    "error": res.get("error", "Task failed")
                }
        time.sleep(interval)
        elapsed += interval
        
    return {"status": "timeout", "prediction_id": prediction_id, "message": "Generation timed out."}

if __name__ == "__main__":
    print("Director O.S. & ZERO CINEMA Atlas Cloud Engine v21.1 Synced & Ready.")
