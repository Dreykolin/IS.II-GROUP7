// components/NavbarSuperior.jsx
import { Navbar, Container, Nav } from 'react-bootstrap';

export default function NavbarSuperior() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">Mi App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Aquí podrías agregar más enlaces */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

