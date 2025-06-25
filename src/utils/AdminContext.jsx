import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext.jsx";
import { useOrder } from "./OrderContext.jsx";
import { products } from "../components/Products.jsx";

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const { isAdmin } = useAuth();
  const { orders } = useOrder();
  const [analytics, setAnalytics] = useState({
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    topSellingProducts: [],
    recentOrders: [],
    salesByCategory: {},
    monthlySalesData: [],
    customerCount: 0,
    inventoryStatus: [],
    lowStockItems: [],
    salesGrowth: 0,
    orderConversionRate: 2.4,
    dailySalesData: [],
    weeklySalesData: [],
    performanceMetrics: {
      revenue: { current: 0, previous: 0, change: 0 },
      orders: { current: 0, previous: 0, change: 0 },
      customers: { current: 0, previous: 0, change: 0 },
      aov: { current: 0, previous: 0, change: 0 },
    },
    categoryDistribution: {},
    salesByDevice: {
      mobile: 38,
      desktop: 52,
      tablet: 10,
    },
    customerMetrics: {
      newCustomers: 0,
      returningCustomers: 0,
      retentionRate: 0,
      churnRate: 0,
    },
  });

  const [systemStatus, setSystemStatus] = useState({
    database: "Online",
    paymentGateway: "Online",
    orderProcessing: "Running",
    storageUsed: 74, // Percentage
    apiRequests: 832,
    serverLoad: 42,
    responseTime: 183, // ms
    uptime: 99.98,
    lastIncident: "2025-05-15",
    scheduledMaintenance: "2025-07-15",
    services: [
      { name: "Product Catalog", status: "Online", uptime: 99.9 },
      { name: "User Authentication", status: "Online", uptime: 100 },
      { name: "Payment Processing", status: "Online", uptime: 99.5 },
      { name: "Inventory Management", status: "Online", uptime: 99.7 },
      { name: "Order Processing", status: "Online", uptime: 99.8 },
    ],
  });

  const [refreshInterval, setRefreshInterval] = useState(60000);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const calculateAnalytics = useCallback(() => {
    if (!isAdmin || !isAdmin()) return;

    const completedOrders = orders.filter(
      (order) => order.status !== "Cancelled"
    );

    let totalSales = 0;
    let allOrderItems = [];
    let customerSet = new Set();

    let categorySales = {};
    let categoryDistribution = {};
    let monthlyData = new Array(12).fill(0);
    let dailyData = new Array(30).fill(0);
    let weeklyData = new Array(12).fill(0);

    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    let currentPeriodMetrics = {
      revenue: 0,
      orders: 0,
      customers: new Set(),
      aov: 0,
    };

    let previousPeriodMetrics = {
      revenue: 0,
      orders: 0,
      customers: new Set(),
      aov: 0,
    };

    let newCustomers = 0;
    let returningCustomers = 0;
    let knownCustomers = new Set();

    const sortedOrders = [...completedOrders].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    const recentOrders = sortedOrders.slice(0, 5);

    completedOrders.forEach((order) => {
      totalSales += order.total || 0;

      if (order.userId) {
        customerSet.add(order.userId);

        if (knownCustomers.has(order.userId)) {
          returningCustomers++;
        } else {
          newCustomers++;
          knownCustomers.add(order.userId);
        }
      }

      const orderDate = order.date ? new Date(order.date) : null;
      if (orderDate) {
        if (orderDate >= currentMonthStart) {
          currentPeriodMetrics.revenue += order.total || 0;
          currentPeriodMetrics.orders++;
          if (order.userId) currentPeriodMetrics.customers.add(order.userId);
        } else if (
          orderDate >= previousMonthStart &&
          orderDate <= previousMonthEnd
        ) {
          previousPeriodMetrics.revenue += order.total || 0;
          previousPeriodMetrics.orders++;
          if (order.userId) previousPeriodMetrics.customers.add(order.userId);
        }
      }

      if (order.items && Array.isArray(order.items)) {
        allOrderItems = [...allOrderItems, ...order.items];

        order.items.forEach((item) => {
          const product = products.find((p) => p.id === item.id);
          if (product && product.category) {
            if (!categorySales[product.category]) {
              categorySales[product.category] = 0;
            }
            categorySales[product.category] += item.price * item.quantity;

            if (!categoryDistribution[product.category]) {
              categoryDistribution[product.category] = 0;
            }
            categoryDistribution[product.category] += item.quantity;
          }
        });
      }

      // Monthly sales tracking
      if (order.date) {
        const orderDate = new Date(order.date);
        const month = orderDate.getMonth();
        monthlyData[month] += order.total || 0;

        // Daily and weekly tracking
        const daysDiff = Math.floor(
          (new Date() - orderDate) / (1000 * 60 * 60 * 24)
        );
        if (daysDiff < 30) {
          dailyData[29 - daysDiff] += order.total || 0;
        }

        const weeksDiff = Math.floor(daysDiff / 7);
        if (weeksDiff < 12) {
          weeklyData[11 - weeksDiff] += order.total || 0;
        }
      }
    });

    // Calculate top selling products
    const productSalesMap = {};
    allOrderItems.forEach((item) => {
      if (!productSalesMap[item.id]) {
        productSalesMap[item.id] = {
          id: item.id,
          name: item.name,
          quantity: 0,
          total: 0,
        };
      }
      productSalesMap[item.id].quantity += item.quantity;
      productSalesMap[item.id].total += item.price * item.quantity;
    });

    const topProducts = Object.values(productSalesMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    const inventoryStatus = products.map((product) => {
      const soldQuantity = productSalesMap[product.id]?.quantity || 0;
      const initialStock = product.initialStock || 100;
      const currentStock = initialStock - soldQuantity;

      return {
        id: product.id,
        name: product.name,
        currentStock,
        isLowStock: currentStock < 10,
      };
    });

    const lowStockItems = inventoryStatus
      .filter((item) => item.isLowStock)
      .slice(0, 8);

    const currentMonth = new Date().getMonth();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const salesGrowth =
      monthlyData[previousMonth] > 0
        ? ((monthlyData[currentMonth] - monthlyData[previousMonth]) /
            monthlyData[previousMonth]) *
          100
        : 0;

    currentPeriodMetrics.aov =
      currentPeriodMetrics.orders > 0
        ? currentPeriodMetrics.revenue / currentPeriodMetrics.orders
        : 0;

    previousPeriodMetrics.aov =
      previousPeriodMetrics.orders > 0
        ? previousPeriodMetrics.revenue / previousPeriodMetrics.orders
        : 0;

    const calculateChange = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    const performanceMetrics = {
      revenue: {
        current: currentPeriodMetrics.revenue,
        previous: previousPeriodMetrics.revenue,
        change: calculateChange(
          currentPeriodMetrics.revenue,
          previousPeriodMetrics.revenue
        ),
      },
      orders: {
        current: currentPeriodMetrics.orders,
        previous: previousPeriodMetrics.orders,
        change: calculateChange(
          currentPeriodMetrics.orders,
          previousPeriodMetrics.orders
        ),
      },
      customers: {
        current: currentPeriodMetrics.customers.size,
        previous: previousPeriodMetrics.customers.size,
        change: calculateChange(
          currentPeriodMetrics.customers.size,
          previousPeriodMetrics.customers.size
        ),
      },
      aov: {
        current: currentPeriodMetrics.aov,
        previous: previousPeriodMetrics.aov,
        change: calculateChange(
          currentPeriodMetrics.aov,
          previousPeriodMetrics.aov
        ),
      },
    };

    const totalItems = Object.values(categoryDistribution).reduce(
      (sum, count) => sum + count,
      0
    );

    if (totalItems > 0) {
      Object.keys(categoryDistribution).forEach((category) => {
        categoryDistribution[category] = Math.round(
          (categoryDistribution[category] / totalItems) * 100
        );
      });
    }

    const totalCustomers = customerSet.size;
    const retentionRate =
      totalCustomers > 0
        ? (returningCustomers / (returningCustomers + newCustomers)) * 100
        : 0;

    setAnalytics({
      totalSales,
      totalOrders: completedOrders.length,
      averageOrderValue: completedOrders.length
        ? totalSales / completedOrders.length
        : 0,
      topSellingProducts: topProducts,
      recentOrders,
      salesByCategory: categorySales,
      monthlySalesData: monthlyData,
      dailySalesData: dailyData,
      weeklySalesData: weeklyData,
      customerCount: customerSet.size,
      inventoryStatus,
      lowStockItems,
      salesGrowth: parseFloat(salesGrowth.toFixed(1)),
      orderConversionRate: Math.random() * 1 + 2,
      performanceMetrics,
      categoryDistribution,
      customerMetrics: {
        newCustomers,
        returningCustomers,
        retentionRate: retentionRate.toFixed(1),
        churnRate: (100 - retentionRate).toFixed(1),
      },
    });

    setLastRefreshed(new Date());
  }, [orders, isAdmin]);

  useEffect(() => {
    calculateAnalytics();
  }, [orders, isAdmin, calculateAnalytics]);

  useEffect(() => {
    if (!isAdmin || !isAdmin()) return;

    const statusCheck = setInterval(() => {
      if (Math.random() > 0.95) {
        setSystemStatus((prev) => ({
          ...prev,
          database: Math.random() > 0.9 ? "Maintenance" : "Online",
          paymentGateway: Math.random() > 0.95 ? "Degraded" : "Online",
          storageUsed: Math.min(
            100,
            prev.storageUsed + (Math.random() > 0.7 ? 1 : -1)
          ),
          apiRequests: prev.apiRequests + Math.floor(Math.random() * 5),
          serverLoad: Math.max(
            10,
            Math.min(95, prev.serverLoad + (Math.random() > 0.6 ? 2 : -2))
          ),
          responseTime: Math.max(
            100,
            Math.min(500, prev.responseTime + (Math.random() > 0.5 ? 10 : -10))
          ),
        }));
      }

      if (Math.random() > 0.98) {
        setSystemStatus((prev) => {
          const updatedServices = [...prev.services];
          const randomServiceIndex = Math.floor(
            Math.random() * updatedServices.length
          );
          const newStatus = Math.random() > 0.8 ? "Degraded" : "Online";

          updatedServices[randomServiceIndex] = {
            ...updatedServices[randomServiceIndex],
            status: newStatus,
          };

          return { ...prev, services: updatedServices };
        });
      }
    }, refreshInterval);

    return () => clearInterval(statusCheck);
  }, [isAdmin, refreshInterval]);

  const refreshData = () => {
    calculateAnalytics();
    setSystemStatus((prev) => ({
      ...prev,
      serverLoad: Math.max(
        10,
        Math.min(95, Math.floor(Math.random() * 50) + 20)
      ),
      responseTime: Math.max(
        100,
        Math.min(300, Math.floor(Math.random() * 200) + 120)
      ),
    }));
  };

  const generateReport = (type = "sales") => {
    switch (type) {
      case "sales":
        return {
          title: "Sales Report",
          data: analytics.monthlySalesData,
          totalSales: analytics.totalSales,
          avgOrderValue: analytics.averageOrderValue,
          byCategory: analytics.salesByCategory,
          growth: analytics.salesGrowth,
          performanceMetrics: analytics.performanceMetrics,
        };
      case "inventory":
        return {
          title: "Inventory Report",
          lowStock: analytics.lowStockItems,
          totalProducts: products.length,
          inventoryStatus: analytics.inventoryStatus,
          categoryDistribution: analytics.categoryDistribution,
        };
      case "customers":
        return {
          title: "Customer Report",
          totalCustomers: analytics.customerCount,
          conversionRate: analytics.orderConversionRate,
          customerMetrics: analytics.customerMetrics,
          newVsReturning: {
            new: analytics.customerMetrics.newCustomers,
            returning: analytics.customerMetrics.returningCustomers,
          },
        };
      case "performance":
        return {
          title: "Performance Report",
          metrics: analytics.performanceMetrics,
          systemStatus,
          uptime: systemStatus.uptime,
          responseTime: systemStatus.responseTime,
        };
      default:
        return { title: "Unknown Report Type", data: {} };
    }
  };

  const predictSales = (months = 3) => {
    const monthlyData = analytics.monthlySalesData;
    const result = [];

    let totalGrowth = 0;
    let growthPoints = 0;

    for (let i = 1; i < monthlyData.length; i++) {
      if (monthlyData[i - 1] > 0) {
        totalGrowth +=
          (monthlyData[i] - monthlyData[i - 1]) / monthlyData[i - 1];
        growthPoints++;
      }
    }

    const avgGrowth = growthPoints > 0 ? totalGrowth / growthPoints : 0.05;
    let lastValue = monthlyData[monthlyData.length - 1];

    for (let i = 0; i < months; i++) {
      lastValue = lastValue * (1 + avgGrowth);
      result.push(lastValue);
    }

    return result;
  };

  const value = {
    analytics,
    systemStatus,
    generateReport,
    refreshData,
    lastRefreshed,
    setRefreshInterval,
    predictSales,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};
