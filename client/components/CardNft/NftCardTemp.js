// import axios from 'axios'
import React, { useState, useContext, useEffect } from 'react'
import { TransactionContext } from '../../context/transactionContext';
const NftCardTemp = ({ UserNftlist }) => {

  const {CurrentAccount, nftContract, web3 } = useContext(TransactionContext)
  const [Auctionsell, setsellPrice] = useState("");
  const [onSale, setonSale] = useState(false);
    console.log('log', UserNftlist)
    let NFTid = UserNftlist[0].tokenId;
    console.log(NFTid)

    const startAuction = async () => {
      console.log('startid', NFTid)
      let aa = await nftContract.methods.startAuction(NFTid, CurrentAccount, web3.utils.toWei(Auctionsell, 'ether')).send({from: CurrentAccount});
      console.log(aa)
      if(aa.blockhash !== undefined){
        setonSale(true)
      }
    }


  return (
    <div >
            {UserNftlist.map((token) => {
                return (
                    <div>
                        <img src={token.IMGURI} width={300} />
                        <div>NFTname: {token.NFTname}</div>
                        <div>NFTDescription: {token.NFTdes}</div>
                        <div>
                        {onSale ? <div>판매중</div> :
                          <div>
                        <input style={{ border: 'none', borderBottom: '1px dashed' }} onChange={(e) => {setsellPrice(e.target.value)}}></input>
                        <button onClick={startAuction}>sell</button>
                        </div>
                          }
                        </div>
                    </div>
                );
            })}
        </div>
  )
}

export default NftCardTemp