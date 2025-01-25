from flask import Flask, jsonify, request
from mira_sdk import MiraClient
from dotenv import load_dotenv
import os
from flask_cors import CORS  # Corrected import for CORS

# Load environment variables
load_dotenv()

# Initialize the Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS

# Get API_KEY from environment variables
api_key = os.getenv("API_KEY")

# Initialize the MiraClient
client = MiraClient(config={"API_KEY": api_key})

@app.route('/get-clothing-suggestion', methods=['POST'])
def get_clothing_suggestion():
    # Get input data from the frontend
    input_data = request.json
    print(f"Received input data: {input_data}")

    # Prepare the flow and get results
    version = "1.0.0"
    flow_name = f"@anand/clothing-suggestion-generator/{version}" if version else "@anand/clothing-suggestion-generator"
    
    try:
        result = client.flow.execute(flow_name, input_data)
        print(f"Clothing suggestion result: {result}")
        return jsonify(result)  # Send the result back to the frontend
    except Exception as e:
        print(f"Error while executing flow: {e}")
        return jsonify({"error": "An error occurred while fetching clothing suggestions"}), 500

if __name__ == '__main__':
    app.run(debug=True)
