import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ProductDetail from "./pages/ProductDetail";
import CategoryPage from "./pages/CategoryPage";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import SearchPage from "./pages/SearchPage";
import { CartProvider } from "./utils/CartContext.jsx";
import { AuthProvider } from "./utils/AuthContext.jsx";
import { OrderProvider } from "./utils/OrderContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [error, setError] = React.useState(null);

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
      <div style={{ 
        padding: "20px", 
        margin: "20px", 
        border: "1px solid #f44336",
        borderRadius: "4px", 
        backgroundColor: "#ffebee" 
      }}>
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
            marginTop: "10px"
          }}
        >
          Reload Page
        </button>
      </div>
    );
  }

  return (
    <React.StrictMode>
      <ErrorBoundary>
        <AuthProvider>
          <CartProvider>
            <OrderProvider>
              <Router>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} /> 
                  <Route path="/login" element={<Login />} /> 
                  <Route path="/register" element={<Register />} /> 
                  <Route path="/cart" element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  } /> 
                  <Route path="/checkout" element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  } />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/categories/:categoryName" element={<CategoryPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/orders" element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  } />
                  <Route path="/orders/:orderId" element={
                    <ProtectedRoute>
                      <OrderDetail />
                    </ProtectedRoute>
                  } />
                </Routes>
              </Router>
            </OrderProvider>
          </CartProvider>
        </AuthProvider>
      </ErrorBoundary>
    </React.StrictMode>
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
        <div style={{ 
          padding: "20px", 
          margin: "20px", 
          border: "1px solid #f44336",
          borderRadius: "4px", 
          backgroundColor: "#ffebee" 
        }}>
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
              marginTop: "10px"
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
