from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
import numpy as np
import pickle
import io
import re
import gc
import asyncio
import httpx
import os
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.applications import MobileNetV2, InceptionV3
from tensorflow.keras import layers
import psutil  # ✅ ADD THIS - Install with: pip install psutil
import warnings

warnings.filterwarnings('ignore')

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ ADD: Global locks for each model (prevents concurrent requests)
malaria_lock = asyncio.Lock()
kidney_lock = asyncio.Lock()
depression_lock = asyncio.Lock()

# ========== SELF-PING CONFIGURATION ==========
RENDER_URL = os.getenv("RENDER_EXTERNAL_URL", "https://sympto-new-model.onrender.com")
PING_INTERVAL = 840

async def keep_alive():
    while True:
        try:
            await asyncio.sleep(PING_INTERVAL)
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(f"{RENDER_URL}/")
                print(f"✓ Self-ping successful at {response.status_code}")
        except Exception as e:
            print(f"✗ Self-ping failed: {e}")

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(keep_alive())
    print(f"🚀 Self-ping activated: {RENDER_URL}")
    print("⚡ Models will swap on-demand to save memory")

# ✅ IMPROVED: Memory cleanup with better logging
def cleanup_memory():
    try:
        for _ in range(2):  # Run twice for better cleanup
            gc.collect()
        
        # Log memory usage
        try:
            mem_mb = psutil.Process().memory_info().rss / 1024 / 1024
            print(f"✓ Memory cleaned. Current usage: {mem_mb:.1f} MB / 512 MB")
        except:
            print("✓ Memory cleaned successfully")
    except Exception as e:
        print(f"✗ Memory cleanup warning: {e}")

# ✅ ADD: Memory safety check
def check_memory_safe():
    """Check if memory is safe to load model"""
    try:
        mem_mb = psutil.Process().memory_info().rss / 1024 / 1024
        print(f"💾 Current memory: {mem_mb:.1f} MB / 512 MB")
        return mem_mb < 450  # Safe threshold (450MB out of 512MB)
    except:
        return True  # If check fails, proceed anyway

# ✅ IMPROVED: Unload with better cleanup
def unload_model(model_name):
    """Unload specific model from memory"""
    global malaria_model, kidney_model, depression_model, depression_vectorizer
    
    if model_name == "malaria" and malaria_model is not None:
        print("[MEMORY] Unloading Malaria model...")
        del malaria_model
        malaria_model = None
        tf.keras.backend.clear_session()
        gc.collect()
        gc.collect()  # Second pass
        print("✓ Malaria model unloaded")
    
    elif model_name == "kidney" and kidney_model is not None:
        print("[MEMORY] Unloading Kidney model...")
        del kidney_model
        kidney_model = None
        tf.keras.backend.clear_session()
        gc.collect()
        gc.collect()  # Second pass
        print("✓ Kidney model unloaded")
    
    elif model_name == "depression" and (depression_model is not None or depression_vectorizer is not None):
        print("[MEMORY] Unloading Depression model...")
        if depression_model is not None:
            del depression_model
            depression_model = None
        if depression_vectorizer is not None:
            del depression_vectorizer
            depression_vectorizer = None
        gc.collect()
        gc.collect()  # Second pass
        print("✓ Depression model unloaded")

# ========== TEXT CLEANING ==========
def clean_text(text):
    text = str(text).lower()
    text = re.sub(r'http\S+', '', text)
    text = re.sub(r'[^a-z\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

# ========== PREPROCESSING ==========
def to_rgb(img: Image.Image) -> Image.Image:
    return img if img.mode == "RGB" else img.convert("RGB")

def preprocess_malaria(img: Image.Image):
    img = to_rgb(img).resize((128, 128))
    arr = np.array(img, dtype=np.float32) / 255.0
    return np.expand_dims(arr, axis=0)

def preprocess_kidney(img: Image.Image):
    img = to_rgb(img).resize((299, 299))
    arr = np.array(img, dtype=np.float32)
    arr = tf.keras.applications.inception_v3.preprocess_input(arr)
    return np.expand_dims(arr, axis=0)

# ========== MODEL VARIABLES ==========
malaria_model = None
kidney_model = None
depression_model = None
depression_vectorizer = None

# ========== SMART LOAD FUNCTIONS ==========
def load_malaria_model():
    global malaria_model
    if malaria_model is None:
        unload_model("kidney")
        unload_model("depression")
        
        print("[MALARIA] Loading model...")
        base = MobileNetV2(input_shape=(128, 128, 3), include_top=False, weights=None)
        base.trainable = False
        malaria_model = keras.Sequential([
            base,
            layers.GlobalAveragePooling2D(),
            layers.Dropout(0.5),
            layers.Dense(128, activation="relu"),
            layers.Dropout(0.3),
            layers.Dense(1, activation="sigmoid"),
        ])
        malaria_model.build((None, 128, 128, 3))
        malaria_model.load_weights("../models/malaria_mobilenetv2_model.keras")
        print("✓ Malaria model loaded")
    return malaria_model

def load_kidney_model():
    global kidney_model
    if kidney_model is None:
        unload_model("malaria")
        unload_model("depression")
        
        print("[KIDNEY] Loading model...")
        kidney_model = keras.models.load_model(
            "../models/final_inceptionv3_kidney_finetuned.h5",
            compile=False
        )
        print("✓ Kidney model loaded")
    return kidney_model

def load_depression_model():
    global depression_model, depression_vectorizer
    if depression_model is None:
        unload_model("malaria")
        unload_model("kidney")
        
        print("[DEPRESSION] Loading model...")
        with open("../models/depression_detection_model.pkl", "rb") as f:
            depression_model = pickle.load(f)
        with open("../models/tfidf_vectorizer.pkl", "rb") as f:
            depression_vectorizer = pickle.load(f)
        print("✓ Depression model loaded")
    return depression_model, depression_vectorizer

# ========== PYDANTIC MODELS ==========
class DepressionInput(BaseModel):
    text: str

# ========== ENDPOINTS ==========
@app.get("/")
def home():
    return {
        "message": "Disease Prediction API",
        "status": "running",
        "memory_optimized": True,
        "strategy": "model_swapping + request_locking",
    }

# ✅ FIXED: Malaria endpoint with locking and memory checks
@app.post("/api/predict/malaria")
async def predict_malaria(image: UploadFile = File(...)):
    async with malaria_lock:  # ✅ Only one malaria prediction at a time
        print("\n[MALARIA] Received prediction request")
        
        try:
            # ✅ Wait for memory to be safe (max 3 attempts)
            for attempt in range(3):
                if check_memory_safe():
                    break
                print(f"⏳ Waiting for memory to clear... (attempt {attempt + 1})")
                await asyncio.sleep(2)
                gc.collect()
            
            # Load model and predict
            model = load_malaria_model()
            
            img = Image.open(io.BytesIO(await image.read()))
            print(f"[MALARIA] Image size: {img.size}, mode: {img.mode}")
            
            x = preprocess_malaria(img)
            y = model.predict(x, verbose=0)
            p = float(y[0][0])
            
            if p >= 0.5:
                label = "Uninfected"
                conf = p * 100
                risk = "Low"
            else:
                label = "Parasitized"
                conf = (1 - p) * 100
                risk = "High" if conf > 80 else "Moderate"
            
            print(f"[MALARIA] Final: {label} ({conf:.2f}%)")
            
            result = {
                "success": True,
                "data": {
                    "prediction": label,
                    "confidence": round(conf, 2),
                    "risk_level": risk,
                    "probabilities": {
                        "Parasitized": round((1 - p) * 100, 2),
                        "Uninfected": round(p * 100, 2),
                    },
                }
            }
            
            # ✅ Cleanup immediately after prediction
            print("[MALARIA] Cleaning up...")
            unload_model("malaria")
            cleanup_memory()
            await asyncio.sleep(0.5)  # Brief pause for cleanup to complete
            
            return result
            
        except Exception as e:
            print(f"[MALARIA] ERROR: {str(e)}")
            unload_model("malaria")
            cleanup_memory()
            raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

# ✅ FIXED: Kidney endpoint with locking and memory checks
@app.post("/api/predict/kidney")
async def predict_kidney(image: UploadFile = File(...)):
    async with kidney_lock:  # ✅ Only one kidney prediction at a time
        print("\n[KIDNEY] Received prediction request")
        
        try:
            # ✅ Wait for memory to be safe
            for attempt in range(3):
                if check_memory_safe():
                    break
                print(f"⏳ Waiting for memory to clear... (attempt {attempt + 1})")
                await asyncio.sleep(2)
                gc.collect()
            
            model = load_kidney_model()
            
            img = Image.open(io.BytesIO(await image.read()))
            print(f"[KIDNEY] Image size: {img.size}, mode: {img.mode}")
            
            x = preprocess_kidney(img)
            y = model.predict(x, verbose=0)[0]
            
            class_names = ["Cyst", "Normal", "Stone", "Tumor"]
            predicted_idx = int(np.argmax(y))
            label = class_names[predicted_idx]
            conf = float(y[predicted_idx]) * 100
            
            print(f"[KIDNEY] Final: {label} ({conf:.2f}%)")
            
            if label == "Normal":
                risk = "Low"
            elif label in ["Cyst", "Stone"]:
                risk = "Moderate" if conf > 70 else "High"
            else:
                risk = "High"
            
            probabilities = {
                class_names[i]: round(float(y[i]) * 100, 2) 
                for i in range(len(class_names))
            }
            
            result = {
                "success": True,
                "data": {
                    "prediction": label,
                    "confidence": round(conf, 2),
                    "risk_level": risk,
                    "probabilities": probabilities,
                }
            }
            
            # ✅ Cleanup immediately
            print("[KIDNEY] Cleaning up...")
            unload_model("kidney")
            cleanup_memory()
            await asyncio.sleep(0.5)
            
            return result
            
        except Exception as e:
            print(f"[KIDNEY] ERROR: {str(e)}")
            unload_model("kidney")
            cleanup_memory()
            raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

# ✅ FIXED: Depression endpoint with locking and memory checks
@app.post("/api/predict/depression")
async def predict_depression(data: DepressionInput):
    async with depression_lock:  # ✅ Only one depression prediction at a time
        print("\n[DEPRESSION] Received prediction request")
        
        try:
            # ✅ Wait for memory to be safe
            for attempt in range(3):
                if check_memory_safe():
                    break
                print(f"⏳ Waiting for memory to clear... (attempt {attempt + 1})")
                await asyncio.sleep(2)
                gc.collect()
            
            model, vectorizer = load_depression_model()
            
            cleaned_text = clean_text(data.text)
            print(f"[DEPRESSION] Cleaned text: {cleaned_text[:50]}...")
            
            if not cleaned_text.strip():
                raise HTTPException(400, "Text input is empty after cleaning")
            
            text_vector = vectorizer.transform([cleaned_text])
            prediction = model.predict(text_vector)[0]
            probability = model.predict_proba(text_vector)[0]
            
            label = "Depressed" if prediction == "depressed" else "Non-Depressed"
            
            if prediction == "depressed":
                conf = float(probability[0]) * 100
                risk = "High" if conf >= 80 else "Moderate"
            else:
                conf = float(probability[1]) * 100
                risk = "Low"
            
            print(f"[DEPRESSION] Final: {label} ({conf:.2f}%)")
            
            result = {
                "success": True,
                "data": {
                    "prediction": label,
                    "confidence": round(conf, 2),
                    "risk_level": risk,
                    "probabilities": {
                        "Depressed": round(probability[0] * 100, 2),
                        "Non-Depressed": round(probability[1] * 100, 2),
                    },
                }
            }
            
            # ✅ Cleanup immediately
            print("[DEPRESSION] Cleaning up...")
            unload_model("depression")
            cleanup_memory()
            await asyncio.sleep(0.5)
            
            return result
            
        except Exception as e:
            print(f"[DEPRESSION] ERROR: {str(e)}")
            unload_model("depression")
            cleanup_memory()
            raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
