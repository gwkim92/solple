import React, { useState, useContext, useEffect } from 'react'
import { TransactionContext } from '../../context/transactionContext'
import NftCardTemp from '../CardNft/NftCardTemp'
import MyAuctionList from './MyAuctionList'
import axios from 'axios'
import { Card, Button } from 'react-bootstrap'
import styled from 'styled-components';

const Div = styled.div`
  width: 50%;
  height: 50%;
  display: flex;
  flex-wrap: wrap;
  border: none;
  border-radius: 50px;
  margin: 1% 0 1% 25%;
  padding-bottom: 1%;
  box-shadow: 4px 12px 20px 6px rgb(0 0 0 / 50%);
`

function myPage() {
  const { connectWallet, CurrentAccount, nftContract, web3 } =
    useContext(TransactionContext)
  const [UserNftlist, setUserNftlist] = useState([])
  console.log(connectWallet, web3, nftContract)
  // const [satting, setsatting] = useState(false)
  const [check, setCheck] = useState(false)
  const [likeOption, setlikeOption] = useState('')
  const [AuctionListData, setAuctionListData] = useState([])
  // const [listsatting, setlistsatting] = useState(false);
  const getUserNftList = async () => {
    const name = await nftContract.methods.name().call()
    const symbol = await nftContract.methods.symbol().call()
    const totalSupply = await nftContract.methods.totalSupply().call()
    let arr = []
    for (let i = 1; i <= totalSupply; i++) {
      arr.push(i)
    }

    for (let tokenId of arr) {
      let tokenOwner = await nftContract.methods.ownerOf(tokenId).call()
      if (String(tokenOwner).toLowerCase() === CurrentAccount) {
        let tokenURI = await nftContract.methods.tokenURI(tokenId).call()
        let get = await axios.get(`https://ipfs.io/ipfs/${tokenURI}`)
        let IMGURI = await get.data.imgURI
        let NFTname = await get.data.nftName
        let NFTDes = await get.data.nftDescription
        setUserNftlist((prevState) => {
          // setsatting(true)
          return [
            ...prevState,
            { name, symbol, tokenId, IMGURI, NFTname, NFTDes },
          ]
        })
      }
    }
  }
  // console.log(UserNftlist)
  //내가 판매중인 리스트 가져오기
  //1. start 이벤트 가져오기 (유저 add, nftid)
  //2. 이벤트 길이 측정하고
  // for (let i = 0; i < getStart.length; i++) {
  //   if(NftId === getStart[i].returnValues.nftId){
  //    if(auctionnor === CurrentAccount){
  // let AuctionURI = await nftContract.methods.tokenURI(getStart[i].returnValues.nftId)
  // }
  const getMyAuctionList = async () => {
    let getAuction = await nftContract.getPastEvents('Start', {
      fromBlock: 1,
      toBlock: 'latest',
    })
    console.log(getAuction[0].returnValues.auctionor, CurrentAccount)
    for (let i = 0; i < getAuction.length; i++) {
      if (
        CurrentAccount ===
        String(getAuction[i].returnValues.auctionor).toLowerCase()
      ) {
        // console.log('1')
        let AuctionMyNftId = getAuction[i].returnValues.nftId
        console.log('id', AuctionMyNftId)
        let getAuctionURI = await nftContract.methods
          .tokenURI(AuctionMyNftId)
          .call()
        console.log(getAuctionURI)
        let getData = await axios.get(`https://ipfs.io/ipfs/${getAuctionURI}`)
        let AuctionURI = await getData.data.imgURI
        let AuctionName = await getData.data.nftName
        let AuctionDes = await getData.data.nftDescription
        setAuctionListData((prevState) => {
          // setlistsatting(false)
          return [
            ...prevState,
            { AuctionURI, AuctionName, AuctionDes, AuctionMyNftId },
          ]
        })
      }
    }
  }

  const obj = {
    0: <NftCardTemp UserNftlist={UserNftlist} />,
    1: <MyAuctionList AuctionListData={AuctionListData} />,
  }
  function likeResult(click) {
    if (click === 'NftCardTemp') {
      setlikeOption(0)
      setCheck(true)
    } else if (click === 'MyAuctionList') {
      setlikeOption(1)
      setCheck(true)
    }
  }
  useEffect(() => {
    if (!CurrentAccount) return
    getUserNftList(), getMyAuctionList()
  }, [CurrentAccount])

  useEffect(() => {
    console.log(NftCardTemp)
  }, [NftCardTemp])

  return (
    <div>
      <Div>
      <Card
        bg="black"
        text="white"
        border="white"
        style={{ borderRadius: '4%' }}
      >
        <Card.Body  >
          <Card.Title>My PublicKey : {CurrentAccount}</Card.Title>
        </Card.Body>
      </Card>
      </Div>
      <br />
      <br />
      
      <div style={{display : 'flex', justifyContent: 'center'}}>
        <button
          className="me-3"
          variant="light"
          onClick={() => {
            likeResult('NftCardTemp')
          }}
        >
          My NFT List
        </button>
        <button
          className="me-3"
          variant="light"
          onClick={() => {
            likeResult('MyAuctionList')
          }}
        >
          My Auction List
        </button>
      </div>
      <hr />
      {check === true ? <div>{obj[likeOption]}</div> : <div></div>}
    </div>
  )
}

export default myPage
