import React from "react";
import Head from "next/head";

const Header = ({
  children = <></>,
  title,
  description = "Super Addon Manager (SAM) - a decentralized addon updater and manager for Blender. Keep (all) your addons up to date using SAM!",
}) => {
  title = title + " · Super Addon Manager";
  return (
    <Head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {/* <meta
        name="author"
        content="Blender Defender,Chris Bond,Kevin Lorengel"
      />
      <meta
        name="author"
        content="Blender Defender,Chris Bond,Kevin Lorengel"
      />
      <meta name="description" content={description} /> */}

      {/* OPEN GRAPH */}
      {/* <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="LINK TO THE IMAGE FILE" />
      <meta property="og:image:alt" content="ALT TEXT FOR THE IMAGE FILE" /> */}

      {/* TWITTER */}
      {/* <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="LINK TO THE IMAGE FILE" />
      <meta name="twitter:card" content="summary_large_image" /> */}

      <meta name="robots" content="noindex" />
      <title>{title}</title>
      <link
        href="https://fonts.googleapis.com/css2?family=Cabin:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <link rel="icon" href="./favicon.ico" />
      {children}
    </Head>
  );
};

export default Header;
