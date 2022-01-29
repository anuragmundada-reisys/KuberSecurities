import './App.css';
import Layout from './component/Layout/Layout';
import { Routes, Route, useNavigate, useLocation} from 'react-router-dom';
import RawMaterialPurchaseList from './container/RawMaterialPurchase/RawMaterialPurchaseList';
import RawMaterialPurchase from './container/RawMaterialPurchase/RawMaterialPurchase';

function App() {
  const navigate = useNavigate();
  const location =useLocation();
  return (
    <div className="App">
      <Layout>
         <Routes>
            <Route path="/raw-material/purchase"  exact element={<RawMaterialPurchaseList navigate={navigate} location={location}/>}/>
            <Route path='/raw-material/add' exact element={<RawMaterialPurchase navigate={navigate}/>}/>
         </Routes>
      </Layout>
    </div>
  );
}

export default App;
