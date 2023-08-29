import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import Modal from 'react-modal';
import { db, storage } from '../firebase';

Modal.setAppElement('#root');

function StoryDetail() {
  const { id } = useParams();
  const inputRef = useRef(null);

  const [storyData, setStoryData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileId, setFileId] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [day, setDay] = useState('');
  const [description, setDescription] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchStoryData = async () => {
      try {
        const docRef = doc(db, 'storys', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setStoryData(data);
          setCategories(data.categories || []);
          setFileId(data.id || '');
          setTitle(data.title || '');
          setAuthor(data.author || '');
          setDay(data.day || '');
          setDescription(data.description || '');
          
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching story data:', error);
      }
    };

    fetchStoryData();
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'storys', id));
      const storageRef = ref(storage, `img_storys/${storyData.title}`);
      await deleteObject(storageRef);

      console.log('Story deleted successfully.');
      // Redirect or update UI accordingly
    } catch (error) {
      console.error('Error deleting story:', error);
    }
  };

  const handleCategoryChange = (selectedCategory) => {
    if (categories.includes(selectedCategory)) {
      setCategories(categories.filter(category => category !== selectedCategory));
    } else {
      setCategories([...categories, selectedCategory]);
    }
  };

  const handleSave = async () => {
    const updatedData = {
      id: fileId,
      title: title,
      author: author,
      day: day,
      description: description,
      categories: categories,
      imageUrl: storyData.imageUrl // ใช้ค่า imageUrl ที่มาจาก Firebase
    };

    try {
      await setDoc(doc(db, 'storys', id), updatedData);
      console.log('Data updated successfully.');
      // Redirect or update UI accordingly
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  return (
    
    <div className="container center">
      {storyData && Object.keys(storyData).length > 0 ? (
        <div className="row">
          <div className="double-column data1">
          <div className="file-input-container" onClick={() => inputRef.current.click()}>
            {selectedFile || storyData.imageUrl ? (
              <img src={selectedFile ? URL.createObjectURL(selectedFile) : storyData.imageUrl} alt="Selected" />
            ) : (
              <p className="file-input-text">Click to select Image</p>
            )}
          </div>
          <input
            type="file"
            ref={inputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          </div>
          <div className="double-column">
            <div className="input-row">
              <label htmlFor="fileId" className="label">ID</label>
              <input
                type="text"
                value={fileId || id} // ใช้ fileId ถ้ามีค่า ถ้าไม่ใช้ storyData.id จาก Firebase
                readOnly
                onChange={(e) => setFileId(e.target.value)}
              />
            </div>
            <div className="input-row">
              <label htmlFor="title" className="label">Title</label>
                <input
                  type="text"
                  value={title || title} // ใช้ title ถ้ามีค่า ถ้าไม่ใช้ storyData.title จาก Firebase
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
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={categories.includes("action")}
                  onChange={() => handleCategoryChange("action")}
                />{" "}
                Action
              </label>
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={categories.includes("comedy")}
                  onChange={() => handleCategoryChange("comedy")}
                />{" "}
                Comedy
              </label>
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={categories.includes("romance")}
                  onChange={() => handleCategoryChange("romance")}
                />{" "}
                Romance
              </label>
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={categories.includes("fantasy")}
                  onChange={() => handleCategoryChange("fantasy")}
                />{" "}
                Fantasy
              </label>
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={categories.includes("horror")}
                  onChange={() => handleCategoryChange("horror")}
                />{" "}
                Horror
              </label>
            {/* เพิ่ม category อื่น ๆ ตามที่คุณต้องการ */}
            </div>

            <div className="input-row">
              <label htmlFor="description" className="label">Description</label>
                <textarea
                  id="description"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div className="input-row">
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setModalIsOpen(true)}>Delete</button>
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
        <h2>...Loading story data...</h2>
      )}
        <div className="divider"></div>

        <div className="row grid-container">
        <div className="grid-container">
            <div className="grid-item-add">
              <h2>+</h2>
            </div>
            <div className="grid-item">
            </div>
            <div className="grid-item">
            </div>
            <div className="grid-item">
            </div>
            <div className="grid-item">
            </div>
            <div className="grid-item">
            </div>
            <div className="grid-item">
            </div>
            <div className="grid-item">
            </div>
            <div className="grid-item">
            </div>
            <div className="grid-item">
            </div>
            <div className="grid-item">
            </div>
        </div>
      </div>
    </div>
    
  );
}

export default StoryDetail;
