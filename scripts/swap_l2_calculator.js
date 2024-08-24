const hre = require("hardhat");

async function main() {
  const Calculator = await hre.ethers.getContractFactory("Calculator");

  // Replace this with the actual L1 token address you want to use
  const l1TokenAddress = "0x4401DeA0C875EF997cF0Cb942825487E28E25b12";

  const calculatorAddress = "0x940760e3877B0AdfcCeF5Ca04882D9D125A8a8FF";

  console.log("Connecting to existing Calculator...");
  const calculator = await Calculator.attach(calculatorAddress);

  console.log("Calculator initialized at address:", calculator.address);

  // Verify the L1 token address
  console.log("L1 token address set during deployment:", l1TokenAddress);

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