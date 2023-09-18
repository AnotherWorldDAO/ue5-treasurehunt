const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

async function getLastTxGas() {
  // Get latest transaction hash
  const latestBlock = await ethers.provider.getBlock("latest");
  const latestTXHash = latestBlock.transactions.at(-1);
  // Get latest transaction receipt object
  const latestTXReceipt = await ethers.provider.getTransactionReceipt(
    latestTXHash
  );
  // Determine latest transaction gas costs
  const latestTXGasUsage = latestTXReceipt.gasUsed;
  const latestTXGasPrice = latestTXReceipt.effectiveGasPrice;
  const latestTXGasCosts = latestTXGasUsage.mul(latestTXGasPrice);
  return Number(latestTXGasUsage);
}

describe("Game Prize contract", function () {
  async function deployTokenFixture() {
    const MockERC20Contract = await ethers.getContractFactory("MockERC20");
    const GamePrizeContract = await ethers.getContractFactory("GamePrize");
    const [owner, operator, player1, player2] = await ethers.getSigners();

    const MockERC20 = await MockERC20Contract.deploy();
    console.log("\tGas(MockERC20-deployment):\t", await getLastTxGas());
    await MockERC20.deployed();

    const GamePrize = await GamePrizeContract.deploy();
    console.log("\tGas(GamePrize-deployment):\t", await getLastTxGas());
    await GamePrize.deployed();

    await GamePrize.connect(owner).setPrizeOperator(operator.address);

    await MockERC20.transfer(
      GamePrize.address,
      ethers.utils.parseEther("1000.0")
    );

    await GamePrize.connect(owner).setAmount(
      MockERC20.address,
      ethers.utils.parseEther("1.0")
    );

    return { GamePrize, MockERC20, owner, operator, player1, player2 };
  }

  describe("Deployment", function () {
    it("Should set the right owner for MockERC20", async function () {
      const { MockERC20, owner } = await loadFixture(deployTokenFixture);
      expect(await MockERC20.owner()).to.equal(owner.address);
    });

    it("Should set the right owner for GamePrize", async function () {
      const { GamePrize, owner } = await loadFixture(deployTokenFixture);
      expect(await GamePrize.owner()).to.equal(owner.address);
    });

    it("Should have a correct GamePrize operator", async function () {
      const { GamePrize, operator } = await loadFixture(deployTokenFixture);
      expect(await GamePrize.prizeOperator()).to.equal(operator.address);
    });

    it("Should have a correct GamePrize balance", async function () {
      const { GamePrize, MockERC20 } = await loadFixture(deployTokenFixture);
      expect(await MockERC20.balanceOf(GamePrize.address)).to.equal(
        ethers.utils.parseEther("1000.0")
      );
    });
  });

  describe("Airdrop", function () {
    it("Should drip correctly", async function () {
      const { MockERC20, GamePrize, owner, operator, player1, player2 } =
        await loadFixture(deployTokenFixture);

      await GamePrize.connect(operator).drip(
        MockERC20.address,
        player1.address
      );
      await GamePrize.connect(operator).drip(
        MockERC20.address,
        player2.address
      );

      await expect(
        GamePrize.connect(operator).drip(MockERC20.address, player1.address)
      )
        .to.emit(GamePrize, "Drip")
        .withArgs(
          MockERC20.address,
          player1.address,
          ethers.utils.parseEther("1.0")
        );

      await expect(await MockERC20.balanceOf(player1.address)).to.equal(
        ethers.utils.parseEther("2.0")
      );

      await expect(await MockERC20.balanceOf(player2.address)).to.equal(
        ethers.utils.parseEther("1.0")
      );
    });
  });

  describe("Withdraw", function () {
    it("Should drip and withdraw correctly", async function () {
      const { MockERC20, GamePrize, owner, operator, player1, player2 } =
        await loadFixture(deployTokenFixture);
      await GamePrize.connect(operator).drip(MockERC20.address, owner.address);

      await expect(GamePrize.connect(owner).withdrawErc20(MockERC20.address))
        .to.emit(GamePrize, "OwnerWithdrawErc20")
        .withArgs(
          owner.address,
          MockERC20.address,
          ethers.utils.parseEther("999.0")
        );

      await expect(await MockERC20.balanceOf(owner.address)).to.equal(
        await MockERC20.totalSupply()
      );

      await expect(await MockERC20.balanceOf(MockERC20.address)).to.equal(
        ethers.utils.parseEther("0.0")
      );
    });
  });
});
