const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens
const shares = ether

describe('Calculator', () => {

  beforeEach(async () => {
    // Setup Accounts
    accounts = await ethers.getSigners()
    deployer = accounts[0]
    liquidityProvider = accounts[1]
    investor1 = accounts[2]
    investor2 = accounts[3]

    // Deploy Calculator
    const Calculator = await ethers.getContractFactory('Calculator')
    calculator = await Calculator.deploy()
    console.log('calculator.address', calculator.address)
  })

  describe('Swapping tokens', () => {
    let amount, transaction, result, estimate, balance

    it('emits Swap event and logs it', async () => {
      // Swap 1 token1
      const swapAmount = tokens(1)
      transaction = await calculator.connect(investor1).swapToken1(swapAmount)
      result = await transaction.wait()

      // Check for SwapToken1 event
      const event = result.events.find(event => event.event === 'SwapToken1')
      expect(event).to.not.be.undefined

      // Log event details
      console.log('SwapToken1 event emitted:')
      console.log('User:', event.args.user)
      console.log('Token1 Amount In:', ethers.utils.formatEther(event.args.token1AmountIn))
      console.log('Timestamp:', event.args.timestamp.toString())

      // Additional checks
      expect(event.args.user).to.equal(investor1.address)
      expect(event.args.token1AmountIn).to.equal(swapAmount)
    })


    })

  })