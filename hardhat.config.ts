import * as dotenv from "dotenv";
import fs from 'fs'
import path from 'path'

import '@nomiclabs/hardhat-ethers'
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import { HardhatUserConfig } from "hardhat/config";

dotenv.config();

const SKIP_LOAD = process.env.SKIP_LOAD === 'true'
if (!SKIP_LOAD) {
  const tasksPath = path.join(__dirname, 'tasks')
  fs.readdirSync(tasksPath)
    .filter((_path) => _path.includes('.ts'))
    .forEach((task) => {
      require(`${tasksPath}/${task}`)
    })
}

const MNEMONIC = process.env.MNEMONIC || ''
const INFURA_KEY = process.env.INFURA_KEY || '' // if use Infura, set this parameter
const ALCHEMY_KEY = process.env.ALCHEMY_KEY || '' // if use Alchemy, set this parameter
const GWEI = 1000 * 1000 * 1000

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
      gasPrice: 65 * GWEI,
    },
    kovan: {
      url: INFURA_KEY
        ? `https://kovan.infura.io/v3/${INFURA_KEY}`
        : `https://eth-kovan.alchemyapi.io/v2/${ALCHEMY_KEY}`,
      gasPrice: 3 * GWEI,
      accounts: {
        mnemonic: MNEMONIC,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
      },
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
