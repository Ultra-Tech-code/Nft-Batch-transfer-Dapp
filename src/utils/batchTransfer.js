//import { ethers } from "ethers";
import { toast } from "react-toastify";
import{ NotificationSuccess, NotificationError } from "../components/ui/Notifications"
//const provider = new ethers.providers.Web3Provider(window.ethereum);


export const batchSend = async (batchTransferContract, performActions, assetaddress, id, _to, _totalID) => {
    let newId = id.split(',').map((num)=>{
        return Number(num)
      })  
      
    //   const isTransactionMined = async() => {
    //     const txReceipt = await provider.getTransactionReceipt(hash);
    //     if (txReceipt && txReceipt.blockNumber) {
    //         return txReceipt;
    //     }
    // }
      
    try {
        await performActions(async (kit) => {
            
            const {defaultAccount} = kit;
            const value = await batchTransferContract.methods.bulkTransfer(defaultAccount, assetaddress, _to, newId, _totalID).send({from: defaultAccount}).on('transactionHash', function(hash){
                console.log("hash "+ hash)
                toast(<NotificationSuccess text="NFT's Sending, ~3 minute remaining...." />);
            })
            toast(<NotificationSuccess text="All NFT's Sent...." />)

            console.log("value receipt ", value.events.TransferSuccessfull.returnValues)

            
            
            // if(value.events === 0){
            //     toast(<NotificationSuccess text="All NFT's Sent...." />);
            // }


            // const notTransferredCount = value[0];
            // const _totalId = value[1];

            // if (notTransferredCount < _totalId) {
            //     const finalNotOwnerId = [](notTransferredCount);
            //     for (let index = 0; index < notTransferredCount; index++) {
            //         finalNotOwnerId[index] = _totalId[index];
            //     }
            //     toast(<NotificationSuccess text="NFT's Sent...." />);
            //     toast(<NotificationError text={`NFT's with this ID ${finalNotOwnerId} not sent, kindly verify that you own it....`} autoClose={10000} />);
            // } else {
            //     toast(<NotificationSuccess text="NFT's Sent...." />);
            //     toast(<NotificationError text={`NFT's with this ID ${_totalId} not sent, kindly verify that you own it....`} autoClose={10000} />);    
            // }
            
        });
    } catch (e) {
        if(e.message.includes("Transaction was not mined within 50 blocks, please make sure your transaction was properly sent. Be aware that it might still be mined!")) {
            toast(<NotificationSuccess text="NFT's Sent...." />);
            // const receipt = await isTransactionMined()
            // console.log(receipt)
    
              }else{
                toast(<NotificationError text="NFT's not Sent...." />);
                console.log({e});
        }
    }
};

export const getTotalTransfer = async (batchTransferContract) => {
    try {
        const value =  await batchTransferContract.methods.getallCollection().call();
        return value.length;
    } catch (e) {
        console.log({e});
    }
};


export const getEvent = async (batchTransferContract, performActions, _to ) => {
    //const eventName = "TransferSuccessfull";
    console.log("event block")
    try {
        // await performActions(async (kit) => {
        //     const {defaultAccount} = kit;

        //     // const options = {
        //     //     fromBlock: 0,
        //     //     toBlock: 1000000, // can also pass "latest"
        //     //     order: "desc",
        //     //     // Configure event filters (filter on indexed event parameters)
        //     //     filters: {
        //     //       from: defaultAccount,
        //     //       to: _to
        //     //     }
        //     //   };
        //     // const events = await batchTransferContract.events(eventName, options).send({from: defaultAccount});
        //     // console.log(events[0].eventName);
        //     // console.log(events[0].data);
        //     // return events[0].data;
        //     provider.on(eventName , () => {
        //         console.log("success ")
        //         return "success"
        //    })
        // });
    //     provider.on(eventName , () => {
    //         console.log("success ")
    //         return "success"
    //    })
      
    } catch (e) {
        console.log({e});
    }
};


