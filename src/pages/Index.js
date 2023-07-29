import React, { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import { Form, Modal, ToastContainer } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Notification from "../components/Notification";

const Index = () => {
  const [data, setData] = useState([]);
  const [itemId, setItemId] = useState(null);
  const [itemSeq, setItemSeq] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('');
  const [toastTitle, setToastTitle] = useState('');
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    const currentDate = new Date().toISOString().slice(0, 10);
    setSelectedDate(currentDate);
  }, []);

  useEffect(() => {
    fetchFilteredData(selectedDate);
  }, [selectedDate]);  

  const handleShowModal = (itemId, itemSeq) => {
    setItemId(itemId);
    setItemSeq(itemSeq);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setItemId(null);
    setItemSeq(null);
    setShowModal(false);
  };

  const handleDelete = () => {
    fetch(`http://localhost:8000/newborn/delete/${itemId}/${itemSeq}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.indctr === '1') {
            setToastMessage(data.msg);
            setToastVariant('success');
            setShowToast(true);
            setToastTitle('Success');

            setTimeout(() => {
              setShowToast(false);
              navigate('/');
            }, 500);
          } else {
            setToastMessage(data.msg);
            setToastVariant('danger');
            setShowToast(true);
            setToastTitle('An error occurred while updating');

            setTimeout(() => {
              setShowToast(false);
            }, 3000);
          }
        })
        .catch((error) => {
            
        });
    handleCloseModal();
  };

  const fetchFilteredData = (selectedDate) => {
    fetch(`http://localhost:8000/newborn/datefilter/${selectedDate}`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        
      });
  };  

  return (
    <div className="form-container">
    <ToastContainer position="top-end">
      <Notification
        show={showToast}
        message={toastMessage}
        variant={toastVariant}
        title={toastTitle}
      />
    </ToastContainer>
      <Row>
        <Form.Group as={Col} md="2" className="mb-3">
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control
            type="date"
            name="date_birth"
            required
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </Form.Group>
        <Form.Group as={Col} md={{ span: 2, offset: 8 }} className="mb-3 d-flex align-items-end justify-content-end">
          <NavLink to="/create">
            <Button type="button">Add NewBorn</Button>
          </NavLink>
        </Form.Group>
      </Row>
        <Table striped bordered hover id='tblDetail'>
            <thead>
                <tr>
                    <th style={{width: '5%'}}>No</th>
                    <th style={{width: '10%'}}>Mother’s Name</th>
                    <th style={{width: '5%'}}>Mother’s Age</th>
                    <th style={{width: '10%'}}>Infant Gender</th>
                    <th style={{width: '15%'}}>Infant Birth date and time</th>
                    <th style={{width: '10%'}}>Height (in cm)</th>
                    <th style={{width: '10%'}}>Weight (in Kg)</th>
                    <th style={{width: '20%'}}>Description</th>
                    <th style={{width: '15%'}}>Action</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    <td style={{textAlign:'center'}}>{index+1}</td>
                    <td>{item.mother_name}</td>
                    <td>{item.mother_age}</td>
                    <td>{item.gender}</td>
                    <td>{item.birth_datetime}</td>
                    <td>{item.height}</td>
                    <td>{item.weight}</td>
                    <td>{item.description}</td>
                    <td>
                      <Link to={`/edit/${item.id}`} as="button" className="btn btn-primary">
                          Edit
                      </Link>
                      <Button variant="danger" onClick={() => handleShowModal(item.id, item.id_seq)} style={{marginLeft: '4px'}}>
                          Delete
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
        </Table>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              No
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
    </div>
  );
};

export default Index
