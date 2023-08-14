import React from 'react';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import AddStory from './pages/AddStory'; // นำเข้าหน้า AddStory
import './navbar.css';

function App() {
  return (
    <BrowserRouter>
        <nav className="topnav" id="myTopnav">
          <Link to="/" className="active">Home</Link>
          <Link to="/add-story">AddStory</Link>
        </nav>
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-story" element={<AddStory />} />
          </Routes>
        </div>
    </BrowserRouter>
  );
}

export default App;
