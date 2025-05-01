import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const key = "1b90d7c5fe150073bcfd916338aaa4b1"; // TMDB API key

const MovieDetails = () => {
  const { movieId } = useParams(); // Extract movieId from URL
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null); // State to hold the trailer key

  // Fetch movie details and recommendations
  useEffect(() => {
    const fetchMovieDetails = async () => {
      console.log("Fetching movie details...");
      try {
        const movieResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${key}`
        );
        setMovie(movieResponse.data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    const fetchRecommendations = async () => {
      console.log("Fetching recommendations...");
      try {
        const recommendationsResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${key}`
        );
        setRecommendations(recommendationsResponse.data.results);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    const fetchTrailer = async () => {
      console.log("Fetching trailer...");
      try {
        const trailerResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${key}`
        );
        const trailer = trailerResponse.data.results.find(
          (video) => video.site === "YouTube" && video.type === "Trailer"
        );
        if (trailer) {
          setTrailerKey(trailer.key);
        }
      } catch (error) {
        console.error("Error fetching trailer:", error);
      }
    };

    // Reset recommendations when movieId changes
    setRecommendations([]); // Clear previous recommendations on movieId change

    fetchMovieDetails();
    fetchRecommendations();
    fetchTrailer();
  }, [movieId]); // Ensures that the effect runs every time the movieId changes

  if (!movie) return <p>Loading...</p>;

  // Function to handle trailer button click (navigate to trailer page)
  const handleTrailerClick = () => {
    if (trailerKey) {
      // Navigate to the trailer on YouTube
      window.open(`https://www.youtube.com/watch?v=${trailerKey}`, "_blank");
    }
  };

  return (
    <div className="movie-details-container p-4 ">
      {/* Movie Details */}
      <div className="flex flex-col md:flex-row">
        <img
          src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
          alt={movie.title}
          className="w-full md:w-1/3 h-auto rounded-lg object-cover"
        />
        <div className="md:ml-6 flex flex-col justify-center">
          <h2 className="text-3xl font-bold break-words text-white">{movie.title}</h2>
          <p className="text-sm text-gray-300 mt-2">{movie.overview}</p>
          <p className="mt-2 text-md text-gray-400">
            ⭐ {movie.vote_average} | 🎭 {movie.genres?.map((genre) => genre.name).join(", ")}
          </p>

          {/* Trailer Button */}
          <div className="my-4">
            <button
              onClick={handleTrailerClick}
              className="text-black bg-white border-gray px-4 py-2 rounded-md"
            >
              Watch Trailer
            </button>
          </div>
        </div>
      </div>

      {/* Recommended Movies */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-white">Recommended Movies</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          {recommendations.length === 0 ? (
            <p>No recommendations found.</p>
          ) : (
            recommendations.map((rec) => (
              <div key={rec.id} className="text-center">
                <a href={`/movie/${rec.id}`}> {/* Link to Movie Details */}
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${rec.poster_path}`}
                    alt={rec.title}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <p className="text-xs mt-2 break-words text-wrap text-white">{rec.title}</p>
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
