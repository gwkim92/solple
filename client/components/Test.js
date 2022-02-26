import { Button } from 'antd'
import React, { useContext } from 'react'
import { TransactionContext } from '../context/transactionContext'

const Test = () => {

  const { connectWallet, CurrentAccount, web3} = useContext(TransactionContext)

console.log(CurrentAccount, web3)

  const onClick = async () => {
    console.log(await web3.eth.getBalance(CurrentAccount))
 
}

  return (
    <div>
      <Button
        onClick={onClick}
      >
        getBalnce
      </Button>
    </div>
  )
}

export default Test