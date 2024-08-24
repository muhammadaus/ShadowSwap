<<<<<<< HEAD
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
=======
import React, { useState, useContext, useEffect } from 'react';
import { BlockchainContext } from './App'
>>>>>>> 0381d4b7 (add liquidity and approve tabs)
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
<<<<<<< HEAD
import Spinner from 'react-bootstrap/Spinner';
import { ethers } from 'ethers'

import Alert from './Alert'

import {
  addLiquidity,
  loadBalances
} from '../store/interactions'

const Deposit = () => {
  const [token1Amount, setToken1Amount] = useState(0)
  const [token2Amount, setToken2Amount] = useState(0)
  const [showAlert, setShowAlert] = useState(false)

  const provider = useSelector(state => state.provider.connection)
  const account = useSelector(state => state.provider.account)

  const tokens = useSelector(state => state.tokens.contracts)
  const symbols = useSelector(state => state.tokens.symbols)
  const balances = useSelector(state => state.tokens.balances)

  const amm = useSelector(state => state.amm.contract)
  const isDepositing = useSelector(state => state.amm.depositing.isDepositing)
  const isSuccess = useSelector(state => state.amm.depositing.isSuccess)
  const transactionHash = useSelector(state => state.amm.depositing.transactionHash)
  const dispatch = useDispatch()

  const amountHandler = async (e) => {
=======
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
>>>>>>> 0381d4b7 (add liquidity and approve tabs)
    if (e.target.id === 'token1') {
      setToken1Amount(e.target.value)

      // Fetch value from chain
      const _token1Amount = ethers.utils.parseUnits(e.target.value, 'ether')
      const result = await amm.calculateToken2Deposit(_token1Amount)
      const _token2Amount = ethers.utils.formatUnits(result.toString(), 'ether')

      setToken2Amount(_token2Amount)
    } else {
      setToken2Amount(e.target.value)

      // Fetch value from chain
      const _token2Amount = ethers.utils.parseUnits(e.target.value, 'ether')
      const result = await amm.calculateToken1Deposit(_token2Amount)
      const _token1Amount = ethers.utils.formatUnits(result.toString(), 'ether')

      setToken1Amount(_token1Amount)
    }
  }

  const depositHandler = async (e) => {
    e.preventDefault()
<<<<<<< HEAD

    setShowAlert(false)

    const _token1Amount = ethers.utils.parseUnits(token1Amount, 'ether')
    const _token2Amount = ethers.utils.parseUnits(token2Amount, 'ether')

    await addLiquidity(
      provider,
      amm,
      tokens,
      [_token1Amount, _token2Amount],
      dispatch
    )

    await loadBalances(amm, tokens, account, dispatch)

    setShowAlert(true)
=======
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
>>>>>>> 0381d4b7 (add liquidity and approve tabs)
  }

  return (
    <div>
      <Card style={{ maxWidth: '450px' }} className='mx-auto px-4'>
        {account ? (
          <Form onSubmit={depositHandler} style={{ maxWidth: '450px', margin: '50px auto' }}>

            <Row>
              <Form.Text className='text-end my-2' muted>
                Balance: {balances[0]}
              </Form.Text>
              <InputGroup>
                <Form.Control
                  type="number"
                  placeholder="0.0"
                  min="0.0"
                  step="any"
                  id="token1"
                  onChange={(e) => amountHandler(e)}
                  value={token1Amount === 0 ? "" : token1Amount}
                />
                <InputGroup.Text style={{ width: "100px" }} className="justify-content-center">
<<<<<<< HEAD
                  { symbols && symbols[0] }
=======
                  USDC
>>>>>>> 0381d4b7 (add liquidity and approve tabs)
                </InputGroup.Text>
              </InputGroup>
            </Row>

            <Row className='my-3'>
              <Form.Text className='text-end my-2' muted>
                Balance:  {balances[1]}
              </Form.Text>
              <InputGroup>
                <Form.Control
                  type="number"
                  placeholder="0.0"
                  step="any"
                  id="token2"
                  onChange={(e) => amountHandler(e)}
                  value={token2Amount === 0 ? "" : token2Amount}
                />
                <InputGroup.Text style={{ width: "100px" }} className="justify-content-center">
<<<<<<< HEAD
                  { symbols && symbols[1] }
=======
                  EURC
>>>>>>> 0381d4b7 (add liquidity and approve tabs)
                </InputGroup.Text>
              </InputGroup>
            </Row>

            <Row className='my-3'>
              {isDepositing ? (
                <Spinner animation="border" style={{ display: 'block', margin: '0 auto' }} />
              ) : (
                <Button type='submit' variant="dark">Deposit</Button>
              )}
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

      {isDepositing ? (
        <Alert
          message={'Deposit Pending...'}
          transactionHash={null}
          variant={'info'}
          setShowAlert={setShowAlert}
        />
      ) : isSuccess && showAlert ? (
        <Alert
          message={'Deposit Successful'}
          transactionHash={transactionHash}
          variant={'success'}
          setShowAlert={setShowAlert}
        />
      ) : !isSuccess && showAlert ? (
        <Alert
          message={'Deposit Failed'}
          transactionHash={null}
          variant={'danger'}
          setShowAlert={setShowAlert}
        />
      ) : (
        <></>
      )}

    </div>
  );
}

export default Deposit;
