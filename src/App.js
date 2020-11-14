import logo from './logo.svg';
import './App.css';
import "antd/dist/antd.css";
import Create from './components/Create';
import List from './components/List';

// function App() {
//   return (
//     <div className="App">
//       <h2>套娃协议</h2>
//       <h3>无限资产的无限合成 </h3>
//       <div>
//         <Create />
//       </div>
//       <div>
//         <List />
//       </div>
//     </div>
//   );
// }

// export default App;

import React from "react";
import Web3 from "web3";
import getWeb3 from "./util/getWeb3";

const appStyles = {}

const constractAddress = '0x09554150b1d44d0dc012813f4b6916fc23471911';
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
      <div className={appStyles.app}>
        <div className={appStyles.appHeader}>
          <h2>套娃协议</h2>
          <p>无限资产的无限合成</p>
        </div>
        <div className={appStyles.appIntro}>
          {this.state.web3 ? (
            <div>
              <p>
                Provider is MetaMask: {(this.state.web3.currentProvider).isMetaMask ? "yes" : "no"}
              </p>
              <p>
                Provider is Mist: {(window).mist ? "yes" : "no"}
              </p>
              {(this.state.web3.currentProvider).host ?
                <p>Provider is {(this.state.web3.currentProvider).host}</p> : null}
            </div>
          ) :
            <p>Web3 is loading</p>}
        </div>
        <hr />
        {this.state.web3 ? <Create web3={this.state.web3} {...props} /> : null}
        {this.state.web3 ? <List web3={this.state.web3} {...props} /> : null}
      </div>
    );
  }
}

export default App;
