import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { ethers, upgrades } from "hardhat"
import { UpgradableSampleGovToken, UpgradableSampleGovToken__factory, UpgradableSampleVeToken, UpgradableSampleVeToken__factory } from "../../typechain"

describe("GovToken", async () => {
  const setup = async (deployer: SignerWithAddress) => {
    const token = (await upgrades.deployProxy(
      new UpgradableSampleGovToken__factory(deployer)
    )) as UpgradableSampleGovToken
    await token.deployTransaction.wait()
    return { token }
  }
  it("deploy", async () => {
    const [owner] = await ethers.getSigners()
    const { token } = await setup(owner)
    const [name, symbol] = await Promise.all([
      token.name(),
      token.symbol()
    ])
    expect(name).to.eq("Sample Governance Token")
    expect(symbol).to.eq("SAMPLEGOVTOKEN")
  })
})

describe("VeToken", async () => {
  const setup = async (deployer: SignerWithAddress) => {
    const token = (await upgrades.deployProxy(
      new UpgradableSampleVeToken__factory(deployer),
      [deployer.address]
    )) as UpgradableSampleVeToken
    await token.deployTransaction.wait()
    return { token }
  }
  it("deploy", async () => {
    const [owner] = await ethers.getSigners()
    const { token } = await setup(owner)
    const [name, symbol] = await Promise.all([
      token.name(),
      token.symbol()
    ])
    expect(name).to.eq("Sample Vote Escrow Token")
    expect(symbol).to.eq("SAMPLEveTOKEN")
  })
})
