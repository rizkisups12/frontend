import React, { useState, useRef, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import InputGroup from 'react-bootstrap/InputGroup';
import { Toast, ToastContainer } from 'react-bootstrap';
import Notification from '../components/Notification';
import { useNavigate } from 'react-router-dom';
import '../style.css';

function Create() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('');
  const [toastTitle, setToastTitle] = useState('');
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const tableRef = useRef(null);
  const [tableData, setTableData] = useState([]);
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {

      const formData = {
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
          formData.infant_gender.push(element.value);
        } else if (element.name === 'birth_datetime[]') {
          formData.birth_datetime.push(element.value);
        } else if (element.name === 'height[]') {
          formData.height.push(element.value);
        } else if (element.name === 'weight[]') {
          formData.weight.push(element.value);
        } else if (element.name === 'description[]') {
          formData.description.push(element.value);
        }
      }

      fetch('http://localhost:8000/newborn/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          if(data.indctr == '1'){
            setToastMessage(data.msg);
            setToastVariant('success');
            setShowToast(true);
            setToastTitle('Success');
  
            setTimeout(() => {
              setShowToast(false);
              navigate('/');
            }, 3000);
            
          }else{
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
            min='0'
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
          min='0'
          required />
          <InputGroup.Text id="basic-addon2">Kg</InputGroup.Text>
          <Form.Control.Feedback type="invalid">
            Please provide valid weight input. ex: 3,85
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>,
      coloumn6:
        <Form.Control type="text" name='description[]' maxLength={50} />,
      coloumn7:
        <Button
          type="button"
          className='btn btn-danger'
          onClick={() => handleDeleteRow(tableData.length)}
        >Delete</Button>,
    };

    setTableData([...tableData, newRow]);
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit} className="form-container">
      <ToastContainer position="top-end">
        <Notification show={showToast} message={toastMessage} variant={toastVariant} title={toastTitle} />
      </ToastContainer>
      <Row className="mb-3">
        <Form.Group as={Col} md="4" controlId="validationMothername">
          <Form.Label>Mother’s Name</Form.Label>
          <Form.Control
            type="text"
            name="mother_name"
            placeholder="Mother’s Name"
            maxLength={50}
            required
          />
          <Form.Control.Feedback type="invalid">
            Please fill out this field.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="2" controlId="validationMotherage">
          <Form.Label>Mother’s Age</Form.Label>
          <Form.Control
            type="number"
            name='mother_age'
            min={0}
            placeholder="Mother’s Age"
            required
          />
          <Form.Control.Feedback type="invalid">
            Please fill out this field.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="2" controlId="validationGestationalage">
          <Form.Label>Gestational Age (in weeks)</Form.Label>
          <Form.Control
            type="number"
            name="gestational_age"
            min={0}
            required
          />
          <Form.Control.Feedback type="invalid">
            Please fill out this field.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row>
        <Form.Group>
            <Button type="button" className='mb-2 btn-success' onClick={addNewRow}>+ Add Row</Button>
            <Table striped bordered hover id='tblDetail' ref={tableRef}>
            <thead>
                <tr>
                    <th style={{width: '5%'}}>No</th>
                    <th style={{width: '15%'}}>Infant Gender</th>
                    <th style={{width: '15%'}}>Infant Birth date and time</th>
                    <th style={{width: '15%'}}>Height</th>
                    <th style={{width: '15%'}}>Weight</th>
                    <th style={{width: '25%'}}>Description</th>
                    <th style={{width: '5%'}}>Action</th>
                </tr>
            </thead>
            <tbody>
                {tableData.map((row, index) => (
                    <tr key={index}>
                        <td style={{textAlign:'center'}}>{index+1}</td>
                        <td>{row.coloumn2}</td>
                        <td>{row.coloumn3}</td>
                        <td>{row.coloumn4}</td>
                        <td>{row.coloumn5}</td>
                        <td>{row.coloumn6}</td>
                        <td>{row.coloumn7}</td>
                    </tr>
                ))}
            </tbody>
            </Table>
        </Form.Group>
      </Row>
      <Button type="submit">Submit</Button>
      <a className='btn btn-default' href="/" style={{ border: '2px solid black', marginLeft: '5px' }}>
          Cancel
      </a>
    </Form>
  );
}

export default Create