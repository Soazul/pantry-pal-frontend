import './App.css';
import { Provider } from "react-redux";
import Login from './Login/Login';
import store from './store';
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import Pantry from './Pantry/Pantry';
import Cookbook from './Cookbook/Cookbook';
import SmartRecipe from './SmartRecipe/SmartRecipe';
import GroceryList from './GroceryList/GroceryList';

function App() {
  return (
    <HashRouter>
      <Provider store={store}>
        <div>
          <Routes>
            <Route path="/" element={<Navigate to="/signin"/>}/>
            <Route path="/signin" element={<Login/>}/>
            <Route path="/pantry/*" element={<Pantry/>}/>
            <Route path="/cookbook/*" element={<Cookbook/>}/>
            <Route path="/smart_recipe/*" element={<SmartRecipe/>}/>
            <Route path="/grocery_list/*" element={<GroceryList/>}/>
          </Routes>
        </div>
      </Provider>
     </HashRouter>
  );
}

export default App;
