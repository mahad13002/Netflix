from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import random
from sklearn.metrics import precision_score, recall_score, f1_score

app = Flask(__name__)
CORS(app)

# Load the movie dataset with necessary columns including keywords
movies_df = pd.read_csv("tmdb_movies_cleaned.csv", usecols=['id', 'title', 'genres', 'keywords', 'poster_path', 'popularity', 'vote_average'])

# Ensure genres and keywords are not NaN
movies_df['genres'] = movies_df['genres'].fillna('')
movies_df['keywords'] = movies_df['keywords'].fillna('')

# Function to get genre-based and keyword-based recommendations enhanced with popularity & rating
def get_recommendations(movie_id, num_recommendations=12):
    print(f"Received movie_id: {repr(movie_id)}")  

    try:
        movie_id = int(str(movie_id).strip())  
    except ValueError:
        print(f"Invalid movie_id format: {movie_id}")
        return []

    movie_row = movies_df[movies_df['id'] == movie_id]
    if movie_row.empty:
        print(f"Movie ID {movie_id} not found in dataset.")
        return []

    # Extract the genres and keywords of the selected movie
    selected_genres = set(movie_row.iloc[0]['genres'].split('|'))
    selected_keywords = set(movie_row.iloc[0]['keywords'].split('|'))

    # Function to calculate genre and keyword similarity
    def calculate_similarity(genres, keywords):
        genres_list = set(genres.split('|'))
        keywords_list = set(keywords.split('|'))

        matched_genres = len(selected_genres & genres_list)
        matched_keywords = len(selected_keywords & keywords_list)

        # Combine genre and keyword similarity (weighted or simple sum)
        return (matched_genres + matched_keywords) / (len(selected_genres) + len(selected_keywords)) if (selected_genres and selected_keywords) else 0

    # Compute similarity scores
    movies_df["similarity"] = movies_df.apply(lambda row: calculate_similarity(row["genres"], row["keywords"]), axis=1)

    # Sort by similarity, then popularity, then rating
    recommended_movies = (
        movies_df[movies_df["id"] != movie_id]
        .sort_values(by=["similarity", "popularity", "vote_average"], ascending=[False, False, False])
        .head(num_recommendations)
        [["id", "title", "genres", "keywords", "poster_path", "popularity", "vote_average"]]
    )

    # Convert `id` to Python `int` for JSON serialization
    recommendations = recommended_movies.to_dict(orient="records")
    for movie in recommendations:
        movie["id"] = int(movie["id"])  

    return recommendations

# Function to compute F1 Score for recommendations
def compute_f1_score(movie_id):
    recommendations = get_recommendations(movie_id)

    # Get ground truth similar movies based on genre and keywords
    movie_row = movies_df[movies_df['id'] == movie_id]
    if movie_row.empty:
        return None

    true_genres = set(movie_row.iloc[0]['genres'].split('|'))
    true_keywords = set(movie_row.iloc[0]['keywords'].split('|'))

    # True movies = Movies that share at least 1 genre or keyword with the selected movie
    true_movies = movies_df[movies_df['genres'].apply(lambda g: len(set(g.split('|')) & true_genres) > 0) | 
                            movies_df['keywords'].apply(lambda k: len(set(k.split('|')) & true_keywords) > 0)]["id"].tolist()

    # Convert to binary format for Precision/Recall/F1 calculation
    true_labels = [1 if movie["id"] in true_movies else 0 for movie in recommendations]
    predicted_labels = [1] * len(recommendations)  # Every recommended movie is considered a prediction

    if sum(true_labels) == 0:
        return {"precision": 0, "recall": 0, "f1_score": 0}

    precision = precision_score(true_labels, predicted_labels, zero_division=1)
    recall = recall_score(true_labels, predicted_labels, zero_division=1)
    f1 = f1_score(true_labels, predicted_labels, zero_division=1)

    return {
        "precision": precision,
        "recall": recall,
        "f1_score": f1,
        "recommended_movies": recommendations
    }

# **API for Movie Recommendations**
@app.route('/recommend', methods=['GET'])
def recommend():
    movie_id = request.args.get("movie_id", type=int)
    if not movie_id:
        return jsonify({"error": "Movie ID is required"}), 400
    
    if movie_id not in movies_df['id'].values:
        return jsonify({
            "recommendations": [],
            "message": "Movie not supported in the backend."
        }), 200

    recommendations = get_recommendations(movie_id)
    return jsonify({"recommendations": recommendations})

# **API for F1 Score Evaluation**
@app.route('/evaluate', methods=['GET'])
def evaluate():
    movie_id = request.args.get("movie_id", type=int)
    if not movie_id:
        return jsonify({"error": "Movie ID is required"}), 400

    evaluation = compute_f1_score(movie_id)
    if evaluation is None:
        return jsonify({"error": "Movie not found in dataset"}), 404

    return jsonify(evaluation)

if __name__ == '__main__':
    app.run(debug=True)
