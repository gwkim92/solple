import axios from 'axios'
import React from 'react'

function NftCardTemp({ UserNftlist }) {

    
    // let URI = UserNftlist[0].tokenURI
    // console.log('1', URI)
    // let res = axios.get(`https://ipfs.io/ipfs/${URI}`)
    // console.log('2', res)
  return (
    <div className="erc721list">
            {UserNftlist.map((token) => {
                return (
                    <div className="erc721token">
                        Name: <span className="name">{token.name}</span>(
                        <span className="symbol">{token.symbol}</span>)
                        
                        <div className="nft">id: {token.tokenId}</div>
                        <img src={token.IMGURI} width={300} />
                        <div>NFTname: {token.NFTname}</div>
                        <div>NFTDescription: {token.NFTDes}</div>
                    </div>
                );
            })}
        </div>
  )
}

export default NftCardTemp