import React, { useState, useContext, useEffect } from 'react'
import { TransactionContext } from '../../context/transactionContext';
import NftCardTemp from '../CardNft/NftCardTemp';
import axios from "axios";

function myPage() {
    const { connectWallet, CurrentAccount, nftContract, web3 } = useContext(TransactionContext)
    const [UserNftlist, setUserNftlist] = useState([]);
    console.log(connectWallet, web3, nftContract)
    const [satting, setsatting] = useState(false)

    const getUserNftList= async () => {
        
        const name = await nftContract.methods.name().call();
        const symbol = await nftContract.methods.symbol().call();
        const totalSupply = await nftContract.methods.totalSupply().call();
        let arr = [];
		  for (let i = 1; i <= totalSupply; i++) {
		      arr.push(i);
		  }
        
          for (let tokenId of arr) {
            let tokenOwner = await nftContract.methods
                .ownerOf(tokenId)
                .call();
            if (String(tokenOwner).toLowerCase() === CurrentAccount) {
                let tokenURI = await nftContract.methods
                    .tokenURI(tokenId)
                    .call();
                let get = await axios.get(`https://ipfs.io/ipfs/${tokenURI}`)
                let IMGURI = await get.data.imgURI
                let NFTname = await get.data.nftName
                let NFTDes = await get.data.nftDescriptionz
                setUserNftlist((prevState) => {
                  setsatting(true)
                    return [...prevState, { name, symbol, tokenId, IMGURI, NFTname, NFTDes}];
                } );
                // setUserNftlist([get.data]);
            }
        }
  }

console.log(UserNftlist)
    useEffect(() => {
      if (!CurrentAccount) return;
      getUserNftList();
    }, [CurrentAccount])

    useEffect(() => {
        console.log(NftCardTemp)
      }, [NftCardTemp])

 
  return (
    <div>
      {satting ? 
      <NftCardTemp UserNftlist={UserNftlist} /> 
      : null } 
    </div>
  )
}

export default myPage

