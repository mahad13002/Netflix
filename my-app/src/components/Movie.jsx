import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import axios from "axios";

const Movie = ({ item }) => {
  const [like, setLike] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  const fetchRecommendations = async (movieId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/recommend?movie_id=${movieId}`
      );
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  return (
    <>
      {/* Movie Thumbnail */}
      <div
        className="w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] inline-block cursor-pointer relative p-2"
        onClick={() => {
          setShowDetails(true);
          fetchRecommendations(item.id);
        }}
      >
        <img
          className="w-full h-auto block"
          src={`https://image.tmdb.org/t/p/w500/${item.backdrop_path}`}
          alt={item.title}
        />

        {/* Hover Overlay */}
        <div className="absolute top-0 left-0 w-full h-full hover:bg-black/80 opacity-0 hover:opacity-100 text-white">
          <p className="whitespace-normal text-xs md:text-sm font-bold flex justify-center items-center h-full text-center break-words text-wrap">
            {item?.title}
          </p>
          <p>
            {like ? (
              <FaHeart
                className="absolute top-4 left-4 text-gray-300"
                onClick={() => setLike(!like)}
              />
            ) : (
              <FaRegHeart
                className="absolute top-4 left-4 text-gray-300"
                onClick={() => setLike(!like)}
              />
            )}
          </p>
        </div>
      </div>

      {/* Full-Screen Movie Preview on Click */}
      {showDetails && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/90 flex justify-center items-center z-50">
          {/* Content Box */}
          <div className="w-[80%] h-[80%] bg-gray-900 text-white p-6 rounded-lg relative overflow-hidden overflow-y-auto">
            {/* Close Button */}
            <button
              className="absolute top-4 right-6 text-3xl text-white cursor-pointer"
              onClick={() => setShowDetails(false)}
            >
              <MdClose />
            </button>

            {/* Movie Details */}
            <div className="flex flex-col md:flex-row">
              {/* Movie Poster */}
              <img
                className="w-full md:w-1/3 h-auto rounded-lg object-cover"
                src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
                alt={item.title}
              />

              {/* Movie Info */}
              <div className="md:ml-6 flex flex-col justify-center">
                <h2 className="text-3xl font-bold break-words text-wrap">{item.title}</h2>
                <p className="text-sm text-gray-300 mt-2 text-wrap">
                  {item.overview}
                </p>
                <p className="mt-2 text-md text-gray-400">
                  ⭐ {item.vote_average} | 🎭 {item.genres}
                </p>
              </div>
            </div>

            {/* Recommended Movies */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Recommended Movies</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                {recommendations.length > 0 ? (
                  recommendations.map((movie, index) => (
                    <div key={index} className="text-center">
                      <img
                        className="w-full h-40 object-cover rounded-lg"
                        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                        alt={movie.title}
                      />
                      <p className="text-xs mt-2 break-words text-wrap">{movie.title}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No similar movies found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Movie;
