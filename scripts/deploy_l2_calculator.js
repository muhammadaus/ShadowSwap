const hre = require("hardhat");

async function main() {
  const Calculator = await hre.ethers.getContractFactory("Calculator");

  // Replace this with the actual L1 token address you want to use
  const l1TokenAddress = "0x4401DeA0C875EF997cF0Cb942825487E28E25b12";

  console.log("Deploying Calculator...");
  const calculator = await Calculator.deploy(l1TokenAddress);

  await calculator.deployed();

  console.log("Calculator deployed to:", calculator.address);

  // Verify the L1 token address
  console.log("L1 token address set during deployment:", l1TokenAddress);

  // Test calculateToken1Swap function
  console.log("\nTesting calculateToken1Swap function...");
  try {
    const token1Amount = hre.ethers.utils.parseEther("1"); // 1 token
    const token2Amount = await calculator.calculateToken1Swap(token1Amount);
    console.log("Swapping 1 Token1 will yield:", hre.ethers.utils.formatEther(token2Amount), "Token2");
  } catch (error) {
    console.error("Error in calculateToken1Swap:", error.message);
  }

  // Test calculateToken2Swap function
  console.log("\nTesting calculateToken2Swap function...");
  try {
    const token2Amount = hre.ethers.utils.parseEther("1"); // 1 token
    const token1Amount = await calculator.calculateToken2Swap(token2Amount);
    console.log("Swapping 1 Token2 will yield:", hre.ethers.utils.formatEther(token1Amount), "Token1");
  } catch (error) {
    console.error("Error in calculateToken2Swap:", error.message);
  }

  // Test swapToken1 function
  console.log("\nTesting swapToken1 function...");
  try {
    const token1Amount = hre.ethers.utils.parseEther("1"); // 1 token
    const tx = await calculator.swapToken1(token1Amount);
    await tx.wait();
    console.log("swapToken1 transaction successful");
  } catch (error) {
    console.error("Error in swapToken1:", error.message);
  }

  // Test swapToken2 function
  console.log("\nTesting swapToken2 function...");
  try {
    const token2Amount = hre.ethers.utils.parseEther("1"); // 1 token
    const tx = await calculator.swapToken2(token2Amount);
    await tx.wait();
    console.log("swapToken2 transaction successful");
  } catch (error) {
    console.error("Error in swapToken2:", error.message);
  }

  console.log("\nAll tests completed");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });