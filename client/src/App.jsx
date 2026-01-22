import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AddListingPage from "./pages/AddListingPage";
import MyListingsPage from "./pages/MyListingsPage";
import ListingDetailsPage from "./pages/ListingDetailsPage";
import Footer from "./components/Footer";
import CartPage from "./pages/CartPage";
import BuyNowPage from "./pages/BuyNowPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentPage from "./pages/PaymentPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import "./App.css";




// export default function App() {
//   return (
//   <h1>App is running</h1>
//   );
// }


export default function App() {
  return (
    <div className="app-root">
      <Navbar />

      <div className="page-shell">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/add" element={<AddListingPage />} />
          <Route path="/my" element={<MyListingsPage />} />
          <Route path="/listing/:id" element={<ListingDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/buy/:id" element={<BuyNowPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/orders/:id" element={<OrderDetailsPage />} />


        </Routes>
      </div>

      <Footer />
    </div>
  );
}


