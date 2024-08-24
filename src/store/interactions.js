import { ethers } from 'ethers'

import {
  setProvider,
  setNetwork,
  setAccount
} from './reducers/provider'

import {
  setContracts,
  setSymbols,
  balancesLoaded
} from './reducers/tokens'

import {
  setContract,
  sharesLoaded,
  swapsLoaded,
  depositRequest,
  depositSuccess,
  depositFail,
  withdrawRequest,
  withdrawSuccess,
  withdrawFail,
  swapRequest,
  swapSuccess,
  swapFail
} from './reducers/amm'

import TOKEN_ABI from '../abis/Token.json';
import AMM_ABI from '../abis/AMM.json';
import config from '../config.json';

export const loadProvider = (dispatch) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  dispatch(setProvider(provider))

  return provider
}

export const loadNetwork = async (provider, dispatch) => {
  const { chainId } = await provider.getNetwork()
  dispatch(setNetwork(chainId))

  return chainId
}

export const loadAccount = async (dispatch) => {
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
  const account = ethers.utils.getAddress(accounts[0])
  dispatch(setAccount(account))

  return account
}

// ------------------------------------------------------------------------------
// LOAD CONTRACTS
export const loadTokens = async (provider, chainId, dispatch) => {
  if (!config[chainId] || !config[chainId].eth || !config[chainId].usd) {
    console.error(`No configuration found for chainId: ${chainId}`);
    return;
  }

  const eth = new ethers.Contract(config[chainId].eth.address, TOKEN_ABI, provider)
  const usd = new ethers.Contract(config[chainId].usd.address, TOKEN_ABI, provider)

  dispatch(setContracts([eth, usd]))
  dispatch(setSymbols([await eth.symbol(), await usd.symbol()]))
}

export const loadAMM = async (provider, chainId, dispatch) => {
  if (!config[chainId] || !config[chainId].amm) {
    console.error(`No AMM configuration found for chainId: ${chainId}`);
    return null;
  }

  const amm = new ethers.Contract(config[chainId].amm.address, AMM_ABI, provider)

  dispatch(setContract(amm))

  return amm
}


// ------------------------------------------------------------------------------
// LOAD BALANCES & SHARES
export const loadBalances = async (amm, tokens, account, dispatch) => {
  if (!tokens || tokens.length < 2) {
    console.error('Tokens not properly loaded');
    return;
  }

  try {
    const balance1 = await tokens[0].balanceOf(account)
    const balance2 = await tokens[1].balanceOf(account)

    dispatch(balancesLoaded([
      ethers.utils.formatUnits(balance1.toString(), 'ether'),
      ethers.utils.formatUnits(balance2.toString(), 'ether')
    ]))

    const shares = await amm.shares(account)
    dispatch(sharesLoaded(ethers.utils.formatUnits(shares.toString(), 'ether')))
  } catch (error) {
    console.error('Error loading balances:', error);
  }
}


// ------------------------------------------------------------------------------
// ADD LIQUDITY
export const addLiquidity = async (provider, amm, tokens, amounts, dispatch) => {
  try {
    dispatch(depositRequest())

    const signer = await provider.getSigner()

    let transaction

    transaction = await tokens[0].connect(signer).approve(amm.address, amounts[0])
    await transaction.wait()

    transaction = await tokens[1].connect(signer).approve(amm.address, amounts[1])
    await transaction.wait()

    transaction = await amm.connect(signer).addLiquidity(amounts[0], amounts[1])
    await transaction.wait()

    dispatch(depositSuccess(transaction.hash))
  } catch (error) {
    dispatch(depositFail())
  }
}

// ------------------------------------------------------------------------------
// REMOVE LIQUDITY
export const removeLiquidity = async (provider, amm, shares, dispatch) => {
  try {
    dispatch(withdrawRequest())

    const signer = await provider.getSigner()

    let transaction = await amm.connect(signer).removeLiquidity(shares)
    await transaction.wait()

    dispatch(withdrawSuccess(transaction.hash))
  } catch (error) {
    dispatch(withdrawFail())
  }
}

// ------------------------------------------------------------------------------
// SWAP

export const swap = async (provider, amm, token, symbol, amount, dispatch) => {
  try {

    dispatch(swapRequest())

    let transaction

    const signer = await provider.getSigner()

    transaction = await token.connect(signer).approve(amm.address, amount)
    await transaction.wait()

    if (symbol === "ETH") {
      transaction = await amm.connect(signer).swapToken1(amount)
    } else {
      transaction = await amm.connect(signer).swapToken2(amount)
    }

    await transaction.wait()

    dispatch(swapSuccess(transaction.hash))

  } catch (error) {
    dispatch(swapFail())
  }
}


// ------------------------------------------------------------------------------
// LOAD ALL SWAPS

export const loadAllSwaps = async (provider, amm, dispatch) => {
  const block = await provider.getBlockNumber()

  const swapStream = await amm.queryFilter('Swap', 0, block)
  const swaps = swapStream.map(event => {
    return { hash: event.transactionHash, args: event.args }
  })

  dispatch(swapsLoaded(swaps))
}