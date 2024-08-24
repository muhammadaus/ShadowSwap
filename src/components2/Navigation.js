import { useSelector, useDispatch } from 'react-redux'
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Blockies from 'react-blockies'
import { useState } from 'react'

import logo from '../logo.png';

import { loadAccount, loadBalances } from '../store/interactions'

import config from '../config.json'

const Navigation = () => {
  const chainId = useSelector(state => state.provider.chainId)
  const account = useSelector(state => state.provider.account)
  const tokens = useSelector(state => state.tokens.contracts)
  const amm = useSelector(state => state.amm.contract)

  const dispatch = useDispatch()

  const [error, setError] = useState(null)

  const connectHandler = async () => {
    try {
      const account = await loadAccount(dispatch)
      await loadBalances(amm, tokens, account, dispatch)
    } catch (err) {
      console.error('Error connecting:', err)
      setError('Failed to connect. Please try again.')
    }
  }

  const networkHandler = async (e) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: e.target.value }],
      })
    } catch (err) {
      console.error('Error switching network:', err)
      setError('Failed to switch network. Please try again.')
    }
  }

  const getNetworkName = (chainId) => {
    if (!chainId) return 'Unknown Network'
    switch(chainId) {
      case '0x7A69': return 'Localhost';
      case '0xaa36a7': return 'Sepolia';
      case '0x21fe10': return 'Scroll Devnet';
      default: return 'Unknown Network';
    }
  }

  if (!chainId) {
    return <div>Loading...</div>
  }

  return (
    <Navbar className='my-3' expand="lg">
      <img
        alt="logo"
        src={logo}
        width="40"
        height="40"
        className="d-inline-block align-top mx-3"
      />
      <Navbar.Brand href="#">Shadow Swap</Navbar.Brand>
      <Navbar.Brand href="#">No MEV..... on Mainnet.</Navbar.Brand>

      <Navbar.Toggle aria-controls="nav" />
      <Navbar.Collapse id="nav" className="justify-content-end">

        <div className="d-flex justify-content-end mt-3">

          {error && <div className="text-danger">{error}</div>}

          <Navbar.Text className="me-3">
            Network: {getNetworkName(`0x${chainId.toString(16)}`)}
          </Navbar.Text>

          <Form.Select
            aria-label="Network Selector"
            value={config[chainId] ? `0x${chainId.toString(16)}` : `0`}
            onChange={networkHandler}
            style={{ maxWidth: '200px', marginRight: '20px' }}
          >
            <option value="0" disabled>Select Network</option>
            <option value="0x7A69">Localhost</option>
            <option value="0xaa36a7">Sepolia</option>
            <option value="0x21fe10">Scroll Devnet</option>
          </Form.Select>

          {account ? (
            <Navbar.Text className='d-flex align-items-center'>
              {account.slice(0, 5) + '...' + account.slice(38, 42)}
              <Blockies
                seed={account}
                size={10}
                scale={3}
                color="#2187D0"
                bgColor="#F1F2F9"
                spotColor="#767F92"
                className="identicon mx-2"
              />
            </Navbar.Text>
          ) : (
            <Button variant="dark" onClick={connectHandler}>Connect</Button>
          )}

        </div>

      </Navbar.Collapse>
    </Navbar>
  );
}

export default Navigation;