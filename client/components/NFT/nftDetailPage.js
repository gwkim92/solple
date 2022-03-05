import React, { useState, useContext, useEffect } from 'react'
import { withRouter } from 'next/router'
import Styled from 'styled-components'
import { Row, Col } from 'antd'
import { TransactionContext } from '../../context/transactionContext'
const FirstDiv = Styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
  width: 100%;
  margin-Top: 3%;
`
const SecDiv = Styled.div`
  /* border: 1px solid black; */
  width: 70%;
  height: 50%;
`
const RightDiv = Styled.div`
  margin-left: 5%;
  /* border: 1px solid black; */
`
const ImgCont = Styled.img`
  border: 1px solid black;
  width: 400px;
  height: 400px;
  border-radius: 3%;
`
const TextBox = Styled.div`
  height: 100px;
  margin-left: 5%;
`
const TextDiv = Styled.div`
  border: 1px solid black;
  border-radius: 4%;
  /* margin-bottom: 3%; */
`
const BidBox = Styled.div`
  display: flex;
  justify-content: right;
  margin-right: 5%;
`
function nftDetailPage({ router: { query } }) {
  const { CurrentAccount, tokenContract, nftContract, NFTADDRESS, ToKenAddress, web3 } = useContext(TransactionContext)
  const [bidding, setbidding] = useState('')
  const [userImformation, setuserImformation] = useState('')
  const [userBid, setuserBid] = useState('')
  const DetailImg = query.nftImg;
  const DetailName = query.nftname;
  const DetailDes = query.nftDes;
  const NftId = query.nftId;
  console.log(query)
  const nftAdd = NFTADDRESS;
  
  console.log(bidding)

  const startBidding = async () => {
    //1. approveToken approveToken(buyer,process.env.NFTTOKENCA)
    //2. bid .bid(tokenId, buyer,web3.utils.toWei(bidPrice, 'ether'))
    console.log('useContext', CurrentAccount, nftAdd, tokenContract.methods)
    let approve = await tokenContract.methods.approveToken(CurrentAccount, nftAdd).send({from: CurrentAccount, gas: 300000});
    console.log(approve)
    if(approve.blockHash !== undefined){
      console.log(approve.blockHash)
      let bid = await nftContract.methods.bid(NftId, CurrentAccount, web3.utils.toWei(bidding, 'ether')).send({from: CurrentAccount});
      console.log(bid)
      }
  }

  
  // const getData = async () => {
  //   let StartAuctionDate = await nftContract.events.Start();
  //   // let BidData = await nftContract.events.Bid({filter: {sender: CurrentAccount}});
  //   // let WithdrawData = await nftContract.events.Withdraw();
  //   // let EndData = await nftContract.events.End();
  //   // let Endedat = await nftContract.events.Endedat();
  //   // console.log(StartAuctionDate, BidData, WithdrawData, EndData, Endedat)
  //   console.log(StartAuctionDate)
  // }

  // useEffect(() => {
       
  //   getData();
  // }, [])
  const getStartEnd = async() => {
    let gs = await nftContract.getPastEvents('Start', {fromBlock: 1, toBlock:'latest'})
    let ge = await nftContract.getPastEvents('Endedat', {fromBlock: 1, toBlock:'latest'})
    let gb = await nftContract.getPastEvents('Bid', {fromBlock: 1, toBlock:'latest'})
    console.log('1', gs)
    console.log('ge', ge)
    console.log('gb', gb)
    console.log('bidData', gb[0].returnValues)
    console.log('bidLength', gb.length)
   
    for (let i = 0; i < gb.length; i++) {
       if(NftId === gb[i].returnValues.nftId){
       console.log(NftId)
       console.log(gb[i].returnValues)
       const user = gb[i].returnValues.sender;
       const money = gb[i].returnValues.amount;
       setuserImformation(user);
       setuserBid(money);
       }
    }
  }

  const TransBid = (web3.utils.fromWei(web3.utils.toBN(userBid), 'ether'));
  
  useEffect(() => {
     
      getStartEnd();
    }, [])
  return (
    <FirstDiv>
      <SecDiv>
        <Row>
          <Col>
            <ImgCont src={DetailImg} />
          </Col>
          <Col style={{ width: '65%', marginLeft: '50px' }}>
            <RightDiv>
              <h1>NFT Name</h1>
              <h2>{DetailName}</h2>
              <br />
              <TextDiv>
              <h1>decription</h1>
              <h2>
                <TextBox>{DetailDes}</TextBox>
              </h2>
                <h1>경매 종료 일</h1>
                <hr />
                <h2>
                  <TextBox>D-day</TextBox>
                </h2>
                <hr />
                <br />
                <h1>현재 최고 가격</h1>
                <h2>
                  <TextBox>{TransBid}Token</TextBox>
                </h2>
                <h1>현재 최고 입찰자</h1>
                <h2>
                  <TextBox>{userImformation}</TextBox>
                </h2>
                <BidBox>
                  <input
                    style={{ border: 'none', borderBottom: '1px dashed' }}
                    onChange={(e) => {
                      setbidding(e.target.value)
                    }}
                  ></input>
                  <button onClick={startBidding}>Start Bid</button>
                </BidBox>
              </TextDiv>
            </RightDiv>
          </Col>
        </Row>
        <Row>
          <div>transaction</div>
        </Row>
      </SecDiv>
    </FirstDiv>
  )
}

export default withRouter(nftDetailPage)
