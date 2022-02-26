import React from 'react'
import 'antd/dist/antd.css'
import Head from 'next/head'
import { TransactionProvider } from '../context/transactionContext'
// import wrapper from "../store/configureStore";

const Myapp = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>MeTa</title>
      </Head>
      <TransactionProvider>
        <Component {...pageProps} />
      </TransactionProvider>
    </>
  )
}

export default Myapp
