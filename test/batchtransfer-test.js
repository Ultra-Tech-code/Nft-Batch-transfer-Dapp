const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BatchTransfer", function () {
  this.timeout(50000);

  let batchTransfer;
  let testNft;

  this.beforeEach(async function () {
    const BatchTransfer = await ethers.getContractFactory("BatchTransfer");
    batchTransfer = await BatchTransfer.deploy();

      const TestNft = await ethers.getContractFactory("TestNft");
      testNft = await TestNft.deploy();

  });

  it("Should mint and transfer", async function () {
    const [deployer, tester1, tester2] = await ethers.getSigners()
    await testNft.safeMint(tester1.address)
    await testNft.safeMint(tester1.address)

    expect(await testNft.balanceOf(tester1.address)).to.equal(2);

    await TestNftInteract.connect(tester1).setApprovalForAll(batchTransfer.address, true)

    const txtransfer = await batchTransfer.connect(tester1).bulkTransfer(tester1.address,testNft, tester2.address, [0,1], 2)
    await txtransfer.wait()

    expect(await testNft.balanceOf(tester1.address)).to.equal(0);
    expect(await testNft.balanceOf(tester2.address)).to.equal(2);

  });

});
