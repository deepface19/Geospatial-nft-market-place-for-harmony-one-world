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
