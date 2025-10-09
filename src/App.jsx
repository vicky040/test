import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './components/Home';
import Withdraw from './components/Withdraw';
import MyAccount from './components/MyAccount';
import Trade from './components/Trade';
import Deposit from './components/Deposit';
import Login from './components/Login';
import CreateAccount from './components/createAccount';
import AdminDashboard from './components/AdminDashboard';
import MembershipUpgrade from './components/MembershipUpgrade';
import ComingSoon from './components/ComingSoon';
import AdminLogin from './components/AdminLogin'

function App(){
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/home" element={<Home />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/my-account" element={<MyAccount />} />
          <Route path="/trade" element={<Trade />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/membership" element={<MembershipUpgrade />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;