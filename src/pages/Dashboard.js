import React, { useState, useEffect } from "react";
import { Row, Table } from "react-bootstrap";
import { Form, Modal, ToastContainer } from "react-bootstrap";
import Col from "react-bootstrap/Col";


const Dashboard = () => {
    const [selectedYear, setSelectedYear] = useState("");
    const [data, setData] = useState([]);  
    const currentYear = new Date().getFullYear();
    const range = 10;
  
    useEffect(() => {
      setSelectedYear(currentYear.toString());
    }, []);

    useEffect(() => {
        fetchFilteredData(selectedYear);
      }, [selectedYear]);  
  
    const handleYearChange = (event) => {
      setSelectedYear(event.target.value);
    };
  
    const yearOptions = Array.from({ length: range * 2 + 1 }, (_, index) => {
      const year = currentYear - range + index;
      return <option key={year} value={year}>{year}</option>;
    });
  
    const fetchFilteredData = (selectedYear) => {
        fetch(`http://localhost:8000/newborn/yearfilter/${selectedYear}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((data) => {
            setData(data);
          })
          .catch((error) => {

          });
      };  

    return (
        <div className="form-container">
            <Row>
                <Form.Group as={Col} md="1" className="mb-3 d-flex align-items-end">
                    <Form.Label>Tahun :</Form.Label>
                </Form.Group>
                <Form.Group as={Col} md="1" className="mb-3" style={{marginLeft: '-50px'}}>
                    <Form.Control
                    as="select"
                    name="year"
                    value={selectedYear}
                    onChange={handleYearChange}
                    >
                    <option value="">Select Year</option>
                    {yearOptions}
                    </Form.Control>
                </Form.Group>
            </Row>
            <Row>
                <Form.Group>
                    <Table striped bordered hover id='tblDetail' style={{ border: 'solid black 2px'}}>
                        <thead style={{ textAlign: 'center'}}>
                            <tr>
                                <th rowSpan={3}>Bulan</th>
                                <th colSpan={4}>Jenis Kelamin</th>
                            </tr>
                            <tr>
                                <th colSpan={2}>Laki - laki</th>
                                <th colSpan={2}>Perempuan</th>
                            </tr>
                            <tr>
                                <th>Jumlah</th>
                                <th>Berat Rata-rata</th>
                                <th>Jumlah</th>
                                <th>Berat Rata-rata</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                            <tr key={index}>
                                <td style={{ textAlign: 'center'}}>{index+1}</td>
                                <td style={{ textAlign: 'center'}}>{item[1]}</td>
                                <td style={{ textAlign: 'right'}}>{parseFloat(item[2]).toFixed(2)} Kg</td>
                                <td style={{ textAlign: 'center'}}>{item[3]}</td>
                                <td style={{ textAlign: 'right'}}>{parseFloat(item[4]).toFixed(2)} Kg</td>
                            </tr>
                            ))}
                        </tbody>
                    </Table>
                </Form.Group>
            </Row>
        </div>
    );
}

export default Dashboard