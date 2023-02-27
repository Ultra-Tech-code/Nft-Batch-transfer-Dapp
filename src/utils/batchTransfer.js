import { ethers } from "ethers";
import { toast } from "react-toastify";
import{ NotificationSuccess, NotificationError } from "../components/ui/Notifications"
const provider = new ethers.providers.Web3Provider(window.ethereum);


export const batchSend = async (batchTransferContract, performActions, assetaddress, id, _to) => {
    let newId = id.split(',').map((num)=>{
        return Number(num)
      })     
    try {
        await performActions(async (kit) => {
            const {defaultAccount} = kit;
            await batchTransferContract.methods.bulkTransfer(defaultAccount, assetaddress, _to, newId).send({from: defaultAccount});
            toast(<NotificationSuccess text="NFT's Sent...." />);
        });
    } catch (e) {
        toast(<NotificationError text="NFT's not Sent...." />);
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


export const getCount = async (batchTransferContract) => {
    try {

        const value =  await batchTransferContract.methods.get().call();
        return value
    } catch (e) {
        console.log({e});
    }
};

