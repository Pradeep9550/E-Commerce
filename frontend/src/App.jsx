import { Route, Routes } from "react-router-dom"
import AuthLayout from "./components/auth/layout.jsx"
import AuthLogin from "./pages/auth/login.jsx"
import AuthRegister from "./pages/auth/register.jsx"
import AdminLayout from "./components/admin-view/layout.jsx";
import AdminDashboard from "./pages/admin-view/dashboard.jsx";
import AdminProducts from "./pages/admin-view/products.jsx";
import AdminFeatures from "./pages/admin-view/features.jsx";
import AdminOrders from "./pages/admin-view/orders.jsx";
import ShoppingLayout from "./components/shopping-view/layout.jsx";
import NotFound from "./pages/not-found/index.jsx";
import ShoppingHome from "./pages/shopping-view/home.jsx";
import ShoppingCheckout from "./pages/shopping-view/checkout.jsx";
import ShoppingAccount from "./pages/shopping-view/account.jsx";
import ShoppingListing from "./pages/shopping-view/listing.jsx";
import CheckAuth from "./components/common/check-auth.jsx";
import UnauthPage from "./pages/unauth-page/index.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice/index.js";
import PaypalReturnPage from "./pages/shopping-view/paypal-return.jsx";
import PaymentSuccessPage from "./pages/shopping-view/payment-success.jsx";
import SearchProducts from "./pages/shopping-view/search.jsx";

function App() {
  
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <div className="flex flex-col overflow-hidden bg-white">

      <Routes>

        <Route path="/" element={
          <CheckAuth
            isAuthenticated={isAuthenticated}
            user={user}
            isLoading={isLoading}
          />
        } />

        <Route path="/auth" element={
          <CheckAuth 
            isAuthenticated={isAuthenticated} 
            user={user}
            isLoading={isLoading}
          >
            <AuthLayout />
          </CheckAuth>
        }>
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>

        <Route path="/admin" element={
          <CheckAuth 
            isAuthenticated={isAuthenticated} 
            user={user}
            isLoading={isLoading}
          >
            <AdminLayout/>
          </CheckAuth>
        }>
          <Route path="dashboard" element={<AdminDashboard/>}/>
          <Route path="products" element={<AdminProducts/>}/>
          <Route path="features" element={<AdminFeatures/>}/>
          <Route path="orders" element={<AdminOrders/>}/>
        </Route>

        <Route path="/shop" element={
          <CheckAuth 
            isAuthenticated={isAuthenticated} 
            user={user}
            isLoading={isLoading}
          >
            <ShoppingLayout/>
          </CheckAuth>
        }>
          <Route path="home" element={<ShoppingHome/>} /> 
          <Route path="listing" element={<ShoppingListing/>} /> 
          <Route path="checkout" element={<ShoppingCheckout/>} /> 
          <Route path="account" element={<ShoppingAccount/>} /> 
          <Route path="payment-success" element={<PaymentSuccessPage />} />
          <Route path="search" element={<SearchProducts />} />
        </Route>

        {/* ✅ PayPal return हमेशा बाहर */}
        <Route path="/shop/paypal-return" element={<PaypalReturnPage />} />

        <Route path="/unauth-page" element={<UnauthPage/>} />
        <Route path="*" element={<NotFound/>} />

      </Routes>
    </div>
  );
}

export default App;