import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, deleteDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import Modal from 'react-modal';
import { db, storage } from '../firebase';
import { format, parseISO } from 'date-fns';

import AlertDeleteStory from '../components/AlertDeleteStory';
import AddEPModal from '../components/AddEPModal';

import './css/StoryDetail.css';

Modal.setAppElement('#root');

function StoryDetail() {
  const { id } = useParams();
  const inputRef = useRef(null);

  const [storyData, setStoryData] = useState({});
  const [gridData, setGridData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileId, setFileId] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [day, setDay] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);

  const [addModalIsOpen, setAddModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false); // เพิ่มสถานะสำหรับการเปิด/ปิด Modal การลบ

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

        // ดึงข้อมูลจาก collection storys_ep
        const epCollectionRef = collection(db, id);
        const epCollectionSnapshot = await getDocs(epCollectionRef);
        const epCollectionData = epCollectionSnapshot.docs.map(doc => doc.data());

        // อัปเดต state ของ gridData เพื่อแสดงข้อมูลใน grid-container
        setGridData(epCollectionData);
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
    
        // เปลี่ยน URL เพื่อนำผู้ใช้ไปยัง /add-story
        window.location.href = '/story';
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
      let updatedImageUrl = storyData.imageUrl; // เริ่มต้นให้เป็น imageUrl เดิม
    
      try {
        // ถ้ามีการเปลี่ยนชื่อ title
        if (title !== storyData.title) {
          // ลบรูปเดิมที่เกี่ยวข้องกับชื่อเดิมออกจาก Firebase storage
          const existingImageRef = ref(storage, `img_storys/${storyData.title}`);
          await deleteObject(existingImageRef);
    
          if (selectedFile) {
            // อัปโหลดรูปใหม่ไปยัง Firebase storage
            const newImageRef = ref(storage, `img_storys/${title}`);
            const snapshot = await uploadBytes(newImageRef, selectedFile);
            updatedImageUrl = await getDownloadURL(snapshot.ref);
          }
        } else if (selectedFile) {
          // กรณีไม่มีการเปลี่ยนชื่อเรื่อง แต่มีการเลือกรูปใหม่
          const newImageRef = ref(storage, `img_storys/${title}`);
          const snapshot = await uploadBytes(newImageRef, selectedFile);
          updatedImageUrl = await getDownloadURL(snapshot.ref);
        }
    
        const updatedData = {
          id: fileId,
          title: title,
          author: author,
          day: day,
          description: description,
          categories: categories,
          imageUrl: updatedImageUrl,
          createdAt: storyData.createdAt, // ใช้ค่าเดิม
          updatedAt: new Date(), // ใช้ค่าปัจจุบัน
        };
    
        // อัปเดตข้อมูลเอกสารด้วยข้อมูลใหม่
        await setDoc(doc(db, 'storys', id), updatedData);
        console.log('Story updated successfully.');
        // รีเฟรชหน้าเว็บหลังจากการบันทึกข้อมูลเสร็จสิ้น
        window.location.reload();
        // ให้เปลี่ยนเส้นทางหรืออัปเดต UI ตามที่เหมาะสม
      } catch (error) {
        console.error('Error updating story:', error);
      }
    };
  
    const handleAddClick = (id) => {
      setAddModalIsOpen(true);
      setFileId(id);
    };

    const handleDeleteClick = () => {
      setDeleteModalIsOpen(true);
    };
    
    return (
      
      <div className="container center">
        {storyData && Object.keys(storyData).length > 0 ? (
          <div className="row">
            <div className="double-column data1">
            <div className="file-input-container" onClick={() => inputRef.current.click()}>
              {selectedFile || storyData.imageUrl ? (
                <img src={selectedFile ? URL.createObjectURL(selectedFile) : storyData.imageUrl} alt="Image Missing" />
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
                  value={fileId || id} // ใช้ fileId ถ้ามีค่า ถ้าไม่ใช้ storyData.id จาก Firebase
                  readOnly
                  onChange={(e) => setFileId(e.target.value)}
                />
                <label htmlFor="createdAt" className="label">Create At</label>
                <input
                  type="text"
                  value={format(parseISO(storyData.createdAt.toDate().toISOString()), 'dd/MM/yyyy : HH.mm')}
                  readOnly
                />
                <label htmlFor="updatedAt" className="label">Update At</label>
                <input
                  type="text"
                  value={format(parseISO(storyData.updatedAt.toDate().toISOString()), 'dd/MM/yyyy : HH.mm')}
                  readOnly
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
                <button className="save-button" onClick={handleSave}>Save</button>
                <button className="delete-button" onClick={handleDeleteClick}>Delete</button>  
              </div>
            </div>
              <AlertDeleteStory
                modalIsOpen={deleteModalIsOpen}
                setModalIsOpen={setDeleteModalIsOpen}
                handleDelete={handleDelete}
              />
          </div>
        ) : (
          <h2>...Loading story data...</h2>
        )}
          <div className="divider"></div>
  
          <div className="row grid-container">
            <div className="grid-container">
              <div className="grid-item-add" onClick={() => handleAddClick(id)}>
                <h2>+</h2>
              </div>
              {gridData.map((item, index) => (
                <div className="grid-item-ep" key={index}>
                  <img src={storyData.imageUrl} alt={title +" EP "+ item.ep} />
                  <p>{title +" EP "+ item.ep}</p>
                  <div className="corner-box"></div>
                </div>
              ))}
            </div>
        </div>
          <AddEPModal
            isOpen={addModalIsOpen}
            onRequestClose={() => setAddModalIsOpen(false)}
            id={id}
            title={title}
          />
      </div>
    );
}

export default StoryDetail