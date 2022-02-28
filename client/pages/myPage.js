import React from "react";
import Head from "next/head";
import MyPage from "../components/mypage/myPage";
import Header from "../components/Header";

const myPage = () => {
  return (
    <>
    <Head>
      <meta charSet="utf-8" />
      <title>test | MeTa</title>
    </Head>
    <Header />
    <MyPage />
  </>
  );
};

export default myPage;
