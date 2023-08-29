import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { ref, getDownloadURL, deleteObject } from 'firebase/storage';

import Modal from 'react-modal';

import { db, storage } from '../firebase';

Modal.setAppElement('#root');

function StoryDetail() {
  const { id } = useParams(); // รับ id ที่ส่งมาจาก URL

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileId, setFileId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [categories, setCategories] = useState([]); // State เพื่อเก็บข้อมูล categories
  const [day, setDay] = useState('');

  const [storyData, setStoryData] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchStoryData = async () => {
      try {
        const docRef = doc(db, 'storys', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setStoryData(data);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching story data:', error);
      }
    };

    fetchStoryData();
  }, [id]);

  const handleDelete = async () => {
    try {
      // Delete data from Firestore
      await deleteDoc(doc(db, 'storys', id));

      // Delete image from Storage
      const storageRef = ref(storage, `img_storys/${storyData.title}`);
      await deleteObject(storageRef);

      console.log('Story deleted successfully.');
      // Redirect or update UI accordingly
    } catch (error) {
      console.error('Error deleting story:', error);
    }
  };

  return (
    
    <div className="container center">
      {storyData ? (
        <div className="row">
          <div className="double-column data1">
            <img src={storyData.imageUrl} alt={storyData.title} />
          </div>
          <div className="double-column">
            <div className="input-row">
              <label htmlFor="fileId" className="label">ID</label>
              <input
                type="text"
                value={fileId || storyData.id} // ใช้ fileId ถ้ามีค่า ถ้าไม่ใช้ storyData.id จาก Firebase
                onChange={(e) => setFileId(e.target.value)}
              />
            </div>
            <div className="input-row">
              <label htmlFor="title" className="label">Title</label>
                <input
                  type="text"
                  value={title || storyData.title} // ใช้ title ถ้ามีค่า ถ้าไม่ใช้ storyData.title จาก Firebase
                  onChange={(e) => setTitle(e.target.value)}
                />
              <label htmlFor="author" className="label">Author</label>
              <input
                type="text"
                value={author || storyData.author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
            <div className="input-row">
              <label htmlFor="dropdown" className="label">Day</label>
              <select
                id="dropdown"
                name="dropdown"
                className="custom-dropdown"
                value={day || storyData.day}
                onChange={(e) => setDay(e.target.value)}
              >
                <option value=""></option>
                <option value="sunday">Sunday</option>
                <option value="monday">Monday</option>
                <option value="tuesday">Tuesday</option>
                <option value="wednesday">Wednesday</option>
                <option value="thursday">Thursday</option>
                <option value="friday">Friday</option>
                <option value="saturday">Saturday</option>
              </select>
              <label className="label">Category</label>
            </div>
            <div className="input-row">
              <label htmlFor="description" className="label">Description</label>
              <p>{storyData.description}</p>
            </div>
            <div className="input-row">
              <button onClick={() => setModalIsOpen(true)}>Delete Story</button>
              <button onClick={() => setModalIsOpen(true)}>Delete Story</button>
            </div>

            <Modal
              isOpen={modalIsOpen}
              onRequestClose={() => setModalIsOpen(false)}
              contentLabel="Delete Confirmation"
            >
              <div>
                <p>Are you sure you want to delete this story?</p>
                <button onClick={handleDelete}>Delete</button>
                <button onClick={() => setModalIsOpen(false)}>Cancel</button>
              </div>
            </Modal>
          </div>
        </div>
      ) : (
        <p>Loading story data...</p>
      )}
    </div>
  );
}

export default StoryDetail;
