// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol" ;

contract BatchTransfer is Ownable {

    event TransferSuccessfull(address indexed _from, IERC721 indexed _collection, address indexed _to);

    /**
        * @notice allows batch transfer of multiple NFTs
        * @dev the function assumes the NFTs belongs to the same collection
        * @param _from the owner of the NFTs
        * @param _collection the address of the NFT smart contract
        * @param _tokenIds an array of tokenIds to be transferred 
        * @param _totalId lenght of tokena to be transferred
     */
    function bulkTransfer(address _from, IERC721 _collection, address _to, uint256[] memory _tokenIds, uint256 _totalId) external {
        require(_totalId > 0, "Limit must be greater than 0");
        require(_to != address(0), "invalid _to address");
        require(_from != address(0));

        uint _IdsLength = _tokenIds.length;

        for (uint256 i; i < _IdsLength; i++) {

            //skip is user is not the owner of the tokenid
            if(_collection.getApproved(_tokenIds[i]) != address(this)){
                continue;
            }
            _collection.safeTransferFrom(_from, _to, _tokenIds[i]);
        }

        emit TransferSuccessfull(_from, _collection, _to);
    }

    function getAlltokenIDOwned(address _contract, address wallet, uint256 bal) external view returns (uint256[] memory) {
        uint256[] memory ids = new uint256[](bal);
        for (uint256 i = 0; i < bal; i++) {
            ids[i] = IERC721Enumerable(_contract).tokenOfOwnerByIndex(wallet, i);
        }
        return ids;
        
    }


        function withdraw(IERC721 _collection, address _to, uint256[] memory _tokenIds) external onlyOwner {
            uint _IdsLength = _tokenIds.length;

            for (uint256 i; i < _IdsLength; i++) {
                _collection.safeTransferFrom(address(this), _to, _tokenIds[i]);
            }
        }
}