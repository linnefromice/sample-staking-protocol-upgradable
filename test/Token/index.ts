import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { ContractTransaction } from "ethers"
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

  describe("functions", () => {
    describe(".addMinter / .removeMinter", () => {
      it("success", async () => {
        const [owner, user] = await ethers.getSigners()
        const { token } = await setup(owner)
        let isMinter: boolean
        let tx: ContractTransaction

        // Prerequisites
        isMinter = await token.connect(ethers.provider).minterList(user.address)
        expect(isMinter).to.false

        // Execute - .addMinter
        tx = await token.connect(owner).addMinter(user.address)
        await tx.wait()
        isMinter = await token.connect(ethers.provider).minterList(user.address)
        expect(isMinter).to.true

        // Execute - .removeMinter
        tx = await token.connect(owner).removeMinter(user.address)
        await tx.wait()
        isMinter = await token.connect(ethers.provider).minterList(user.address)
        expect(isMinter).to.false
      })

      it("revert .addMinter if not owner", async () => {
        const [owner, user] = await ethers.getSigners()
        const { token } = await setup(owner)

        // Prerequisites
        const ownerAddress = await token.connect(ethers.provider).owner()
        expect(ownerAddress.toLowerCase()).to.eq(owner.address.toLowerCase())

        // Execute
        await expect(token.connect(user).addMinter(user.address))
          .to.be.revertedWith("Ownable: caller is not the owner")
      })

      it("revert .removeMinter if not owner", async () => {
        const [owner, user] = await ethers.getSigners()
        const { token } = await setup(owner)

        // Prerequisites
        const ownerAddress = await token.connect(ethers.provider).owner()
        expect(ownerAddress.toLowerCase()).to.eq(owner.address.toLowerCase())

        // Execute
        await expect(token.connect(user).removeMinter(user.address))
          .to.be.revertedWith("Ownable: caller is not the owner")
      })
    })
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
