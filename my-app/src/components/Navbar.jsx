import React from "react";
import SearchBar from "./SearchBar"; 
import { Link } from "react-router-dom"; 

const Navbar = () => {
  return (
    <div className="navbar-container absolute top-0 left-0 w-full z-50 p-4 bg-black/70 flex justify-between items-center">
      <Link to="/" className="text-red-600 text-4xl font-bold cursor-pointer">NETCOOK</Link>
      
      {/* Search Bar */}
      <div className="search-bar-container absolute top-4 right-0 flex justify-end">
        <SearchBar />
      </div>
    </div>
  );
};

export default Navbar;
