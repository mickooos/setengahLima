import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MejaProvider } from "../context/MejaContext";
import { OrderProvider } from "../context/OrderContext";
import Welcome from "../pages/Welcome";
import LandingPage from "../pages/LandingPage";
import MenuPage from "../pages/MenuPage";
import CheckoutPage from "../pages/CheckoutPage";
import TransactionPage from "../pages/TransactionPage";
import MyOrderPage from "../pages/MyOrderPage";
import NotFound from "./NotFound";

function AppRoutes() {
  return (
    <MejaProvider>
      <OrderProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/home" element={<LandingPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/transaction/cash" element={<TransactionPage />} />
            <Route path="/my-order" element={<MyOrderPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </OrderProvider>
    </MejaProvider>
  );
}

export default AppRoutes;
