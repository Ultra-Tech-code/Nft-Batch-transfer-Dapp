import { Container, Nav } from "react-bootstrap";
import { useContractKit } from "@celo-tools/use-contractkit";
import { Notification } from "./components/ui/Notifications";
import Wallet from "./components/Wallet";
import Cover from "./components/Cover";
import React, {useState} from "react";
import BatchTransfer from "./components/BatchTransfer";
import { useBalance, useBatchTransferContract } from "./hooks";
import "./App.css";


export const addressAPI = React.createContext({

})

const App = function AppWrapper() {
  const { address, destroy, connect } = useContractKit();
  const { balance } = useBalance();
  const batchTransferContract = useBatchTransferContract();
  const [tokenAddress, settokenAddress] = useState("");

  return (
    <addressAPI.Provider value={{tokenAddress, settokenAddress}}>

    <>
      <Notification />
      {address ? ( 
        <Container fluid="md">
          <Nav className="justify-content-end pt-3 pb-5">
            <Nav.Item>
              {/*display user wallet*/}
              <Wallet
                address={address}
                amount={balance.CELO}
                symbol="CELO"
                destroy={destroy}
              />
            </Nav.Item>
          </Nav>
          {/* display cover */}
          <main>
            <BatchTransfer batchTransferContract={batchTransferContract} />
          </main>
        </Container>
      ) : (
        // display cover if user is not connected
        <div className="App">
          <header className="App-header">
            <Cover connect={connect} />
          </header>
        </div>
      )}
    </>
    </addressAPI.Provider>
  );
};

export default App;
