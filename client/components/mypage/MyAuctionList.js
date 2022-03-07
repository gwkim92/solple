// import axios from 'axios'
import React, { useState, useContext, useEffect, useCallback } from 'react'
import { TransactionContext } from '../../context/transactionContext'
import moment from 'moment'
import styled from 'styled-components';
import { Modal,Card, Button } from "react-bootstrap";
const Div = styled.div`
margin: 2%;
border-radius: 4%;
display: flex;
box-shadow: 4px 12px 30px 6px rgb(0 0 0 / 9%);
transition: all 0.2s ease-in-out;
&:hover {

  box-shadow: 4px 12px 20px 6px rgb(0 0 0 / 18%);
  transform: translateY(5px);

}
`
const MyAuctionList = ({ AuctionListData }) => {
  const { CurrentAccount, nftContract, web3 } = useContext(TransactionContext)
  const [Auctionsell, setsellPrice] = useState('')
  const [onSale, setonSale] = useState(false)
  const [dateTarget, setdateTarget] = useState('')
  const [userBid, setuserBid] = useState('')
  const [complete, setComplete] = useState(false)
  // console.log('log', AuctionListData)
  let NFTid = AuctionListData[0].AuctionMyNftId
  // console.log(NFTid)

  const endAuction = async () => {
    let aa = await nftContract.methods
      .end(NFTid, CurrentAccount)
      .send({ from: CurrentAccount })
    console.log(aa)
  }

  const getStartEnd = async () => {
    // let gs = await nftContract.getPastEvents('Start', {fromBlock: 1, toBlock:'latest'})
    let ge = await nftContract.getPastEvents('Endedat', {
      fromBlock: 1,
      toBlock: 'latest',
    })
    let gb = await nftContract.getPastEvents('Bid', {
      fromBlock: 1,
      toBlock: 'latest',
    })
    console.log(ge.length)
    console.log(gb.length)
    for (let i = 0; i < gb.length; i++) {
      console.log('1')
      if (NFTid === gb[i].returnValues.nftId) {
        console.log(NFTid)
        console.log(gb[i].returnValues)
        const user = gb[i].returnValues.sender
        const money = gb[i].returnValues.amount
        setuserImformation(user)
        setuserBid(money)
      }
    }
    for (let i = 0; i < ge.length; i++) {
      console.log('1')
      if (NFTid === ge[i].returnValues.nftId) {
        const target = ge[i].returnValues.target
        console.log('tar', target)
        setdateTarget(target)
      }
    }
  }

  const TransBid = web3.utils.fromWei(web3.utils.toBN(userBid), 'ether')

  const today = new Date(dateTarget * 1000)

  const countDown = useCallback((data) => {
    let timer
    let _vDate = data
    let _second = 1000
    let _minute = _second * 60
    let _hour = _minute * 60
    let _day = _hour * 24
    console.log(_vDate)
    function showRemaining() {
      try {
        if (data !== undefined) {
          let now = moment()
          // let now = new Date().getTime();
          let distDt = _vDate - now
          // console.log('2', distDt)
          if (distDt < 0) {
            clearInterval(timer)
            let HapDate =
              // '0' + 'd ' +
              '0' + 'h ' + '0' + 'm ' + '0' + 's '
            document.getElementById('timer').innerHTML = HapDate
            // console.log('1',HapDate)
            return
          } else {
            setComplete(true)
            // let days = Math.floor(distDt / _day);
            let hours = Math.floor(distDt / _hour)
            let minutes = Math.floor((distDt % _hour) / _minute)
            let seconds = Math.floor((distDt % _minute) / _second)
            let HapDate =
              // parseInt(days) +
              // 'd ' +
              parseInt(hours) +
              ' : ' +
              parseInt(minutes) +
              ' : ' +
              parseInt(seconds) +
              ' '
            document.getElementById('timer').innerHTML = HapDate
            // console.log('1',HapDate)
          }
        }
      } catch (e) {
        console.log(e)
      }
    }

    timer = setInterval(showRemaining, 1000)
  }, [])

  useEffect(() => {
    getStartEnd()
  }, [])

  return (
    <div>
      {AuctionListData.map((token) => {
        return (
          <Div>
            <Card bg='black' text='white' border='white' style={{ width:'25rem', borderRadius:'4%', margin:"auto",borderRadius:'4%' }}>
            <Card.Img variant="top" src={token.AuctionURI} style={{ width: '100%', height:'25rem', borderTopLeftRadius:'4%',borderTopRightRadius:"4%" }} />
            <Card.Body>
            <Card.Title>NFTname: {token.AuctionName}</Card.Title>
            <Card.Text>NFTDescription: {token.AuctionDes}
            <br/>
            <h1>현재 최고 가격</h1>
            <h2>
              <div>{TransBid}Token</div>
            </h2>
            <div>
              <span id="timer" className="timer">
                {countDown(today)}
              </span>
            </div>
            </Card.Text>
            <div>
              {onSale ? (
                <div>판매중</div>
              ) : (
                <div>
                  <button onClick={endAuction}>경매종료</button>
                </div>
              )}
            </div>
            </Card.Body>
            </Card>
          </Div>
        )
      })}
    </div>
  )
}

export default MyAuctionList
