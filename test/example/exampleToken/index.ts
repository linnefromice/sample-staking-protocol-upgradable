import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { ethers, upgrades } from "hardhat"
import { ExampleToken, ExampleToken__factory } from "../../../typechain"

describe("ExampleToken", () => {
  const setup = async (deployer: SignerWithAddress) => {
    const token = await upgrades.deployProxy(
      new ExampleToken__factory(deployer),
      [
        "First",
        "Example Token",
        "TOKEN"
      ]
    )
    await token.deployTransaction.wait()
    return { token }
  }

  it("upgrade", async () => {
    const [owner] = await ethers.getSigners();
    const { token } = await setup(owner)
    let version: string, name: string, symbol: string
    [version, name, symbol] = await Promise.all([
      token.version(),
      token.name(),
      token.symbol(),
    ])
    expect(version).to.eq("First")
    expect(name).to.eq("Example Token")
    expect(symbol).to.eq("TOKEN")
  })
})