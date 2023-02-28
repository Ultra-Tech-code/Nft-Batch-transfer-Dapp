import { ethers } from "ethers";
import { toast } from "react-toastify";
import{ NotificationSuccess, NotificationError } from "../components/ui/Notifications"
const provider = new ethers.providers.Web3Provider(window.ethereum);


export const batchSend = async (batchTransferContract, performActions, assetaddress, id, _to, _totalID) => {
    let newId = id.split(',').map((num)=>{
        return Number(num)
      })     
    try {
        await performActions(async (kit) => {
            const {defaultAccount} = kit;
            const value = await batchTransferContract.methods.bulkTransfer(defaultAccount, assetaddress, _to, newId, _totalID).send({from: defaultAccount});
            if(value === 0){
                toast(<NotificationSuccess text="All NFT's Sent...." />);
            }
            toast(<NotificationSuccess text="NFT's Sent...." />);
            toast(<NotificationError text={`NFT's with this ID ${value} not sent, kindly verify that you own it....`} autoClose={10000} />);
            
        });
    } catch (e) {
        toast(<NotificationError text="NFT's not Sent...." />);
        console.log({e});
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
    const eventName = "TransferSuccessfull";
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
        provider.on(eventName , () => {
            console.log("success ")
            return "success"
       })
      
    } catch (e) {
        console.log({e});
    }
};


