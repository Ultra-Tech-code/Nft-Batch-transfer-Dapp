import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import { Card, Button } from "react-bootstrap";
import { useContractKit } from "@celo-tools/use-contractkit";
import {  batchSend, getEvent } from "../utils/batchTransfer";
import Loader from "./ui/Loader";
import { addressAPI } from "../App";
import { useERC721 } from "../hooks/useERC721";
import BatchTransferAddress from "../contracts/BatchTransferAddress.json";
import{ NotificationSuccess, NotificationError } from "./ui/Notifications"

const BatchTransfer = ({ batchTransferContract }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const { performActions } = useContractKit();
  const [nftId, setnftId] = useState("");
  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState('');
  const {tokenAddress, settokenAddress} = useContext(addressAPI);

  const erc271Contract=  useERC721(tokenAddress)

  const handleSubmit = (event) => {
    event.preventDefault();
   // Assetcontract ${tokenAddress} \n Nftid ${nftId} \n to ${receiver}
    setMessage(
        `
      <p>Assetcontract: ${tokenAddress} </p>
      <p>Nftid: ${nftId} </p>
      <p>receiver: ${receiver} </p>
    `
    );

  };

  const updateInput =() => {
    settokenAddress("");
    setnftId("");
    setReceiver("");
  }

  const updateSendStatus = async (_receiver) => {
    try {
      setLoading(true);
      const value = await(getEvent(batchTransferContract, performActions, _receiver));
      console.log("value ", value)
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
          console.log("batchTransferContract ", batchTransferContract.events)
          console.log("batchTransferContract. methid", batchTransferContract.methods)
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
      //await updateSendStatus(receiver)
    } catch (e) {
      console.log({ e });
      toast(<NotificationError text="OOps, Unable to send." />);
    } finally {
      setLoading(false);
    }
  };



  return (
    <Card className="text-center w-50 m-auto" id="bg-form">
      <Card.Header class="font-weight-bold">BULK NFT TRANSFERER</Card.Header>
  
      <Card.Body className="mt-4">
        <Card.Title></Card.Title>
        <br />

        {!loading ? (

          <div className="d-grid gap-2 d-md-block">

<form onSubmit={handleSubmit}>
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text" id="tokenAddress">&#129297;</span>
          </div>
          <input type="text" id="tokenAddress" name="tokenAddress" class="form-control" value={tokenAddress} placeholder="asset contract addresss"
          onChange={(event) => settokenAddress(event.target.value)} aria-describedby="tokenAddress"
        />
        </div>

        <br />

        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text" id="nftId">&#129488;</span>
          </div>
          <input type="text" id="nftId" name="lastName" class="form-control" value={nftId} placeholder="Enter nft id's "
          onChange={(event) => { setnftId(event.target.value); }} aria-describedby="nftId"
        />
        </div>

        <br />

        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text" id="receiver">&#128525;</span>
          </div>
          <input type="text" id="receiver" name="Receiver" class="form-control" value={receiver} placeholder="Enter receiver address"
          onChange={(event) => { setReceiver(event.target.value);}} aria-describedby="receiver"
        />
        </div>
        <br />

      
        <Button className="m-2"  variant="dark" size="lg" type="submit">Confirm submission</Button>

        <br />
        <br />

        <p class="text-light">{message}</p>

        <Button className="m-2" id="sendNFT"  size="lg" onClick={send} >
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
