import { useEffect, useState, createContext } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'

// Components
import Navigation from './Navigation';
import Tabs from './Tabs';
import Swap from './Swap';
import Deposit from './Deposit';
import Withdraw from './Withdraw';

// Create a context for blockchain data
export const BlockchainContext = createContext();

function App() {
  const [account, setAccount] = useState(null)

  useEffect(() => {
    // Simple check for MetaMask
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(accounts => setAccount(accounts[0]))
        .catch(error => console.error("User denied account access"))
    }
  }, []);

  return(
    <BlockchainContext.Provider value={{ account }}>
      <Container>
        <HashRouter>
          <Navigation />
          <hr />
          <Tabs />
          <Routes>
            <Route exact path="/" element={<Swap />} />
            <Route path="/deposit" element={<Deposit />} />
            <Route path="/withdraw" element={<Withdraw />} />
          </Routes>
        </HashRouter>
      </Container>
    </BlockchainContext.Provider>
  )
}

export default App;