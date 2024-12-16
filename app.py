from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load the saved model
model = joblib.load("./decision_tree_model.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    features = np.array([[data["attendance"], data["participation"], data["assignments"], data["examMarks"]]])
    
    # Predict using the loaded model
    prediction = model.predict(features)[0]
    
    return jsonify({"grade": round(prediction, 2)})

if __name__ == "__main__":
    app.run(debug=True)
