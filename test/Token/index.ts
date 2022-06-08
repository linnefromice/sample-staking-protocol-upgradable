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
  it("deploy / .initialize", async () => {
    const [owner] = await ethers.getSigners()
    const { token } = await setup(owner)
    const [name, symbol, ownerAddress, isMinter] = await Promise.all([
      token.name(),
      token.symbol(),
      token.owner(),
      token.minterList(owner.address)
    ])
    expect(name).to.eq("Sample Governance Token")
    expect(symbol).to.eq("SAMPLEGOVTOKEN")
    expect(ownerAddress.toLowerCase()).to.eq(owner.address.toLowerCase())
    expect(isMinter).to.eq(true)
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
  it("deploy / .initializer", async () => {
    const [owner] = await ethers.getSigners()
    const { token } = await setup(owner)
    const [name, symbol, operator] = await Promise.all([
      token.name(),
      token.symbol(),
      token.operator()
    ])
    expect(name).to.eq("Sample Vote Escrow Token")
    expect(symbol).to.eq("SAMPLEveTOKEN")
    expect(operator.toLowerCase()).to.eq(owner.address.toLowerCase())
  })

  describe("functions", () => {
    describe(".setOperator", () => {
      it("success", async () => {
        const [owner, user] = await ethers.getSigners()
        const { token } = await setup(owner)
        let operator: string

        // Prerequisites
        const ownerAddress = await token.connect(ethers.provider).owner()
        expect(ownerAddress.toLowerCase()).to.eq(owner.address.toLowerCase())
        operator = await token.connect(ethers.provider).operator()
        expect(operator.toLowerCase()).to.eq(owner.address.toLowerCase())

        // Execute
        const tx = await token.connect(owner).setOperator(user.address)
        await tx.wait()
        operator = await token.connect(ethers.provider).operator()
        expect(operator.toLowerCase()).to.eq(user.address.toLowerCase())
      })

      it("revert", async () => {
        const [owner, user] = await ethers.getSigners()
        const { token } = await setup(owner)

        // Prerequisites
        const ownerAddress = await token.connect(ethers.provider).owner()
        expect(ownerAddress.toLowerCase()).to.eq(owner.address.toLowerCase())

        // Execute
        await expect(token.connect(user).setOperator(user.address))
          .to.be.revertedWith("Ownable: caller is not the owner")
      })
    })
  })
})
