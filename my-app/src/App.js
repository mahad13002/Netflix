import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SearchPage from "./components/SearchPage";
import MovieDetails from "./components/MovieDetails";

function App() {
  return (
    <>
    <Navbar />
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/search' element={<SearchPage />} />
      <Route path="/movie/:movieId" element={<MovieDetails />} />
    </Routes>
    </>
  );
}

export default App;
