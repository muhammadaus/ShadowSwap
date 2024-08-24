// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

  // Deploy AMM
  const AMM = await hre.ethers.getContractFactory('AMM')
  const ammAddress = "0x5d4bf065A9ae8B5D8b9cb632C38c77d784d086Cc"
  const amm = await AMM.attach(ammAddress)

  // Ensure token approvals
  const Token1 = await hre.ethers.getContractFactory('Token')
  const Token2 = await hre.ethers.getContractFactory('Token')
  const token1 = await Token1.attach('0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238')
  const token2 = await Token2.attach('0x08210F9170F89Ab7658F0B5E3fF39b0E03C594D4')

  await token1.approve(ammAddress, '10000000')
  await token2.approve(ammAddress, '10000000')

  // Check balances
  const balance1 = await token1.balanceOf("0xFC116bF2F327b8A0DFba8fB49a9Eb8BC041D165E")
  const balance2 = await token2.balanceOf("0xFC116bF2F327b8A0DFba8fB49a9Eb8BC041D165E")
  console.log(`Token1 balance: ${balance1}, Token2 balance: ${balance2}`)

  try {
    await amm.setSwapApproval("0xFC116bF2F327b8A0DFba8fB49a9Eb8BC041D165E", true)
    console.log('Approved successfully')
  } catch (error) {
    console.error('Error adding liquidity:', error.message)
    // If available, log more detailed error information
    if (error.error && error.error.message) {
      console.error('Detailed error:', error.error.message)
    }
  }

  console.log(`AMM add liquidity to: ${amm.address}\n`)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});