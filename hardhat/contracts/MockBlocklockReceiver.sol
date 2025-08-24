// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import {TypesLib} from "blocklock-solidity/src/libraries/TypesLib.sol";
import {AbstractBlocklockReceiver} from "blocklock-solidity/src/AbstractBlocklockReceiver.sol";

/// @notice This contract is used for testing only and should not be used for production.
contract MockBlocklockReceiver is AbstractBlocklockReceiver {
    uint256 public requestId;
    TypesLib.Ciphertext public encryptedValue;
    string public plainTextValue;

    constructor(address blocklockContract) AbstractBlocklockReceiver(blocklockContract) {}

    function createTimelockRequestWithDirectFunding(
        uint32 callbackGasLimit,
        bytes calldata condition,
        TypesLib.Ciphertext calldata encryptedData
    ) external payable returns (uint256, uint256) {
        // create timelock request
        (uint256 _requestId, uint256 requestPrice) =
            _requestBlocklockPayInNative(callbackGasLimit, condition, encryptedData);
        // store request id
        requestId = _requestId;
        // store Ciphertext
        encryptedValue = encryptedData;
        return (requestId, requestPrice);
    }

    function createTimelockRequestWithSubscription(
        uint32 callbackGasLimit,
        bytes calldata condition,
        TypesLib.Ciphertext calldata encryptedData
    ) external returns (uint256) {
        // create timelock request
        uint256 _requestId = _requestBlocklockWithSubscription(callbackGasLimit, condition, encryptedData);
        // store request id
        requestId = _requestId;
        // store Ciphertext
        encryptedValue = encryptedData;
        return requestId;
    }

    function _onBlocklockReceived(uint256 _requestId, bytes calldata decryptionKey) internal override {
        require(requestId == _requestId, "Invalid request id");
        plainTextValue = abi.decode(_decrypt(encryptedValue, decryptionKey), (string));
    }
}
