require('dotenv').config();
const { ethers } = require('ethers');
const { executeSwap } = require('./ExecuteSwap');
const { getLatestBlockTime } = require('./BatchCalculator');

const provider = new ethers.providers.JsonRpcProvider("https://l1sload-rpc.scroll.io");
const contractAddress = "0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f"; // L1SLOAD Calculator Contract Address

// Contract ABI (Only for the SwapToken1 and SwapToken2 events)
const contractABI = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "token1AmountIn", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "SwapToken1",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "token2AmountIn", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "SwapToken2",
    "type": "event"
  }
];

const contract = new ethers.Contract(contractAddress, contractABI, provider);
let eventBatch = [];
let eventSet = new Set(); // hashset to store unique events

function listenForEvents() {
  contract.on("SwapToken1", (user, token1AmountIn, timestamp) => {
    const eventKey = `${user}-${token1AmountIn.toString()}-${timestamp.toString()}`;

    if (!eventSet.has(eventKey)) {
      eventBatch.push({ event: "SwapToken1", user, token1AmountIn, timestamp });
      eventSet.add(eventKey);
    }
  });

  contract.on("SwapToken2", (user, token2AmountIn, timestamp) => {
    const eventKey = `${user}-${token2AmountIn.toString()}-${timestamp.toString()}`;

    if (!eventSet.has(eventKey)) {
      eventBatch.push({ event: "SwapToken2", user, token2AmountIn, timestamp });
      eventSet.add(eventKey);
    }
  });
}

async function processBatchAndReset() {
  if (eventBatch.length) {
    await executeSwap(eventBatch);
    console.log("Batch sent to blockchain.", eventBatch);
    eventBatch = [];
    eventSet.clear();
    console.log("Batch processed and reset.");
  }
  console.log("No events to process.");
}

async function startBatchProcessor() {
  console.log("Starting batch processor...");
  const blockTimeInterval = getLatestBlockTime(); 
  listenForEvents();  

  setTimeout(async () => {
    await processBatchAndReset(); // Process the batch when the time is up
    startBatchProcessor(); // Call itself again for the next interval
    console.log("Batch processor restarted.");
  }, blockTimeInterval);
}

startBatchProcessor(); 
