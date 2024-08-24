import React, { useState, useContext, useEffect } from 'react';
import { BlockchainContext } from './App'
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import { ethers } from 'ethers';
import AMMabi from '../abis/AMM.json';

const Deposit = () => {
  const [token1Amount, setToken1Amount] = useState('')
  const [token2Amount, setToken2Amount] = useState('')
  const [ammContract, setAmmContract] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { account } = useContext(BlockchainContext)

  useEffect(() => {
    const initializeContract = async () => {
      if (typeof window.ethereum !== 'undefined' && account) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contractAddress = '0x5d4bf065A9ae8B5D8b9cb632C38c77d784d086Cc';
        const contract = new ethers.Contract(contractAddress, AMMabi, signer);
        setAmmContract(contract);
      }
    };
    initializeContract();
  }, [account]);

  const amountHandler = (e) => {
    if (e.target.id === 'token1') {
      setToken1Amount(e.target.value)
    } else {
      setToken2Amount(e.target.value)
    }
  }

  const depositHandler = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!ammContract) {
      setError('Contract not initialized')
      setIsLoading(false)
      return
    }

    if (!token1Amount || !token2Amount || isNaN(token1Amount) || isNaN(token2Amount)) {
      setError('Please enter valid amounts for both tokens')
      setIsLoading(false)
      return
    }

    try {
      // Convert amounts to wei (assuming 6 decimals for both tokens)
      const amount1 = ethers.utils.parseUnits(token1Amount, 6)
      const amount2 = ethers.utils.parseUnits(token2Amount, 6)

      // Call addLiquidity function
      const tx = await ammContract.addLiquidity(amount1, amount2)
      await tx.wait()

      console.log('Liquidity added successfully')
      setToken1Amount('')
      setToken2Amount('')
    } catch (error) {
      console.error('Error adding liquidity:', error)
      setError('Failed to add liquidity. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Card style={{ maxWidth: '450px' }} className='mx-auto px-4'>
        {account ? (
          <Form onSubmit={depositHandler} style={{ maxWidth: '450px', margin: '50px auto' }}>
            <Row>
              <InputGroup>
                <Form.Control
                  type="number"
                  placeholder="0.0"
                  min="0.0"
                  step="any"
                  id="token1"
                  onChange={amountHandler}
                  value={token1Amount}
                />
                <InputGroup.Text style={{ width: "100px" }} className="justify-content-center">
                  USDC
                </InputGroup.Text>
              </InputGroup>
            </Row>

            <Row className='my-3'>
              <InputGroup>
                <Form.Control
                  type="number"
                  placeholder="0.0"
                  step="any"
                  id="token2"
                  onChange={amountHandler}
                  value={token2Amount}
                />
                <InputGroup.Text style={{ width: "100px" }} className="justify-content-center">
                  EURC
                </InputGroup.Text>
              </InputGroup>
            </Row>

            <Row className='my-3'>
              <Button type='submit' variant="dark">Deposit</Button>
            </Row>
          </Form>
        ) : (
          <p
            className='d-flex justify-content-center align-items-center'
            style={{ height: '300px' }}
          >
            Please connect wallet.
          </p>
        )}
      </Card>
    </div>
  );
}

export default Deposit;