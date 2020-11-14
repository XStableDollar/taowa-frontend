import React from 'react';
import { Form, Input, Button, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import * as TruffleContract from 'truffle-contract';
// import * as Web3 from "web3";
const Web3 = require('web3');
// import BigNumber from "bignumber.js"
const BigNumber = require('bignumber.js');

const constractAddress = '0x09554150b1d44d0dc012813f4b6916fc23471911';
const jsonInterface = require("../abi.json");

// const contractInstance = TruffleContract();

export default class extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  // async componentWillMount() {
  //   const { web3 } = this.props;
  //   if (web3.eth.accounts.length === 0) {
  //     this.setState({
  //       account: "",
  //       accountError: true,
  //     });
  //     return;
  //   }

  //   web3.eth.Contract.setProvider(web3.currentProvider);
  //   const instance = new web3.eth.Contract(jsonInterface, constractAddress);

  //   // contract.methods.somFunc().send({from: ....})
  //   // .on('receipt', function(){
  //   //     ...
  //   // });

  //   const accounts = await web3.eth.requestAccounts();
  //   console.log('web3.eth.accounts: ', web3.eth.accounts)
  //   console.log('accounts: ', accounts)
  //   const balance  = instance && await instance.methods.balanceOf(accounts[0]).call();
  //   console.log('balance: ', balance)
  //   console.log('instance: ', instance)
  //   this.setState({
  //     account: accounts[0],
  //     accounts: accounts,
  //     accountError: false,
  //     balance: balance,
  //     contractAddress: instance._address,
  //     contractInstance: instance,
  //   });
  // }

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
