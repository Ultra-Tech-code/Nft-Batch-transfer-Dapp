import { useContract } from "./useContract";
import BatchTransfer from "../contracts/BatchTransfer.json";
import BatchTransferAddress from "../contracts/BatchTransferAddress.json";

// export interface for smart contract
export const useBatchTransferContract = () =>
  useContract(BatchTransfer.abi, BatchTransferAddress.BatchTransfer);
  
