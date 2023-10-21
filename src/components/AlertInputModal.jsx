// AlertInputModal.jsx

import React from 'react';
import PropTypes from 'prop-types'; // นำเข้า PropTypes
import Modal from 'react-modal';
import './css/AlertInputModal.css'; // นำเข้าไฟล์ CSS

Modal.setAppElement('#root');

function AlertInputModal({ modalIsOpen, setModalIsOpen, missingFields }) {
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={() => setModalIsOpen(false)}
      contentLabel="Incomplete Data Alert"
      className="custom-modal"
      overlayClassName="custom-overlay"
    >
      <div className="modal-content-alert-input">
        <h2>Please fill in the following fields</h2>
        <ul>
          {missingFields.map((field, index) => (
            <li key={index}>{field}</li>
          ))}
        </ul>
        <button onClick={() => setModalIsOpen(false)}>Close</button>
      </div>
    </Modal>
  );
}

// เพิ่ม propTypes
AlertInputModal.propTypes = {
  modalIsOpen: PropTypes.bool.isRequired,
  setModalIsOpen: PropTypes.func.isRequired,
  missingFields: PropTypes.array.isRequired,
};

export default AlertInputModal;
