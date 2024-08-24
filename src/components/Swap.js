import { useState, useContext, useEffect } from 'react';
import { BlockchainContext } from './App';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import { ethers } from 'ethers';

import AMMabi from '../abis/AMM.json';

const Swap = () => {
  const [isApproved, setIsApproved] = useState(false);
  const [inputAmount, setInputAmount] = useState('');
  const [outputAmount, setOutputAmount] = useState(null);
  const { account } = useContext(BlockchainContext);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner(account);

  const [ammContract, setAmmContract] = useState(null);

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

  const handleApprove = async () => {
    if (ammContract && account) {
      try {
        await ammContract.setSwapApproval("0xFC116bF2F327b8A0DFba8fB49a9Eb8BC041D165E", true);
        setIsApproved(true);
      } catch (error) {
        console.error("Error approving swap:", error);
      }
    } else {
      console.error("AmmContract or account not available");
    }
  };

  

  return (
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

        <Card style={{ maxWidth: '450px' }} className='mx-auto px-4'>
        <Card.Body>
          <Card.Title>Approve Swap</Card.Title>
          <Card.Text>
            {isApproved 
              ? "Swap has been approved for the contract."
              : "Click the button below first to approve the contract for swapping."}
          </Card.Text>
          <Button 
            variant="dark" 
            onClick={handleApprove}
            disabled={isApproved || !account || !ammContract}
          >
            {isApproved ? "Approved" : "Approve Contract for Swap"}
          </Button>
        </Card.Body>
      </Card>

        <Row className="my-3">
          <Button type="submit" variant="dark">Swap</Button>
        </Row>
      </Form>
    </Card>
  );
};

export default Swap;
