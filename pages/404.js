import React, { useEffect, useState } from "react";
import Link from "next/link";

// Guess the page the user wants to go to
const guessPage = require("string-similarity");
const glob = require("glob");

// Components
import Header from "../components/Header";
import { Col, Container, Row } from "react-bootstrap";

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
          {/* ERROR MESSAGE TEXT */}
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
          <div className="error-404-message--link-container error-404-message--text">
            {addonDownloadLinks.map((addon) => (
              <>
                <Link key={addon.name} href={addon.link}>
                  <a>{addon.name}</a>
                </Link>{" "}
              </>
            ))}
          </div>
          {/* FUN FACT */}
          <div className="error-404-message--text">Fun Fact: {funFact}</div>
        </Container>
        {/* BOTTOM WAVES */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 315">
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,160L34.3,144C68.6,128,137,96,206,112C274.3,128,343,192,411,229.3C480,267,549,277,617,234.7C685.7,192,754,96,823,90.7C891.4,85,960,171,1029,197.3C1097.1,224,1166,192,1234,170.7C1302.9,149,1371,139,1406,133.3L1440,128L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z"
          ></path>
        </svg>
      </section>

      {/* CONTACT LINK */}
      <div className="error-404-message--text error-404-message--link-container error-404-message--contact">
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

  pages.sort((a, b) => {
    return a.length - b.length;
  });

  return {
    props: {
      funFacts,
      pages,
      addonDownloadLinks,
    },
  };
};

export default Custom404;
