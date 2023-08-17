import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import Modal from 'react-modal'; // นำเข้า react-modal

import { db } from '../firebase';

// กำหนด App Element ที่ใช้คือ root element ของแอพพลิเคชัน
Modal.setAppElement('#root'); // อาจต้องเปลี่ยนเป็นเลือก App Element ที่ถูกต้องในแอพพลิเคชันของคุณ

function StoryDetail() {
  const { id } = useParams();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [imageName, setImageName] = useState('');
  const [author, setAuthor] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // เพิ่ม state สำหรับการเปิด/ปิด modal

  useEffect(() => {
    const fetchStoryData = async () => {
      const storyDocRef = doc(db, 'storys', id);
      const storyDocSnap = await getDoc(storyDocRef);
      if (storyDocSnap.exists()) {
        const storyData = storyDocSnap.data();
        setTitle(storyData.title);
        setCategory(storyData.category);
        setDescription(storyData.description);
        setImageName(storyData.image_name);
        setAuthor(storyData.author);
        setImageUrl(storyData.imageUrl);
      }
    };

    fetchStoryData();
  }, [id]);

  const handleSave = async () => {
    try {
      const storyDocRef = doc(db, 'storys', id);
      await updateDoc(storyDocRef, {
        title: title,
        category: category,
        description: description,
        image_name: imageName,
        author: author
      });
      console.log('Data updated successfully.');
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    // เปิด modal ในขั้นตอนแรก
    openDeleteModal();
  };

  const confirmDelete = async () => {
    try {
      const storyDocRef = doc(db, 'storys', id);
      await deleteDoc(storyDocRef);
      console.log('Data deleted successfully.');
      window.location.href = '/add-story'; // เปลี่ยนหน้าไปยัง '/add-story' หลังจากลบเสร็จ
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };  

  return (
    <div className="container center">
      <div className="row">
        <div className="double-column data1">
          <img src={imageUrl} alt="Selected" />
        </div>
        <div className="double-column">
          <div className="input-row">
            <label className="input-label">Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="input-row">
            <label className="input-label">Category:</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <label className="input-label">Description:</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="input-row">
            <label className="input-label">Image Name:</label>
            <input
              type="text"
              value={imageName}
              onChange={(e) => setImageName(e.target.value)}
            />
            <label className="input-label">Author:</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          <div className="button-row">
            <button className="save-button" onClick={handleSave}>
              Save
            </button>
            <button className="delete-button" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>

        {/* สร้าง Modal เพื่อยืนยันการลบ */}
        <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Delete Modal"
        className="react-modal" // กำหนดคลาส CSS สำหรับ modal
        >
          <h2 style={{ color: 'black'}}>Confirm Deletion</h2>
          <p style={{ color: 'black'}}>Are you sure you want to delete this story?</p>
          <button className="delete" onClick={confirmDelete}>
            Delete
          </button>
          <button className="cancel" onClick={closeDeleteModal}>
            Cancel
          </button>
        </Modal>

      </div>

      <div className="divider"></div>

        <div className="row grid-container">
            {/* ใช้ CSS Grid ในการแสดงข้อมูลในกรอบเดียวกัน */}
            <div className="grid-container">
                <div className="grid-item"></div>
            </div>
        </div>

    </div>
  );
}

export default StoryDetail;
