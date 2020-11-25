import logo from './logo.png';
import './App.css';
import "antd/dist/antd.css";
import Create from './components/Create';
import List from './components/List';
import React from "react";
import getWeb3 from "./util/getWeb3";

// const constractAddress = '0x8835F21613672fA18f5716aB0ee4878045eCf5EE';
const constractAddress = '0xA4565fF972387139865633CECA0A9868Ab5D3f87';
// XSGT token: 0x364Ac8785c0f98B1419e54e9aeB209Fb2CE26348
// hand token: 0xf456516715c75a421674B7547fACc1C224Eeb657
const jsonInterface = require("./abi.json");

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: null,
    };
  }

  async componentWillMount() {
    const web3 = await getWeb3();
    console.log('app.js: web3: ', web3)

    // if (web3.eth.accounts.length === 0) {
    //   this.setState({
    //     account: "",
    //     accountError: true,
    //   });
    //   return;
    // }

    web3.eth.Contract.setProvider(web3.currentProvider);
    const instance = new web3.eth.Contract(jsonInterface, constractAddress);

    // contract.methods.somFunc().send({from: ....})
    // .on('receipt', function(){
    //     ...
    // });

    const accounts = await web3.eth.requestAccounts();
    console.log('web3.eth.accounts: ', web3.eth.accounts)
    console.log('accounts: ', accounts)
    const balance  = instance && await instance.methods.balanceOf(accounts[0]).call();
    console.log('balance: ', balance)
    console.log('instance: ', instance)
    this.setState({
      web3,
      account: accounts[0],
      accounts: accounts,
      accountError: false,
      balance: balance,
      contractAddress: instance._address,
      contractInstance: instance,
    });
  }

  render() {
    const { account, contractAddress, contractInstance } = this.state;
    const props = { account, contractAddress, contractInstance };

    return (
      <div>
        <div className="App-header">
          <img src={logo} alt="logo" />
          <h1 style={{color: "white"}}>套娃协议</h1>
          <p>资产的无限合成</p>

          <p>BSC RPC：https://data-seed-prebsc-1-s1.binance.org:8545/</p>
          <p><a href="https://testnet.binance.org/faucet-smart" target="_blank"> bsc水龙头</a></p>
          <p><a href="https://testnet.bscscan.com/" target="_blank"> bsc区块浏览器</a></p>
        </div>

        <div className="App">
          {this.state.web3 ? <Create web3={this.state.web3} {...props} /> : null}
          {this.state.web3 ? <List web3={this.state.web3} {...props} /> : null}
        </div>
      </div>
    );
  }
}

export default App;
