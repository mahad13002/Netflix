import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const key = "1b90d7c5fe150073bcfd916338aaa4b1"; // API key for TMDB

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState(""); // State to track the search query
  const navigate = useNavigate(); // Get the navigate function from react-router

  // Handle search query changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Fetch movies based on search query
  const handleSearch = async () => {
    if (searchQuery === "") {
      return; // Do nothing if the search query is empty
    }

    try {
      // Fetch search results from the API
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${searchQuery}`
      );

      // Navigate to the search page and pass the results via state
      navigate("/search", { state: { results: response.data.results } });
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  // Handle Enter key press to trigger search
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(); // Trigger the search when Enter is pressed
    }
  };

  return (
    <div className="search-bar flex items-center">
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange} // Update query when the input changes
        onKeyDown={handleKeyDown} // Call handleSearch when Enter is pressed
        placeholder="Search for movies..."
        className="search-input p-2 rounded-l-md bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
      />
      <button
        onClick={handleSearch} // Trigger the search on button click
        className="search-button bg-black-600 text-red-600 p-2 rounded-r-md"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
