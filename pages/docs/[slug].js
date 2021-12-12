import React from "react";
import Link from "next/link";

// FILESYSTEM MODULES
import fs, { readdirSync } from "fs";
import path from "path";

// MARKDOWN MODULES
import matter from "gray-matter";
import Markdown from "markdown-to-jsx";
import hljs from "highlight.js";

// COMPONENTS
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import CopyButton from "../../components/CopyButton";

const CodeRender = ({ children }) => {
  let className = children.props.className;
  children = children.props.children;

  let language = className ?? "lang-plaintext";
  let hljs_language = language.split("-")[1];
  hljs_language = hljs.getLanguage(hljs_language) ? hljs_language : "plaintext";

  let html_content = hljs.highlight(children, {
    language: hljs_language,
  }).value;

  return (
    <div>
      <CopyButton text={children} />
      <pre>
        <code
          className={`hljs ${language}`}
          dangerouslySetInnerHTML={{ __html: html_content }}
        ></code>
      </pre>
    </div>
  );
};

const Page = ({ content, data, navbarData }) => (
  <>
    <Header title={data.title + " · Documentation"} />
    <Navbar />
    <div className="docs-container">
      {/* NAVIGATION SIDEBAR */}
      <aside className="docs-sidebar">
        <nav className="docs-navbar">
          <ul>
            {navbarData.map((pageData, index, array) => {
              const categoryHeading =
                index == 0 ||
                array[index - 1]["category-index"] !=
                  pageData["category-index"] ? (
                  <h1
                    id={pageData.category}
                    className={
                      "docs-navbar--heading " + pageData.categoryClassName
                    }
                  >
                    {pageData.category}
                  </h1>
                ) : null;
              return (
                <React.Fragment key={pageData.file}>
                  {categoryHeading}
                  <li id={pageData.title}>
                    <Link href={"/docs/" + pageData.file}>
                      <a
                        className={
                          "docs-navbar--links " +
                          (pageData.isActive ? "docs-navbar--active" : "")
                        }
                      >
                        {pageData.isActive && "» "}
                        {pageData.title}
                      </a>
                    </Link>
                  </li>
                </React.Fragment>
              );
            })}
          </ul>
        </nav>
      </aside>
      {/* MAIN PAGE CONTENT */}
      <main>
        {/* PAGE CONTENT */}
        <Markdown
          options={{
            overrides: {
              pre: {
                component: CodeRender,
                props: {
                  // className: "hljs",
                },
              },
            },
          }}
        >
          {content}
        </Markdown>
      </main>
    </div>
  </>
);

export const getStaticPaths = async () => {
  const files = readdirSync("docs");

  const paths = files.map((filename) => ({
    params: {
      slug: filename.replace(".md", ""),
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params: { slug } }) => {
  const files = readdirSync("docs");
  const navbarData = files.map((filename) => {
    let categoryClassName = "";

    const fileData = fs.readFileSync(path.join("docs", filename)).toString();
    return {
      ...matter(fileData).data,
      file: filename.replace(".md", ""),
      categoryClassName,
      isActive: slug + ".md" === filename,
    };
  });

  navbarData.sort((a, b) => {
    if (a["category-index"] < b["category-index"]) return -1;
    if (a["page-index"] < b["page-index"]) return -1;
    return 1;
  });

  navbarData[0].categoryClassName = "docs-navbar--first-element";

  // console.log(navbarData);

  const markdownWithMetadata = fs
    .readFileSync(path.join("docs", slug + ".md"))
    .toString();

  const parsedMarkdown = matter(markdownWithMetadata);

  return {
    props: {
      content: parsedMarkdown.content,
      data: parsedMarkdown.data,
      navbarData,
    },
  };
};

export default Page;
