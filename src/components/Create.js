import React from 'react';
import { Form, Input, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
// import * as Web3 from "web3";
const Web3 = require('web3');
// import BigNumber from "bignumber.js"
const BigNumber = require('bignumber.js');

export default class extends React.Component {
   onFinish = async (values) => {
    const { contractInstance, account } = this.props;
    const { name, symbol, tokens } = values;
    console.log('Received values of form:', name, symbol, tokens);
    const result  = await contractInstance.methods.create(name, symbol).send({ from: account });
    console.log('result: ', result)
  };

  render() {
    const { contractInstance, account, contractAddress } = this.props;
    return (
      <div>
        <h2>创建合成资产</h2>
        <div>
          <p>Contract address: {contractAddress}</p>
          <p>Account: {account}</p>
        </div>
        <Form name="dynamic_form_nest_item" onFinish={this.onFinish} autoComplete="off">
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Symbol"
            name="symbol"
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
      </div>
    );

  }
};
