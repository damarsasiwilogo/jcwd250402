import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedTenantRoute = () => {
  const auth = {
    isTenant: localStorage.getItem("isTenant"),
    isLoggedIn: localStorage.getItem("isLoggedIn"),
  };
  return auth.isTenant && auth.isLoggedIn ? <Outlet /> : <Navigate to="/" />;
};

const RedirectRoute = () => {
  const auth = {
    isLoggedIn: useSelector((state) => state.auth.isLoggedIn),
    isTenant: useSelector((state) => state.auth.isTenant),
  };
  if (auth.isTenant) {
    return <Navigate to="/" />;
  } else return <Outlet />;
};

const ProtectedRoute = () => {
  const auth = {
    isLoggedIn: useSelector((state) => state.auth.isLoggedIn),
    token: useSelector((state) => state.auth.token),
  };

  return auth.isLoggedIn ? <Outlet /> : <Navigate to="/" />;
};

export { ProtectedRoute, RedirectRoute, ProtectedTenantRoute };
