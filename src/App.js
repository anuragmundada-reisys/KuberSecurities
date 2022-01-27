import './App.css';
import Layout from './component/Layout/Layout';
import { Routes, Route} from 'react-router-dom';
import RawMaterialPurchase from './container/RawMaterialPurchase/RawMaterialPurchase';

function App() {
  return (
    <div className="App">
      <Layout>
         <Routes>
            <Route path="/purchase" exact element={<RawMaterialPurchase/>} />
         </Routes>
      </Layout>
    </div>
  );
}

export default App;
