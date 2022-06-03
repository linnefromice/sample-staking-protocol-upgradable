import { expect } from "chai";
import { ethers } from "hardhat";
import { MintableERC20__factory } from "../../typechain";

describe("MintableERC20", () => {
  it("Should create ERC20 with selected parameter & default decimals", async () => {
    const _name = "Test Token"
    const _symbol = "TEST"

    const [owner] = await ethers.getSigners();
    const token = await new MintableERC20__factory(owner).deploy(_name, _symbol)
    await token.deployTransaction.wait()
    
    expect(_name).to.eq(await token.name())
    expect(_symbol).to.eq(await token.symbol())
    expect("18").to.eq((await token.decimals()).toString())
    expect("0").to.eq((await token.totalSupply()).toString())
  })

  it("Should be mintable by anyone", async () => {
    const [owner, userA, userB] = await ethers.getSigners();
    const token = await new MintableERC20__factory(owner).deploy("Name", "SYMBOL")
    await token.deployTransaction.wait()

    let tx;
    tx = await token.connect(userA).mint(ethers.utils.parseUnits("1.25"))
    await tx.wait()
    expect("1.25").to.eq(ethers.utils.formatUnits(await token.totalSupply()))
    tx = await token.connect(userB).mint(ethers.utils.parseUnits("20.68"))
    await tx.wait()
    expect("21.93").to.eq(ethers.utils.formatUnits(await token.totalSupply()))
  })
})