import React, { useState, useRef } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { setDoc, doc } from 'firebase/firestore';
import { db, storage } from '../firebase';

import './css/AddEPModal.css'; // นำเข้าไฟล์ CSS

function AddEPModal({ isOpen, onRequestClose, id, title }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [ep, setEp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const inputRef = useRef(null);

  const handleFileChanges = (event) => {
    const files = event.target.files;
    const filesArray = Array.from(files);
    setSelectedFiles(filesArray);
  };

  const handleAdd = async () => {
      // ตรวจสอบว่า ep เป็นตัวเลขหรือไม่
      if (!/^\d+$/.test(ep)) {
        setErrorMessage('EP must be a number');
        return;
      }
    try {
      // บันทึกรูปทั้งหมดที่เลือกไปเก็บใน storage
      const storagePromises = selectedFiles.map(async (file, index) => {
        const storageRef = ref(storage, `${id}/ep${ep}/${index + 1}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
      });

      const imageURLs = await Promise.all(storagePromises);

      // สร้างข้อมูลที่ต้องบันทึกใน Firebase Database
      const newData = {
        id: id,
        ep: ep,
        images: imageURLs,
      };

      // บันทึกข้อมูลลงใน Firebase Database
      await setDoc(doc(db, id, `${title} EP ${ep}`), newData);

      console.log('New EP added successfully.');
      onRequestClose(); // ปิด Modal เมื่อเสร็จสิ้น
      window.location.href = `/story/${id}`;
    } catch (error) {
      console.error('Error adding new EP:', error);
    }
  };

  const handleModalClose = () => {
    onRequestClose();
    setSelectedFiles([]);
    setEp('');
    setErrorMessage(''); // เพิ่มบรรทัดนี้เพื่อลบ errorMessage
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleModalClose}
      contentLabel="Add New EP"
      className="custom-modal" // เพิ่มคลาสสำหรับปรับแต่งสไตล์ของ Modal
      overlayClassName="custom-overlay" // เพิ่มคลาสสำหรับปรับแต่งสไตล์ของ overlay
    >
      <div className="modal-content-ep">
        <h2>Add EP - {title}</h2>
        <div className="img-input-container-ep" onClick={() => inputRef.current.click()}>
          {selectedFiles.length > 0 ? (
            <p className="p-ep">{selectedFiles.length} Images selected</p>
          ) : (
            <p className="p-ep">Click to select file Images</p>
          )}
        </div>
        <input
          type="file"
          ref={inputRef}
          style={{ display: 'none' }}
          onChange={handleFileChanges}
          multiple // เพิ่ม attribute multiple เพื่ออนุญาตให้เลือกรูปหลายรูปพร้อมกัน
        />
        <div className="input-row-model">
          <label htmlFor="" className='label-ep'>EP</label>
          <input
            type="text"
            value={ep}
            onChange={(e) => setEp(e.target.value)}
            className='input-ep'
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="input-row-model">
          <button className="save-button" onClick={handleAdd}>Add</button>
          <button className="delete-button" onClick={handleModalClose}>Cancel</button>
        </div>
      </div>
    </Modal>
  );
}

AddEPModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  };

export default AddEPModal;
