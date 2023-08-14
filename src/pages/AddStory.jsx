import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import { db, storage } from '../firebase';

function AddStory() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileId, setFileId] = useState('');
  const [title, setTitle] = useState('');
  const [editableFileName, setEditableFileName] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setEditableFileName(file.name);
  };

  const handleIdChange = (event) => {
    setFileId(event.target.value);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleUpload = async () => {
    if (!selectedFile || !fileId || !title) {
      console.error('Please fill in all fields.');
      return;
    }

    const storageRef = ref(storage, 'img_story/' + editableFileName);

    try {
      // Upload file
      const snapshot = await uploadBytes(storageRef, selectedFile);

      // Get download URL
      const imageUrl = await getDownloadURL(snapshot.ref);
      setImageUrl(imageUrl);

      // Save data to Firestore
      const docRef = await addDoc(collection(db, 'storys'), {
        id: fileId,
        title: title,
        imageName: editableFileName,
        imageUrl: imageUrl
      });

      console.log('Document written with ID: ', docRef.id);
    } catch (error) {
      console.error('Error uploading file:', error);
      return;
    }
  };

  return (
    <div>
      <h2>AddStory Page</h2>
      <input type="file" onChange={handleFileChange} />
      <div>
        <h4>Selected File:</h4>
        {selectedFile && <p>{editableFileName}</p>}
      </div>
      <div>
        <label htmlFor="fileId">Image ID:</label>
        <input type="text" id="fileId" value={fileId} onChange={handleIdChange} />
      </div>
      <div>
        <label>Title:</label>
        <input type="text" value={title} onChange={handleTitleChange} />
      </div>
      <div>
        <label>Editable Image Name:</label>
        <input type="text" value={editableFileName} onChange={(e) => setEditableFileName(e.target.value)} />
      </div>
      <div>
        <button onClick={handleUpload}>Submit</button>
      </div>
      <div>
        {imageUrl && <img src={imageUrl} alt="Uploaded" />}
      </div>
    </div>
  );
}

export default AddStory;
