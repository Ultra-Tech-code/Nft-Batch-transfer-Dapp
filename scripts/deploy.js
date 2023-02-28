// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const BatchTransfer = await hre.ethers.getContractFactory("BatchTransfer");
  const batchTransfer = await BatchTransfer.deploy();

  await batchTransfer.deployed();

  console.log("Contract deployed to:", batchTransfer.address);
  storeContractData(batchTransfer)
}

function storeContractData(contract) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/BatchTransferAddress.json",
    JSON.stringify({ BatchTransfer: contract.address }, undefined, 2)
  );

  const BatchTransferArtifact = artifacts.readArtifactSync("BatchTransfer");

  fs.writeFileSync(
    contractsDir + "/BatchTransfer.json",
    JSON.stringify(BatchTransferArtifact, null, 2)
  );
}

//deployed to - 0xEa9C19564186958FB6De241c049c3727a6a40c28
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

