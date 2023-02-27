// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IERC721 {
    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external;
}

contract BatchTransfer {

    event TransferSuccessfull(address indexed _from, IERC721 indexed _collection, address indexed _to);

    /**
        * @notice allows batch transfer of multiple NFTs
        * @dev the function assumes the NFTs belongs to the same collection
        * @param _from the owner of the NFTs
        * @param _collection the address of the NFT smart contract
        * @param _tokenIds an array of tokenIds to be transferred 
     */
    function bulkTransfer(address _from, IERC721 _collection, address _to, uint256[] memory _tokenIds) external {
        require(_to != address(0));
        require(_from != address(0));
        uint totalIds = _tokenIds.length;
        
        for (uint256 i = 0; i < totalIds; i++) {
            _collection.safeTransferFrom(_from, _to, _tokenIds[i]);
        }

        emit TransferSuccessfull(_from, _collection, _to);
    }
}