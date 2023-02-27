import { useContract } from "../hooks";
import erc721 from "../contracts/erc721.json";
import { addressAPI } from "../App";
import { useContext } from "react";


// export interface for smart contract
export const useERC721 = (_tokenAddress) =>
    // const {tokenAddress} = useContext(addressAPI);
  useContract(erc721.abi, _tokenAddress );
    

  
