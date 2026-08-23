"""
ZERO CINEMA — Master Enterprise REST API & SSE Streaming Server (V21.1 Unified)
Unified API Suite combining:
1. Director OS Frontend API (Atlas Cloud Multi-Model Generation + Vision Chat)
2. ZERO CINEMA Directing Studio (Screenplay, CharSheet, EnvSheet, 3-Block & 9-Block Prompts, 23-Point Audit)
3. Direct Video & Diffusion Model Dispatch (Seedance 2.5, Kling, Nano Banana, GPT-Image-2)
4. Interactive SSE Streaming with Live Activity Tracking
5. Auto-documented via Swagger UI at: http://localhost:8000/docs
"""

import os
import json
from fastapi import FastAPI, HTTPException, Request, UploadFile, File
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional, Union
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from agent_core import (
    stream_chat_completion, 
    direct_generate_screenplay,
    direct_generate_charsheet,
    direct_generate_envsheet,
    direct_generate_9block_prompt,
    direct_generate_3block_prompt,
    direct_audit_prompt,
    SYSTEM_RULES_PROMPT
)
from atlas_cloud_helper import (
    generate_image_gpt2,
    generate_image_diffusion,
    generate_video_task,
    get_prediction_status,
    poll_prediction,
    upload_media_to_atlas
)

# Import routers (Atlas Cloud multi-model generation + Workflow Chat)
from routers import atlas, workflow

# Rate limiting with slowapi
try:
    from slowapi import Limiter, _rate_limit_exceeded_handler
    from slowapi.util import get_remote_address
    from slowapi.errors import RateLimitExceeded
    limiter = Limiter(key_func=get_remote_address)
    HAS_SLOWAPI = True
except ImportError:
    HAS_SLOWAPI = False

app = FastAPI(
    title="Director OS — ZERO CINEMA Master API",
    description="Studio-grade AI Directing & Multi-Model Generation REST API Suite powered by Panavision DXL2 standards and Atlas Cloud.",
    version="21.1"
)

# Attach rate limiter if available
if HAS_SLOWAPI:
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*",
        "http://localhost:3000",
        "http://localhost:5173",
        "https://director-os-web-v2-1.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────────────
# MOUNT ROUTERS (Frontend Endpoints)
# ─────────────────────────────────────────────────────
# Provides:
#   GET  /api/atlas/models
#   GET  /api/atlas/models/{model_id}
#   POST /api/atlas/generate
#   GET  /api/atlas/status/{prediction_id}
#   POST /api/chat
app.include_router(atlas.router, prefix="/api/atlas", tags=["Atlas Cloud"])
app.include_router(workflow.router, prefix="/api", tags=["Chat"])

# ─────────────────────────────────────────────────────
# HEALTH CHECK & SYSTEM MODELS
# ─────────────────────────────────────────────────────

@app.get("/api/health")
async def health_check():
    """Health check endpoint used by the Director OS frontend."""
    return {"status": "ok", "service": "Director OS Backend — ZERO CINEMA V21.1"}

CINEMA_MODELS = [
    {"id": "deepseek-ai/DeepSeek-V3.1", "name": "DeepSeek V3.1 (Fast Stream)", "category": "Flagship"},
    {"id": "anthropic/claude-sonnet-4.6", "name": "Claude Sonnet 4.6 (Master)", "category": "Flagship"},
    {"id": "google/gemini-2.5-flash", "name": "Gemini 2.5 Flash (Ultra Fast)", "category": "Flash"},
]

@app.get("/api/models")
@app.get("/api/v1/models")
async def get_cinema_models():
    """Returns the list of supported ZERO CINEMA flagship AI models."""
    return {"models": CINEMA_MODELS}

# -------------------------------------------------------------
# PYDANTIC SCHEMAS (ZERO CINEMA)
# -------------------------------------------------------------

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatStreamRequest(BaseModel):
    messages: List[ChatMessage]
    model: Optional[str] = "deepseek-ai/DeepSeek-V3.1"
    language: Optional[str] = "id"
    temperature: Optional[float] = 0.7

class ScreenplayRequest(BaseModel):
    concept: str = Field(..., description="Visi adegan atau logline film")
    auteur_style: Optional[str] = Field("David Fincher", description="Gaya sutradara (misal: Gareth Evans, Christopher Nolan, Wong Kar-wai)")
    duration: Optional[str] = Field("15s", description="Durasi adegan (10s, 15s, 30s)")
    language: Optional[str] = Field("id", description="'id' untuk Indonesia, 'en' untuk English")
    model: Optional[str] = "deepseek-ai/DeepSeek-V3.1"

class CharSheetRequest(BaseModel):
    character_name: str
    age: int = 28
    gender: str = "female"
    ethnicity: str = "Indonesian"
    wardrobe: str = "Gaun merah sutra elegan"
    details: Optional[str] = "tatapan dingin, makeup bold"
    model: Optional[str] = "deepseek-ai/DeepSeek-V3.1"

class EnvSheetRequest(BaseModel):
    location_name: str = "Apartemen Mewah Tengah Malam"
    lighting: str = "Single 2700K tungsten lamp chiaroscuro"
    details: str = "Jendela besar basah terkena hujan deras, sofa kulit hitam"
    model: Optional[str] = "deepseek-ai/DeepSeek-V3.1"

class Prompt9BlockRequest(BaseModel):
    screenplay: str
    duration: Optional[str] = "15s"
    camera_spec: Optional[str] = "Panavision Millennium DXL2 70mm Primo"
    language: Optional[str] = "id"
    model: Optional[str] = "deepseek-ai/DeepSeek-V3.1"

class Prompt3BlockRequest(BaseModel):
    screenplay: str
    duration: Optional[str] = "10s"
    language: Optional[str] = "id"
    model: Optional[str] = "deepseek-ai/DeepSeek-V3.1"

class AuditRequest(BaseModel):
    prompt_text: str
    model: Optional[str] = "deepseek-ai/DeepSeek-V3.1"

class GenerateImageRequest(BaseModel):
    prompt: str
    model: Optional[str] = "openai/gpt-image-2"

class GenerateImageDiffusionRequest(BaseModel):
    prompt: str = Field(..., description="Prompt gambar sinematik")
    model: Optional[str] = Field("google/nano-banana-2-lite/text-to-image", description="Model image Atlas Cloud")
    aspect_ratio: Optional[str] = Field("16:9", description="Rasio aspek")
    size: Optional[str] = Field(None, description="Ukuran pixel misal '2048*2048'")
    wait_for_completion: Optional[bool] = Field(True, description="Tunggu hingga gambar selesai dirender")

class GenerateVideoRequest(BaseModel):
    prompt: str = Field(..., description="Prompt teks video sinematik")
    model: Optional[str] = Field("bytedance/seedance-2.5/text-to-video", description="Model video Atlas Cloud")
    duration: Optional[int] = Field(5, description="Durasi video dalam detik (4-30s)")
    resolution: Optional[str] = Field("720p", description="Resolusi (720p, 1080p-esr, 4k-esr)")
    ratio: Optional[str] = Field("16:9", description="Aspek rasio (16:9, 9:16, 21:9, adaptive)")
    generate_audio: Optional[bool] = Field(True, description="Sertakan audio native sinematik")
    image_url: Optional[str] = Field(None, description="Image referensi untuk Image-to-Video")
    wait_for_completion: Optional[bool] = Field(True, description="Tunggu hingga video selesai dirender")

# -------------------------------------------------------------
# ZERO CINEMA REST API ENDPOINTS
# -------------------------------------------------------------

@app.post("/api/chat-stream")
async def chat_stream_endpoint(req: ChatStreamRequest):
    """Interactive full 6-step conversational director stream via SSE."""
    messages = [{"role": m.role, "content": m.content} for m in req.messages]
    return StreamingResponse(
        stream_chat_completion(
            messages, 
            model=req.model, 
            language=req.language or "id",
            temperature=req.temperature
        ),
        media_type="text/event-stream"
    )

@app.post("/api/v1/screenplay")
async def api_generate_screenplay(req: ScreenplayRequest):
    """Direct Screenplay & Motivated Cuts Generator (Hollywood Format)."""
    try:
        script = direct_generate_screenplay(
            concept=req.concept,
            auteur_style=req.auteur_style,
            duration=req.duration or "15s",
            language=req.language or "id",
            model=req.model or "deepseek-ai/DeepSeek-V3.1"
        )
        return {"status": "success", "duration": req.duration, "screenplay": script}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/assets/charsheet")
async def api_generate_charsheet(req: CharSheetRequest):
    """Direct 4-Panel Raw UGC Character Reference Sheet Prompt Generator (Solid White)."""
    try:
        prompt = direct_generate_charsheet(
            character_name=req.character_name,
            age=req.age,
            gender=req.gender,
            ethnicity=req.ethnicity,
            wardrobe=req.wardrobe,
            details=req.details,
            model=req.model or "deepseek-ai/DeepSeek-V3.1"
        )
        return {
            "status": "success",
            "character_name": req.character_name,
            "format": "4-panel raw UGC grid solid white",
            "prompt": prompt
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/assets/envsheet")
async def api_generate_envsheet(req: EnvSheetRequest):
    """Direct Single-Wall Environmental Reference Sheet Prompt Generator."""
    try:
        prompt = direct_generate_envsheet(
            location_name=req.location_name,
            lighting=req.lighting,
            details=req.details,
            model=req.model or "deepseek-ai/DeepSeek-V3.1"
        )
        return {"status": "success", "location_name": req.location_name, "prompt": prompt}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/prompts/9block")
async def api_generate_9block(req: Prompt9BlockRequest):
    """Direct Master 9-Block Extended Video Prompt Generator (1 Single Unified Codeblock)."""
    try:
        prompt = direct_generate_9block_prompt(
            screenplay=req.screenplay,
            duration=req.duration or "15s",
            camera_spec=req.camera_spec or "Panavision Millennium DXL2 70mm Primo",
            language=req.language or "id",
            model=req.model or "deepseek-ai/DeepSeek-V3.1"
        )
        return {"status": "success", "duration": req.duration, "master_9block_prompt": prompt}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/prompts/3block")
async def api_generate_3block(req: Prompt3BlockRequest):
    """Direct Standard 3-Block Master Video Prompt Generator ([PROSE], [ACTING], [CAMERA])."""
    try:
        prompt = direct_generate_3block_prompt(
            screenplay=req.screenplay,
            duration=req.duration or "10s",
            language=req.language or "id",
            model=req.model or "deepseek-ai/DeepSeek-V3.1"
        )
        return {"status": "success", "duration": req.duration, "master_3block_prompt": prompt}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/audit")
async def api_audit_prompt(req: AuditRequest):
    """Direct 23-Point Zero-Defect Cinematic Compliance Auditor."""
    try:
        report = direct_audit_prompt(req.prompt_text, model=req.model or "deepseek-ai/DeepSeek-V3.1")
        return {"status": "success", "audit_report": report}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-image")
@app.post("/api/v1/generate-image")
async def generate_image_endpoint(req: GenerateImageRequest):
    """Direct Image Generation via Atlas Cloud API (openai/gpt-image-2)."""
    result = generate_image_gpt2(req.prompt, model=req.model or "openai/gpt-image-2")
    return result

@app.post("/api/v1/generate-image-diffusion")
async def generate_image_diffusion_endpoint(req: GenerateImageDiffusionRequest):
    """Direct Image Generation via Atlas Cloud Diffusion Models (Nano Banana, Seedream, etc.)."""
    res = generate_image_diffusion(
        prompt=req.prompt,
        model=req.model or "google/nano-banana-2-lite/text-to-image",
        aspect_ratio=req.aspect_ratio or "16:9",
        size=req.size
    )
    if res.get("status") == "success" and req.wait_for_completion:
        pred_id = res.get("prediction_id")
        if pred_id:
            polled = poll_prediction(pred_id, max_wait_seconds=60, interval=2)
            return polled
    return res

@app.post("/api/generate-video")
@app.post("/api/v1/generate-video")
async def generate_video_endpoint(req: GenerateVideoRequest):
    """Direct Video Generation via Atlas Cloud Video Models (Seedance 2.5, Kling, etc.)."""
    res = generate_video_task(
        prompt=req.prompt,
        model=req.model or "bytedance/seedance-2.5/text-to-video",
        duration=req.duration or 5,
        resolution=req.resolution or "720p",
        ratio=req.ratio or "16:9",
        generate_audio=req.generate_audio if req.generate_audio is not None else True,
        image_url=req.image_url
    )
    if res.get("status") == "success" and req.wait_for_completion:
        pred_id = res.get("prediction_id")
        if pred_id:
            polled = poll_prediction(pred_id, max_wait_seconds=180, interval=3)
            return polled
    return res

@app.get("/api/prediction/{prediction_id}")
@app.get("/api/v1/prediction/{prediction_id}")
async def get_prediction_endpoint(prediction_id: str):
    """Checks the live generation status of an async image or video task."""
    return get_prediction_status(prediction_id)

@app.post("/api/upload-media")
@app.post("/api/v1/upload-media")
async def upload_media_endpoint(file: UploadFile = File(...)):
    """Uploads a local reference image to Atlas Cloud CDN storage."""
    try:
        raw_bytes = await file.read()
        res = upload_media_to_atlas(
            file_bytes=raw_bytes,
            filename=file.filename or "reference.jpg",
            content_type=file.content_type or "image/jpeg"
        )
        if res.get("status") == "success":
            return res
        raise HTTPException(status_code=500, detail=res.get("msg", "Upload failed"))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# -------------------------------------------------------------
# STATIC FILES SERVING (ZERO CINEMA STUDIO UI)
# Static mount must be LAST because it catches all unmatched routes
# -------------------------------------------------------------
STATIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")
os.makedirs(STATIC_DIR, exist_ok=True)

# Mount /static prefix for explicit assets
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static_dir")

# Fallback root mount for direct web studio UI access
app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="static_root")

if __name__ == "__main__":
    import uvicorn
    print("=" * 60)
    print("  Director OS — ZERO CINEMA Master API Server (V21.1)")
    print("  Frontend API + ZERO CINEMA Directing Endpoints")
    print("=" * 60)
    print("[SERVER] Starting on http://localhost:8000 ...")
    print("[DOCS]   Swagger API Docs at: http://localhost:8000/docs")
    print("[FRONT]  Frontend connects to: http://localhost:8000/api/*")
    print("=" * 60)
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
