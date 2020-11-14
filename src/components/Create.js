import React from 'react';
import { Form, Input, Button, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import * as TruffleContract from 'truffle-contract';
// import * as Web3 from "web3";
const Web3 = require('web3');
// import BigNumber from "bignumber.js"
const BigNumber = require('bignumber.js');

const MetaCoinContract = TruffleContract(require("../XSGTReward.json"));

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      accountError: false,
      balance: "",
      contractAddress: "",
    };
  }

  async componentWillMount() {
    if (this.props.web3.eth.accounts.length === 0) {
      this.setState({
        account: "",
        accountError: true,
      });
      return;
    }
    MetaCoinContract.setProvider(this.props.web3.currentProvider);
    let instance;
    try {
      instance = await MetaCoinContract.deployed();
      console.log('instance: ', instance)
    } catch (err) {
      console.log(err);
    }
    const balance  = instance && await instance.getBalance(this.props.web3.eth.accounts[0]) || 0;
    const accounts = await this.props.web3.eth.requestAccounts();
    console.log('this.props.web3.eth.accounts: ', this.props.web3.eth.accounts)
    console.log('accounts: ', accounts)
    this.setState({
      account: accounts[0],
      accounts: accounts,
      accountError: false,
      balance: balance.toString(),
      // contractAddress: instance.address,
    });
  }

  render() {
    const onFinish = values => {
      console.log('Received values of form:', values);
    };

    return (
      <div>
        <div>
          <h3>MetaCoin</h3>
          <p>Contract address: {this.state.contractAddress}</p>
          <p>Account: {this.state.accountError ? "No accounts found" : this.state.account}</p>
          <p>Balance: {this.state.balance}</p>
        </div>
        <Form name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
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

          <Form.List name="tokens">
            {(fields, { add, remove }) => (
              <>
                {fields.map(field => (
                  <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...field}
                      label="Address"
                      name={[field.name, 'first']}
                      fieldKey={[field.fieldKey, 'first']}
                      rules={[{ required: true, message: 'Missing Address' }]}
                    >
                      <Input placeholder="Address" />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      label="Amount"
                      name={[field.name, 'last']}
                      fieldKey={[field.fieldKey, 'last']}
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
      </div>
    );

  }
};
