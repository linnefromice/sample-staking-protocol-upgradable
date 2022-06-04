import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { ethers, upgrades } from "hardhat"
import { ExampleToken__factory } from "../../../typechain"

describe("ExampleToken", () => {
  const setup = async (deployer: SignerWithAddress) => {
    const token = await upgrades.deployProxy(
      new ExampleToken__factory(deployer)
    )
    await token.deployTransaction.wait()
    return { token }
  }

  describe("upgradable", () => {
    it("deploy proxy", async () => {
      const [owner] = await ethers.getSigners();
      const { token } = await setup(owner)
      const [name, symbol, contractVersion, upgradedVersion] = await Promise.all([
        token.name(),
        token.symbol(),
        token.contractVersion(),
        token.upgradedVersion(),
      ]);
      expect(name).to.eq("Example Token")
      expect(symbol).to.eq("TOKEN")
      expect(contractVersion.toNumber()).to.eq(1)
      expect(upgradedVersion.toNumber()).to.eq(1)
    })
  })
})