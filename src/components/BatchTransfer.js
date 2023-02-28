import React, { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { Card, Button } from "react-bootstrap";
import { useContractKit } from "@celo-tools/use-contractkit";
import {  batchSend, getEvent, getTotalTransfer } from "../utils/batchTransfer";
import Loader from "./ui/Loader";
import { addressAPI } from "../App";
import { useERC721 } from "../hooks/useERC721";
import BatchTransferAddress from "../contracts/BatchTransferAddress.json";
import{ NotificationInfo, NotificationSuccess, NotificationError } from "./ui/Notifications"
import 'react-toastify/dist/ReactToastify.css';

const BatchTransfer = ({ batchTransferContract }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const { performActions } = useContractKit();
  const [nftId, setnftId] = useState("");
  const [receiver, setReceiver] = useState("");
  const [totalID, settotalID] = useState("");
  const [message, setMessage] = useState([]);
  const {tokenAddress, settokenAddress} = useContext(addressAPI); 

  const erc271Contract=  useERC721(tokenAddress)

useEffect(() => {
  try { 
      if (batchTransferContract ) {
        getTotal();
      }
  } catch (error) {
      console.log({error});
  }
}, [batchTransferContract, getTotalTransfer]);


  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage([`${tokenAddress}`,`${nftId}`, `${receiver}`]);

  };

  const updateInput =() => {
    settokenAddress("");
    setnftId("");
    setReceiver("");
    settotalID("");
  }

  const updateSendStatus = async (_receiver) => {
    try {
      setLoading(true);
      const value = await getEvent(batchTransferContract, performActions, _receiver);
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
      await performActions(async (kit) => {
          const {defaultAccount} = kit;
          await  erc271Contract.methods.setApprovalForAll( BatchTransferAddress?.BatchTransfer, true).send({from: defaultAccount});
          toast(<NotificationSuccess text="Approval Successfull...." />);
      });
  } catch (e) {
    toast(<NotificationError text="OOps, Approval Failed." />);
      console.log({e});
  }


  }

  const send = async () => {   
    try {
      setLoading(true);
      
      await approve(tokenAddress, performActions)

      await batchSend(batchTransferContract, performActions, tokenAddress, nftId, receiver, totalID);
      updateInput()
      //await updateSendStatus(receiver)
    } catch (e) {
      console.log({ e });
      updateInput()
    } finally {
      setLoading(false);
    }
  };

  const getTotal = async () => {   
    try {
      setLoading(true);  
      const value = await getTotalTransfer(batchTransferContract)
    toast(<NotificationInfo  text= {`Proceessed ${value} transaction, when processing thousands of nft, wallet might throw gas estimation error, kindly click "I want to proceed anyway"`}/>
    ,{position: toast.POSITION.TOP_LEFT}); 
    } catch (e) {
      console.log({ e });
    } finally {
      setLoading(false);
    }
  };



  return (
    <Card className="text-center w-50 m-auto" id="bg-form">
      <Card.Header className="font-weight-bold text-dark">BULK NFT TRANSFERER</Card.Header>
  
      <Card.Body className="mt-4">
        <Card.Title></Card.Title>
        <br />

        {!loading ? (

          <div className="d-grid gap-2 d-md-block">

<form onSubmit={handleSubmit}>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="tokenAddress">&#x1F47E;</span>
          </div>
          <input type="text" id="tokenAddress" name="tokenAddress" className="form-control" value={tokenAddress} placeholder="asset contract addresss"
          onChange={(event) => settokenAddress(event.target.value)} aria-describedby="tokenAddress"
        />
        </div>

        <br />

        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="nftId">&#x1F575;</span>
          </div>
          <input type="text" id="nftId" name="lastName" className="form-control" value={nftId} placeholder="Enter nft id's 0, 1, 2"
          onChange={(event) => { setnftId(event.target.value); }} aria-describedby="nftId"
        />
        </div>

        <br />
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="receiver">&#x1F91D;</span>
          </div>
          <input type="text" id="receiver" name="Receiver" className="form-control" value={receiver} placeholder="Enter receiver address"
          onChange={(event) => { setReceiver(event.target.value);}} aria-describedby="receiver"
        />
        </div>

        <br />

        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="totalID">&#x1F680;</span>
          </div>
          <input type="text" id="totalID" name="TotalID" className="form-control" value={totalID} placeholder="Enter the totalID"
          onChange={(event) => { settotalID(event.target.value);}} aria-describedby="totalID"
        />
        </div>

      
        <Button className="m-2"  variant="dark" size="lg" type="submit">Confirm submission</Button>

        <br />
        <br />

        <div className="text-light">
        <p><span className="text-dark">Assetcontract: </span>{message[0]} </p>
         <p><span className="text-dark">NftId's: </span> {message[1]} </p>
         <p><span className="text-dark">Receiver: </span> {message[2]} </p>

        </div>

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
