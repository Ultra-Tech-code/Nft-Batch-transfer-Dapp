import { useContract } from "../hooks";
import erc721 from "../contracts/erc721.json";



// export interface for smart contract
export const useERC721 = (_tokenAddress) =>
  useContract(erc721.abi, _tokenAddress );
    

  
