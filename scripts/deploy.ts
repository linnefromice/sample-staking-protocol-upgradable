import { ethers, network } from "hardhat";
import { MintableERC20__factory, NotificationContract__factory, Pool__factory, SampleGovToken__factory, SampleVeToken__factory, StakingPool__factory } from "../typechain";
import {
  writeContractAddress,
  resetContractAddressesJson,
  loadDeployedContractAddresses,
  getFilePath
} from "../libs/utils/deployed-contracts"

const _writeToJson = ({ network, group, name, value }: {
  network: string
  group: string
  name: string | null
  value: string
}) => {
  writeContractAddress({
    group,
    name,
    value,
    fileName: getFilePath({ network }),
  })
}

async function main() {
  console.log("START deploy-single")
  const [owner] = await ethers.getSigners();

  // reset json
  resetContractAddressesJson({ network: network.name })

  // deploy mocks
  console.log(`> Deploy mockDai`)
  const mockDai = await new MintableERC20__factory(owner).deploy("Mock Dai Stablecoin", "mockDAI")
  await mockDai.deployTransaction.wait()
  console.log(`> Deploy mockTrueUsd`)
  const mockTrueUsd = await new MintableERC20__factory(owner).deploy("Mock TrueUSD", "mockTUSD")
  await mockTrueUsd.deployTransaction.wait()
  _writeToJson({
    network: network.name,
    group: "mocks",
    name: "dai",
    value: mockDai.address
  })
  _writeToJson({
    network: network.name,
    group: "mocks",
    name: "trueUsd",
    value: mockTrueUsd.address
  })

  // main deployments
  console.log(`> Deploy GovToken`)
  const govToken = await new SampleGovToken__factory(owner).deploy()
  await govToken.deployTransaction.wait()
  _writeToJson({
    network: network.name,
    group: "tokens",
    name: "govToken",
    value: govToken.address
  })
  
  console.log(`> Deploy daiPool`)
  const daiPool = await new Pool__factory(owner).deploy(mockDai.address, govToken.address)
  await daiPool.deployTransaction.wait()
  console.log(`> Deploy trueUsdPool`)
  const trueUsdPool = await new Pool__factory(owner).deploy(mockTrueUsd.address, govToken.address)
  await trueUsdPool.deployTransaction.wait()
  _writeToJson({
    network: network.name,
    group: "pools",
    name: "dai",
    value: daiPool.address
  })
  _writeToJson({
    network: network.name,
    group: "pools",
    name: "trueUsd",
    value: trueUsdPool.address
  })

  console.log(`> Deploy VeToken`)
  const veToken = await new SampleVeToken__factory(owner).deploy(owner.address)
  await veToken.deployTransaction.wait()
  _writeToJson({
    network: network.name,
    group: "tokens",
    name: "veToken",
    value: veToken.address
  })

  console.log(`> Deploy StakingToken`)
  const stakingPool = await new StakingPool__factory(owner).deploy(govToken.address, veToken.address)
  await stakingPool.deployTransaction.wait()
  _writeToJson({
    network: network.name,
    group: "stakingPool",
    name: null,
    value: stakingPool.address
  })

  console.log(`> SampleVeToken.setOperator`)
  await veToken.setOperator(stakingPool.address)

  console.log(`> Deploy Utility Contracts`)
  console.log(`>> Deploy NotificationContract`)
  const notificationContract = await new NotificationContract__factory(owner).deploy()
  await notificationContract.deployTransaction.wait()
  _writeToJson({
    network: network.name,
    group: "utilities",
    name: "notificationContract",
    value: notificationContract.address
  })

  console.log("FINISH deploy")
  console.log(loadDeployedContractAddresses(network.name))
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

