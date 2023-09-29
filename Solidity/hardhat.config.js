const { config: dotenvConfig } = require("dotenv");
const { resolve } = require("path");
require("@nomicfoundation/hardhat-toolbox");
dotenvConfig({ path: resolve(__dirname, "./.env") });

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [
        `0x${process.env.GOERLI_DEPLOYER}`, `0x${process.env.GOERLI_OPERATOR}`
      ],
    },
    optimism: {
      url: `https://optimism-mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
    },
    goerliop: {
      url: `https://optimism-goerli.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [
        `0x${process.env.GOERLI_DEPLOYER}`, `0x${process.env.GOERLI_OPERATOR}`
      ],
      // gasPrice: 100, // may need to specify higher gas on OP
    },
    hardhat: {
      chainId: 1337,
    },
  },
  etherscan: {
    customChains: [
      {
        network: "optimism",
        chainId: 10,
        urls: {
          apiURL: "https://api-optimistic.etherscan.io/api",
          browserURL: "https://optimistic.etherscan.io/",
        },
      },
      {
        network: "goerliop",
        chainId: 420,
        urls: {
          apiURL: "https://api-goerli-optimistic.etherscan.io/api",
          browserURL: "https://goerli-optimism.etherscan.io/",
        },
      },
    ],
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY,
      goerli: process.env.ETHERSCAN_API_KEY,
      optimism: process.env.ETHERSCAN_OP_API_KEY,
      goerliop: process.env.ETHERSCAN_OP_API_KEY,
    },
  },
};
