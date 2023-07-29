import React, { useState, useRef, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import InputGroup from 'react-bootstrap/InputGroup';
import { Modal, Toast, ToastContainer } from 'react-bootstrap';
import Notification from '../components/Notification';
import { useNavigate } from 'react-router-dom';
import '../style.css';
import { useParams } from 'react-router-dom';

function Edit() {
  const [main, setMain] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const [itemId, setItemId] = useState(null);
  const [itemSeq, setItemSeq] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('');
  const [toastTitle, setToastTitle] = useState('');
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const tableRef = useRef(null);
  const [tableData, setTableData] = useState([]);
  const [motherName, setMotherName] = useState('');
  const [motherAge, setMotherAge] = useState('');
  const [gestationalAge, setGestationalAge] = useState('');

  const [formData, setFormData] = useState({
    mother_name: '',
    mother_age: '',
    gestational_age: '',
    infant_gender: [],
    birth_datetime: [],
    height: [],
    weight: [],
    description: [],
  });

  useEffect(() => {
    fetch(`http://localhost:8000/newborn/data/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setMain(data.main);
        setTableData(data.data);
        setIsLoading(false);

        setMotherName(data.main.mother_name || '');
        setMotherAge(data.main.mother_age || '');
        setGestationalAge(data.main.gestational_age || '');
      })
      .catch((error) => {
        console.error('Error:', error);
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  const handleChange = (index, fieldName, value) => {
    let updatedValue = value;
    
    if (fieldName === 'birth_datetime') {
      const dateObject = new Date(value);
      const year = dateObject.getFullYear();
      const month = String(dateObject.getMonth() + 1).padStart(2, '0');
      const day = String(dateObject.getDate()).padStart(2, '0');
      const hours = String(dateObject.getHours()).padStart(2, '0');
      const minutes = String(dateObject.getMinutes()).padStart(2, '0');
  
      updatedValue = `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    const updatedTableData = tableData.map((r, i) =>
      i === index ? { ...r, [fieldName]: updatedValue } : r
    );
    setTableData(updatedTableData);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      
      const updatedFormData = {
        mother_name: form.elements['mother_name'].value,
        mother_age: form.elements['mother_age'].value,
        gestational_age: form.elements['gestational_age'].value,
        infant_gender: [],
        birth_datetime: [],
        height: [],
        weight: [],
        description: [],
      };
  
      for (let i = 0; i < form.elements.length; i++) {
        const element = form.elements[i];
        if (element.name === 'infant_gender[]') {
          updatedFormData.infant_gender.push(element.value);
        } else if (element.name === 'birth_datetime[]') {
          updatedFormData.birth_datetime.push(element.value);
        } else if (element.name === 'height[]') {
          updatedFormData.height.push(element.value);
        } else if (element.name === 'weight[]') {
          updatedFormData.weight.push(element.value);
        } else if (element.name === 'description[]') {
          updatedFormData.description.push(element.value);
        }
      }

      fetch(`http://localhost:8000/newborn/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
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
            }, 3000);
          } else {
            if (data.errors) {
              const formattedErrors = data.errors;

              let errorMessage = '';
              for (const column in formattedErrors) {
                const fieldName = column.replace(/\.\d+$/, '');
                errorMessage += `${formattedErrors[column].replace(column, fieldName)}\n`;
              }

              setToastMessage(errorMessage);
              setToastVariant('danger');
              setShowToast(true);
              setToastTitle('An error occurred while updating');
    
              setTimeout(() => {
                setShowToast(false);
              }, 3000);
            } else {
              setToastMessage(data.msg);
              setToastVariant('danger');
              setShowToast(true);
              setToastTitle('An error occurred while updating');
  
              setTimeout(() => {
                setShowToast(false);
              }, 3000);
            }
          }
        })
        .catch((error) => {
            setToastMessage(error.message || 'An unknown error occurred.');

            setToastVariant('danger');
            setShowToast(true);
            setToastTitle('An error occurred while updating');

            setTimeout(() => {
              setShowToast(false);
            }, 10000);
        });
    }

    setValidated(true);
  };

  const handleDeleteRow = (index) => {
    const updatedTableData = [...tableData];
    updatedTableData.splice(index, 1);
    setTableData(updatedTableData);
  };

  const addNewRow = () => {
    const newRow = {
      coloumn1: <Form.Control name='id_seq[]' required type="hidden" />,
      coloumn2:
        <Form.Group controlId="validationInfantGender">
        <Form.Select name='infant_gender[]' id='infant_gender' required defaultValue={''}>
          <option value='' disabled>Choose...</option>
          <option value='M'>Male</option>
          <option value='F'>Female</option>
        </Form.Select>
        <Form.Control.Feedback type="invalid">
            Please select an option.
        </Form.Control.Feedback>
      </Form.Group>,
      coloumn3:
      <Form.Group controlId="validationBirthdate">
        <Form.Control name='birth_datetime[]' type="datetime-local" required />
        <Form.Control.Feedback type="invalid">
            Please select a date and time of birth.
          </Form.Control.Feedback>
      </Form.Group>,
      coloumn4:
        <InputGroup>
          <Form.Control
            type="number"
            name='height[]'
            min="0"
            style={{ textAlign: 'right' }}
            required
          />
          <InputGroup.Text id="basic-addon2">cm</InputGroup.Text>
          <Form.Control.Feedback type="invalid">
            Please fill out this field.
          </Form.Control.Feedback>
        </InputGroup>,
      coloumn5:
      <Form.Group>
        <InputGroup>
          <Form.Control 
          type="number" 
          name='weight[]' 
          style={{ textAlign: 'right' }} 
          step="0.01"
          min="0"
          required />
          <InputGroup.Text id="basic-addon2">Kg</InputGroup.Text>
          <Form.Control.Feedback type="invalid">
            Please provide valid weight input. ex: 3,85
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>,
      coloumn6:
        <Form.Group>
          <Form.Control type="text" name='description[]' maxLength={50}/>
          <Form.Control.Feedback type="invalid">
            Please enter no more than 50 characters in this field.
          </Form.Control.Feedback>
        </Form.Group>,
      coloumn7:
        <Button
          type="button"
          className='btn btn-danger'
          onClick={() => handleDeleteRow(tableData.length)}
        >Delete</Button>,
    };

    setTableData([...tableData, newRow]);
  };

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
              const url = `http://localhost:3000/edit/${id}`;
              window.location.href = url;
            }, 500);
          } else {
            setToastMessage(data.msg);
            setToastVariant('danger');
            setShowToast(true);
            setToastTitle('An error occurred while deleting');

            setTimeout(() => {
              setShowToast(false);
            }, 3000);
          }
        })
        .catch((error) => {
          setToastMessage(error);
          setToastVariant('danger');
          setShowToast(true);
          setToastTitle('An error occurred while communicating with the server');
    
          setTimeout(() => {
            setShowToast(false);
          }, 3000);
        });
    handleCloseModal();
  };

  return (
    <div>
      <Form noValidate validated={validated} onSubmit={handleSubmit} className="form-container">
        <ToastContainer position="top-end">
          <Notification
            show={showToast}
            message={toastMessage}
            variant={toastVariant}
            title={toastTitle}
          />
        </ToastContainer>
        <Row className="mb-3">
          <Form.Group as={Col} md="4" controlId="validationMothername">
            <Form.Label>Mother’s Name</Form.Label>
            <Form.Control
              required
              type="text"
              name="mother_name"
              placeholder="Mother’s Name"
              maxLength={50}
              value={motherName}
              onChange={(e) => setMotherName(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="validationMotherage">
            <Form.Label>Mother’s Age</Form.Label>
            <Form.Control
              required
              type="number"
              name="mother_age"
              placeholder="Mother’s Age"
              value={motherAge}
              min={0}
              onChange={(e) => setMotherAge(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="validationGestationalage">
            <Form.Label>Gestational Age (in weeks)</Form.Label>
            <Form.Control
              required
              type="number"
              name="gestational_age"
              placeholder="Gestational Age (in weeks)"
              min={0}
              value={gestationalAge}
              onChange={(e) => setGestationalAge(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please fill out this field.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row>
          <Form.Group>
            <Button type="button" className='mb-2 btn-success' onClick={addNewRow}>
              + Add Row
            </Button>
            <Table striped bordered hover id='tblDetail' ref={tableRef}>
              <thead>
                <tr>
                  <th style={{ width: '5%' }}>No</th>
                  <th style={{ width: '15%' }}>Infant Gender</th>
                  <th style={{ width: '15%' }}>Infant Birth date and time</th>
                  <th style={{ width: '15%' }}>Height</th>
                  <th style={{ width: '15%' }}>Weight</th>
                  <th style={{ width: '25%' }}>Description</th>
                  <th style={{ width: '5%' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index}>
                    <td style={{ textAlign: 'center' }}>{index + 1}</td>
                    <td>
                    <Form.Group controlId="validationInfantGender">
                      <Form.Select
                        name='infant_gender[]'
                        id='infant_gender'
                        value={row.infant_gender}
                        onChange={(e) => handleChange(index, 'infant_gender', e.target.value)}
                        required
                        >
                        <option value='' disabled>Choose...</option>
                        <option value='M'>Male</option>
                        <option value='F'>Female</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Please select an option.
                      </Form.Control.Feedback>
                    </Form.Group>
                    </td>
                    <td>
                    <Form.Group controlId="validationBirthdate">
                      <Form.Control
                        name='birth_datetime[]'
                        type="datetime-local"
                        value={row.datebirth}
                        onChange={(e) => handleChange(index, 'birth_datetime', e.target.value)}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please select a date and time of birth.
                      </Form.Control.Feedback>
                    </Form.Group>
                    </td>
                    <td>
                      <InputGroup>
                        <Form.Control
                          type="number"
                          name='height[]'
                          min="0"
                          style={{ textAlign: 'right' }}
                          value={row.height || ''}
                          onChange={(e) => handleChange(index, 'height', e.target.value)}
                          required
                        />
                        <InputGroup.Text id="basic-addon2">cm</InputGroup.Text>
                        <Form.Control.Feedback type="invalid">
                          Please fill out this field.
                        </Form.Control.Feedback>
                      </InputGroup>
                    </td>
                    <td>
                      <Form.Group>
                        <InputGroup>
                          <Form.Control
                            type="number"
                            name='weight[]'
                            step="0.01"
                            min="0"
                            style={{ textAlign: 'right' }}
                            value={row.weight || ''}
                            onChange={(e) => handleChange(index, 'weight', e.target.value)}
                            required
                          />
                          <InputGroup.Text id="basic-addon2">Kg</InputGroup.Text>
                          <Form.Control.Feedback type="invalid">
                            Please provide valid weight input. ex: 3,85
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </td>
                    <td>
                    <Form.Group>
                      <Form.Control
                        type="text"
                        name="description[]"
                        value={row.description || ''}
                        maxLength={50}
                        onChange={(e) => handleChange(index, 'description', e.target.value)}
                      />
                      <Form.Control.Feedback type="invalid">
                          Please enter no more than 50 characters in this field.
                        </Form.Control.Feedback>
                    </Form.Group>
                    </td>
                    <td>
                      <Button variant="danger" onClick={() => handleShowModal(row.id, row.id_seq)} style={{marginLeft: '4px'}}>
                          Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Form.Group>
        </Row>
        <Button type="submit">Update</Button>
        <a className='btn btn-default' href="/" style={{ border: '2px solid black', marginLeft: '5px' }}>
          Cancel
        </a>
      </Form>

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
}

export default Edit