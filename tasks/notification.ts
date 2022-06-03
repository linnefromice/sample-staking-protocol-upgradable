import { task } from 'hardhat/config'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { loadDeployedContractAddresses } from "../libs/utils/deployed-contracts";
import { NotificationContract__factory } from "../typechain";

const setup = async (hre: HardhatRuntimeEnvironment) => {
  const { ethers, network } = hre
  const [owner] = await ethers.getSigners();
  const { utilities } = loadDeployedContractAddresses(network.name)
  const notificationContract = NotificationContract__factory.connect(
    utilities.notificationContract,
    owner
  )
  return {
    ethers,
    network,
    notificationContract
  }
}

task(
  "notification:reset-pool",
  "notification:reset-pool"
).setAction(async ({}, hre: HardhatRuntimeEnvironment) => {
  console.log(`> START NotificationContract#notifyResetPool`)
  const { notificationContract } = await setup(hre)
  const tx = await notificationContract.notifyResetPool()
  console.log(`> END NotificationContract#notifyResetPool`)
  await tx.wait()
})

task(
  "notification:reset-staking-pool",
  "notification:reset-staking-pool"
).setAction(async ({}, hre: HardhatRuntimeEnvironment) => {
  console.log(`> START NotificationContract#notifyResetStakingPool`)
  const { notificationContract } = await setup(hre)
  const tx = await notificationContract.notifyResetStakingPool()
  console.log(`> END NotificationContract#notifyResetStakingPool`)
  await tx.wait()
})

task(
  "notification:all",
  "notification:all"
).setAction(async ({}, hre: HardhatRuntimeEnvironment) => {
  await hre.run("notification:reset-pool")
  await hre.run("notification:reset-staking-pool")
})
