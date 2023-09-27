import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { sha3_512 } from 'js-sha3'; // นำเข้าเมื่อต้องการใช้งาน SHA-3
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

import './css/LoginModal.css';

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
  
    // ฟังก์ชันสำหรับรีเซตค่า username และ password
    const resetForm = () => {
      setUsername('');
      setPassword('');
    };
  
    if (!isOpen) return null;
  
    const handleLogin = async () => {
      const hashedPassword = sha3_512(password); // ใช้ฟังก์ชัน sha3_512 ในการแปลงรหัสผ่าน
      console.log(username+"\n"+hashedPassword);
    
      try {
        const adminQuery = query(collection(db, 'admins'), where('username', '==', username));
        const adminQuerySnapshot = await getDocs(adminQuery);
    
        if (!adminQuerySnapshot.empty) {
          const adminData = adminQuerySnapshot.docs[0].data();
          if (adminData.password === hashedPassword) {
            console.log('Logged in as:', username);
            resetForm();
            onLoginSuccess(username); // เรียกใช้งานฟังก์ชัน onLoginSuccess และส่งชื่อผู้ใช้
            onClose();
          } else {
            console.log('Invalid password');
            resetForm(); // รีเซตค่า username และ password เมื่อเกิดข้อผิดพลาด
          }
        } else {
          console.log('User not found');
          resetForm(); // รีเซตค่า username และ password เมื่อเกิดข้อผิดพลาด
        }
      } catch (error) {
        console.error('Error logging in:', error);
        resetForm(); // รีเซตค่า username และ password เมื่อเกิดข้อผิดพลาด
      }
    };
  
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Login</h2>
          <div className="input-login">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-login">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="button-container">
            <button className="confirm-button" onClick={handleLogin}>
              Login
            </button>
            <button className="close-button" onClick={() => { onClose(); resetForm(); }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  LoginModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onLoginSuccess: PropTypes.func.isRequired,
  };

export default LoginModal;