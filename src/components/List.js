import React from 'react';
import { List, Card } from 'antd';
import * as TruffleContract from 'truffle-contract';
// import * as Web3 from "web3";
const Web3 = require('web3');
// import BigNumber from "bignumber.js"
const BigNumber = require('bignumber.js');

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
      const totalAssets  = await contractInstance.methods.totalAssets().call();

      const getDepositedAsset  = async(customAssetAddress, index) => {
        console.log('index: ', index)
        const address = await contractInstance.methods.token2symbol(customAssetAddress, index).call();
        console.log('address: ', address)
        return address;
      }

      const getCustomAsset  = async(index) => {
        console.log('index: ', index)
        const customAssetAddress = await contractInstance.methods.customAssets(index).call();
        const customAssetInfo = await contractInstance.methods.ercAddrToCustomToken(customAssetAddress).call();
        let depositedAsset0 = 'Empty';
        let depositedAsset1 = 'Empty';
        try {
          depositedAsset0 = await getDepositedAsset(customAssetAddress, 0);
          depositedAsset1 = await getDepositedAsset(customAssetAddress, 1);
        } catch (error) {
          console.log('Error: not deposit any token yet')
        }

        // const promiseArrForDepositedAsset = [];
        // for (let i = 0; i < 2; i++) {
        //   promiseArrForDepositedAsset.push(getDepositedAsset(customAssetAddress, i));
        // }
        // const depositedAssets = await Promise.all(promiseArrForDepositedAsset);
        const depositedAssets = [depositedAsset0, depositedAsset1];
        customAssetInfo.depositedAssets = depositedAssets

        return customAssetInfo;
      }

      const promiseArr = [];
      for (let i = 0; i < totalAssets; i++) {
        promiseArr.push(getCustomAsset(i));
      }

      const customAssets = await Promise.all(promiseArr);
      console.log('customAssets:', customAssets)
      this.setState({ totalAssets, customAssets })
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
            <Card title={`${item.name}(${item.symbol})`}>
              <div>
                <h4>Deposited Tokens</h4>
                <p>{item.depositedAssets[0].substr(0, 10)}</p>
                <p>{item.depositedAssets[1].substr(0, 10)}</p>
              </div>
            </Card>
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