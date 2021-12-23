import React, { useEffect, useState } from "react";
import Link from "next/link";

// Guess the page the user wants to go to
const guessPage = require("string-similarity");
const glob = require("glob");

// Components
import Header from "../components/Header";
import { Container, Row } from "react-bootstrap";

const Custom404 = ({ funFacts, pages, addonDownloadLinks }) => {
  const [suggestedPage, setSuggestedPage] = useState({
    bestMatch: { target: "#" },
  });

  useEffect(() => {
    setSuggestedPage(guessPage.findBestMatch(window.location.pathname, pages));
    console.log(guessPage.findBestMatch(window.location.pathname, pages));
  }, []);

  const funFact = funFacts[Math.floor(Math.random() * funFacts.length)];
  return (
    <>
      <Header title="Error 404" />

      {/* Error Message */}
      <section className="error-404-message">
        <Container>
          <h1>You’ve found a secret place.</h1>
          <div className="error-404-message--text">
            If you want to, you can{" "}
            <Link href="/">
              <a>go home</a>
            </Link>{" "}
            or{" "}
            <Link href={suggestedPage.bestMatch.target}>
              <a target="_blank" rel="noopener noreferrer">
                try this page
              </a>
            </Link>
            , but here’s a secret for you: Super Addon Manager isn’t the only
            addon that we created. You can download the other Pidgeon tools
            addons directly from here:
          </div>
          {/* DOWNLOAD LINKS */}
          <div className="error-404-message--links">
            {addonDownloadLinks.map((addon) => (
              <Link key={addon.name} href={addon.link}>
                <a>{addon.name}</a>
              </Link>
            ))}
          </div>
          {/* FUN FACT */}
          <div>Fun Fact: {funFact}</div>
        </Container>
      </section>

      {/* CONTACT LINK */}
      <div>
        You are 100% sure this page should be here?{" "}
        <Link href="https://discord.gg/hGzHDA7bj9">
          <a target="_blank" rel="noopener noreferrer">
            Contact us via Discord!
          </a>
        </Link>
      </div>
    </>
  );
};

export const getStaticProps = () => {
  const funFacts = require("../data/fun-facts.json");
  const addonDownloadLinks = require("../data/404-download-links.json");
  let pages = [];

  // Clean up the file paths and bring them into a URL path format.
  const getPagePaths = (files) => {
    let pages = [];
    files.map((file) => {
      if (file.endsWith(".md")) {
        file = "/" + file.substring(0, file.length - 3);
      }
      if (file.endsWith(".js")) {
        file = file.substring(5, file.length - 3);
      }
      if (file.endsWith("index")) {
        file = file.substring(0, file.length - 5);
      }

      if (!file.endsWith("[slug]")) {
        pages = pages.concat(file);
      }
    });

    return pages;
  };

  // Get documentation pages
  pages = pages.concat(getPagePaths(glob.sync("docs/**/*.md")));

  // Get all other pages
  pages = pages.concat(
    getPagePaths(
      glob.sync("pages/**/*.js", { ignore: ["**/404.js", "**/_app.js"] })
    )
  );

  return {
    props: {
      funFacts,
      pages,
      addonDownloadLinks,
    },
  };
};

export default Custom404;
