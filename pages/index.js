import Link from "next/link";

// Bootstrap
import { Container, Nav } from "react-bootstrap";

// Components
import Header from "../components/Header";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
      <Header title="Home" />
      <Navbar />
      <Container className="intro" style={{ marginBottom: "80vh" }}>
        <Nav as="ul" className="flex-column">
          <Nav.Item as="li">
            <Nav.Link as={Link} href="/request-support">
              Request Support
            </Nav.Link>
          </Nav.Item>
          <Nav.Item as="li">
            <Nav.Link as={Link} href="/endpoint-builder">
              Endpoint Builder
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Container>
    </>
  );
}
