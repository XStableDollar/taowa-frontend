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

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: null,
    };
  }

  async componentWillMount() {
    const web3 = await getWeb3();
    this.setState({
      web3,
    });
  }

  render() {
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
        {this.state.web3 ? <Create web3={this.state.web3} /> : null}
        {this.state.web3 ? <List web3={this.state.web3} /> : null}
      </div>
    );
  }
}

export default App;
