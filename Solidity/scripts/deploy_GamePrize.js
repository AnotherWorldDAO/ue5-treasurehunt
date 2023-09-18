const { ethers, network, run } = require("hardhat");

  // run this under the repo root
  // npx hardhat run --network goerli scripts\deploy_GamePrize.js

async function main() {
  const [deployer, operator] = await ethers.getSigners();

  console.log("Deployer:", deployer.address);
  // check account balance
  console.log(
    "Deployer balance:",
    ethers.utils.formatEther(await deployer.getBalance()).toString()
  );
  console.log("");
  console.log("Operator:", operator.address);
  console.log(
    "Operator balance:",
    ethers.utils.formatEther(await operator.getBalance()).toString()
  );

  const MockERC20Contract = await ethers.getContractFactory(
    "MockERC20"
  );

  const MockERC20 = await MockERC20Contract.deploy();
  await MockERC20.deployed();

  console.log(`MockERC20 Contract deployed to ${MockERC20.address} on ${network.name}`);

  const GamePrizeContract = await ethers.getContractFactory("GamePrize");

  const GamePrize = await GamePrizeContract.deploy();

  const WAIT_BLOCK_CONFIRMATIONS = 10;
  await GamePrize.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);

  console.log(`GamePrize Contract deployed to ${GamePrize.address} on ${network.name}`);

  let tx;
  tx = await GamePrize.connect(deployer).setPrizeOperator(operator.address);
  await tx.wait();

  tx = await MockERC20.connect(deployer).transfer(GamePrize.address, ethers.utils.parseEther("10000.0"));
  await tx.wait();

  tx = await GamePrize.connect(deployer).setAmount(
    MockERC20.address,
    ethers.utils.parseEther("1.0")
  );
  await tx.wait();

  console.log(`Verifying contract on Etherscan...`);

  await run(`verify:verify`, {
    address: GamePrize.address,
  });

  await run(`verify:verify`, {
    address: MockERC20.address,
  });

  console.log("done!");
  console.log("Deployer:", deployer.address);
  // check account balance
  console.log(
    "Deployer balance:",
    ethers.utils.formatEther(await deployer.getBalance()).toString()
  );
  console.log("");
  console.log("Operator:", operator.address);
  console.log(
    "Operator balance:",
    ethers.utils.formatEther(await operator.getBalance()).toString()
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
