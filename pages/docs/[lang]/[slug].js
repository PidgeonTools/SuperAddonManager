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
import Header from "../../../components/Header";
import Navbar from "../../../components/Navbar";
import CopyButton from "../../../components/CopyButton";
import DocumentationImage from "../../../components/docs/DocumentationImage";
import {
  BlInfoVersionProblems,
  SamNotSupported,
  UrlInvalid,
  EndpointOffline,
  InvalidEndpoint,
  EndpointInvalidSchema,
  UnknownError,
} from "../../../components/request-support/ErrorCodes";

// Translations
import IntlWrapper from "../../../components/IntlWrapper";

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

const Page = ({
  content,
  data,
  lang = "en",
  navbarData,
  previousArticle,
  nextArticle,
}) => (
  <IntlWrapper>
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
                    <Link href={"/docs/" + lang + "/" + pageData.file}>
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
      <main id="main">
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
              SamNotSupported: {
                component: SamNotSupported,
              },
              BlInfoVersionProblems: {
                component: BlInfoVersionProblems,
              },
              UrlInvalid: {
                component: UrlInvalid,
              },
              EndpointOffline: {
                component: EndpointOffline,
              },
              InvalidEndpoint: {
                component: InvalidEndpoint,
              },
              EndpointInvalidSchema: {
                component: EndpointInvalidSchema,
              },
              UnknownError: {
                component: UnknownError,
              },
              DocumentationImage: {
                component: DocumentationImage,
              },
            },
          }}
        >
          {content}
        </Markdown>

        <div className="d-flex">
          {/* PREVIOUS PAGE BUTTON */}
          <>
            {previousArticle ? (
              <Link href={"/docs/" + lang + "/" + previousArticle.file}>
                <div className="docs-navigate-one-page docs-navigate-one-page--previous">
                  <div className="docs-navigate-one-page--static-label">
                    Previous
                  </div>
                  <div className="docs-navigate-one-page--dynamic-label">
                    « {previousArticle.title}
                  </div>
                </div>
              </Link>
            ) : (
              ""
            )}
          </>
          {/* NEXT PAGE BUTTON */}
          <>
            {nextArticle ? (
              <Link href={"/docs/" + lang + "/" + nextArticle.file}>
                <div className="docs-navigate-one-page docs-navigate-one-page--next">
                  <div className="docs-navigate-one-page--static-label">
                    Next
                  </div>
                  <div className="docs-navigate-one-page--dynamic-label">
                    {nextArticle.title} »
                  </div>
                </div>
              </Link>
            ) : (
              ""
            )}
          </>
        </div>
      </main>
    </div>
  </IntlWrapper>
);

export const getStaticPaths = async () => {
  const folders = readdirSync("docs");

  const paths_outer = folders.map((folder) => {
    const files = readdirSync("docs/" + folder);

    const paths_inner = files.map((filename) => ({
      params: {
        lang: folder,
        slug: filename.replace(".md", ""),
      },
    }));

    return paths_inner;
  });

  // Concat all subarrays into one array to avoid Next JS errors.
  const paths = [].concat.apply([], paths_outer);

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params: { slug, lang } }) => {
  const files = readdirSync(path.join("docs", lang));
  const navbarData = files.map((filename) => {
    let categoryClassName = "";

    const fileData = fs
      .readFileSync(path.join("docs", lang, filename))
      .toString();
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

  // Set the data of the previous and next article for the navigation buttons at the bottom of the page.
  let previousArticle = null;
  let nextArticle = null;
  for (let index = 0; index < navbarData.length; index++) {
    if (!navbarData[index].isActive) continue;
    if (index > 0) {
      previousArticle = navbarData[index - 1];
    }
    if (index < navbarData.length - 1) {
      nextArticle = navbarData[index + 1];
    }
  }

  // console.log(navbarData);

  const markdownWithMetadata = fs
    .readFileSync(path.join("docs", lang, slug + ".md"))
    .toString();

  const parsedMarkdown = matter(markdownWithMetadata);

  return {
    props: {
      content: parsedMarkdown.content,
      data: parsedMarkdown.data,
      lang,
      navbarData,
      previousArticle,
      nextArticle,
    },
  };
};

export default Page;
