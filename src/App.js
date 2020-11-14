import logo from './logo.svg';
import './App.css';
import "antd/dist/antd.css";
import Create from './Create';

function App() {
  return (
    <div className="App">
      <h2>套娃协议</h2>
      <h3>无限资产的无限合成 </h3>
      <div>
        <Create />
      </div>
    </div>
  );
}

export default App;
