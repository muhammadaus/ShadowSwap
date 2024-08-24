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
  removeLiquidity,
  loadBalances
} from '../store/interactions'

const Withdraw = () => {
  const [amount, setAmount] = useState(0)
  const [showAlert, setShowAlert] = useState(false)

  const provider = useSelector(state => state.provider.connection)
  const account = useSelector(state => state.provider.account)

  const shares = useSelector(state => state.amm.shares)

  const tokens = useSelector(state => state.tokens.contracts)
  const balances = useSelector(state => state.tokens.balances)

  const amm = useSelector(state => state.amm.contract)
  const isWithdrawing = useSelector(state => state.amm.withdrawing.isWithdrawing)
  const isSuccess = useSelector(state => state.amm.withdrawing.isSuccess)
  const transactionHash = useSelector(state => state.amm.withdrawing.transactionHash)

  const dispatch = useDispatch()

  const withdrawHandler = async (e) => {
    e.preventDefault()

    setShowAlert(false)

    const _shares = ethers.utils.parseUnits(amount.toString(), 'ether')

    await removeLiquidity(
      provider,
      amm,
      _shares,
      dispatch
    )

    await loadBalances(amm, tokens, account, dispatch)

    setShowAlert(true)
    setAmount(0)
=======
import { ethers } from 'ethers';
import AMMabi from '../abis/AMM.json';
import Alert from 'react-bootstrap/Alert';

const Withdraw = () => {
  const [amount, setAmount] = useState('')
  const { account } = useContext(BlockchainContext)
  const [ammContract, setAmmContract] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

  const withdrawHandler = async (e) => {
    e.preventDefault()
    setError('');
    setIsLoading(true);

    if (!ammContract) {
      setError('Contract not initialized');
      setIsLoading(false);
      return;
    }

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      setIsLoading(false);
      return;
    }

    try {
      const shareAmount = ethers.utils.parseUnits(amount, 18); // Assuming 18 decimals, adjust if different
      const tx = await ammContract.removeLiquidity(shareAmount);
      await tx.wait();
      console.log('Liquidity removed successfully');
      setAmount('');
    } catch (error) {
      console.error('Error removing liquidity:', error);
      setError('Failed to remove liquidity. Please try again.');
    } finally {
      setIsLoading(false);
    }
>>>>>>> 0381d4b7 (add liquidity and approve tabs)
  }

  return (
    <div>
      <Card style={{ maxWidth: '450px' }} className='mx-auto px-4'>
        {account ? (
          <Form onSubmit={withdrawHandler} style={{ maxWidth: '450px', margin: '50px auto' }}>

            <Row>
              <Form.Text className='text-end my-2' muted>
                Shares: {shares}
              </Form.Text>
              <InputGroup>
                <Form.Control
                  type="number"
                  placeholder="0"
                  min="0.0"
                  step="any"
                  id="shares"
                  value={amount === 0 ? "" : amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <InputGroup.Text style={{ width: "100px" }} className="justify-content-center">
                  Shares
                </InputGroup.Text>
              </InputGroup>
            </Row>

            <Row className='my-3'>
<<<<<<< HEAD
              {isWithdrawing ? (
                <Spinner animation="border" style={{ display: 'block', margin: '0 auto' }} />
              ) : (
                <Button type='submit' variant="dark">Withdraw</Button>
              )}
=======
              <Button type='submit' variant="dark" disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Withdraw'}
              </Button>
>>>>>>> 0381d4b7 (add liquidity and approve tabs)
            </Row>

            {error && <Alert variant="danger">{error}</Alert>}

            <hr />

            <Row>
              <p><strong>DAPP Balance:</strong> {balances[0]}</p>
              <p><strong>USD Balance:</strong> {balances[1]}</p>
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

      {isWithdrawing ? (
        <Alert
          message={'Withdraw Pending...'}
          transactionHash={null}
          variant={'info'}
          setShowAlert={setShowAlert}
        />
      ) : isSuccess && showAlert ? (
        <Alert
          message={'Withdraw Successful'}
          transactionHash={transactionHash}
          variant={'success'}
          setShowAlert={setShowAlert}
        />
      ) : !isSuccess && showAlert ? (
        <Alert
          message={'Withdraw Failed'}
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

export default Withdraw;
