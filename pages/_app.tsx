import React, { useEffect } from "react";
import { Button, Pane } from "evergreen-ui";
import Navigator from "@components/Navigator";
import "@styles/main.css";

import NProgress from "nprogress";
import Router, { useRouter } from "next/router";
import { activeRouteData } from "@utils/routes";
import Head from "next/head";
import { Meta } from "@components/Meta";

export default function App(props) {
  const router = useRouter();

  useEffect(() => {
    let timer;

    const stopProgress = () => {
      clearTimeout(timer);
      NProgress.done();
    };

    const startProgress = () => NProgress.start();

    const showProgressBar = () => {
      timer = setTimeout(startProgress, 300);
      router.events.on("routeChangeComplete", stopProgress);
      router.events.on("routeChangeError", stopProgress);
    };

    router.events.on("routeChangeStart", showProgressBar);

    return () => {
      router.events.off("routeChangeComplete", stopProgress);
      router.events.off("routeChangeError", stopProgress);
      router.events.off("routeChangeStart", showProgressBar);
      timer && clearTimeout(timer);
    };
  }, []);

  const { Component, pageProps } = props;

  const activeRoute = activeRouteData(router.pathname);

  return (
    <>
      {router.pathname === "/" || !router.pathname ? (
        <Meta
          title={"Json格式化 - 代码片段记录"}
          url={`https://zencode.cc${router.pathname}`}
          keywork={"json格式化"}
          description={"Json格式化"}
        />
      ) : (
        <Meta
          title={activeRoute?.searchTerm + " - 代码片段记录"}
          url={`https://zencode.cc${router.pathname}`}
          keywork={activeRoute?.keyword}
          description={activeRoute?.desc}
        />
      )}
      <Pane
        display="flex"
        alignItems="center"
        flexDirection="row"
        is="header"
        height={40}
        backgroundColor="#222"
        paddingRight={20}
      >
        <Pane flex={1} display="flex" paddingX={20} className="logo-transform">
          <i className="logo-font">ZenCode</i>
          <span className="site-title"> - 代码片段记录</span>
        </Pane>
        <Pane display="flex" alignItems={"center"}>
          <a
            href="https://github.com/liujin0506/zencode/issues"
            target="_blank"
            style={{
              color: "#fff",
              textDecoration: "none"
            }}
          >
            Issues
          </a>
        </Pane>
      </Pane>
      <Pane display="flex" flexDirection="row">
        <Navigator />
        <Component {...pageProps} />
      </Pane>
    </>
  );
}
