import React, { useState, useEffect } from "react";
import axios from "axios";

const Recommendations = ({ movieId }) => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (!movieId) return;

    axios
      .get(`http://127.0.0.1:5000/recommend?movie_id=${movieId}`)
      .then((response) => {
        setRecommendations(
          Array.isArray(response.data.recommendations)
            ? response.data.recommendations
            : []
        );
      })
      .catch((error) =>
        console.error("Error fetching recommendations:", error)
      );
  }, [movieId]);

  return (
    <div className="mt-4 p-4 bg-gray-800 rounded-lg overflow-hidden">
      <h2 className="text-lg font-bold text-white text-center">
        Recommended Movies
      </h2>
      <div className="flex gap-4 overflow-x-auto no-scrollbar">
      {Array.isArray(recommendations) && recommendations.length > 0 ? (
          recommendations.map((movie) => (
            <div key={movie.id} className="text-center w-32">
              <img
                className="w-full h-auto object-cover rounded-lg"
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                    : "/placeholder.jpg"
                }
                alt={movie.title}
              />
              <p className="text-sm mt-2 text-white text-center break-words leading-relaxed">
                {movie.title}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">No similar movies found.</p>
        )}
      </div>
    </div>
  );
};

export default Recommendations;
