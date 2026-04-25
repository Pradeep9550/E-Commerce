import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, isLoading, children }) {

  const location = useLocation();

  // ✅ 1. PayPal return को कभी block मत करो
  if (location.pathname.includes("paypal-return")) {
    return children;
  }

  // ✅ 2. जब तक auth check चल रहा है wait करो
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // ✅ 3. root route logic
  if (location.pathname === "/") {
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" />;
    } else {
      if (user?.role === "admin") {
        return <Navigate to="/admin/dashboard" />;
      } else {
        return <Navigate to="/shop/home" />;
      }
    }
  }

  // ✅ 4. unauth user
  if (
    !isAuthenticated &&
    !(location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    return <Navigate to="/auth/login" />;
  }

  // ✅ 5. auth user shouldn't see login/register
  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/shop/home" />;
    }
  }

  // ✅ 6. user trying admin
  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    location.pathname.includes("admin")
  ) {
    return <Navigate to="/unauth-page" />;
  }

  // ✅ 7. admin trying shop
  if (
    isAuthenticated &&
    user?.role === "admin" &&
    location.pathname.includes("shop")
  ) {
    return <Navigate to="/admin/dashboard" />;
  }

  return <>{children}</>;
}

export default CheckAuth;