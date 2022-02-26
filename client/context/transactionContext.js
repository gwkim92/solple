import React, { useState, useEffect } from 'react'
import Nftabi from '../abi/Nft';
import Web3 from 'web3';

// const web3 = new Web3(
// 	new Web3.providers.HttpProvider(
// 		'https://ropsten.infura.io/v3/c2cc008afe67457fb9a4ee32408bcac6'
// 	)
// );
///////////////////////////////////////////

// const web3 = await getWeb3();
///////////////////////////////////////////

export const TransactionContext = React.createContext()

let eth

if (typeof window !== 'undefined') {
    eth = window.ethereum
}
console.log(eth)

const web3 = new Web3(eth)
// await web3.eth.getBalance(serverAddress);

const serverAddress = process.env.SERVERADDRESS;
const serverPrivateKey = process.env.SERVERPRIVATE;
const NFTADDRESS = process.env.NFTADDRESS

const newContract = (web3, abi, ca) => {
	return new web3.eth.Contract(abi, ca, {
		from: serverAddress,
		gas: 3000000,
	});
};
const nftContract = newContract(web3, Nftabi, NFTADDRESS); // nft

export const TransactionProvider = ({ children }) => {
  const [CurrentAccount, setCurrentAccount] = useState()

  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  const connectWallet = async (metamask = eth) => {
    console.log(await web3.eth.getBalance(serverAddress));
    try {
      if (!metamask) return alert('Please install metamask ')

      const accounts = await metamask.request({ method: 'eth_requestAccounts' })
      console.log('request', accounts)
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.error(error)
      throw new Error('No ethereum object.')
    }
  }
  const checkIfWalletIsConnected = async (metamask = eth) => {
    try {
      if (!metamask) return alert('Please install metamask ')

      const accounts = await metamask.request({ method: 'eth_accounts' })

      if (accounts.length) {
        setCurrentAccount(accounts[0])
        console.log('wallet is alreday connected')
      }
    } catch (error) {
      console.error(error)
      throw new Error('No ethereum object.')
    }
  }

  return (
      <TransactionContext.Provider
          value = {{
              CurrentAccount,
              connectWallet,
              checkIfWalletIsConnected,
              nftContract,
              serverAddress,
              serverPrivateKey,
              web3,
              NFTADDRESS
          }}
        >
            {children}
      </TransactionContext.Provider>
  )
}
