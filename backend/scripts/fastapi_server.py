from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
import numpy as np
import pickle
import io
import re
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.applications import MobileNetV2, InceptionV3
from tensorflow.keras import layers
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
    """Malaria: 128x128 RGB, scale /255"""
    img = to_rgb(img).resize((128, 128))
    arr = np.array(img, dtype=np.float32) / 255.0
    return np.expand_dims(arr, axis=0)

def preprocess_kidney(img: Image.Image):
    """Kidney: 299x299 RGB, InceptionV3 preprocessing"""
    img = to_rgb(img).resize((299, 299))
    arr = np.array(img, dtype=np.float32)
    arr = tf.keras.applications.inception_v3.preprocess_input(arr)
    return np.expand_dims(arr, axis=0)

# ========== GLOBAL MODEL VARIABLES ==========
malaria_model = None
kidney_model = None
depression_model = None
depression_vectorizer = None

# ========== LOAD MODELS ==========
print("\n" + "="*60)
print("Loading ML Models...")
print("="*60)

# Load Malaria Model
try:
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
    print("✓ Malaria model loaded successfully")
except Exception as e:
    print(f"✗ Malaria model FAILED: {e}")
    malaria_model = None

# Load Kidney Model
try:
    kidney_model = keras.models.load_model(
        "../models/final_inceptionv3_kidney_finetuned.h5",
        compile=False
    )
    print("✓ Kidney model loaded successfully")
except Exception as e:
    print(f"✗ Kidney model FAILED: {e}")
    kidney_model = None

# Load Depression Model
try:
    with open("../models/depression_detection_model.pkl", "rb") as f:
        depression_model = pickle.load(f)
    with open("../models/tfidf_vectorizer.pkl", "rb") as f:
        depression_vectorizer = pickle.load(f)
    print("✓ Depression model loaded successfully")
except Exception as e:
    print(f"✗ Depression model FAILED: {e}")
    depression_model = None
    depression_vectorizer = None

print("="*60 + "\n")

# ========== PYDANTIC MODELS ==========
class DepressionInput(BaseModel):
    text: str

# ========== ENDPOINTS ==========
@app.get("/")
def home():
    return {
        "message": "Disease Prediction API",
        "status": "running",
        "models": {
            "malaria": malaria_model is not None,
            "kidney": kidney_model is not None,
            "depression": depression_model is not None,
        },
    }

@app.post("/api/predict/malaria")
async def predict_malaria(image: UploadFile = File(...)):
    print("\n[MALARIA] Received prediction request")
    
    if malaria_model is None:
        raise HTTPException(500, "Malaria model not loaded")
    
    try:
        # Read and preprocess image
        img = Image.open(io.BytesIO(await image.read()))
        print(f"[MALARIA] Image size: {img.size}, mode: {img.mode}")
        
        x = preprocess_malaria(img)
        print(f"[MALARIA] Preprocessed shape: {x.shape}")
        
        # Make prediction
        y = malaria_model.predict(x, verbose=0)
        p = float(y[0][0])
        print(f"[MALARIA] Raw prediction: {p}")
        
        # Determine label and confidence
        if p >= 0.5:
            label = "Uninfected"
            conf = p * 100
            risk = "Low"
        else:
            label = "Parasitized"
            conf = (1 - p) * 100
            risk = "High" if conf > 80 else "Moderate"
        
        print(f"[MALARIA] Final: {label} ({conf:.2f}%)")
        
        return {
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
    except Exception as e:
        print(f"[MALARIA] ERROR: {str(e)}")
        raise HTTPException(400, str(e))

@app.post("/api/predict/kidney")
async def predict_kidney(image: UploadFile = File(...)):
    print("\n[KIDNEY] Received prediction request")
    
    if kidney_model is None:
        raise HTTPException(500, "Kidney model not loaded")
    
    try:
        # Read and preprocess image
        img = Image.open(io.BytesIO(await image.read()))
        print(f"[KIDNEY] Image size: {img.size}, mode: {img.mode}")
        
        x = preprocess_kidney(img)
        print(f"[KIDNEY] Preprocessed shape: {x.shape}")
        
        # Make prediction
        y = kidney_model.predict(x, verbose=0)[0]
        print(f"[KIDNEY] Raw predictions: {y}")
        
        # Class names
        class_names = ["Cyst", "Normal", "Stone", "Tumor"]
        predicted_idx = int(np.argmax(y))
        label = class_names[predicted_idx]
        conf = float(y[predicted_idx]) * 100
        
        print(f"[KIDNEY] Final: {label} ({conf:.2f}%)")
        
        # Risk level
        if label == "Normal":
            risk = "Low"
        elif label in ["Cyst", "Stone"]:
            risk = "Moderate" if conf > 70 else "High"
        else:  # Tumor
            risk = "High"
        
        probabilities = {
            class_names[i]: round(float(y[i]) * 100, 2) 
            for i in range(len(class_names))
        }
        
        return {
            "success": True,
            "data": {
                "prediction": label,
                "confidence": round(conf, 2),
                "risk_level": risk,
                "probabilities": probabilities,
            }
        }
    except Exception as e:
        print(f"[KIDNEY] ERROR: {str(e)}")
        raise HTTPException(400, str(e))

@app.post("/api/predict/depression")
async def predict_depression(data: DepressionInput):
    print("\n[DEPRESSION] Received prediction request")
    print(f"[DEPRESSION] Text: {data.text[:50]}...")
    
    if depression_model is None or depression_vectorizer is None:
        raise HTTPException(500, "Depression model not loaded")
    
    try:
        # Clean text
        cleaned_text = clean_text(data.text)
        print(f"[DEPRESSION] Cleaned text: {cleaned_text[:50]}...")
        
        if not cleaned_text.strip():
            raise HTTPException(400, "Text input is empty after cleaning")
        
        # Vectorize and predict
        text_vector = depression_vectorizer.transform([cleaned_text])
        prediction = depression_model.predict(text_vector)[0]
        probability = depression_model.predict_proba(text_vector)[0]
        
        print(f"[DEPRESSION] Raw prediction: {prediction}")
        print(f"[DEPRESSION] Probabilities: {probability}")
        
        # Determine label
        label = "Depressed" if prediction == "depressed" else "Non-Depressed"
        
        if prediction == "depressed":
            conf = float(probability[0]) * 100
            risk = "High" if conf >= 80 else "Moderate"
        else:
            conf = float(probability[1]) * 100
            risk = "Low"
        
        print(f"[DEPRESSION] Final: {label} ({conf:.2f}%)")
        
        return {
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
    except Exception as e:
        print(f"[DEPRESSION] ERROR: {str(e)}")
        raise HTTPException(400, str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
