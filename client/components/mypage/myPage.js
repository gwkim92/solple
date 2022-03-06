import React, { useState, useContext, useEffect } from 'react'
import { TransactionContext } from '../../context/transactionContext';
import NftCardTemp from '../CardNft/NftCardTemp';
import MyAuctionList from './MyAuctionList';
import axios from "axios";

function myPage() {
    const { connectWallet, CurrentAccount, nftContract, web3 } = useContext(TransactionContext)
    const [UserNftlist, setUserNftlist] = useState([]);
    console.log(connectWallet, web3, nftContract)
    const [satting, setsatting] = useState(false)
    const [check, setCheck] = useState(false);
    const [likeOption, setlikeOption] = useState("");
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
            }
        }

        
  }
  //내가 판매중인 리스트 가져오기
//1. start 이벤트 가져오기 (유저 add, nftid)
//2. 이벤트 길이 측정하고 
// for (let i = 0; i < getStart.length; i++) {
//   if(NftId === getStart[i].returnValues.nftId){
//    if(auctionnor === CurrentAccount){
          // let AuctionURI = await nftContract.methods.tokenURI(getStart[i].returnValues.nftId)
// }

  const obj = {
    0: <NftCardTemp UserNftlist={UserNftlist}/>,
    1: <MyAuctionList />,
  };
  function likeResult(click) {
    if (click === "NftCardTemp") {
      setlikeOption(0);
      setCheck(true);
    } else if (click === "MyAuctionList") {
      setlikeOption(1);
      setCheck(true);
    }
  }
    useEffect(() => {
      if (!CurrentAccount) return;
      getUserNftList();
    }, [CurrentAccount])

    useEffect(() => {
        console.log(NftCardTemp)
      }, [NftCardTemp])
    
 
  return (
    // <div>
    //   {satting ? 
    //   <NftCardTemp UserNftlist={UserNftlist} /> 
    //   : null } 
    // </div>
    <div>
      <div>
      <button
          className="me-3"
          variant="light"
          onClick={() => {
            likeResult( "NftCardTemp");
          }}
        >
          My NFT List
        </button>
        <button
          className="me-3"
          variant="light"
          onClick={() => {
            likeResult("MyAuctionList");
          }}
        >
          My Auction List
        </button>
        </div>
        {check === true ? <div>{obj[likeOption]}</div> : <div></div>}
    </div>
  )
}

export default myPage

