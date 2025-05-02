from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
from evaluation.routes import evaluation_routes

app = Flask(__name__)
CORS(app)
app.register_blueprint(evaluation_routes)

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

if __name__ == '__main__':
    app.run(debug=True)
