import React, { useState, useContext, useEffect } from 'react'
import { TransactionContext } from '../../context/transactionContext';
import NftCardTemp from '../CardNft/NftCardTemp';
import axios from "axios";

function myPage() {
    const { connectWallet, CurrentAccount, nftContract, web3 } = useContext(TransactionContext)
    console.log(connectWallet, web3, nftContract)
    // const [NftCardTemp, setNftCardTemp] = useState([]);
    const [UserNftlist, setUserNftlist] = useState([]);

    // const getMyTokens = async () => {
    //     try{
    //         const balanceLength = await nftContract.methods.balanceOf(CurrentAccount).call();
    //         const NftCardArray = [];

    //         // let total = contract.methods.showeAllToken.call()
    //         // let totalArr = [];

    //         for (let i = 0; i < parseInt(balanceLength, 10); i++){
    //             const nftTokenId = await nftContract.methods.tokenOfOwnerByIndex(CurrentAccount, i).call();
    //             const nftType = await nftContract.methods.TestTypes(nftTokenId).call();
    //             // const nftTokenURI = await nftContract.methods.tokenURI(i).call();

    //             NftCardArray.push(nftType);
    //             // NftCardArray.push(nftTokenURI);
    //         }

    //         setNftCardTemp(NftCardArray);
    //     }catch(error){
    //         console.log(error)
    //     }
    // }
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
                console.log(get.data)
                let IMGURI = get.data.imgURI
                let NFTname = get.data.nftName
                let NFTDes = get.data.nftDescription
                setUserNftlist((prevState) => {
                    return [...prevState, { name, symbol, tokenId, IMGURI, NFTname, NFTDes}];
                });
            }
        }
  }


    useEffect(() => {
      if (!CurrentAccount) return;
      getUserNftList();
    }, [CurrentAccount])

    useEffect(() => {
        console.log(NftCardTemp)
      }, [NftCardTemp])

    console.log('list', UserNftlist)
  return (
    <div>
        {/* {NftCardTemp && NftCardTemp.map((v, i) => {
            return <NftCard key={i} nftType={v}/>
        })} */}
        <NftCardTemp UserNftlist={UserNftlist} />
    </div>
  )
}

export default myPage