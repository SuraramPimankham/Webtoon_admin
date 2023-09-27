import React, { useState, useRef, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getDocs, setDoc, doc, collection } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { Link } from 'react-router-dom';
import Modal from 'react-modal'; // นำเข้า Modal โดยไม่ใช้ curly braces
import AlertInputModal from '../components/AlertInputModal'; // นำเข้า AlertInputModal

import './css/Story.css';

Modal.setAppElement('#root');

function Story() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileId, setFileId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [categories, setCategories] = useState([]);
  const [day, setDay] = useState('');
  const [createdAt, setCreatedAt] = useState(new Date()); // เพิ่ม state สำหรับวันที่ลง
  const [updatedAt, setUpdatedAt] = useState(new Date()); // เพิ่ม state สำหรับวันที่อัพเดต

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const inputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    const missingFields = [];

    if (!selectedFile) missingFields.push("Image");
    if (!fileId) missingFields.push("ID");
    if (!title) missingFields.push("Title");
    if (categories.length === 0) missingFields.push("Category");
    if (!description) missingFields.push("Description");
    if (!author) missingFields.push("Author");
    if (!day) missingFields.push("Day");

    if (missingFields.length > 0) {
      setMissingFields(missingFields);
      setModalIsOpen(true);
      return;
    }

    const storageRef = ref(storage, `img_storys/${title}`);

    try {
      const snapshot = await uploadBytes(storageRef, selectedFile);
      const imageUrl = await getDownloadURL(snapshot.ref);

      await setDoc(doc(db, 'storys', fileId), {
        id: fileId,
        title: title,
        categories: categories,
        description: description,
        imageUrl: imageUrl,
        author: author,
        day: day,
        createdAt: createdAt, // เพิ่ม createdAt
        updatedAt: updatedAt, // เพิ่ม updatedAt
      });

      console.log('Data uploaded successfully. Document ID:', fileId);
      window.location.reload();
    } catch (error) {
      console.error('Error uploading data:', error);
    }
  };

  const fetchStories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'storys'));
      const storiesData = querySnapshot.docs.map((doc) => doc.data());
      setStories(storiesData);
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  const [stories, setStories] = useState([]);

  const handleCategoryChange = (selectedCategory) => {
    if (categories.includes(selectedCategory)) {
      setCategories(categories.filter(category => category !== selectedCategory));
    } else {
      setCategories([...categories, selectedCategory]);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);
  
    return (
      <div className="container center">
        <div className="row">
          <div className="double-column data1">
            <div className="file-input-container" onClick={() => inputRef.current.click()}>
              {selectedFile ? (
                <img src={URL.createObjectURL(selectedFile)} alt="Selected" />
              ) : (
                <p>Click to select Image</p>
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
                value={fileId}
                onChange={(e) => setFileId(e.target.value)}
              />
            </div>
            <div className="input-row">
              <label htmlFor="title" className="label">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <label htmlFor="author" className="label">Author</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
            <div className="input-row">
            <label htmlFor="dropdown" className="label">Day</label>
              <select
                id="dropdown"
                name="dropdown"
                className="custom-dropdown"
                value={day}
                onChange={(e) => setDay(e.target.value)} // เพิ่มการเซ็ตค่า day จากการเลือก dropdown
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
            <button onClick={handleUpload}>UPLOAD</button>
            {/* เรียกใช้ AlertInputModal */}
            <AlertInputModal
              modalIsOpen={modalIsOpen}
              setModalIsOpen={setModalIsOpen}
              missingFields={missingFields}
            />
          </div>
        </div>
        <div className="divider"></div>
        <div className="row grid-container">
          <div className="grid-container">
            {stories.map((story, index) => (
              <Link key={index} to={`/story/${story.id}`} className="grid-item">
                <img src={story.imageUrl} alt={story.title} />
                <p>{story.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
}

export default Story