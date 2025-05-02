from flask import Blueprint, jsonify, request
import pandas as pd
import traceback
from evaluation.evaluation import evaluate

evaluation_routes = Blueprint('evaluation', __name__)

@evaluation_routes.route('/evaluate', methods=['GET', 'OPTIONS'])
def run_evaluation():
    try:
        # Log incoming request
        print("Received request to /evaluate")

        # Parse query parameters
        sample_size = request.args.get('sample_size', default=50, type=int)
        k = request.args.get('k', default=10, type=int)
        print(f"Sample size: {sample_size}, K: {k}")

        # Load dataset and check existence
        try:
            df = pd.read_csv("tmdb_movies_cleaned.csv").sample(10000)
            print(f"Loaded dataset with {len(df)} rows")
        except FileNotFoundError:
            print("ERROR: File tmdb_movies_cleaned.csv not found")
            return jsonify({"error": "Dataset file not found"}), 500

        # Run the evaluation logic
        results = evaluate(df, sample_size=sample_size, k=k)
        print("Evaluation completed successfully")

        # Return the result as JSON
        return jsonify(results)

    except Exception as e:
        # Print the full traceback to terminal
        print("An error occurred during evaluation:")
        traceback.print_exc()

        # Return error message as JSON response
        return jsonify({
            "error": "Something went wrong during evaluation",
            "details": str(e)
        }), 500
