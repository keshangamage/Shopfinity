import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import PersistenceDebugger from "./components/PersistenceDebugger";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import { CartProvider } from "./utils/CartContext.jsx";
import { AuthProvider } from "./utils/AuthContext.jsx";
import { OrderProvider } from "./utils/OrderContext.jsx";
import { AddressProvider } from "./utils/AddressContext.jsx";
import { PaymentProvider } from "./utils/PaymentContext.jsx";
import { SavedItemsProvider } from "./utils/SavedItemsContext.jsx";
import { RewardsProvider } from "./utils/RewardsContext.jsx";
import { ProductProvider } from "./utils/ProductContext.jsx";
import { AdminProvider } from "./utils/AdminContext.jsx";
import { UserProvider } from "./utils/UserContext.jsx";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const Profile = lazy(() => import("./pages/Profile"));
const Orders = lazy(() => import("./pages/Orders"));
const OrderDetail = lazy(() => import("./pages/OrderDetail"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const AdminLayout = lazy(() => import("./components/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminProducts = lazy(() => import("./pages/admin/Products"));
const AdminOrders = lazy(() => import("./pages/admin/Orders"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));

function App() {
  const [error, setError] = React.useState(null);

  // Initialize app data from localStorage
  React.useEffect(() => {
    try {
      if (typeof localStorage === "undefined") {
        console.warn("localStorage is not available in this browser");
        return;
      }

      window.addEventListener("focus", () => {
        if (document.visibilityState === "visible") {
          console.log("App focus - checking data persistence");
        }
      });
    } catch (e) {
      console.error("Error initializing app storage:", e);
    }
  }, []);

  React.useEffect(() => {
    //error handler
    const handleError = (event) => {
      console.error("Global error:", event.error);
      setError(event.error.message || "An unexpected error occurred");
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (error) {
    return (
      <div
        style={{
          padding: "20px",
          margin: "20px",
          border: "1px solid #f44336",
          borderRadius: "4px",
          backgroundColor: "#ffebee",
        }}
      >
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "8px 16px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          Reload Page
        </button>
      </div>
    );
  }

  const suspenseFallback = (
    <div className="p-6 text-center text-gray-600">Loading...</div>
  );

  return (
    <ErrorBoundary>
      <AuthProvider>
        <UserProvider>
          <CartProvider>
            <OrderProvider>
              <AddressProvider>
                <SavedItemsProvider>
                  <PaymentProvider>
                    <RewardsProvider>
                      <ProductProvider>
                        <AdminProvider>
                          <Router>
                            {import.meta.env.DEV && <PersistenceDebugger />}
                            <Navbar />
                            <Suspense fallback={suspenseFallback}>
                              <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/login" element={<Login />} />
                                <Route
                                  path="/register"
                                  element={<Register />}
                                />
                                <Route path="/cart" element={<Cart />} />
                                <Route
                                  path="/checkout"
                                  element={
                                    <ProtectedRoute>
                                      <Checkout />
                                    </ProtectedRoute>
                                  }
                                />
                                <Route
                                  path="/product/:id"
                                  element={<ProductDetail />}
                                />
                                <Route
                                  path="/categories/:categoryName"
                                  element={<CategoryPage />}
                                />
                                <Route
                                  path="/search"
                                  element={<SearchPage />}
                                />
                                <Route
                                  path="/profile"
                                  element={
                                    <ProtectedRoute>
                                      <Profile />
                                    </ProtectedRoute>
                                  }
                                />
                                <Route
                                  path="/orders"
                                  element={
                                    <ProtectedRoute>
                                      <Orders />
                                    </ProtectedRoute>
                                  }
                                />
                                <Route
                                  path="/orders/:orderId"
                                  element={
                                    <ProtectedRoute>
                                      <OrderDetail />
                                    </ProtectedRoute>
                                  }
                                />
                                <Route
                                  path="/admin"
                                  element={
                                    <AdminRoute>
                                      <AdminLayout>
                                        <AdminDashboard />
                                      </AdminLayout>
                                    </AdminRoute>
                                  }
                                />
                                <Route
                                  path="/admin/products"
                                  element={
                                    <AdminRoute>
                                      <AdminLayout>
                                        <AdminProducts />
                                      </AdminLayout>
                                    </AdminRoute>
                                  }
                                />
                                <Route
                                  path="/admin/orders"
                                  element={
                                    <AdminRoute>
                                      <AdminLayout>
                                        <AdminOrders />
                                      </AdminLayout>
                                    </AdminRoute>
                                  }
                                />
                                <Route
                                  path="/admin/users"
                                  element={
                                    <AdminRoute>
                                      <AdminLayout>
                                        <AdminUsers />
                                      </AdminLayout>
                                    </AdminRoute>
                                  }
                                />
                              </Routes>
                            </Suspense>
                          </Router>
                        </AdminProvider>
                      </ProductProvider>
                    </RewardsProvider>
                  </PaymentProvider>
                </SavedItemsProvider>
              </AddressProvider>
            </OrderProvider>
          </CartProvider>
        </UserProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

// Simple error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "20px",
            margin: "20px",
            border: "1px solid #f44336",
            borderRadius: "4px",
            backgroundColor: "#ffebee",
          }}
        >
          <h2>Something went wrong in the application</h2>
          <p>{this.state.error?.message || "Unknown error"}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "8px 16px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default App;
