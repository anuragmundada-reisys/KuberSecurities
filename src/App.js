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
import Signup from "./container/Authentication/Signup";
import Login from "./container/Authentication/Login";
import Logout from "./container/Authentication/Logout";
import RequireAuth from "./container/Authentication/RequireAuth";
import ResetPassword from "./container/Authentication/ResetPassword";
import ReceivedPayment from "./container/ReceivedPayment/ReceivedPayment";
import Expense from "./container/Expense/Expense";
import ExpenseList from "./container/Expense/ExpenseList";

function App(props) {
  const navigate = useNavigate();
  return (
    <div className="App">
      <Layout>
         <Routes>
           <Route path='/' exact element={<Home/>}/>
           <Route path='/dashboard' exact element={<Dashboard/>}/>
             <Route path="/login" exact element={<Login navigate={navigate}/>}/>
             <Route path="/signup" exact element={
                 <RequireAuth>
                     <Signup navigate={navigate}/>
                 </RequireAuth>
             }
             />
            <Route path="/order" exact element={
                <RequireAuth>
                  <OrderList navigate={navigate}/>
                </RequireAuth>
              }
            />
            <Route path='/order/add' exact element={
                <RequireAuth>
                 <Order navigate={navigate}/>
                </RequireAuth>
              }
            />
            <Route path="/inventory" exact element={
                <RequireAuth>
                  <InventoryList navigate={navigate}/>
                </RequireAuth>
              }
            />
            <Route path='/inventory/add' exact element={
               <RequireAuth>
                <Inventory navigate={navigate}/>
               </RequireAuth>
              }
            />
             <Route path="/expense" exact element={
                 <RequireAuth>
                     <ExpenseList navigate={navigate}/>
                 </RequireAuth>
             }
             />
             <Route path='/expense/add' exact element={
                 <RequireAuth>
                     <Expense navigate={navigate}/>
                 </RequireAuth>
             }
             />


             <Route path='/collection' exact element={
                <RequireAuth>
                  <Collection navigate={navigate}/>
                </RequireAuth>
            }/>
           <Route path='/logout' exact element={
               <RequireAuth>
                 <Logout navigate={navigate}/>
                </RequireAuth>
           } />
           <Route path='/resetpassword' exact element={
                 <RequireAuth>
                     <ResetPassword navigate={navigate}/>
                 </RequireAuth>
           } />
             <Route path='/received-payment' exact element={
                 <RequireAuth>
                     <ReceivedPayment navigate={navigate}/>
                 </RequireAuth>
             }
             />
         </Routes>
      </Layout>
    </div>
  );
}


export default App;
