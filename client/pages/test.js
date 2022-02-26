import React from "react";
import Head from "next/head";
import CreateNFT from "../components/NFT/createNFT";
import Header from "../components/Header";
import Test from "../components/Test";
const TestSend = () => {
  return (
    <>
    <Head>
      <meta charSet="utf-8" />
      <title>test | MeTa</title>
    </Head>
    <Header />
    <Test />
  </>
  );
};

export default TestSend;
