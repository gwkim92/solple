import React from "react";
import Head from "next/head";
import Header from "../components/Header";
import UserAuctionList from "../components/NFT/AuctionList/UserAuctionList";

const UserAuctionPage = () => {
  return (
    <>
    <Head>
      <meta charSet="utf-8" />
      <title>Auction | MeTa</title>
    </Head>
    <Header />
    <UserAuctionList />
  </>
  );
};

export default UserAuctionPage;
