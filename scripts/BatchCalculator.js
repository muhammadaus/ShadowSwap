require('dotenv').config();
const { ethers } = require("ethers");
const network = "sepolia";
const provider = ethers.getDefaultProvider(network, {
    infura: { projectId: process.env.INFURA_API_URL, projectSecret: process.env.private_key },
});

let latestBlockTime = null;

async function getBlockTimes() {
    provider.on('block', async (blockNumber) => {
      try {
        const block = await provider.getBlock(blockNumber);
        const block_behind = await provider.getBlock(blockNumber - 10);
        const block_time_interval = ((block.timestamp - block_behind.timestamp) / 10) * 1000;
        latestBlockTime = block_time_interval;
        console.log(`Updated Block Time Interval: ${block_time_interval} ms`);
      } catch (error) {
        console.error('Error fetching block time:', error.message);
      }
    });
  }
  
  // Retrieve the latest available block time when called
  function getLatestBlockTime() {
    if (latestBlockTime !== null) {
      console.log(`Latest Block Time Interval: ${latestBlockTime} ms`);
      return latestBlockTime;
    } else {
        console.log("No block time found - returning default 12000 ms");
        return 12000;
    }
  }
  
  getBlockTimes();
  // Export both functions
  module.exports = { getBlockTimes, getLatestBlockTime };