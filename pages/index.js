import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { Nav } from "react-bootstrap";

export default function Home() {
  return (
    <>
      <Header title="Home" />
      <Navbar />
      <div className="container intro">
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
      </div>
    </>
  );
}
