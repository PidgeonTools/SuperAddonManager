import React from "react";
import Link from "next/link";
import fs from "fs";

// COMPONENTS
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";

const Docs = ({ slugs }) => (
  <>
    <Header title="Super Addon Manager - Documentation" />
    <Navbar />
    <div className="container intro">
      {slugs.map((slug) => {
        return (
          <div key={slug}>
            <Link href={`/docs/${slug}`}>
              <a>{slug}</a>
            </Link>
          </div>
        );
      })}
    </div>
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
