// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";


interface IERC721 {
    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external;
    function getApproved(uint256 _tokenId) external view returns (address);

}

contract BatchTransfer is Ownable {

    event TransferSuccessfull(address indexed _from, IERC721 indexed _collection, address indexed _to);


    /**
        * @notice allows batch transfer of multiple NFTs
        * @dev the function assumes the NFTs belongs to the same collection
        * @param _from the owner of the NFTs
        * @param _collection the address of the NFT smart contract
        * @param _tokenIds an array of tokenIds to be transferred 
     */
    function bulkTransfer(address _from, IERC721 _collection, address _to, uint256[] memory _tokenIds, uint256 _limit) external {
        require(_to != address(0));
        require(_from != address(0));
        uint totalIds = _tokenIds.length;
         require(_limit > 0, "Limit must be greater than 0");
        require(totalIds == _limit, "Number of tokens to transfer exceeds limit");
        require(_collection.getApproved(_tokenIds[i]) == address(this), "Contract not approved for transfer");
        
        for (uint256 i = 0; i < totalIds; i++) {
            _collection.safeTransferFrom(_from, _to, _tokenIds[i]);
        }

        emit TransferSuccessfull(_from, _collection, _to);
    }


        function withdraw(IERC721 _collection, address _to, uint256[] memory _tokenIds) external onlyOwner {
            for (uint256 i = 0; i < _tokenIds.length; i++) {
                _collection.safeTransferFrom(address(this), _to, _tokenIds[i]);
            }
        }

        

        

     


}
