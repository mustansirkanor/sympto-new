# test_sklearn.py
import pickle

print("Testing scikit-learn compatibility...")

try:
    with open("../models/diabetes_gb_model.pkl", "rb") as f:
        model = pickle.load(f)
    print(f"✓ Model loaded successfully!")
    print(f"Model type: {type(model)}")
except Exception as e:
    print(f"✗ Error: {e}")
    
    # Try to find which sklearn version was used
    import sklearn
    print(f"Current scikit-learn version: {sklearn.__version__}")
    print("Try installing: pip install scikit-learn==1.2.2")
