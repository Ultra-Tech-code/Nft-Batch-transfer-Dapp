// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
interface IERC721 {
    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external;
    function ownerOf(uint256 _tokenId) external view returns (address);

}

contract BatchTransfer is Ownable {

    event TransferSuccessfull(address indexed _from, IERC721 indexed _collection, address indexed _to);

    /// all collection that the contract has processed
    IERC721[] allCollection;

    /**
        * @notice allows batch transfer of multiple NFTs
        * @dev the function assumes the NFTs belongs to the same collection
        * @param _from the owner of the NFTs
        * @param _collection the address of the NFT smart contract
        * @param _tokenIds an array of tokenIds to be transferred 
        * @param _totalId lenght of tokena to be transferred
     */    
    function bulkTransfer(address _from, IERC721 _collection, address _to, uint256[] memory _tokenIds, uint256 _totalId) external returns(uint256, uint256[] memory){
        require(_to != address(0));
        require(_from != address(0));
        uint totalIds = _tokenIds.length;
        require(totalIds == _totalId, "total id less/greater than _idLenght");

        //id's Of Nft that was not sent in a transaction
        uint[] memory notOwnerId = new uint[](_totalId);
        uint notTransferredCount = 0;
        
        for (uint256 i; i < totalIds; i++) {

             //skip if user is not the owner of the tokenid
            if(_collection.ownerOf(_tokenIds[i]) != _from){
                notOwnerId[notTransferredCount] = _tokenIds[i];
                notTransferredCount++;

                continue;
            }
            _collection.safeTransferFrom(_from, _to, _tokenIds[i]);
        }
        allCollection.push(_collection);

        emit TransferSuccessfull(_from, _collection, _to);
        return(notTransferredCount , notOwnerId) ;
    }

       /**
        * @notice allows the contract owner to send out any any trapped token in the contract
        * @param _to receiver of the NFTs
        * @param _collection the address of the NFT smart contract
        * @param _tokenIds an array of tokenIds to be transferred 
     */
    function withdraw(IERC721 _collection, address _to, uint256[] memory _tokenIds) external onlyOwner {
        uint _IdsLength = _tokenIds.length;

        for (uint256 i; i < _IdsLength; i++) {
            _collection.safeTransferFrom(address(this), _to, _tokenIds[i]);
        }
    }

}