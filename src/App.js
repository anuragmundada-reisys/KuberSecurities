import './App.css';
import Layout from './component/Layout/Layout';
import { Routes, Route, useNavigate} from 'react-router-dom';
import OrderList from './container/Order/OrderList';
import Order from './container/Order/Order';
import InventoryList from './container/Inventory/InventoryList';
import Inventory from './container/Inventory/Inventory';
import Dashboard from './container/Dashboard/Dashboard';
import Home from "./container/Home/Home";
import Collection from "./container/Collection/Collection";

function App() {
  const navigate = useNavigate();
  return (
    <div className="App">
      <Layout>
         <Routes>
           <Route path='/' exact element={<Home/>}/>
           <Route path='/dashboard' exact element={<Dashboard/>}/>
            <Route path="/order" exact element={<OrderList navigate={navigate}/>}/>
            <Route path='/order/add' exact element={<Order navigate={navigate}/>}/>
            <Route path="/inventory" exact element={<InventoryList navigate={navigate}/>}/>
            <Route path='/inventory/add' exact element={<Inventory navigate={navigate}/>}/>
            <Route path='/collection' exact element={<Collection navigate={navigate}/>}/>
         </Routes>
      </Layout>
    </div>
  );
}

export default App;
