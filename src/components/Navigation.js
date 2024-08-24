import { useContext } from 'react'
import { BlockchainContext } from './App'
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button'

import logo from '../logo.png';

const Navigation = () => {
  const { account } = useContext(BlockchainContext)

  const connectHandler = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
      } catch (error) {
        console.error("User denied account access")
      }
    } else {
      console.log('Please install MetaMask!')
    }
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
      <Navbar.Brand href="#">No MEV.....on Mainnet</Navbar.Brand>

      <Navbar.Toggle aria-controls="nav" />
      <Navbar.Collapse id="nav" className="justify-content-end">
        <div className="d-flex justify-content-end mt-3">
          {account ? (
            <Navbar.Text className='d-flex align-items-center'>
              {account.slice(0, 5) + '...' + account.slice(38, 42)}
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