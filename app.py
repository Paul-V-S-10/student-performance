from flask import Flask, request, jsonify
import joblib
import pandas as pd
from flask_cors import CORS 

app = Flask(__name__)
CORS(app)

model = joblib.load("./decision_tree_model.pkl") 
scaler = joblib.load("./scaler.pkl")  
feature_columns = joblib.load("./columns.pkl")  


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        print("Received data:", data) 

        features = [
            data["attendance"],
            data["participation"],
            data["assignments"],
            data["examMarks"]
        ]
        print("Raw Input Features:", features)  

        features_df = pd.DataFrame([features], columns=["attendance", "participation", "assignments", "examMarks"])

        for col in feature_columns:
            if col not in features_df:
                features_df[col] = 0 
        features_df = features_df[feature_columns] 

        print("Aligned Features DataFrame:\n", features_df)  

        scaled_features = scaler.transform(features_df)
        print("Scaled Features:", scaled_features)  

        prediction = model.predict(scaled_features)[0]
        print("Prediction:", prediction)  

        return jsonify({"prediction": float(prediction)})
    except Exception as e:
        print("Error during prediction:", str(e)) 
        return jsonify({"error": str(e)})


if __name__ == '__main__':
    app.run(debug=True)
