import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './frontend/pages/dashboard';
import Register from './frontend/pages/register.jsx.jsx';
import MenuItemDetail from './frontend/pages/view_page.jsx';
import PaymentPage from './frontend/pages/payment.jsx';
import AddToCart from './frontend/pages/orders.jsx';
import AddressForm from './frontend/pages/address .jsx';
import Login from './frontend/pages/login.jsx';
import BillingPage from './frontend/pages/billingPage.jsx';
import Admin from './frontend/pages/admin.jsx';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/offers" element={<Dashboard showOffersOnly />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/item/:id" element={<MenuItemDetail />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/checkout" element={<BillingPage />} />
        <Route path="/cart" element={<AddToCart />} />
        <Route path="/address" element={<AddressForm />} />
        {/* <Route path="/login" element={<Login />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
