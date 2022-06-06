import { ethers, upgrades } from "hardhat";
import { MintableERC20__factory, Pool, Pool__factory, SampleGovToken__factory, SampleVeToken__factory, StakingPool, StakingPool__factory, UpgradableSampleGovToken, UpgradableSampleGovToken__factory, UpgradableSampleVeToken, UpgradableSampleVeToken__factory } from "../typechain";

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
  const govToken = (await upgrades.deployProxy(
    new UpgradableSampleGovToken__factory(owner)
  )) as UpgradableSampleGovToken
  await govToken.deployTransaction.wait()

  console.log(`> Deploy Pools`)
  const [daiPool, trueUsdPool] = await Promise.all([
    upgrades.deployProxy(
      new Pool__factory(owner),
      [mockDai.address, govToken.address]
    ),
    upgrades.deployProxy(
      new Pool__factory(owner),
      [mockTrueUsd.address, govToken.address]
    )
  ]) as [Pool, Pool]
  await Promise.all([
    daiPool.deployTransaction.wait(),
    trueUsdPool.deployTransaction.wait()
  ])

  console.log(`> Deploy VeToken`)
  const veToken = (await upgrades.deployProxy(
    new UpgradableSampleVeToken__factory(owner),
    [owner.address]
  )) as UpgradableSampleVeToken
  await veToken.deployTransaction.wait()
  console.log(`> Deploy StakingToken`)
  const stakingPool = (await upgrades.deployProxy(
    new StakingPool__factory(owner),
    [govToken.address, veToken.address]
  )) as StakingPool
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
