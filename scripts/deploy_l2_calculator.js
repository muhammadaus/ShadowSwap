const hre = require("hardhat");

async function main() {
  // Replace this with the actual L1 token address you want to use
  const l1TokenAddress = "0x5d4bf065A9ae8B5D8b9cb632C38c77d784d086Cc";

  console.log("Deploying Calculator...");

  const Calculator = await ethers.getContractFactory("Calculator");
  const calculator = await Calculator.deploy(l1TokenAddress);

  await calculator.deployed();


  // Verify the L1 token address
  console.log("L1 token address set during deployment:", l1TokenAddress);

  console.log("\nAll tests completed");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });