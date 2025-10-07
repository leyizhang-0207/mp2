import { Routes, Route, Link, Navigate } from "react-router-dom";
import ListView from "./pages/ListView";
import GalleryView from "./pages/GalleryView";
import DetailView from "./pages/DetailView";
import "./App.css";

export default function App() {
  return (
    <>
      <header className="navbar">
        <div className="logo">Pokémon</div>
        <nav className="nav-links">
          <Link to="/">List</Link>
          <Link to="/gallery">Gallery</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<ListView />} />
          <Route path="/gallery" element={<GalleryView />} />
          <Route path="/pokemon/:idOrName" element={<DetailView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
