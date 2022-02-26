import React from 'react'
import Head from 'next/head'
import CreateNFT from '../components/NFT/createNFT'
import Header from '../components/Header'

const CreateNft = () => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>CreateNFT | MeTa</title>
      </Head>
      <Header />
      <CreateNFT />
    </>
  )
}

export default CreateNft
