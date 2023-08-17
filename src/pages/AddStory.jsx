import React, { useState, useRef, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, getDocs, setDoc, doc } from 'firebase/firestore'; // นำเข้า setDoc และ doc ด้วย
import { db, storage } from '../firebase';
import { Link } from 'react-router-dom';

function AddStory() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileId, setFileId] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [imageName, setImageName] = useState('');
  const [author, setAuthor] = useState('');

  // State เพื่อเก็บข้อมูล stories ที่ดึงมาจาก Firebase
  const [stories, setStories] = useState([]);

  const inputRef = useRef(null); // สร้าง ref สำหรับ input

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !fileId || !title || !category || !description || !imageName || !author) {
      console.error('Please fill in all fields.');
      return;
    }
    
    const storageRef = ref(storage, `img_storys/${imageName}`);
    
    try {
      // Upload file
      const snapshot = await uploadBytes(storageRef, selectedFile);
    
      // Get download URL
      const imageUrl = await getDownloadURL(snapshot.ref);
    
      // Save data to Firestore with fileId as Document ID
      await setDoc(doc(db, 'storys', fileId), {
        id: fileId,
        title: title,
        category: category,
        description: description,
        image_name: imageName,
        imageUrl: imageUrl,
        author: author
      });
    
      console.log('Data uploaded successfully. Document ID:', fileId);
    
      // Reload the page
      window.location.reload();
    } catch (error) {
      console.error('Error uploading data:', error);
    }
  };

  // Function สำหรับดึงข้อมูล stories จาก Firebase
  const fetchStories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'storys'));
      const storiesData = querySnapshot.docs.map((doc) => doc.data());
      setStories(storiesData);
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };
    
  // ใช้ useEffect เพื่อดึงข้อมูล stories เมื่อคอมโพเนนต์ถูกโหลด
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
                <p className="file-input-text">Click to select image.</p>
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
            <input
              type="text"
              placeholder="ID"
              value={fileId}
              onChange={(e) => setFileId(e.target.value)}
            />
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="input-row">
            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="input-row">
            <input
              type="text"
              placeholder="Image Name"
              value={imageName}
              onChange={(e) => setImageName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          <button onClick={handleUpload}>UPLOAD</button>
        </div>

      </div>

      <div className="divider"></div>

      <div className="row grid-container">
        {/* ใช้ CSS Grid ในการแสดงข้อมูลในกรอบเดียวกัน */}
        <div className="grid-container">

        {stories.map((story, index) => (
          <Link key={index} to={`/story/${story.id}`} className="grid-item">
            <img src={story.imageUrl} alt={story.title} />
            <p style={{ color: 'white' }}>{story.title}</p>
          </Link>
        ))}

        </div>
      </div>
    </div>
  );
  
}

export default AddStory;
