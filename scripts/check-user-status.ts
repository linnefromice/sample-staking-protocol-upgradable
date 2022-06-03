import { ethers, network } from "hardhat";
import { loadDeployedContractAddresses } from "../libs/utils/deployed-contracts";
import { ERC20__factory } from "../typechain";

async function main() {
  console.log("START check-user-status")
  const [owner] = await ethers.getSigners();
  const addresses = loadDeployedContractAddresses(network.name)

  const tokens = [
    addresses.mocks.dai,
    addresses.mocks.trueUsd,
    addresses.tokens.govToken,
    addresses.tokens.veToken
  ]
  for await (const addr of tokens) {
    const _instance = await ERC20__factory.connect(addr, owner)
    console.log(await _instance.name())
    console.log(await _instance.balanceOf(owner.address))
  }

  console.log("FINISH check-user-status")
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});