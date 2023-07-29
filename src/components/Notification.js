import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const Notification = ({ show, message, variant, title}) => {
  return (
    <Toast show={show} onClose={() => {}}>
      <Toast.Header closeButton={true} className={`bg-${variant} text-white`}>
        <strong className="me-auto">{title}</strong>
      </Toast.Header>
      <Toast.Body className={`bg-${variant} text-white`}>{message}</Toast.Body>
    </Toast>
  );
};

export default Notification