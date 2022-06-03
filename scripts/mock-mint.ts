import { ethers, network } from "hardhat";
import { loadDeployedContractAddresses } from "../libs/utils/deployed-contracts";
import { MintableERC20__factory } from "../typechain";

async function main() {
  console.log("START mock mint")
  const [owner] = await ethers.getSigners();
  const addresses = loadDeployedContractAddresses(network.name)

  const mocks = [addresses.mocks.dai, addresses.mocks.trueUsd]
  for await (const addr of mocks) {
    const _instance = await MintableERC20__factory.connect(
      addr,
      owner,
    )
    const tx = await _instance.mint(ethers.utils.parseEther("50"))
    await tx.wait()
  }
  
  console.log("FINISH mock mint")
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});