import React from 'react'
import { withRouter } from 'next/router';

function nftDetailPage({ router: { query } }) {
    
    const DetailImg = query.nftImg;
    const DetailName = query.nftname;
    const DetailDes = query.nftDes;

console.log(DetailImg, DetailName, DetailDes)
  return (
    <div>nftDetailPage</div>
  )
}

export default withRouter (nftDetailPage);