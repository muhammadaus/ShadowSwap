import React, { useState, useContext } from 'react';
import { BlockchainContext } from './App';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';


import { ethers } from 'ethers'

let ammContract = null;

export const initializeContract = async () => {
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contractAddress = '0x5d4bf065A9ae8B5D8b9cb632C38c77d784d086Cc';
    const contractABI = []; // Add your contract ABI here
    ammContract = new ethers.Contract(contractAddress, contractABI, signer);
  }
};

export const getAmmContract = () => ammContract;


const Approve = () => {
  const [isApproved, setIsApproved] = useState(false);
  const { account, amm } = useContext(BlockchainContext);

  const handleApprove = async () => {
    if (amm && account) {
      try {
        await ammContract.setSwapApproval("0xFC116bF2F327b8A0DFba8fB49a9Eb8BC041D165E", true);
        setIsApproved(true);
      } catch (error) {
        console.error("Error approving swap:", error);
      }
    }
  };

  return (
    <Card style={{ maxWidth: '450px' }} className='mx-auto px-4'>
      <Card.Body>
        <Card.Title>Approve Swap</Card.Title>
        <Card.Text>
          {isApproved 
            ? "Swap has been approved for the contract."
            : "Click the button below to approve the contract for swapping."}
        </Card.Text>
        <Button 
          variant="dark" 
          onClick={handleApprove}
          disabled={isApproved || !account}
        >
          {isApproved ? "Approved" : "Approve Contract for Swap"}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default Approve;