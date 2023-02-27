import React from 'react'
import { useERC721 } from "../hooks/useERC721";
import BatchTransferAddress from "../contracts/BatchTransferAddress.json";


const Approval = (_tokenAddress) => {
    const erc721Contract = useERC721(_tokenAddress);

    
  return (
    erc721Contract
  )
}

export default Approval