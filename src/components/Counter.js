import React, { useRef, useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { useContractKit } from "@celo-tools/use-contractkit";
import { increaseCount, decreaseCount, getCount, batchSend } from "../utils/counter";
import Loader from "./ui/Loader";

const Counter = ({ counterContract }) => {
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const { performActions } = useContractKit();

  /*****************************************8 */
  const [tokenAddress, settokenAddress] = useState("");
  const [nftId, setnftId] = useState("");
  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState('');


  const handleSubmit = (event) => {
    event.preventDefault();

    setMessage(`Assetcontract ${tokenAddress}`  + `\n Nftid ${nftId}` + `\n to ${receiver}`);

  };

  const updateInput =() => {
    settokenAddress("");
    setnftId("");
    setReceiver("");
  }

  /*********************************88 */

  useEffect(() => {
    try {
      if (counterContract) {
        updateCount();
      }
    } catch (error) {
      console.log({ error });
    }
  }, [counterContract, getCount]);

  const increment = async () => {
    try {
      setLoading(true);
      await increaseCount(counterContract, performActions);
      await updateCount();
    } catch (e) {
      console.log({ e });
    } finally {
      setLoading(false);
    }
  };

  const decrement = async () => {
    try {
      setLoading(true);
      await decreaseCount(counterContract, performActions);

      await updateCount();
    } catch (e) {
      console.log({ e });
    } finally {
      setLoading(false);
    }
  };

  const updateCount = async () => {
    try {
      setLoading(true);
      const value = await getCount(counterContract);
      setCount(value);
    } catch (e) {
      console.log({ e });
    } finally {
      setLoading(false);
    }
  };


  const send = async () => {
    try {
      setLoading(true);
      await batchSend(counterContract, performActions, tokenAddress, nftId, receiver);

      await updateInput()
      await updateCount();
    } catch (e) {
      console.log({ e });
    } finally {
      setLoading(false);
    }
  };



  return (
    <Card className="text-center w-50 m-auto">
      <Card.Header>Counter</Card.Header>

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

      <Card.Body className="mt-4">
        <Card.Title>Count: {count}</Card.Title>
        <br />

        {!loading ? (
          <div className="d-grid gap-2 d-md-block">
            <Button
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
            </Button>
          </div>
        ) : (
          <Loader />
        )}
      </Card.Body>
    </Card>
  );
};

export default Counter;
