// import axios from 'axios'
import React, { useState, useContext } from 'react'
import Link from 'next/link'
import NftDetailPage from '../nftDetailPage';

const UserAuctionCard = ({ UserNftlist }) => {
  console.log(UserNftlist)

  const [nftdata, setnftdata] = useState("");

  function Auction(nftdata) {
        setnftdata(nftdata);
    }


  return (
    <div>
      {UserNftlist.map((token) => {
        return (
          <div>
            <img src={token.IMGURI} width={300} />
            <div>NFTname: {token.NFTname}</div>
            <div>NFTDescription: {token.NFTDes}</div>
            <div>
              <Link href={{pathname: '/NftDetail/[id]', 
                      query: 
                      { 
                        nftImg: token.IMGURI,
                        nftname: token.NFTname,
                        nftDes: token.NFTDes
                      }, }} as = {`/NftDetail/${token.tokenId}`}>
                <button onClick={() => Auction(token)} >Auction</button>
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default UserAuctionCard