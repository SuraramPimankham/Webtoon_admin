import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import AddStory from './pages/Story';
import StoryDetail from './pages/StoryDetail';
import Error from './pages/Error';
import LoginModal from './components/loginModal';
import './navbar.css';
import { db } from './firebase';

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  // ตรวจสอบการเข้าสู่ระบบจาก Local Storage เมื่อโหลดหน้าเว็บใหม่
  const initialLoggedInUsername = localStorage.getItem('loggedInUsername') || '';
  const [loggedInUsername, setLoggedInUsername] = useState(initialLoggedInUsername);

  const [isOpenDropdown, setIsOpenDropdown] = useState(false); // เพิ่มสถานะ isOpenDropdown

  const links = [
    { to: '/', label: 'Home' },
    { to: '/story', label: 'Story' },
    { to: '/error'}
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
  // ล้างข้อมูลการเข้าสู่ระบบออกจาก Local Storage
  localStorage.removeItem('loggedInUsername');
  
  // ดำเนินการออกจากระบบ (ลบบันทึกการเข้าสู่ระบบ)
  // และเรียกใช้ onLoginSuccess เพื่อเคลียร์สถานะการเข้าสู่ระบบ
  setLoggedInUsername('');
  setIsOpenDropdown(false);

  // เปลี่ยนเส้นทางไปยังหน้าหลัก
  setActiveLink('/');
  };

  return (
    <BrowserRouter>
      <nav className="topnav" id="myTopnav">
        <div className="left-links">
          <Link
            to="/"
            className={activeLink === '/' ? 'active' : ''}
            onClick={() => setActiveLink('/')}
          >
            Home
          </Link>
          {loggedInUsername && (
            <Link
              to="/story"
              className={activeLink === '/story' || currentPath.startsWith('/story/') ? 'active' : ''}
              onClick={() => setActiveLink('/story')}
            >
              Story
            </Link>
          )}
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
                <Link to="/" onClick={handleLogoutClick}>
                  Logout
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
  
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          {loggedInUsername ? (
            <Route path="/story" element={<AddStory />} />
            ) : (
              <Route path="/story" element={<Navigate to="/error" />} />
            )}
            {loggedInUsername ? (
              <Route path="/story/:id" element={<StoryDetail />} />
            ) : (
              <Route path="/story/:id" element={<Navigate to="/error" />} />
            )}
          <Route path="/error" element={<Error />} />
        </Routes>
      </div>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </BrowserRouter>
  );
  
}

export default App;
