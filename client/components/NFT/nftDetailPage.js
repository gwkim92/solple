import React, { useState, useContext, useEffect, useCallback } from 'react'
import { withRouter } from 'next/router'
import Styled from 'styled-components'
import { Row, Col } from 'antd'
import { TransactionContext } from '../../context/transactionContext'
import moment from "moment";
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
  const [bidding, setbidding] = useState('');
  const [userImformation, setuserImformation] = useState('');
  const [userBid, setuserBid] = useState('');
  const [dateTarget, setdateTarget] = useState('');
  const [complete, setComplete] = useState(false);
  const DetailImg = query.nftImg;
  const DetailName = query.nftname;
  const DetailDes = query.nftDes;
  const NftId = query.nftId;
  const nftAdd = NFTADDRESS;
  
 

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

  const getStartEnd = async() => {
    // let gs = await nftContract.getPastEvents('Start', {fromBlock: 1, toBlock:'latest'})
    let ge = await nftContract.getPastEvents('Endedat', {fromBlock: 1, toBlock:'latest'})
    let gb = await nftContract.getPastEvents('Bid', {fromBlock: 1, toBlock:'latest'})
    // console.log(ge)
       
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
    for(let i = 0; i < gb.length; i++){
      if(NftId === ge[i].returnValues.nftId){
        const target = ge[i].returnValues.target;
        // console.log(target)
        setdateTarget(target);
      }
    }
  }

  const TransBid = (web3.utils.fromWei(web3.utils.toBN(userBid), 'ether'));

  const today = new Date(dateTarget * 1000);

  const countDown = useCallback((data) => {
    let timer;
    let _vDate = data;
    let _second = 1000;
    let _minute = _second * 60;
    let _hour = _minute * 60;
    let _day = _hour * 24;
    console.log(_vDate)
    function showRemaining() {
      try {
        if (data !== undefined) {
          let now = moment();
          // let now = new Date().getTime();
          let distDt = _vDate - now;
          // console.log('2', distDt)
          if (distDt < 0) {
            clearInterval(timer);
            let HapDate =
              // '0' + 'd ' +
              "0" + "h " + "0" + "m " + "0" + "s ";
            document.getElementById("timer").innerHTML = HapDate;
            // console.log('1',HapDate)
            return;
          } else {
            setComplete(true);
            // let days = Math.floor(distDt / _day);
            let hours = Math.floor(distDt  / _hour);
            let minutes = Math.floor((distDt % _hour) / _minute);
            let seconds = Math.floor((distDt % _minute) / _second);
            let HapDate =
              // parseInt(days) +
              // 'd ' +
              parseInt(hours) +
              " : " +
              parseInt(minutes) +
              " : " +
              parseInt(seconds) +
              " ";
            document.getElementById("timer").innerHTML = HapDate;
            // console.log('1',HapDate)
          }
        }
      } catch (e) {
        console.log(e);
      }
    }

    timer = setInterval(showRemaining, 1000);
  }, []);
  


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
                <h1>경매 남은 시간</h1>
                <hr />
                <h2>
                  <TextBox><div><span id="timer" className="timer">{countDown(today)}</span></div></TextBox>
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
