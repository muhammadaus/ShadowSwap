<<<<<<< HEAD
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
=======
import { useState, useContext, useEffect } from 'react';
import { BlockchainContext } from './App';
>>>>>>> e60ea6ec (Update Swap.js)
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
<<<<<<< HEAD
import Spinner from 'react-bootstrap/Spinner';
import { ethers } from 'ethers'

import Alert from './Alert'

import {
  swap,
  loadBalances
} from '../store/interactions'

const Swap = () => {
  const [inputToken, setInputToken] = useState(null)
  const [outputToken, setOutputToken] = useState(null)
  const [inputAmount, setInputAmount] = useState(0)
  const [outputAmount, setOutputAmount] = useState(0)

  const [price, setPrice] = useState(0)

  const [showAlert, setShowAlert] = useState(false)

  const provider = useSelector(state => state.provider.connection)
  const account = useSelector(state => state.provider.account)

  const tokens = useSelector(state => state.tokens.contracts)
  const symbols = useSelector(state => state.tokens.symbols)
  const balances = useSelector(state => state.tokens.balances)

  const amm = useSelector(state => state.amm.contract)
  const isSwapping = useSelector(state => state.amm.swapping.isSwapping)
  const isSuccess = useSelector(state => state.amm.swapping.isSuccess)
  const transactionHash = useSelector(state => state.amm.swapping.transactionHash)

  const dispatch = useDispatch()

  const inputHandler = async (e) => {
    if (!inputToken || !outputToken) {
      window.alert('Please select token')
      return
    }

    if (inputToken === outputToken) {
      window.alert('Invalid token pair')
      return
    }

    if (inputToken === 'ETH') {
      setInputAmount(e.target.value)

      const _token1Amount = ethers.utils.parseUnits(e.target.value, 'ether')
      const result = await amm.calculateToken1Swap(_token1Amount)
      const _token2Amount = ethers.utils.formatUnits(result.toString(), 'ether')

      setOutputAmount(_token2Amount.toString())

    } else {
      setInputAmount(e.target.value)

      const _token2Amount = ethers.utils.parseUnits(e.target.value, 'ether')
      const result = await amm.calculateToken2Swap(_token2Amount)
      const _token1Amount = ethers.utils.formatUnits(result.toString(), 'ether')

      setOutputAmount(_token1Amount.toString())
    }

  }
=======
import { ethers } from 'ethers';

const Swap = () => {
  const [inputAmount, setInputAmount] = useState('');
  const [outputAmount, setOutputAmount] = useState(null);
  const { account } = useContext(BlockchainContext);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner(account);

  const [currency, setCurrency] = useState({ input: 'USDC', output: 'EURC' });

  const contractAddress = "0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f";
  const contractABI = [
    {
      inputs: [{ name: "_token1Amount", type: "uint256" }],
      name: "calculateToken1Swap",
      outputs: [{ name: "token2Amount", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ name: "_token1Amount", type: "uint256" }],
      name: "calculateToken2Swap",
      outputs: [{ name: "token1Amount", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
  ];

  const calculateSwap = async () => {
    if (!inputAmount || inputAmount <= 0) {
      setOutputAmount(0);
      return;
    }

    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    try {
      const method = currency.input === 'USDC' ? 'calculateToken1Swap' : 'calculateToken2Swap';
      const result = await contract[method](ethers.utils.parseUnits(inputAmount, 6));
      setOutputAmount(ethers.utils.formatUnits(result, 6));
      console.log("Input amount:", ethers.utils.formatUnits(inputAmount,0), currency.input);
      console.log("Output amount:", ethers.utils.formatUnits(result, 6), currency.output);
    } catch (error) {
      console.error("Error calling contract:", error);
    }
  };

  const toggleCurrency = () => {
    setCurrency((prev) => ({
      input: prev.input === 'USDC' ? 'EURC' : 'USDC',
      output: prev.output === 'EURC' ? 'USDC' : 'EURC',
    }));
  };

  useEffect(() => {
    calculateSwap();
  }, [inputAmount, currency.input]);

  const swapHandler = (e) => {
    e.preventDefault();
    console.log('Swapping...');
    // Implement swapping logic
  };
>>>>>>> e60ea6ec (Update Swap.js)

  const swapHandler = async (e) => {
    e.preventDefault()

    setShowAlert(false)

    if (inputToken === outputToken) {
      window.alert('Invalid Token Pair')
      return
    }

    const _inputAmount = ethers.utils.parseUnits(inputAmount, 'ether')

    // Swap token depending upon which one we're doing...
    if (inputToken === "ETH") {
      await swap(provider, amm, tokens[0], inputToken, _inputAmount, dispatch)
    } else {
      await swap(provider, amm, tokens[1], inputToken, _inputAmount, dispatch)
    }

    await loadBalances(amm, tokens, account, dispatch)
    await getPrice()

    setShowAlert(true)

  }

  const getPrice = async () => {
    if (inputToken === outputToken) {
      setPrice(0)
      return
    }

    if (inputToken === 'ETH') {
      setPrice(await amm.token2Balance() / await amm.token1Balance())
    } else {
      setPrice(await amm.token1Balance() / await amm.token2Balance())
    }
  }

  useEffect(() => {
    if(inputToken && outputToken) {
      getPrice()
    }
  }, [inputToken, outputToken]);

  return (
<<<<<<< HEAD
    <div>
      <Card style={{ maxWidth: '450px' }} className='mx-auto px-4'>
        {account ? (
          <Form onSubmit={swapHandler} style={{ maxWidth: '450px', margin: '50px auto' }}>

            <Row className='my-3'>
              <div className='d-flex justify-content-between'>
                <Form.Label><strong>Input:</strong></Form.Label>
                <Form.Text muted>
                  Balance: {
                    inputToken === symbols[0] ? (
                      balances[0]
                    ) : inputToken === symbols[1] ? (
                      balances[1]
                    ) : 0
                  }
                </Form.Text>
              </div>
              <InputGroup>
                <Form.Control
                  type="number"
                  placeholder="0.0"
                  min="0.0"
                  step="any"
                  onChange={(e) => inputHandler(e) }
                  disabled={!inputToken}
                />
                <DropdownButton
                  variant="outline-secondary"
                  title={inputToken ? inputToken : "Select Token"}
                >
                  <Dropdown.Item onClick={(e) => setInputToken(e.target.innerHTML)} >ETH</Dropdown.Item>
                  <Dropdown.Item onClick={(e) => setInputToken(e.target.innerHTML)} >USD</Dropdown.Item>
                </DropdownButton>
              </InputGroup>
            </Row>

            <Row className='my-4'>
              <div className='d-flex justify-content-between'>
                <Form.Label><strong>Output:</strong></Form.Label>
                <Form.Text muted>
                  Balance: {
                    outputToken === symbols[0] ? (
                      balances[0]
                    ) : outputToken === symbols[1] ? (
                      balances[1]
                    ) : 0
                  }
                </Form.Text>
              </div>
              <InputGroup>
                <Form.Control
                  type="number"
                  placeholder="0.0"
                  value={outputAmount === 0 ? "" : outputAmount }
                  disabled
                />
                <DropdownButton
                  variant="outline-secondary"
                  title={outputToken ? outputToken : "Select Token"}
                >
                  <Dropdown.Item onClick={(e) => setOutputToken(e.target.innerHTML)}>ETH</Dropdown.Item>
                  <Dropdown.Item onClick={(e) => setOutputToken(e.target.innerHTML)}>USD</Dropdown.Item>
                </DropdownButton>
              </InputGroup>
            </Row>

            <Row className='my-3'>
              {isSwapping ? (
                <Spinner animation="border" style={{ display: 'block', margin: '0 auto' }} />
              ): (
                <Button type='submit' variant="dark">Swap</Button>
              )}

              <Form.Text muted>
                Exchange Rate: {price}
              </Form.Text>
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

      {isSwapping ? (
        <Alert
          message={'Swap Pending...'}
          transactionHash={null}
          variant={'info'}
          setShowAlert={setShowAlert}
        />
      ) : isSuccess && showAlert ? (
        <Alert
          message={'Swap Successful'}
          transactionHash={transactionHash}
          variant={'success'}
          setShowAlert={setShowAlert}
        />
      ) : !isSuccess && showAlert ? (
        <Alert
          message={'Swap Failed'}
          transactionHash={null}
          variant={'danger'}
          setShowAlert={setShowAlert}
        />
      ) : (
        <></>
      )}

    </div>
=======
    <Card style={{ maxWidth: '450px' }} className="mx-auto px-4">
      <Form onSubmit={swapHandler} style={{ maxWidth: '450px', margin: '50px auto' }}>
        <Row className="my-3">
          <InputGroup>
            <Form.Control
              type="number"
              placeholder="0.0"
              min="0.0"
              step="any"
              onChange={(e) => setInputAmount(e.target.value)}
              value={inputAmount}
            />
            <InputGroup.Text>{currency.input}</InputGroup.Text>
          </InputGroup>
        </Row>

        <Row className="my-4">
          <InputGroup>
            <Form.Control
              type="number"
              placeholder="0.0"
              value={outputAmount || ''}
              readOnly
            />
            <InputGroup.Text>{currency.output}</InputGroup.Text>
          </InputGroup>
        </Row>

        <Row className="my-3">
          <Button variant="secondary" onClick={toggleCurrency}>
            Switch Currency
          </Button>
        </Row>

        <Row className="my-3">
          <Button type="submit" variant="dark">Swap</Button>
        </Row>
      </Form>
    </Card>
>>>>>>> e60ea6ec (Update Swap.js)
  );
};

export default Swap;
