// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";

contract Calculator {
    address constant L1_BLOCKS_ADDRESS = 0x5300000000000000000000000000000000000001;
    address constant L1_SLOAD_ADDRESS = 0x0000000000000000000000000000000000000101;
    address immutable l1TokenAddress;

    uint256 constant TOKEN1_BALANCE_SLOT = 2;
    uint256 constant TOKEN2_BALANCE_SLOT = 3;
    uint256 constant K_SLOT = 4;

    constructor(address _l1TokenAddress) {
        l1TokenAddress = _l1TokenAddress;
    }

    function retrieveSlotFromL1(address l1StorageAddress, uint slot) internal view returns (bytes memory) {
        bool success;
        bytes memory returnValue;
        (success, returnValue) = L1_SLOAD_ADDRESS.staticcall(abi.encodePacked(l1StorageAddress, slot));
        if(!success)
        {
            revert("L1SLOAD failed");
        }
        return returnValue;
    }

    Token public token1;
    Token public token2;

    uint256 public token1Balance;
    uint256 public token2Balance;
    uint256 public K;

    event SwapToken1(
        address user,
        uint256 token1AmountIn,
        uint256 timestamp
    );

    event SwapToken2(
        address user,
        uint256 token2AmountIn,
        uint256 timestamp
    );

    // Returns amount of token2 received when swapping token1
    function calculateToken1Swap(uint256 _token1Amount)
        public
        view
        returns (uint256 token2Amount)
    {
        uint256 token1Balance = abi.decode(retrieveSlotFromL1(l1TokenAddress, TOKEN1_BALANCE_SLOT), (uint256));
        uint256 token2Balance = abi.decode(retrieveSlotFromL1(l1TokenAddress, TOKEN2_BALANCE_SLOT), (uint256));
        uint256 K = abi.decode(retrieveSlotFromL1(l1TokenAddress, K_SLOT), (uint256));

        uint256 token1After = token1Balance + _token1Amount;
        uint256 token2After = K / token1After;
        token2Amount = token2Balance - token2After;

        // Don't let the pool go to 0
        if (token2Amount == token2Balance) {
            token2Amount--;
        }

        require(token2Amount < token2Balance, "swap amount too large");
    }

    function swapToken1(uint256 _token1Amount) external {
        // Emit an event
        emit SwapToken1(
            msg.sender,
            _token1Amount,
            block.timestamp
        );
    }

    // Returns amount of token1 received when swapping token2
    function calculateToken2Swap(uint256 _token2Amount)
        public
        view
        returns (uint256 token1Amount)
    {
        uint256 token1Balance = abi.decode(retrieveSlotFromL1(l1TokenAddress, TOKEN1_BALANCE_SLOT), (uint256));
        uint256 token2Balance = abi.decode(retrieveSlotFromL1(l1TokenAddress, TOKEN2_BALANCE_SLOT), (uint256));
        uint256 K = abi.decode(retrieveSlotFromL1(l1TokenAddress, K_SLOT), (uint256));

        uint256 token2After = token2Balance + _token2Amount;
        uint256 token1After = K / token2After;
        token1Amount = token1Balance - token1After;

        // Don't let the pool go to 0
        if (token1Amount == token1Balance) {
            token1Amount--;
        }

        require(token1Amount < token1Balance, "swap amount to large");
    }

    function swapToken2(uint256 _token2Amount) external {
        // Emit an event
        emit SwapToken2(
            msg.sender,
            _token2Amount,
            block.timestamp
        );
    }
}