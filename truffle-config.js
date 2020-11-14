const config = require('config');
const Web3 = require("web3");
const web3 = new Web3();
const WalletProvider = require("truffle-wallet-provider");
const Wallet = require('ethereumjs-wallet');

// var mainNetPrivateKey = new Buffer(config.get("MAINNET_PRIVATE_KEY"), "hex")
// var mainNetWallet = Wallet.fromPrivateKey(mainNetPrivateKey);
// var mainNetProvider = new WalletProvider(mainNetWallet, "https://mainnet.infura.io/");

// var ropstenPrivateKey = new Buffer(config.get("ROPSTEN_PRIVATE_KEY"), "hex")
// var ropstenWallet = Wallet.fromPrivateKey(ropstenPrivateKey);
// var ropstenProvider = new WalletProvider(ropstenWallet, config.get("infuraUrl"));

var binancePrivateKey = new Buffer(config.get("BINANCE_PRIVATE_KEY"), "hex")
var binanceWallet = Wallet.fromPrivateKey(binancePrivateKey);
var binanceProvider = new WalletProvider(binanceWallet, config.get("binanceUrl"));
console.log(config.get("BINANCE_PRIVATE_KEY"))
console.log(config.get("binanceUrl"))

module.exports = {
  migrations_directory: "./migrations",
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      gasPrice: web3.utils.toWei("5", "gwei"),
      network_id: "*" // Match any network id
    },
    bsc: {
      provider: binanceProvider,
      gas: 8000000,
      gasPrice: web3.utils.toWei("10", "gwei"),
      network_id: "97",
      // from: '0x8f4E659b586A0d279BA674351C26fBcf2e55a5C3',
    },
    // ropsten: {
    //   provider: ropstenProvider,
    //   // You can get the current gasLimit by running
    //   // truffle deploy --network ropsten
    //   // truffle(ropsten)> web3.eth.getBlock("pending", (error, result) =>
    //   //   console.log(result.gasLimit))
    //   gas: 8000000,
    //   gasPrice: web3.utils.toWei("5", "gwei"),
    //   network_id: "3",
    // },
    // mainnet: {
    //   provider: mainNetProvider,
    //   gas: 4600000,
    //   gasPrice: web3.utils.toWei("20", "gwei"),
    //   network_id: "1",
    // }
  },
  compilers: {
    solc: {
      version: "0.6.12",    // Fetch exact version from solc-bin (default: truffle's version)
      optimizer: {
         enabled: true,
         runs: 200
       },
    },
  },
};
