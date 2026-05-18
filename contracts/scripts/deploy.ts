import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const initialSupply = ethers.parseUnits("1000000000", 18);

  const BCGS = await ethers.getContractFactory("BCGSToken");
  const token = await BCGS.deploy(deployer.address, initialSupply);
  await token.waitForDeployment();

  const Rewards = await ethers.getContractFactory("TournamentRewards");
  const rewards = await Rewards.deploy(deployer.address);
  await rewards.waitForDeployment();

  const Escrow = await ethers.getContractFactory("GameEscrow");
  const escrow = await Escrow.deploy(deployer.address);
  await escrow.waitForDeployment();

  const Treasury = await ethers.getContractFactory("TreasuryMultisig");
  const treasury = await Treasury.deploy([deployer.address], 1);
  await treasury.waitForDeployment();

  console.log({
    token: await token.getAddress(),
    rewards: await rewards.getAddress(),
    escrow: await escrow.getAddress(),
    treasury: await treasury.getAddress()
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
