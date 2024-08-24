// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.20;

interface IL1Blocks {
    function latestBlockNumber() external view returns (uint256);
}

contract L2Storage {
    address constant L1_BLOCKS_ADDRESS = 0x5300000000000000000000000000000000000001;
    address constant L1_SLOAD_ADDRESS = 0x0000000000000000000000000000000000000101;
    address immutable l1TokenAddress;

    constructor(address _l1TokenAddress) {
        l1TokenAddress = _l1TokenAddress;
    }

    // Internal functions

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

    // Public functions
    function retrieveL1Balance(address account) public view returns(uint) {
        uint slotNumber = 0;
        return abi.decode(retrieveSlotFromL1(
            l1TokenAddress,
            uint(keccak256(
                abi.encodePacked(uint(uint160(account)),slotNumber)
                )
            )
            ), (uint));
    }
}