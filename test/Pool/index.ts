import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { MintableERC20__factory, Pool__factory, StakingPool__factory } from "../../typechain";

describe("Pool", () => {
  const setup = async (deployer: SignerWithAddress) => {
    const [token, rewardToken] = await Promise.all([
      new MintableERC20__factory(deployer).deploy("Token", "TOKEN"),
      new MintableERC20__factory(deployer).deploy("Reward Token", "REWARD_TOKEN")
    ])

    await Promise.all([
      token.deployTransaction.wait(),
      rewardToken.deployTransaction.wait()
    ])
    const pool = await upgrades.deployProxy(
      new Pool__factory(deployer),
      [
        token.address,
        rewardToken.address
      ]
    )
    await pool.deployTransaction.wait()

    return {
      token,
      rewardToken,
      pool
    }
  }

  it("Should create Pool with selected parameter", async () => {
    const [owner] = await ethers.getSigners();
    const { token, rewardToken, pool } = await setup(owner)

    expect(token.address).to.eq(await pool.token())
    expect(rewardToken.address).to.eq(await pool.rewardToken())
    expect("0").to.eq((await pool.totalSupply()).toString())
    expect(ethers.utils.parseEther(String(1_000_000))).to.eq((await pool.maxSupply()).toString())
    expect(ethers.utils.parseEther(String(1_000_000))).to.eq((await rewardToken.balanceOf(pool.address)).toString())

    expect("0").to.eq((await token.balanceOf(pool.address)).toString())
    expect("0").to.eq((await pool.balanceOf(owner.address)).toString())
  })

  it("Upgradable", async () => {
    const [owner] = await ethers.getSigners();
    const { pool } = await setup(owner)
    const [tokenV2, rewardTokenV2] = await Promise.all([
      new MintableERC20__factory(owner).deploy("V2Token", "V2TOKEN"),
      new MintableERC20__factory(owner).deploy("V2 Reward Token", "V2REWARD_TOKEN")
    ])
    await Promise.all([
      tokenV2.deployTransaction.wait(),
      rewardTokenV2.deployTransaction.wait()
    ])
    const poolv2 = await upgrades.deployProxy(
      new Pool__factory(owner),
      [
        tokenV2.address,
        rewardTokenV2.address
      ]
    )
    const upgraded = await upgrades.upgradeProxy(poolv2.address, new Pool__factory(owner))
    const _token = await upgraded.token()
    const _rewardToken = await upgraded.rewardToken()
    expect(tokenV2.address).to.eq(_token)
    expect(rewardTokenV2.address).to.eq(_rewardToken)
  })

  describe("Enable to deposit & get rewardToken", () => {
    it("success", async () => {
      const [owner, depositor] = await ethers.getSigners();
      const { token, rewardToken, pool } = await setup(owner)
 
      let tx;
      
      // Prerequisites
      expect(ethers.utils.parseEther("0")).to.eq((await token.balanceOf(depositor.address)).toString())
      expect(ethers.utils.parseEther("0")).to.eq((await rewardToken.balanceOf(depositor.address)).toString())
      tx = await token.connect(depositor).mint(ethers.utils.parseEther("0.05"), { from: depositor.address })
      await tx.wait()
      expect(ethers.utils.parseEther("0.05")).to.eq((await token.balanceOf(depositor.address)).toString())
      expect(ethers.utils.parseEther("0")).to.eq((await rewardToken.balanceOf(depositor.address)).toString())

      // deposit
      tx = await token.connect(depositor).approve(pool.address, ethers.utils.parseEther("0.01"), { from: depositor.address })
      await tx.wait()
      tx = await pool.connect(depositor).deposit(ethers.utils.parseEther("0.01"), { from: depositor.address })
      await tx.wait()
      expect(ethers.utils.parseEther("0.04")).to.eq((await token.balanceOf(depositor.address)).toString())
      expect(ethers.utils.parseEther("0.01")).to.eq((await rewardToken.balanceOf(depositor.address)).toString())
    })

    it("failure: amount is zero", async () => {
      const [owner, depositor] = await ethers.getSigners();
      const { token, rewardToken, pool } = await setup(owner)
 
      let tx;
      
      // Prerequisites
      tx = await token.connect(depositor).mint(ethers.utils.parseEther("0.05"), { from: depositor.address })
      await tx.wait()

      // deposit
      tx = await token.connect(depositor).approve(pool.address, ethers.utils.parseEther("0.01"), { from: depositor.address })
      await tx.wait()
      await expect(
        pool.connect(depositor).deposit("0", { from: depositor.address })
      ).to.be.revertedWith("amount is positive number")
      expect(ethers.utils.parseEther("0.05")).to.eq((await token.balanceOf(depositor.address)).toString())
      expect(ethers.utils.parseEther("0")).to.eq((await rewardToken.balanceOf(depositor.address)).toString())
    })
  })

  describe("Enable to withdraw & get back tokens", () => {
    it("success", async () => {
      const [owner, player] = await ethers.getSigners();
      const { token, rewardToken, pool } = await setup(owner)

      let tx;

      // Prerequisites
      // - mint mock token
      tx = await token.connect(player).mint(ethers.utils.parseEther("0.05"), { from: player.address })
      await tx.wait()
      // - deposit
      tx = await token.connect(player).approve(pool.address, ethers.utils.parseEther("0.02"), { from: player.address })
      await tx.wait()
      tx = await pool.connect(player).deposit(ethers.utils.parseEther("0.02"), { from: player.address })
      await tx.wait()

      // withdraw
      // - approve
      tx = await rewardToken.connect(player).approve(pool.address, ethers.utils.parseEther("0.015"), { from: player.address })
      await tx.wait()
      // - execute
      tx = await pool.connect(player).withdraw(ethers.utils.parseEther("0.015"), { from: player.address })
      await tx.wait()

      expect(ethers.utils.parseEther("0.045")).to.eq((await token.balanceOf(player.address)).toString())
      expect(ethers.utils.parseEther("0.005")).to.eq((await rewardToken.balanceOf(player.address)).toString())
    })

    it("failure: amount is over deposited", async () => {
      const [owner, player] = await ethers.getSigners();
      const { token, rewardToken, pool } = await setup(owner)

      let tx;

      // Prerequisites
      // - mint mock token
      tx = await token.connect(player).mint(ethers.utils.parseEther("0.05"), { from: player.address })
      await tx.wait()
      // - deposit
      tx = await token.connect(player).approve(pool.address, ethers.utils.parseEther("0.01"), { from: player.address })
      await tx.wait()
      tx = await pool.connect(player).deposit(ethers.utils.parseEther("0.01"), { from: player.address })
      await tx.wait()

      // withdraw
      await expect(
        pool.connect(player).withdraw(ethers.utils.parseEther("0.02"), { from: player.address })
      ).to.be.revertedWith("amount is sender's balance or less")
      expect(ethers.utils.parseEther("0.04")).to.eq((await token.balanceOf(player.address)).toString())
      expect(ethers.utils.parseEther("0.01")).to.eq((await rewardToken.balanceOf(player.address)).toString())
    })

    it("failure: amount is zero", async () => {
      const [owner, player] = await ethers.getSigners();
      const { pool } = await setup(owner)

      await expect(
        pool.connect(player).withdraw("0", { from: player.address })
      ).to.be.revertedWith("amount is sender's balance or less")
    })
  })
})