import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import AddTransaction from './pages/AddTransaction';
import Home from './pages/Home';
import { Provider, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import Categories from './pages/Categories';

import { setTransactions } from './redux/transactionsSlice';

function App() {
  const dispatch = useDispatch();
  
    useEffect(() => {
      const storedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      if (storedTransactions.length > 0) {
        dispatch(setTransactions(storedTransactions));
      }
    }, [dispatch]);

  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddTransaction />} />
        <Route path="/categories" element={<Categories />} />
      </Routes>
  )
}

export default App;
