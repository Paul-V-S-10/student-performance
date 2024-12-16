from flask import Flask, request, jsonify
import joblib
import pandas as pd
from flask_cors import CORS  # Import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load the trained model, scaler, and feature columns
model = joblib.load("./decision_tree_model.pkl")  # Ensure the model file is in the same folder
scaler = joblib.load("./scaler.pkl")  # Preprocessing scaler
feature_columns = joblib.load("./columns.pkl")  # List of feature columns used in training


@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Parse JSON data from request
        data = request.json
        print("Received data:", data)  # Debugging log

        # Extract input features from the JSON request
        features = [
            data["attendance"],
            data["participation"],
            data["assignments"],
            data["examMarks"]
        ]
        print("Raw Input Features:", features)  # Debugging log

        # Convert input features to a DataFrame
        features_df = pd.DataFrame([features], columns=["attendance", "participation", "assignments", "examMarks"])

        # Align with training columns: Add missing columns with default values (e.g., 0)
        for col in feature_columns:
            if col not in features_df:
                features_df[col] = 0  # Assign default value for missing features
        features_df = features_df[feature_columns]  # Reorder columns to match training data

        print("Aligned Features DataFrame:\n", features_df)  # Debugging log

        # Scale the input features using the saved scaler
        scaled_features = scaler.transform(features_df)
        print("Scaled Features:", scaled_features)  # Debugging log

        # Make prediction using the trained model
        prediction = model.predict(scaled_features)[0]
        print("Prediction:", prediction)  # Debugging log

        # Return the prediction as JSON
        return jsonify({"prediction": float(prediction)})
    except Exception as e:
        print("Error during prediction:", str(e))  # Debugging log
        return jsonify({"error": str(e)})


if __name__ == '__main__':
    # Run the Flask app
    app.run(debug=True)
