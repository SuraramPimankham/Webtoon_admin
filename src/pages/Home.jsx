import React from 'react'
import './css/Home.css';

function Home() {
  return (
    <div className="home-container">
    <h2>รายละเอียด</h2>
    <p>นี่เป็น project เกี่ยวกับการจัดการการ์ตูนบนเว็บไชต์</p>
    <p>เชื่อมต่อกับ Firebase เพื่อเก็บข้อมูลโดยใช้ React ในการเขียน</p>
    <p>โดยสามารถดูรายละเอียด เพิ่ม ลบ แก้ไข ข้อมูลต่างๆ ของการ์ตูนได้</p>
    </div>
  )
}

export default Home