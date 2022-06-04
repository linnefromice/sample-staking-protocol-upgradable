import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { ContractTransaction } from "ethers"
import { ethers, upgrades } from "hardhat"
import { ExampleTokenV2__factory, ExampleToken__factory } from "../../../typechain"

describe("ExampleToken", () => {
  const setup = async (deployer: SignerWithAddress) => {
    const token = await upgrades.deployProxy(
      new ExampleToken__factory(deployer)
    )
    await token.deployTransaction.wait()
    return { token }
  }

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

  describe("upgradable", () => {
    describe("2nd implementation", () => {
      it("success", async () => {
        const [owner] = await ethers.getSigners();
        const { token } = await setup(owner)

        const [name, symbol, contractVersion, upgradedVersion] = await Promise.all([
          token.name(),
          token.symbol(),
          token.contractVersion(),
          token.upgradedVersion(),
        ]);

        // upgrade to v2
        const upgraded = await upgrades.upgradeProxy(
          token,
          new ExampleTokenV2__factory(owner),
        );

        const [_name, _symbol, _contractVersion, _upgradedVersion] = await Promise.all([
          upgraded.name(),
          upgraded.symbol(),
          upgraded.contractVersion(),
          upgraded.upgradedVersion(),
        ]);
        expect(_name).to.eq(name)
        expect(_symbol).to.eq(symbol)
        expect(_contractVersion.toNumber()).to.eq(contractVersion.toNumber())
        expect(_upgradedVersion.toNumber()).to.eq(upgradedVersion.toNumber())
      })

      it("success with function", async () => {
        const [owner] = await ethers.getSigners();
        const { token } = await setup(owner)

        const [name, symbol] = await Promise.all([
          token.name(),
          token.symbol(),
          token.contractVersion(),
          token.upgradedVersion(),
        ]);

        // upgrade to v2
        const upgraded = await upgrades.upgradeProxy(
          token,
          new ExampleTokenV2__factory(owner),
          { call: { fn: "upgradeNextVersion" } }
        );

        const [_name, _symbol, _contractVersion, _upgradedVersion] = await Promise.all([
          upgraded.name(),
          upgraded.symbol(),
          upgraded.contractVersion(),
          upgraded.upgradedVersion(),
        ]);
        expect(_name).to.eq(name)
        expect(_symbol).to.eq(symbol)
        expect(_contractVersion.toNumber()).to.eq(2)
        expect(_upgradedVersion.toNumber()).to.eq(2)
      })

      it("success with function to use upgradable", async () => {
        const [owner] = await ethers.getSigners();
        const { token } = await setup(owner)

        // upgrade to v2
        const upgraded = await upgrades.upgradeProxy(
          token,
          new ExampleTokenV2__factory(owner),
          { call: { fn: "upgradeNextVersionWithUpgradeable" } }
        );

        const [_name, _symbol, _contractVersion, _upgradedVersion] = await Promise.all([
          upgraded.name(),
          upgraded.symbol(),
          upgraded.contractVersion(),
          upgraded.upgradedVersion(),
        ]);
        expect(_name).to.eq("Example Token V2")
        expect(_symbol).to.eq("TOKENV2")
        expect(_contractVersion.toNumber()).to.eq(2)
        expect(_upgradedVersion.toNumber()).to.eq(2)
      })

      describe("fail to call reinitializer multiple times", () => {
        it("use UpgradeProxyOptions in HardhatUpgrades.upgradeProxy", async () => {
          const [owner] = await ethers.getSigners();
          const { token } = await setup(owner)
  
          // upgrade to v2
          const upgraded = await upgrades.upgradeProxy(
            token,
            new ExampleTokenV2__factory(owner),
            { call: { fn: "upgradeNextVersionWithUpgradeable" } }
          );
          await expect(upgraded.upgradeNextVersionWithUpgradeable()).to.be.revertedWith("Initializable: contract is already initialized")
        })
        it("normal", async () => {
          const [owner] = await ethers.getSigners();
          const { token } = await setup(owner)
  
          // upgrade to v2
          const upgraded = await upgrades.upgradeProxy(
            token,
            new ExampleTokenV2__factory(owner)
          );
          await upgraded.upgradeNextVersionWithUpgradeable()
          await expect(upgraded.upgradeNextVersionWithUpgradeable()).to.be.revertedWith("Initializable: contract is already initialized")
        })  
      })
    })
  })
})