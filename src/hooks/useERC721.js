import { useContract } from "../hooks";
import erc721 from "../contracts/erc721.abi";
import { addressAPI } from "../App";
import { useContext } from "react";


// export interface for smart contract
export const useERC721 = () =>{
const {tokenAddress} = useContext(addressAPI);
 return  useContract(erc721.abi, tokenAddress);

}
    

  
