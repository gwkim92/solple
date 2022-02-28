import React, { useContext } from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'
import { Input, Menu, Row, Col } from 'antd'
import styled from 'styled-components'
import { TransactionContext } from '../context/transactionContext'

const Div = styled.div`
  width: 100%;
  height: 100%;
  /* display: flex; */
  justify-content: center;
`

const Header = () => {
  const { connectWallet, CurrentAccount } = useContext(TransactionContext)

  console.log('Header', { connectWallet, CurrentAccount })
  return (
    <div>
      <Menu mode="horizontal">
        <Menu.Item>
          <Link href="/">
            <a>Meta</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Input.Search enterButton style={{ verticalAlign: 'middle' }} />
        </Menu.Item>
        <Menu.Item>
          <Link href="/profile">
            <a>NFT Explore</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link href="/createNft">
            <a>Create</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link href="/myPage">
            <a>Mypage</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link href="/test">
            <a>test</a>
          </Link>
        </Menu.Item>
        {CurrentAccount ? (
          <Menu.Item>
            <div>username</div>
          </Menu.Item>
        ) : (
          <Menu.Item>
            <button onClick={() => connectWallet()}>
              <div>Connect Wallet</div>
            </button>
          </Menu.Item>
        )}
      </Menu>
    </div>
  )
}

export default Header
