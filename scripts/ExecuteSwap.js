const hre = require("hardhat");

async function executeSwap(batch) {
    const AMM = await hre.ethers.getContractFactory('AMM');
    const ammAddress = "0x5d4bf065A9ae8B5D8b9cb632C38c77d784d086Cc";
    const amm = await AMM.attach(ammAddress);

    await Promise.all(batch.map(async (event) => {
        if (event.token1AmountIn) {
            try {
                const token1Amount = event.token1AmountIn.toNumber();
                await amm.swapToken1(token1Amount, event.user);
                console.log("Event Token1 Amount", token1Amount);
                console.log("Event User.", event.user);
                console.log('Swapped token1 successfully');
            } catch (error) {
                console.error('Error swapping token1:', error.message);
                if (error.error && error.error.message) {
                    console.error('Swap Token 1 error:', error.error.message);
                }
            }
        } else if (event.token2AmountIn) {
            try {
                const token2Amount = event.token2AmountIn.toNumber();
                await amm.swapToken2(token2Amount, event.user);
                console.log('Swapped token 2 successfully');
            } catch (error) {
                console.error('Error swapping token2:', error.message);
                if (error.error && error.error.message) {
                    console.error('Swap Token 2 error:', error.error.message);
                }
            }
        }
    }));
}

// Export the module
module.exports = {
    executeSwap
};
