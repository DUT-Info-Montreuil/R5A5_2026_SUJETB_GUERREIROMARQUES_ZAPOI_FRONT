/** Cadre commun à toutes les pages : en-tête, contenu, pied de page. */

import { Container, Navbar } from 'react-bootstrap';
import { Link, Outlet } from 'react-router-dom';

import logo from '../../assets/logo.svg';

export function MiseEnPage() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar className="border-bottom">
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
            <img src={logo} alt="" width={32} height={32} />
            <span className="fw-bold text-uppercase">Tournament Organizer</span>
          </Navbar.Brand>
        </Container>
      </Navbar>

      <main className="flex-grow-1 py-5">
        <Container>
          <Outlet />
        </Container>
      </main>

      <footer className="border-top py-3 small text-body-secondary">
        <Container>Tournament Organizer — R5A5, IUT de Montreuil</Container>
      </footer>
    </div>
  );
}
