/* eslint no-use-before-define: 0 */
import React from 'react';
import { Form, Input, Button } from 'antd';

export default class Component extends React.Component {
   onFinish = async (values) => {
    const { contractInstance, account } = this.props;
    const { name, symbol, tokens } = values;
    console.log('Received values of form:', name, symbol, tokens);
    const result  = await contractInstance.methods.create(name, symbol).send({ from: account });
    console.log('result: ', result)
  };

  render() {
    const { account, contractAddress } = this.props;
    return (
      <div>
        <h>创建合成资产</h>
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
