import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import { db, storage } from '../firebase';

function AddStory() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileId, setFileId] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [imageName, setImageName] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !fileId || !title || !category || !description || !imageName) {
      console.error('Please fill in all fields.');
      return;
    }

    const storageRef = ref(storage, `img_storys/${imageName}`);

    try {
      // Upload file
      const snapshot = await uploadBytes(storageRef, selectedFile);

      // Get download URL
      const imageUrl = await getDownloadURL(snapshot.ref);

      // Save data to Firestore
      await addDoc(collection(db, 'storys'), {
        id: fileId,
        title: title,
        category: category,
        description: description,
        imageUrl: imageUrl
      });

      console.log('Data uploaded successfully.');
    } catch (error) {
      console.error('Error uploading data:', error);
    }
  };

  return (
    <div className="container center">
      <div>
        <input
          type="file"
          onChange={handleFileChange}
        />
        <button onClick={handleUpload}>Load</button>
      </div>
      {selectedFile ? (
        <img src={URL.createObjectURL(selectedFile)} alt="Selected" />
      ) : (
        <p>No image selected.</p>
      )}
      <input
        type="text"
        placeholder="Image ID"
        value={fileId}
        onChange={(e) => setFileId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
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
      <input
        type="text"
        placeholder="Image Name"
        value={imageName}
        onChange={(e) => setImageName(e.target.value)}
      />
      <button onClick={handleUpload}>Submit</button>
    </div>
  );
}

export default AddStory;
