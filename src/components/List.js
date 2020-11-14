import React from 'react';
import { List, Card } from 'antd';
import * as TruffleContract from 'truffle-contract';
// import * as Web3 from "web3";
const Web3 = require('web3');
// import BigNumber from "bignumber.js"
const BigNumber = require('bignumber.js');

const data = [
  {
    title: 'Title 1',
  },
  {
    title: 'Title 2',
  },
  {
    title: 'Title 3',
  },
  {
    title: 'Title 4',
  },
];

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customAssets: []
    }
  }
  async componentWillMount() {
    const { contractInstance, account, contractAddress } = this.props;
    try {
      // const tokenList  = await contractInstance.methods.ercAddrToCustomToken().call();
      // console.log('tokenList:', tokenList)
      const totalAssets  = await contractInstance.methods.totalAssets().call();
      const getCustomAsset  = async(index) => {
        console.log('index: ', index)
        const customAssetAddress = await contractInstance.methods.customAssets(index).call();
        const customAssetInfo = await contractInstance.methods.ercAddrToCustomToken
        (customAssetAddress).call();
        return customAssetInfo;
      }

      const promiseArr = [];
      for (let i = 0; i < totalAssets; i++) {
        promiseArr.push(getCustomAsset(i));
      }

      const customAssets = await Promise.all(promiseArr);
      // const customAssets  = await contractInstance.methods.customAssets(0).call();
      console.log('customAssets:', customAssets)
      this.setState({ totalAssets, customAssets })
      // this.setState({ tokenList, customAssets })
    } catch (error) {
      console.log('error: ', error)
    }
  }
  render() {
    const { contractInstance, account, contractAddress } = this.props;
    const { totalAssets, customAssets } = this.state;
    const customAssetsElem = (
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={customAssets}
        renderItem={item => (
          <List.Item>
            <Card title={item.name}>{item.symbol}</Card>
          </List.Item>
        )}
      />
    )
    return (
      <div>
        <span>Total assets: {totalAssets}</span>

        {customAssetsElem}
      </div>
    );
  }
};