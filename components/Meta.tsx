import Head from "next/head";
import React from "react";

export const Meta = ({ title, description, url }) => {
  return (
    <Head>
      <title>{title}</title>
      <link rel="icon" href="/static/favicon.png" type="image/png" />
      <meta content={description} name="description" />
      <link rel="manifest" href="/static/site.webmanifest" />
    </Head>
  );
};
