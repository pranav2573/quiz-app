import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <BootstrapNavbar 
      expand="lg" 
      bg="dark" 
      variant="dark" 
      expanded={expanded}
      className="shadow-sm mb-4"
    >
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="fw-bold">
          <span className="text-primary">Quiz</span>Master
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle 
          aria-controls="navbar-nav" 
          onClick={() => setExpanded(expanded ? false : true)}
        />
        <BootstrapNavbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" onClick={() => setExpanded(false)}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/explore" onClick={() => setExpanded(false)}>
              Explore Quizzes
            </Nav.Link>
            {currentUser && (
              <>
                <Nav.Link as={Link} to="/create-quiz" onClick={() => setExpanded(false)}>
                  Create Quiz
                </Nav.Link>
                <Nav.Link as={Link} to="/my-quizzes" onClick={() => setExpanded(false)}>
                  My Quizzes
                </Nav.Link>
                <Nav.Link as={Link} to="/admin" onClick={() => setExpanded(false)}>
                  Analytics
                </Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            {currentUser ? (
              <div className="d-flex align-items-center">
                <span className="text-light me-3">
                  {currentUser.email}
                </span>
                <Button 
                  variant="outline-light" 
                  onClick={() => {
                    setExpanded(false);
                    handleLogout();
                  }}
                >
                  Log Out
                </Button>
              </div>
            ) : (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/login" 
                  className="me-2" 
                  onClick={() => setExpanded(false)}
                >
                  Log In
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/register" 
                  className="btn btn-primary text-white" 
                  onClick={() => setExpanded(false)}
                >
                  Sign Up
                </Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar; 