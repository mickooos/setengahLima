import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "../store/slices/authSlice";
import { RootState } from "../store/store";
import Authentication from "../pages/Authentication";
import Dashboard from "../pages/Dashboard";
import Orders from "../pages/Orders";
import Products from "../pages/Products";
import Categories from "../pages/Categories";
import Revenue from "../pages/Revenue";
import Sales from "../pages/Sales";
import Tables from "../pages/Tables";
import Reservation from "../pages/Reservation";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";

function AppRoutes() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  // Check authentication on component mount
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Router>
      {isAuthenticated ? (
        <>
          <div className="flex">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Header />
              <main className="flex-1 p-4">
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/tables" element={<Tables />} />
                  <Route path="/reservation" element={<Reservation />} />
                  <Route path="/revenue" element={<Revenue />} />
                  <Route path="/sales" element={<Sales />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </main>
            </div>
          </div>
        </>
      ) : (
        <Routes>
          <Route path="/" element={<Authentication />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </Router>
  );
}

export default AppRoutes;
