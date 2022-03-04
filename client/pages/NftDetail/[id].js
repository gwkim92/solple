import React from "react";
import Head from "next/head";
import Header from "../../components/Header";
import NftDetailPage from "../../components/NFT/nftDetailPage";


const NftDetail = () => {
  return (
    <>
    <Head>
      <meta charSet="utf-8" />
      <title>DetailAuctionPage | MeTa</title>
    </Head>
    <Header />
    <NftDetailPage />
  </>
  );
};

export default NftDetail;
