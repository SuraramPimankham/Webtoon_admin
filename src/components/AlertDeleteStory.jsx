// AlertDeleteStory.jsx

import React from 'react';
import PropTypes from 'prop-types'; // นำเข้า PropTypes
import Modal from 'react-modal';
import './css/AlertDeleteStory.css'; // นำเข้าไฟล์ CSS

Modal.setAppElement('#root');

function AlertDeleteStory({ modalIsOpen, setModalIsOpen, handleDelete }) {
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={() => setModalIsOpen(false)}
      contentLabel="Delete Story Confirmation"
      className="custom-modal"
      overlayClassName="custom-overlay"
    >
      <div className="modal-content">
        <h2>Are you sure you want to delete this story?</h2>
        <button className='yes' onClick={handleDelete}>Yes</button>
        <button onClick={() => setModalIsOpen(false)}>No</button>
      </div>
    </Modal>
  );
}

AlertDeleteStory.propTypes = {
    modalIsOpen: PropTypes.bool.isRequired,
    setModalIsOpen: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
  };


export default AlertDeleteStory;
