module.exports = {
  // Uncommenting the defaults below 
  // provides for an easier quick-start with Ganache.
  // You can also follow this format for other networks;
  // see <http://truffleframework.com/docs/advanced/configuration>
  // for more details on how to specify configuration options!
  //
  //networks: {
  //  development: {
  //    host: "127.0.0.1",
  //    port: 7545,
  //    network_id: "*"
  //  },
  //  test: {
  //    host: "127.0.0.1",
  //    port: 7545,
  //    network_id: "*"
  //  }
  //}
  //
};
const HDWalletProvider = require('@truffle/hdwallet-provider');
const mnemonic = '<perfect ordinary kick exit cross item pride confirm melt project bulb click>';
const privateKeyTest = '<ADD-YOUR-PRIVATE-KEY-HERE>';

module.exports = {
  networks: {
    testnet: {
      provider: () => {
        return new HDWalletProvider({
          mnemonic,
          providerOrUrl: 'https://api.s0.b.hmny.io', // https://api.s0.t.hmny.io for mainnet
          derivationPath: `m/44'/1023'/0'/0/`
        });
      },
      network_id: 1666700000, // 1666600000 for mainnet
    },
    testnetHar: {
      provider: () => {
        if (!privateKeyTest.trim()) {
          throw new Error(
            'Please enter a private key with funds, you can use the default one'
          );
        }
        return new HDWalletProvider({
          privateKeys: [privateKeyTest],
          providerOrUrl: 'https://api.s0.b.hmny.io',
        });
      },
      network_id: 1666700000,
    },
  },
};
require("dotenv").config();
const Web3 = require("web3");
const contractFile = require("./compile");
const HDWalletProvider = require("@truffle/hdwallet-provider");

const bytecode = contractFile.evm.bytecode.object;
const abi = contractFile.abi;

const provider = new HDWalletProvider(
  process.env.mneumonic,
  process.env.rpcEndpoint
);

const web3 = new Web3(provider);

const deploy = async () => {
  console.log("Deploying....");
  I;
  const accounts = await web3.eth.getAccounts();
  const result = await new web3.eth.Contract(abi)
    .deploy({ data: "0x" + bytecode })
    .send({ gas: "3000000", from: accounts[0] });

  console.log("Contract deployed to", result.options.address);
  process.exit();
};

deploy();
