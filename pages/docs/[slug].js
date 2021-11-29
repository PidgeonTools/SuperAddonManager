import React from "react";

// FILESYSTEM MODULES
import fs, { readdirSync } from "fs";
import path from "path";

// MARKDOWN MODULES
import matter from "gray-matter";
import marked from "marked";

// COMPONENTS
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import { Container } from "react-bootstrap";

function replaceAll(string, search, replace) {
  return string.split(search).join(replace);
}

// === Configure marked. ===
marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: function (code, lang) {
    const hljs = require("highlight.js");
    const language = hljs.getLanguage(lang) ? lang : "plaintext";
    return hljs.highlight(code, { language }).value;
  },
  langPrefix: "hljs language-", // highlight.js css expects a top-level 'hljs' class.
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false,
});
// Override behaviour for tables (set class names according to class=".+" in the table header)
const renderer = {
  table(header, body) {
    const re = /class=&quot;.+&quot;/;

    let tableClass = header.match(re);
    tableClass = tableClass ? tableClass.toString() : "table";

    header = header.replace(tableClass, "");

    return `
    <table ${replaceAll(tableClass, "&quot;", '"')}>
        ${header}
        ${body}
      </table>
    `;
  },
};
marked.use({ renderer });

const Page = ({ content, data, navbarData }) => (
  <>
    <Header title={data.title + " · Documentation"} />
    <Navbar />
    <div className="docs-container">
      <aside className="docs-sidebar">
        <nav className="docs-navbar">
          <ul>
            {navbarData.map((pageData, index, array) => {
              if (
                index == 0 ||
                array[index - 1]["category-index"] != pageData["category-index"]
              ) {
                return (
                  <>
                    <h1
                      id={pageData.category}
                      className={
                        "docs-navbar--heading " + pageData.categoryClassName
                      }
                    >
                      {pageData.category}
                    </h1>
                    <li id={pageData.title}>
                      <a
                        className={
                          "docs-navbar--links " + pageData.linkClassName
                        }
                        href={"/docs/" + pageData.file}
                      >
                        {pageData.title}
                      </a>
                    </li>
                  </>
                );
              }
              return (
                <li key={pageData.title} id={pageData.title}>
                  <a
                    className={"docs-navbar--links " + pageData.linkClassName}
                    href={"/docs/" + pageData.file}
                  >
                    {pageData.title}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
      <main dangerouslySetInnerHTML={{ __html: content }} />
    </div>
    {/* <div>{content}</div> */}
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

    let linkClassName = "";
    if (slug + ".md" === filename) {
      linkClassName = "docs-navbar--active";
    }

    const fileData = fs.readFileSync(path.join("docs", filename)).toString();
    return {
      ...matter(fileData).data,
      file: filename.replace(".md", ""),
      linkClassName,
      categoryClassName,
    };
  });

  navbarData.sort((a, b) => {
    if (a["category-index"] < b["category-index"]) return -1;
    if (a["page-index"] < b["page-index"]) return -1;
    return 1;
  });

  navbarData[0].categoryClassName = "docs-navbar--first-element";

  console.log(navbarData);

  const markdownWithMetadata = fs
    .readFileSync(path.join("docs", slug + ".md"))
    .toString();

  const parsedMarkdown = matter(markdownWithMetadata);

  const content = marked(parsedMarkdown.content);

  return {
    props: {
      content,
      data: parsedMarkdown.data,
      navbarData,
    },
  };
};

export default Page;
