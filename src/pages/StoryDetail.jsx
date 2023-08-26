import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject, uploadBytes } from 'firebase/storage';

import Modal from 'react-modal';

import { db } from '../firebase';
import { storage } from '../firebase';

Modal.setAppElement('#root');

function StoryDetail() {
  const { id } = useParams();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [imageName, setImageName] = useState('');
  const [imageNameNew, setImageNameNew] = useState('');
  const [author, setAuthor] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const inputRef = useRef(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);

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
        setImageNameNew(storyData.image_name);
        setAuthor(storyData.author);
        setImageUrl(storyData.imageUrl);
      }
    };

    fetchStoryData();
  }, [id]);

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
  
    if (selectedFile) {
      setImageUrl(URL.createObjectURL(selectedFile));
      setSelectedFile(selectedFile);
      setImageNameNew(selectedFile.name);
    }
  };
  
  const handleSave = async () => {
    try {
      const storyDocRef = doc(db, 'storys', id);
  
      // ลบรูปเก่าจาก Storage ก่อน (ถ้ามีการเปลี่ยน imageName)
      if (imageName !== imageNameNew) {
        const oldStorageRef = ref(storage, 'img_storys/' + imageName);
        await deleteObject(oldStorageRef);
      }
  
      // อัปโหลดรูปใหม่ (ถ้ามีการเลือกรูปใหม่)
      if (selectedFile) {
        const newStorageRef = ref(storage, 'img_storys/' + imageNameNew);
        await uploadBytes(newStorageRef, selectedFile);
      } else {
        // ใช้ imageUrl เดิมเพื่ออัปเดตชื่อรูปใน Firestore
        const newStorageRef = ref(storage, 'img_storys/' + imageUrl.split('/').pop());
        await deleteObject(newStorageRef);
        await uploadBytes(newStorageRef, selectedFile);
      }
  
      // บันทึกข้อมูลใหม่
      await updateDoc(storyDocRef, {
        title: title,
        category: category,
        description: description,
        image_name: imageNameNew,
        author: author,
        imageUrl: selectedFile ? imageUrl : imageUrl
      });
  
      console.log('Data and image updated successfully.');
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
    openDeleteModal();
  };

  const confirmDelete = async () => {
    try {
      const storyDocRef = doc(db, 'storys', id);
      await deleteDoc(storyDocRef);
  
      console.log('Data and image deleted successfully.');
      window.location.href = '/add-story';
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };
  
  return (
    <div className="container center">
      <div className="row">
        <div className="double-column data1">
        <div className="file-input-container" onClick={() => inputRef.current.click()}>
          {selectedFile ? (
            <img src={URL.createObjectURL(selectedFile)} alt="Selected" />
          ) : imageUrl ? (
            <img src={imageUrl} alt="Previous" />
          ) : (
            <p className="file-input-text">Click to select image.</p>
          )}
        </div>
          <input
            type="file"
            style={{ display: 'none' }}
            onChange={handleImageChange}
            ref={inputRef}
          />
        </div>

        <div className="double-column">
          <div className="input-row">
            <label className="input-label">ชื่อเรื่อง:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <label className="input-label">ผู้แต่ง:</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          <div className="input-row">
            <label className="input-label">หมวดหมู่:</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <label className="input-label">คำอธิบาย:</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="input-row">
            <label className="input-label">ชื่อรูปภาพ:</label>
            <input
              type="text"
              value={imageNameNew}
              onChange={(e) => setImageNameNew(e.target.value)}
            />
          </div>
          <div className="button-row">
            <button className="save-button" onClick={handleSave}>
              บันทึก
            </button>
            <button className="delete-button" onClick={handleDelete}>
              ลบ
            </button>
          </div>
        </div>

        <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Delete Modal"
        className="react-modal"
        >
          <h2 style={{ color: 'black'}}>ยืนยันการลบ</h2>
          <p style={{ color: 'black'}}>คุณแน่ใจหรือไม่ที่จะลบเรื่องนี้?</p>
          <button className="delete" onClick={confirmDelete}>
            ลบ
          </button>
          <button className="cancel" onClick={closeDeleteModal}>
            ยกเลิก
          </button>
        </Modal>

      </div>

      <div className="divider"></div>

        <div className="row grid-container">
            <div className="grid-container">
                <div className="grid-item"><h1>+</h1></div>
            </div>
        </div>

    </div>
  );
}

export default StoryDetail;
