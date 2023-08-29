import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import AddStory from './pages/AddStory';
import StoryDetail from './pages/StoryDetail';
import './navbar.css';

function App() {
  const links = [
    { to: '/', label: 'Home' },
    { to: '/add-story', label: 'Story' }
  ];

  const currentPath = window.location.pathname;
  const isPathFound = links.some(link => link.to === currentPath);
  const [activeLink, setActiveLink] = useState(isPathFound ? currentPath : links[links.length - 1].to);

  return (
    <BrowserRouter>
      <nav className="topnav" id="myTopnav">
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={activeLink === link.to ? 'active' : ''}
            onClick={() => setActiveLink(link.to)}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-story" element={<AddStory />} />
          <Route path="/story/:id" element={<StoryDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
