// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";


interface IERC721 {
    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external;
    function getApproved(uint256 _tokenId) external view returns (address);

}

contract BatchTransfer is Ownable {

    event TransferSuccessfull(address indexed _from, IERC721 indexed _collection, address indexed _to);

    function bulkTransfer(address _from, IERC721 _collection, address _to, uint256[] memory _tokenIds, uint256 _limit) external onlyOwner {
        for (uint256 i = 0; i < _tokenIds.length; i++) {
         require(_limit > 0, "Limit must be greater than 0");
        require(_tokenIds.length <= _limit, "Number of tokens to transfer exceeds limit");
        require(_collection.getApproved(_tokenIds[i]) == address(this), "Contract not approved for transfer");
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
