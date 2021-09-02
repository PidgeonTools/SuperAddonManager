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

const Page = ({ content, data }) => (
  <>
    <Header title={data.title + " · Documentation"} />
    <Navbar />
    <div dangerouslySetInnerHTML={{ __html: content }} />
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
  const markdownWithMetadata = fs
    .readFileSync(path.join("docs", slug + ".md"))
    .toString();

  const parsedMarkdown = matter(markdownWithMetadata);

  const content = marked(parsedMarkdown.content);

  return {
    props: {
      content,
      data: parsedMarkdown.data,
    },
  };
};

export default Page;
