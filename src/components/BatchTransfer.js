import React, { useState, useEffect, useContext } from "react";
import { Card, Button } from "react-bootstrap";
import { useContractKit } from "@celo-tools/use-contractkit";
import {  batchSend, getEvent } from "../utils/batchTransfer";
import Loader from "./ui/Loader";
import { addressAPI } from "../App";
import { useERC721 } from "../hooks/useERC721";
import BatchTransferAddress from "../contracts/BatchTransferAddress.json";

const BatchTransfer = ({ batchTransferContract }) => {
  const [loading, setLoading] = useState(false);
  //const [count, setCount] = useState(0);
  const [status, setStatus] = useState("");
  const { performActions } = useContractKit();
  const [nftId, setnftId] = useState("");
  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState('');
  const {tokenAddress, settokenAddress} = useContext(addressAPI);

  const erc271Contract=  useERC721(tokenAddress)

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage(`Assetcontract ${tokenAddress} \n Nftid ${nftId} \n to ${receiver}`);

  };

  const updateInput =() => {
    settokenAddress("");
    setnftId("");
    setReceiver("");
  }

  /*********************************88 */

  // useEffect(() => {
  //   try {
  //     if (batchTransferContract) {
  //       updateCount();
  //     }
  //   } catch (error) {
  //     console.log({ error });
  //   }
  // }, [batchTransferContract, getCount]);


  // const updateCount = async () => {
  //   try {
  //     setLoading(true);
  //     const value = await(batchTransferContract);
  //     setCount(value);
  //   } catch (e) {
  //     console.log({ e });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const updateSendStatus = async (_receiver) => {
    try {
      setLoading(true);
      const value = await(getEvent(batchTransferContract, performActions, _receiver));
      setStatus(value);
    } catch (e) {
      console.log({ e });
    } finally {
      setLoading(false);
    }
  };


  const approve = async () => {
    try {
      console.log("appoval is done")
      await performActions(async (kit) => {
          const {defaultAccount} = kit;
          await  erc271Contract.methods.setApprovalForAll( BatchTransferAddress?.BatchTransfer, true).send({from: defaultAccount});
      });
  } catch (e) {
      console.log({e});
  }


  }

  const send = async () => {   
    try {
      setLoading(true);

      await approve(tokenAddress, performActions)

      await batchSend(batchTransferContract, performActions, tokenAddress, nftId, receiver);

      updateInput()
      await updateSendStatus(receiver)
      //await updateCount();
    } catch (e) {
      console.log({ e });
    } finally {
      setLoading(false);
    }
  };



  return (
    <Card className="text-center w-50 m-auto">
      <Card.Header>Bulk Nft Transferer</Card.Header>
  
      <Card.Body className="mt-4">
        <Card.Title></Card.Title>
        <br />

        {!loading ? (

          <div className="d-grid gap-2 d-md-block">

<form onSubmit={handleSubmit}>
        <input type="text" id="tokenAddress" name="tokenAddress" value={tokenAddress} placeholder="asset contract addresss"
          onChange={(event) => settokenAddress(event.target.value)}
        />

        <br />
        <br />

        <input type="text" id="nftId" name="lastName" value={nftId} placeholder="Enter nft id's "
          onChange={(event) => {
            setnftId(event.target.value);
          }}
        />

        <br />
        <br />

        <input type="text" id="receiver" name="Receiver" value={receiver} placeholder="Enter receiver address"
          onChange={(event) => {
            setReceiver(event.target.value);
          }}
        />

        <br />
        <br />

        <button type="submit">Confirm submission</button>

        <br />
        <br />

        <p>{message}</p>

        <Button className="m-2" id="sendNFT" variant="dark" size="lg" onClick={send} >
              send Nft
            </Button>
      </form>

      <p>{status}</p>

          </div>
        ) : (
          <Loader />
        )}
      </Card.Body>
    </Card>
  );
};

export default BatchTransfer;
