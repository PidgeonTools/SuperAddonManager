import React from "react";
import fs from "fs";
import Head from "next/head";
import path from "path";
import matter from "gray-matter";
import marked from "marked";

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

const Post = ({ htmlString, data }) => {
  return (
    <>
      <Head>
        <title>{data.title}</title>
        <meta name="description" content={data.description} />
      </Head>
      <div dangerouslySetInnerHTML={{ __html: htmlString }}></div>
    </>
  );
};

export const getStaticPaths = async () => {
  const files = fs.readdirSync("posts");
  console.log("Files:", files);

  const paths = files.map((filename) => ({
    params: {
      slug: filename.replace(".md", ""),
    },
  }));
  console.log("Paths: ", paths);

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params: { slug } }) => {
  const mdWithMetadata = fs
    .readFileSync(path.join("posts", slug + ".md"))
    .toString();

  const parsedMd = matter(mdWithMetadata);

  const htmlString = marked(parsedMd.content);

  return {
    props: {
      htmlString,
      data: parsedMd.data,
    },
  };
};

export default Post;
