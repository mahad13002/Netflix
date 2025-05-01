import React from "react";
import { useLocation, Link } from "react-router-dom"; // Import both useLocation and Link

const SearchPage = () => {
  const { state } = useLocation(); // Use the useLocation hook to get the state
  const searchResults = state?.results || [];

  return (
    <div className="search-results-container p-4">
      <h2 className="text-3xl font-bold mb-4">Search Results</h2>
      <div className="grid grid-cols-3 gap-4">
        {searchResults.length === 0 ? (
          <p>No movies found for your search.</p>
        ) : (
          searchResults.map((movie) => (
            <div key={movie.id} className="movie-card">
              <Link to={`/movie/${movie.id}`}> {/* Link to Movie Details */}
                <img
                  src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-72 object-cover rounded"
                />
                <p className="text-center text-white mt-2">{movie.title}</p>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchPage;
