export const increaseCount = async (counterContract, performActions) => {
    try {
        await performActions(async (kit) => {
            const {defaultAccount} = kit;
            await counterContract.methods.inc().send({from: defaultAccount});
        });
    } catch (e) {
        console.log({e});
    }
};

export const decreaseCount = async (counterContract, performActions) => {
    try {
        await performActions(async (kit) => {
            const {defaultAccount} = kit;
            await counterContract.methods.dec().send({from: defaultAccount});
        });
    } catch (e) {
        console.log({e});
    }
};

export const getCount = async (counterContract) => {
    try {

        const value =  await counterContract.methods.get().call();
        return value
    } catch (e) {
        console.log({e});
    }
};


export const batchSend = async (counterContract, performActions, assetaddress,  id, _to) => {
    //console.log("id ", id)
    let newId = id.split(',');
    //console.log("default ", defaultAccount)
    // console.log("newID: ", newId)
    // console.log(assetaddress)
    // console.log(counterContract.methods)
    // console.log(to, counterContract, performActions)
    try {
        await performActions(async (kit) => {
            const {defaultAccount} = kit;
            console.log("default ", defaultAccount)
            await counterContract.methods.bulkTransfer(defaultAccount, assetaddress, _to, newId).send({from: defaultAccount});
        });
    } catch (e) {
        console.log({e});
    }
};


export const getEvent = async (counterContract) => {
    try {

        const value =  await counterContract.methods.get().call();
        return value
    } catch (e) {
        console.log({e});
    }
};
const eventName = "TransferSuccessfull";
// // The name of the event to get logs for
// const eventName = "Transfer";

// // Optionally pass in options to limit the blocks from which events are retrieved
// const options = {
//   fromBlock: 0,
//   toBlock: 1000000, // can also pass "latest"
//   order: "desc",
//   // Configure event filters (filter on indexed event parameters)
//   filters: {
//     from: "0x...",
//     to: "0x..."
//   }
// };

// const events = await contract.events.getEvents(eventName, options);
// console.log(events[0].eventName);
// console.log(events[0].data);