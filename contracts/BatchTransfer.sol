// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IERC721 {
    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external;
}

contract BatchTransfer {

    event TransferSuccessfull(address indexed _from, IERC721 indexed _collection, address indexed _to);

    function bulkTransfer(address _from, IERC721 _collection, address _to, uint256[] memory _tokenIds) external {
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            _collection.safeTransferFrom(_from, _to, _tokenIds[i]);
        }

        emit TransferSuccessfull(_from, _collection, _to);
    }
}