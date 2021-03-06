/* eslint no-use-before-define: 0 */
import React from 'react';
import { List, Input, Card, Button, Form, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

export default class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customAssets: [],
      tokens: [],
      redeemAmount: 0
    }
  }
  async componentWillMount() {
    const { contractInstance } = this.props;
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

  onFormFinish = (values) => {
    console.log('Received values of form:', values);
    const addressArr = [];
    const amountArr = [];
    values.tokens.forEach(tokenInfo => {
      addressArr.push(tokenInfo.address);
      amountArr.push(tokenInfo.amount);
    })
    this.setState({ tokens: values.tokens, addressArr, amountArr })
  }
  mintMulti = async (assetInfo) => {
    const { contractInstance, account } = this.props;
    const { tokens, addressArr, amountArr } = this.state;
    const { target } = assetInfo;
    console.log('Received values of form:', tokens, addressArr, amountArr);
    console.log('target: ', target);
    try {
      const result  = await contractInstance.methods.mintMulti2(target, addressArr, amountArr).send({ from: account });
      console.log('result: ', result);
    } catch (error) {
      console.log('error: ', error);
    }
  };

  onRedeemFinish = (values) => {
    const { amount } = values;
    this.setState({ redeemAmount: amount });
  }
  redeem = async (assetInfo) => {
    const { contractInstance, account } = this.props;
    const { redeemAmount } = this.state;
    const { target } = assetInfo;
    console.log('Received values of form:', redeemAmount);
    console.log('target: ', target);
    try {
      const result  = await contractInstance.methods.redeem2(target, redeemAmount).send({ from: account });
      console.log('redeem result: ', result)
    } catch (error) {
      console.log('error: ', error);
    }
  };

  render() {
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
              <div>
                <Button type="primary" onClick={() => this.mintMulti(item)}>Deposit</Button>
                <Button onClick={() => this.redeem(item)}>Redeem</Button>
              </div>
            </Card>
          </List.Item>
        )}
      />
    );

    const redeemForm = (
      <Form name="dynamic_form_nest_item" onFinish={this.onRedeemFinish} autoComplete="off">
        <Form.Item
          label="Amount"
          name="amount"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    );

    const mintForm = (
      <Form name="dynamic_form_nest_item" onFinish={this.onFormFinish} autoComplete="off">
        <Form.List name="tokens">
          {(fields, { add, remove }) => (
            <>
              {fields.map(field => (
                <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...field}
                    label="Address"
                    name={[field.name, 'address']}
                    fieldKey={[field.fieldKey, 'address']}
                    rules={[{ required: true, message: 'Missing Address' }]}
                  >
                    <Input placeholder="Address" />
                  </Form.Item>
                  <Form.Item
                    {...field}
                    label="Amount"
                    name={[field.name, 'amount']}
                    fieldKey={[field.fieldKey, 'amount']}
                    rules={[{ required: true, message: 'Missing Amount' }]}
                  >
                    <Input placeholder="Amount" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(field.name)} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add field
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
    return (
      <div>
        <h2>所有合成资产({totalAssets})</h2>
        {customAssetsElem}
        <hr />
        <h3>向合成资产添加 token</h3>
        {mintForm}
        <hr />
        <h3>销毁合成资产 & 赎回 token</h3>
        {redeemForm}
      </div>
    );
  }
};