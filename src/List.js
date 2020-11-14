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

export default () => {
  return (
    <List
      grid={{ gutter: 16, column: 4 }}
      dataSource={data}
      renderItem={item => (
        <List.Item>
          <Card title={item.title}>Card content</Card>
        </List.Item>
      )}
    />
  );
};