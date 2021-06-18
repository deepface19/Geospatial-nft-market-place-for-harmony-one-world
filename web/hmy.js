const { Harmony } = require('@harmony-js/core');
const { ChainID, ChainType } = require('@harmony-js/utils');

const shardID = 0;
//const main = "https://api.s0.dry.hmny.io" // ostn
//const main = "https://api.s0.b.hmny.io" // test
const main = "https://api.s0.t.hmny.io" // main
const hmy = new Harmony(
  // rpc url
  main,
  {
    // chainType set to Harmony
    chainType: ChainType.Harmony,
    // chainType set to HmyLocal
    //chainId: ChainID.HmyTestnet,
    chainId: ChainID.HmyMainnet,
    shardID,
  }
);

const GAS_PRICE = (new hmy.utils.Unit(1)).asGwei().toHex(); // 1Gwei

stakingAPIs.map(mod => {
  let modname = mod.name.split(" ")[0];
  let methodsObj = {};
  mod.methods.map(method => {
    let name = method.startsWith('hmy_') ? method.slice(4) : method;
    methodsObj[name] = function () {
      return hmy.messenger.send(
        method,
        Array.from(arguments)
      ).then(result => result.getRaw);
    }
  });
  hmy.blockchain[modname] = methodsObj;
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function walletInit() {
  let retry = 0;
  while (!window.harmony && retry++ < 2) await sleep(1000);
  if (!window.harmony) throw ({ message: "请安装麦子钱包" });
}

let address = null;
async function login() {
  await walletInit();
  let account = await window.harmony.getAccount();
  address = account.address;
  return account;
  //return {address:"user"}
}

async function logout() {
  await walletInit();
  address = null;
  return window.harmony.forgetIdentity();
}

function delegate(from, to, amount) {
  let tx = hmy.stakings.delegate({
    delegatorAddress: from,
    validatorAddress: to,
    amount: new hmy.utils.Unit(amount).asWei().toHex()
  }).setTxParams({
    gasPrice: GAS_PRICE,
    gasLimit: "0x0927c0",
    chainId: hmy.chainId
  }).build();
  tx.setFromAddress(from);
  window.dtx = tx;
  return tx;
}

function withdrawReward(from) {
  let tx = hmy.stakings.collectRewards({
    delegatorAddress: from
  }).setTxParams({
    gasPrice: GAS_PRICE,
    gasLimit: "0x0927c0",
    chainId: hmy.chainId
  }).build();
  tx.setFromAddress(from);
  window.rtx = tx;
  return tx;
}

function undelegate(from, to, amount) {
  let tx = hmy.stakings.undelegate({
    delegatorAddress: from,
    validatorAddress: to,
    amount: new hmy.utils.Unit(amount).asWei().toHex()
  }).setTxParams({
    gasPrice: GAS_PRICE,
    gasLimit: "0x0927c0",
    chainId: hmy.chainId
  }).build();
  tx.setFromAddress(from);
  window.udtx = tx;
  return tx;
}

function transfer(from, to, amount) {
  let tx = hmy.transactions.newTx({
    from,
    //  token send to
    to,
    // amount to send
    value: new hmy.utils.Unit(amount).asWei().toHex(),
    // gas limit, you can use string
    gasLimit: '210000',
    // send token from shardID
    shardID: 0,
    // send token to toShardID
    toShardID: 0,
    // gas Price, you can use Unit class, and use Gwei, then remember to use toWei(), which will be transformed to BN
    gasPrice: GAS_PRICE,
  });
  window.tx = tx;
  return tx;
}

function contract(abi, to = "0x998FFE1E43fAcffb941dc337dD0468d52bA5b48A", options = { from: hmy.crypto.fromBech32(address), gas: '210000', gasPrice: GAS_PRICE }) {
  let contract = hmy.contracts.createContract(abi, to, options);
  contract.wallet.signTransaction = window.harmony.signTransaction; // or importPrivate
  let decodeParameters = (abi, hexdata) => {
    if (0 == abi.length)
      return [];
    let params = contract.abiCoder.decodeParameters(abi, hexdata);
    params.length = abi.length;
    return params;
  };
  for (let name in contract.abiModel.getMethods()) {
    let method = contract.abiModel.getMethod(name);
    method.decodeInputs = hexData => decodeParameters(method.inputs, hexData);
    method.decodeOutputs = hexData => decodeParameters(method.outputs, hexData);
  }

  contract.decodeInput = (hexData) => {
    let no0x = hexData.startsWith('0x') ? hexData.slice(2) : hexData;
    let sig = no0x.slice(0, 8).toLowerCase();
    let method = contract.abiModel.getMethod('0x' + sig);
    if (!method) return false;
    let obj = {
      name: method.name,
      params: method.decodeInputs('0x' + no0x.slice(8))
    }
    obj.toString = () => {
      let str = obj.name + '(';
      for (let i = 0; i < obj.params.length; i++) {
        if (i > 0) str += ',';
        str += obj.params[i];
      }
      str += ')';
      return str;
    }
    return obj;
  }
  return contract;
}

function contractDeploy(abi, code, _arguments) {
  let contractObj = contract(abi, "0x");
  return contractObj.deploy({
    data: code,
    arguments: _arguments
  })
}

async function txSignSend(tx) {
  await window.harmony.signTransaction(tx);
  let ret = await tx.sendTransaction();
  if (ret[1] != tx.id) throw { message: ret[1] };
  return tx;
}

module.exports  ={
  hmy,
  login,
  logout,
  transfer,
  delegate,
  undelegate,
  withdrawReward,
  txSignSend,
  contract,
  contractDeploy
}

