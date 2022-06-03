import { ethers } from "hardhat";
import { MintableERC20__factory, Pool__factory, SampleGovToken__factory, SampleVeToken__factory, StakingPool__factory } from "../typechain";

async function main() {
  console.log("START deploy")
  const [owner] = await ethers.getSigners();

  // deploy mocks
  console.log(`> Deploy mocks`)
  const [mockDai, mockTrueUsd] = await Promise.all([
    new MintableERC20__factory(owner).deploy("Mock Dai Stablecoin", "mockDAI"),
    new MintableERC20__factory(owner).deploy("Mock TrueUSD", "mockTUSD"),
  ])
  await Promise.all([
    mockDai.deployTransaction.wait(),
    mockTrueUsd.deployTransaction.wait()
  ])

  // main deployments
  console.log(`> Deploy GovToken`)
  const govToken = await new SampleGovToken__factory(owner).deploy()
  await govToken.deployTransaction.wait()

  console.log(`> Deploy Pools`)
  const [daiPool, trueUsdPool] = await Promise.all([
    new Pool__factory(owner).deploy(mockDai.address, govToken.address),
    new Pool__factory(owner).deploy(mockTrueUsd.address, govToken.address)
  ])
  await Promise.all([
    daiPool.deployTransaction.wait(),
    trueUsdPool.deployTransaction.wait()
  ])

  console.log(`> Deploy VeToken`)
  const veToken = await new SampleVeToken__factory(owner).deploy(owner.address)
  await veToken.deployTransaction.wait()
  console.log(`> Deploy StakingToken`)
  const stakingPool = await new StakingPool__factory(owner).deploy(govToken.address, veToken.address)
  await stakingPool.deployTransaction.wait()
  console.log(`> SampleVeToken.setOperator`)
  await veToken.setOperator(stakingPool.address)
  console.log("FINISH deploy")
  console.log({
    mocks: {
      dai: mockDai.address,
      trueUsd: mockTrueUsd.address,
    },
    pools: {
      dai: daiPool.address,
      trueUsd: trueUsdPool.address,
    },
    stakingPool: stakingPool.address,
    tokens: {
      govToken: govToken.address,
      veToken: veToken.address
    }
  })
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
