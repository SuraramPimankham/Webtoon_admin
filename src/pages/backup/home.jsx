import React from 'react';
import './css/Home.css';

function Home() {
  const isLoggedIn = localStorage.getItem('loggedInUsername');

  return (
    <div className="home-container">
      {isLoggedIn ? (
        <>
        
          {/* <div className="row-home-1">
            <div className="col-md-6-home">
              <div className="container-home">
                <h2>Dashboard</h2>
              </div>
            </div>
            </div>
            <div className="row-home-2">
              <div className="colunm-home-2">
                <div className="container-home">
                <h2>ยอดนิยม 3 อันดับแรก</h2>
                </div>
              </div>
              <div className="colunm-home-2">
                <div className="container-home">
                <h2>ทำเงินสูงสุด 3 อันดับแรก</h2>
                </div>
              </div>
          </div>
          <div className="row-home-3">
            <div className="col-md-6-home">
            <div className="container-home">
                <h2>Dashboard</h2>
              </div>
            </div>
          </div> */}
        </>
      ) : (
        <>
          <h2>รายละเอียด</h2>
          <p>นี่เป็น project เกี่ยวกับการจัดการการ์ตูนบนเว็บไชต์</p>
          <p>เชื่อมต่อกับ Firebase เพื่อเก็บข้อมูลโดยใช้ React ในการเขียน</p>
          <p>โดยสามารถดูรายละเอียด เพิ่ม ลบ แก้ไข ข้อมูลต่างๆ ของการ์ตูนได้</p>
        </>
      )}
    </div>
  );
}

export default Home;
