import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { useAdmin } from "../../utils/AdminContext";
import { FaArrowUp, FaArrowDown, FaEquals } from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const OrdersAnalytics = ({ orders }) => {
  const { analytics } = useAdmin();

  const orderData =
    orders && orders.length > 0 ? orders : analytics.recentOrders;

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getChangeIndicator = (change) => {
    if (change > 0) {
      return {
        icon: <FaArrowUp className="text-green-500" />,
        colorClass: "text-green-500",
      };
    } else if (change < 0) {
      return {
        icon: <FaArrowDown className="text-red-500" />,
        colorClass: "text-red-500",
      };
    }
    return {
      icon: <FaEquals className="text-gray-500" />,
      colorClass: "text-gray-500",
    };
  };

  const statusDistribution = {
    Processing: 0,
    Shipped: 0,
    Delivered: 0,
    Cancelled: 0,
  };

  orderData.forEach((order) => {
    if (order.status && statusDistribution.hasOwnProperty(order.status)) {
      statusDistribution[order.status]++;
    } else {
      statusDistribution.Processing++;
    }
  });

  const statusChartData = {
    labels: Object.keys(statusDistribution),
    datasets: [
      {
        label: "Orders by Status",
        data: Object.values(statusDistribution),
        backgroundColor: [
          "rgba(255, 206, 86, 0.7)", // Processing - yellow
          "rgba(54, 162, 235, 0.7)", // Shipped - blue
          "rgba(75, 192, 192, 0.7)", // Delivered - green
          "rgba(255, 99, 132, 0.7)", // Cancelled - red
        ],
        borderColor: [
          "rgba(255, 206, 86, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const revenueByTimeData = {
    labels: ["Last 7 Days", "Last 30 Days", "Last 90 Days"],
    datasets: [
      {
        label: "Revenue",
        data: [
          analytics.weeklySalesData.reduce((sum, val) => sum + val, 0),
          analytics.dailySalesData.reduce((sum, val) => sum + val, 0),
          analytics.monthlySalesData.reduce((sum, val) => sum + val, 0) / 4,
        ],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const salesTrendData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Monthly Sales",
        data: analytics.monthlySalesData,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="mb-8">
      <h2 className="ml-7 mt-5 text-xl font-semibold mb-4">
        Order Analytics Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
          <div className="flex items-baseline">
            <p className="text-2xl font-bold">{analytics.totalOrders}</p>
            <div className="ml-2 flex items-center text-sm">
              {
                getChangeIndicator(analytics.performanceMetrics.orders.change)
                  .icon
              }
              <span
                className={`ml-1 ${
                  getChangeIndicator(analytics.performanceMetrics.orders.change)
                    .colorClass
                }`}
              >
                {Math.abs(analytics.performanceMetrics.orders.change).toFixed(
                  1
                )}
                %
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">vs previous period</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
          <div className="flex items-baseline">
            <p className="text-2xl font-bold">
              {formatCurrency(analytics.totalSales)}
            </p>
            <div className="ml-2 flex items-center text-sm">
              {
                getChangeIndicator(analytics.performanceMetrics.revenue.change)
                  .icon
              }
              <span
                className={`ml-1 ${
                  getChangeIndicator(
                    analytics.performanceMetrics.revenue.change
                  ).colorClass
                }`}
              >
                {Math.abs(analytics.performanceMetrics.revenue.change).toFixed(
                  1
                )}
                %
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">vs previous period</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">
            Avg. Order Value
          </h3>
          <div className="flex items-baseline">
            <p className="text-2xl font-bold">
              {formatCurrency(analytics.averageOrderValue)}
            </p>
            <div className="ml-2 flex items-center text-sm">
              {getChangeIndicator(analytics.performanceMetrics.aov.change).icon}
              <span
                className={`ml-1 ${
                  getChangeIndicator(analytics.performanceMetrics.aov.change)
                    .colorClass
                }`}
              >
                {Math.abs(analytics.performanceMetrics.aov.change).toFixed(1)}%
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">vs previous period</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
          <div className="flex items-baseline">
            <p className="text-2xl font-bold">
              {analytics.orderConversionRate.toFixed(1)}%
            </p>
            <div className="ml-2 flex items-center text-sm">
              {getChangeIndicator(0.3).icon}
              <span className={`ml-1 ${getChangeIndicator(0.3).colorClass}`}>
                0.3%
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">vs previous period</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Order Status Distribution */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-4">
            Order Status Distribution
          </h3>
          <div className="h-60">
            <Doughnut
              data={statusChartData}
              options={{
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>

        {/* Revenue by Time Period */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-4">
            Revenue by Time Period
          </h3>
          <div className="h-60">
            <Bar
              data={revenueByTimeData}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function (value) {
                        return "$" + value;
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Sales Trend Line Chart */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h3 className="text-sm font-medium text-gray-500 mb-4">
          Monthly Sales Trend
        </h3>
        <div className="h-60">
          <Line
            data={salesTrendData}
            options={{
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function (value) {
                      return "$" + value;
                    },
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default OrdersAnalytics;
