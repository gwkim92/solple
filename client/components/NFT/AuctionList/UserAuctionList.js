import React, { useState, useContext, useEffect } from 'react'
import { TransactionContext } from '../../../context/transactionContext';
import UserAuctionCard from './UserAuctionCard';
import axios from "axios";

function UserAuctionList() {
    const {CurrentAccount,nftContract, NFTADDRESS } = useContext(TransactionContext)
    const [satting, setsatting] = useState(false)
    const [UserNftlist, setUserNftlist] = useState([]);
  


    const getUserAuctionList = async () => {
        
        const totalSupply = await nftContract.methods.totalSupply().call();
       
        let arr = [];
		  for (let i = 1; i <= totalSupply; i++) {
		      arr.push(i);
		  }
        
          for (let tokenId of arr) {
            let tokenOwner = await nftContract.methods
                .ownerOf(tokenId)
                .call();
            
            if (String(tokenOwner).toLowerCase() === String(NFTADDRESS).toLowerCase()) {
                let tokenURI = await nftContract.methods
                    .tokenURI(tokenId)
                    .call();
                let get = await axios.get(`https://ipfs.io/ipfs/${tokenURI}`)
                let IMGURI = await get.data.imgURI;
                let NFTname = await get.data.nftName;
                let NFTDes = await get.data.nftDescription;
                
                setUserNftlist((prevState) => {
                  setsatting(true)
                    return [...prevState, {tokenId, IMGURI, NFTname, NFTDes}];
                } );
               
            }
        }
    }

    useEffect(() => {
       
        getUserAuctionList();
      }, [])
  
      useEffect(() => {
          console.log(UserAuctionCard)
        }, [UserAuctionCard])
  return (
    <div>
      {satting ? 
        <UserAuctionCard UserNftlist={UserNftlist} /> 
      : null } 
    </div>
  )
}

export default UserAuctionList