import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';

function Navbar() {
  const location = useLocation();

  const isCreateActive = location.pathname === '/create' || location.pathname.startsWith('/edit/');

  return (
    <Nav style={{ backgroundColor: '#FFEECC', fontWeight: 'bold' }} variant="tabs" className='mb-5'>
      <Nav.Item>
        <NavLink exact to="/" className={`nav-link ${isCreateActive ? 'active' : ''}`}>
          NewBorn Database Application
        </NavLink>
      </Nav.Item>
      <Nav.Item>
        <NavLink exact to="/dashboard" className="nav-link">Analysis New Born</NavLink>
      </Nav.Item>
    </Nav>
  );
}

export default Navbar