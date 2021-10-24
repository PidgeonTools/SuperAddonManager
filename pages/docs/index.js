import React from "react";
import Link from "next/link";
import fs from "fs";

// Bootstrap
import { Container } from "react-bootstrap";

// COMPONENTS
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";

const Docs = ({ slugs }) => (
  <>
    <Header title="Documentation" />
    <Navbar />
    <Container className="intro">
      {slugs.map((slug) => {
        return (
          <div key={slug}>
            <Link href={`/docs/${slug}`}>
              <a>{slug}</a>
            </Link>
          </div>
        );
      })}
    </Container>
  </>
);

export const getStaticProps = async () => {
  const files = fs.readdirSync("docs");
  return {
    props: {
      slugs: files.map((filename) => filename.replace(".md", "")),
    },
  };
};

export default Docs;
