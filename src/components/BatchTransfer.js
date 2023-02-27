import React, { useState, useEffect, useContext } from "react";
import { Card, Button } from "react-bootstrap";
import { useContractKit } from "@celo-tools/use-contractkit";
//increaseCount, decreaseCount,
import {  batchSend, getCount, Approval } from "../utils/batchTransfer";
import Loader from "./ui/Loader";
import { addressAPI } from "../App";
import { useERC721 } from "../hooks/useERC721";
import BatchTransferAddress from "../contracts/BatchTransferAddress.json";

const BatchTransfer = ({ batchTransferContract }) => {
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const { performActions } = useContractKit();

  /*****************************************8 */
  const [nftId, setnftId] = useState("");
  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState('');

  const {tokenAddress, settokenAddress} = useContext(addressAPI);


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

  useEffect(() => {
    try {
      if (batchTransferContract) {
        updateCount();
      }
    } catch (error) {
      console.log({ error });
    }
  }, [batchTransferContract, getCount]);


  // const increment = async () => {
  //   try {
  //     setLoading(true);
  //     await increaseCount(batchTransferContract, performActions);
  //     await updateCount();
  //   } catch (e) {
  //     console.log({ e });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const decrement = async () => {
  //   try {
  //     setLoading(true);
  //     await decreaseCount(batchTransferContract, performActions);

  //     await updateCount();
  //   } catch (e) {
  //     console.log({ e });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const updateCount = async () => {
    try {
      setLoading(true);
      const value = await(batchTransferContract);
      setCount(value);
    } catch (e) {
      console.log({ e });
    } finally {
      setLoading(false);
    }
  };

  // const updateSendStatus = async () => {
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
  const contraxr721 =  useERC721(tokenAddress)

  const approve = async () => {

    try {
      console.log("appoval is done")
      await performActions(async (kit) => {
          const {defaultAccount} = kit;
          // console.log("default ", defaultAccount)
          await  contraxr721.methods.setApprovalForAll( BatchTransferAddress?.BatchTransfer, true).send({from: defaultAccount});
      });
  } catch (e) {
      console.log({e});
  }


  }

  const send = async () => {   

    try {
      setLoading(true);

     // await contraxr721.method

      await approve(tokenAddress, performActions)

      await batchSend(batchTransferContract, performActions, tokenAddress, nftId, receiver);

      updateInput()
      //await updateSendStatus()
      //await updateCount();
    } catch (e) {
      console.log({ e });
    } finally {
      setLoading(false);
    }
  };



  return (
    <Card className="text-center w-50 m-auto">
      <Card.Header>Counter</Card.Header>

  
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

          




            {/* <Button
              className="m-2"
              variant="dark"
              size="lg"
              onClick={increment}
            >
              Increase Count
            </Button>
            <Button
              className="m-2"
              variant="outline-dark"
              disabled={count < 1}
              size="lg"
              onClick={decrement}
            >
              Decrease Count
            </Button> */}
          </div>
        ) : (
          <Loader />
        )}
      </Card.Body>
    </Card>
  );
};

export default BatchTransfer;
