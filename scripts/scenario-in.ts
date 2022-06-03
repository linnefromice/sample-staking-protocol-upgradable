import { ethers, network } from "hardhat";
import { loadDeployedContractAddresses } from "../libs/utils/deployed-contracts";
import { ERC20__factory, Pool__factory, StakingPool__factory } from "../typechain";

async function main() {
  console.log("START scenario")
  const [owner] = await ethers.getSigners();
  const addresses = loadDeployedContractAddresses(network.name)
  const { mocks, pools, stakingPool, tokens } = addresses

  let tx;
  // approves
  tx = await ERC20__factory.connect(mocks.dai, owner).approve(pools.dai, ethers.constants.MaxUint256)
  await tx.wait()
  tx = await ERC20__factory.connect(mocks.trueUsd, owner).approve(pools.trueUsd, ethers.constants.MaxUint256)
  await tx.wait()
  tx = await ERC20__factory.connect(tokens.govToken, owner).approve(stakingPool, ethers.constants.MaxUint256)
  await tx.wait()

  // deposit & stake
  tx = await Pool__factory.connect(pools.dai, owner).deposit(ethers.utils.parseEther("25"))
  await tx.wait()
  tx = await Pool__factory.connect(pools.trueUsd, owner).deposit(ethers.utils.parseEther("25"))
  await tx.wait()
  tx = await StakingPool__factory.connect(stakingPool, owner).stake(ethers.utils.parseEther("40"))
  await tx.wait()

  console.log("FINISH scenario")
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});