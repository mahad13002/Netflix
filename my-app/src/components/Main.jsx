import React, { useState, useEffect } from "react";
import axios from "axios";
import requests from "../Requests";

const key = "1b90d7c5fe150073bcfd916338aaa4b1"; // TMDB API key

const Main = () => {
  const [movies, setMovies] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null); // State to hold the trailer key
  const [movie, setMovie] = useState(null); // State to hold the randomly selected movie

  // Fetch popular movies
  useEffect(() => {
    axios.get(requests.requestPopular).then((response) => {
      setMovies(response.data.results);
    });
  }, []);

  // Fetch the trailer when the movie changes
  useEffect(() => {
    if (movie) {
      const fetchTrailer = async () => {
        console.log("Fetching trailer...");
        try {
          const trailerResponse = await axios.get(
            `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${key}`
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

      fetchTrailer();
    }
  }, [movie]); // Runs when `movie` changes

  // Select a random movie from the list of fetched movies
  useEffect(() => {
    if (movies.length > 0) {
      const randomMovie = movies[Math.floor(Math.random() * movies.length)];
      setMovie(randomMovie);
    }
  }, [movies]);

  const truncateString = (str, num) => {
    if (str?.length > num) {
      return str.slice(0, num) + "...";
    } else {
      return str;
    }
  };

  // Function to handle trailer button click (navigate to trailer page)
  const handleTrailerClick = () => {
    if (trailerKey) {
      // Navigate to the trailer on YouTube
      window.open(`https://www.youtube.com/watch?v=${trailerKey}`, "_blank");
    }
  };

  return (
    <div className="w-full h-[550px] text-white">
      {movie && (
        <div className="w-full h-full">
          <div className="absolute w-full h-[550px] bg-gradient-to-r from-black"></div>
          <img
            className="w-full h-full object-cover"
            src={`https://image.tmdb.org/t/p/original/${movie?.backdrop_path}`}
            alt={movie?.title}
          />
          <div className="absolute w-full top-[20%] p-4 md:p-8">
            <h1 className="text-3xl md:text-5xl font-bold">{movie?.title}</h1>
            <div className="my-4">
              <button
                onClick={handleTrailerClick}
                className="text-black bg-white border-gray-300 px-4 py-2 rounded-md"
              >
                Watch Trailer
              </button>
            </div>
            <p className="text-gray-400 text-sm">Released: {movie?.release_date}</p>
            <p className="w-full md:max-w-[70%] lg:max-w-[50%] xl:max-w-[35%] text-gray-200">
              {truncateString(movie?.overview, 150)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
