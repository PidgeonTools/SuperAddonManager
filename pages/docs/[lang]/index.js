import React from "react";
import Link from "next/link";

// Bootstrap
import { Container } from "react-bootstrap";

// COMPONENTS
import Header from "../../../components/Header";
import Navbar from "../../../components/Navbar";

// FILESYSTEM MODULES
import fs from "fs";
import path from "path";

// MARKDOWN MODULES
import matter from "gray-matter";

const Docs = ({ navbarData }) => (
  <>
    <Header title="Documentation" />
    <Navbar />
    <Container className="intro">
      {navbarData.map((page) => {
        return (
          <div key={page}>
            <Link href={`/docs/${page.file}`}>
              <a>{page.title}</a>
            </Link>
          </div>
        );
      })}
    </Container>
  </>
);

export const getStaticPaths = async () => {
  const folders = fs.readdirSync("docs");

  const paths = folders.map((folder) => ({
    params: {
      lang: folder,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params: { lang } }) => {
  const files = fs.readdirSync("docs/" + lang);
  const navbarData = files.map((filename) => {
    const fileData = fs
      .readFileSync(path.join("docs", lang, filename))
      .toString();
    return {
      ...matter(fileData).data,
      file: path.join(lang, filename.replace(".md", "")),
    };
  });

  navbarData.sort((a, b) => {
    if (a.for === "Users") return -1;
    return 1;
  });

  return {
    props: {
      navbarData,
    },
  };
};

export default Docs;
