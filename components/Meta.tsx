import Head from "next/head";
import React from "react";

export const Meta = ({ title, keywork, description, url }) => {
  return (
    <Head>
      <title>{title}</title>
      <link rel="icon" href="/static/favicon.png" type="image/png" />
      <meta content={description} name="description" />
      <meta content={keywork} name="keywork" />
      <meta name="og:url" content={url} />
      <meta name="og:title" content={title} />
      <meta name="og:description" content={description} />
      <meta name="og:image" content={"https://transform.tools/cover.png"} />
      <meta name="og:type" content="website" />
      <meta
        name="google-site-verification"
        content="gKxBWPnQmsbDgeECrmnYoZqVsu52BHXnIbC_hJrNdoo"
      />
      <link rel="manifest" href="/static/site.webmanifest" />
    </Head>
  );
};
