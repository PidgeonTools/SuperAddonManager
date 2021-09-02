import React from "react";
import Head from "next/head";

const Header = ({ title }) => (
  <Head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script src="./bootstrap/bootstrap.bundle.min.js"></script>

    <title>{title + " · Super Addon Manager"}</title>
    <link
      href="https://fonts.googleapis.com/css2?family=Cabin:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <link rel="icon" href="./favicon.ico" />
  </Head>
);

export default Header;
