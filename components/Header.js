import React from "react";
import Head from "next/head";

const Header = ({ title, description = "" }) => (
  <Head>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    {/* <meta name="author" content="Blender Defender,Chris Bond,Kevin Lorengel" />
    <meta name="description" content={description} /> */}
    <meta name="robots" content="noindex" />

    <title>{title + " · Super Addon Manager"}</title>
    <link
      href="https://fonts.googleapis.com/css2?family=Cabin:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <link rel="icon" href="./favicon.ico" />
  </Head>
);

export default Header;
