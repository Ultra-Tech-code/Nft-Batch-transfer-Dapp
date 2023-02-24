import { useState, useEffect, useCallback } from "react";
import { useContractKit } from "@celo-tools/use-contractkit";
import { useBatchTransferContract } from "./useBatchTransferContract";

export const useCount = () => {
  const { address, kit } = useContractKit();
  const [count, setCount] = useState(0);
  const batchTransferContract = useBatchTransferContract();

  const getCount = useCallback(async () => {
    if (!batchTransferContract) return;
    // fetch a connected wallet token balance
    const value = await batchTransferContract.methods.get().call();
    setCount(value);
  }, [address, kit, batchTransferContract]);

  useEffect(() => {
    if (address) getCount();
  }, [address, getCount()]);

  return {
    count,
    getCount,
  };
};
