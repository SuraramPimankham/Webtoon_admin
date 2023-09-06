import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import AddStory from './pages/AddStory';
import StoryDetail from './pages/StoryDetail';
import LoginModal from './components/LoginModal';
import './navbar.css';
import { db } from './firebase'; // นำเข้าเพื่อใช้งาน Firestore

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loggedInUsername, setLoggedInUsername] = useState('');
  const [isOpenDropdown, setIsOpenDropdown] = useState(false); // เพิ่มสถานะ isOpenDropdown

  

  const links = [
    { to: '/', label: 'Home' },
    { to: '/add-story', label: 'Story' }
  ];

  const currentPath = window.location.pathname;
  const isPathFound = links.some(link => link.to === currentPath);
  const [activeLink, setActiveLink] = useState(isPathFound ? currentPath : links[links.length - 1].to);
  
  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = (username) => {
    setLoggedInUsername(username);
    setIsLoginModalOpen(false);

    // บันทึกข้อมูลการเข้าสู่ระบบใน Local Storage
    localStorage.setItem('loggedInUsername', username);
  };

  const handleDropdownClick = () => {
    setIsOpenDropdown(!isOpenDropdown);
  };

  const handleLogoutClick = () => {
    // ดำเนินการออกจากระบบ (ลบบันทึกการเข้าสู่ระบบ)
    // และเรียกใช้ onLoginSuccess เพื่อเคลียร์สถานะการเข้าสู่ระบบ
    setLoggedInUsername('');
    setIsOpenDropdown(false);
  };

  return (
    <BrowserRouter>
      <nav className="topnav" id="myTopnav">
        <div className="left-links">
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
        </div>
        <div className="right-links">
          <div className="login-button">
            {loggedInUsername ? (
                <Link to="#" onClick={handleDropdownClick}>
                  {loggedInUsername}
                </Link>
            ) : (
              <Link to="#" onClick={handleLoginClick}>
                Login
              </Link>
            )}
              {isOpenDropdown && (
              <div className="dropdown">
                <a href="#" onClick={handleLogoutClick}>Logout</a>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-story" element={<AddStory />} />
          <Route path="/story/:id" element={<StoryDetail />} />
        </Routes>
      </div>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess} // รับค่า onLoginSuccess
      />
    </BrowserRouter>
  );
}

export default App;
