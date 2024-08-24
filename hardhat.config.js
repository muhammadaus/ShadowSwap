require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: `REPLACE_WITH_APIKEY`,
      accounts: [`0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`] //hardhat
    },
    scrollDevnet: {
      url: "https://l1sload-rpc.scroll.io",
      accounts: [`0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`] //hardhat
    },
    scrollSepolia: {
      url: "REPLACE_WITH_APIKEY",
      accounts: [`0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`] //hardhat
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};