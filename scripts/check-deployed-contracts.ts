import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "ethers";
import hre from "hardhat";
import { ERC20__factory, Pool__factory, StakingPool__factory } from "../typechain";

// need updates
const addresses = {
  mocks: {
    dai: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    trueUsd: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
  },
  tokens: {
    govToken: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
    veToken: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318'
  },
  pools: {
    dai: '0x0165878A594ca255338adfa4d48449f69242Eb8F',
    trueUsd: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853'
  },
  stakingPool: '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e',
}

type CheckFunctionArgs = {
  address: string
  providerOrSigner: SignerWithAddress | ethers.providers.JsonRpcProvider
}
const checkERC20Token = async (args: CheckFunctionArgs & { name?: string }) => {
  if (args.name) {
    console.log(`--- [start] ERC20: ${args.name} ---`)
    console.log(`> address ... ${args.address}`)
  }
  const _instance = await ERC20__factory.connect(
    args.address,
    args.providerOrSigner,
  )
  const targets = [
    { label: 'name', fn: _instance.name },
    { label: 'symbol', fn: _instance.symbol },
    { label: 'decimals', fn: _instance.decimals },
    { label: 'totalSupply', fn: _instance.totalSupply },
  ]
  for (const _v of targets) console.log(`${_v.label} ... ${await _v.fn()}`)
  if (args.name) console.log(`--- [end] ERC20: ${args.name} ---`)
}
const checkPool = async (args: CheckFunctionArgs & { name?: string }) => {
  console.log(`--- [start] Pool: ${args.name} ---`)
  const _instance = await Pool__factory.connect(
    args.address,
    args.providerOrSigner,
  )
  const targets = [
    { label: 'token', fn: _instance.token },
    { label: 'rewardToken', fn: _instance.rewardToken },
    { label: 'maxSupply', fn: _instance.maxSupply },
    { label: 'totalSupply', fn: _instance.totalSupply },
  ]
  for (const _v of targets) console.log(`${_v.label} ... ${await _v.fn()}`)
  console.log(`--- [end] Pool: ${args.name} ---`)
}
const checkStakingPool = async (args: CheckFunctionArgs & { name?: string }) => {
  console.log(`--- [start] StakingPool: ${args.name} ---`)
  const _instance = await StakingPool__factory.connect(
    args.address,
    args.providerOrSigner,
  )
  const targets = [
    { label: 'token', fn: _instance.token },
    { label: 'rewardToken', fn: _instance.rewardToken },
    { label: 'maxSupply', fn: _instance.maxSupply },
    { label: 'totalSupply', fn: _instance.totalSupply },
  ]
  for (const _v of targets) console.log(`${_v.label} ... ${await _v.fn()}`)
  console.log(`--- [end] Pool: ${args.name} ---`)
}

async function main() {
  const { ethers: { provider }} = hre
  await checkERC20Token({
    address: addresses.mocks.dai,
    providerOrSigner: provider,
    name: "Mock DAI"
  });
  await checkERC20Token({
    address: addresses.mocks.trueUsd,
    providerOrSigner: provider,
    name: "Mock TrueUSD"
  });
  await checkERC20Token({
    address: addresses.tokens.govToken,
    providerOrSigner: provider,
    name: "Sample Gov Token"
  });
  await checkERC20Token({
    address: addresses.tokens.veToken,
    providerOrSigner: provider,
    name: "Sample VeToken"
  });
  await checkPool({
    address: addresses.pools.dai,
    providerOrSigner: provider,
    name: "Dai Pool"
  })
  await checkPool({
    address: addresses.pools.trueUsd,
    providerOrSigner: provider,
    name: "TrueUsd Pool"
  })
  await checkStakingPool({
    address: addresses.stakingPool,
    providerOrSigner: provider,
    name: "Staking Pool"
  })
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
