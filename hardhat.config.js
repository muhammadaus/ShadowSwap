require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
<<<<<<< HEAD
      url: `https://gateway-api.cabinet-node.com/0db81d915acae383cf7b91896d80ce9d`,
      accounts: [`0x82550edf3152e9af8df21e3b301ee97d0c681be4b56951a58250d317fba0ed39`]
    },
    scrollDevnet: {
      url: "https://l1sload-rpc.scroll.io",
<<<<<<< HEAD
      accounts: [`0x82550edf3152e9af8df21e3b301ee97d0c681be4b56951a58250d317fba0ed39`]
=======
      accounts: [`0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`]
>>>>>>> d7d39ec4 (update approve page)
    },
    scrollSepolia: {
      url: "https://gateway-api.cabinet-node.com/b5f8d602629e60d5b3a1d6fa32ef8374",
      accounts: [`0x82550edf3152e9af8df21e3b301ee97d0c681be4b56951a58250d317fba0ed39`]
=======
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
>>>>>>> 0381d4b7 (add liquidity and approve tabs)
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};