import { Link, Route, Routes, useLocation } from "react-router-dom";
import { FaBoxArchive } from "react-icons/fa6";
import { FaShoppingBag, FaUsers, FaCog, FaBars, FaTimes, FaChartLine, FaDollarSign, FaTachometerAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ProductsAdminPage from "./admin/productsAdminPage";
import AddProductPage from "./admin/addProductAdminPage";
import UpdateProductPage from "./admin/updateProduct";
import OrdersPageAdmin from "./admin/ordersPageAdmin";
import UsersAdminPage from "./admin/usersAdminPage";

export default function AdminPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dashboardData, setDashboardData] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        recentOrders: [],
        loading: true
    });
    const location = useLocation();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setDashboardData(prev => ({ ...prev, loading: true }));

                // Fetch products
                const productsRes = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/products");
                const products = productsRes.data;
                const totalProducts = Array.isArray(products) ? products.length : 0;

                // Fetch orders (get first page with large limit to get many orders)
                const ordersRes = await axios.get(
                    import.meta.env.VITE_BACKEND_URL + "/api/orders/1/1000",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                const orders = ordersRes.data.orders || [];
                const totalOrders = orders.length;

                // Calculate revenue from completed orders
                const totalRevenue = orders
                    .filter(order => order.status === 'completed')
                    .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

                // Fetch users
                const usersRes = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/users/all", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const users = usersRes.data;
                const totalUsers = Array.isArray(users) ? users.length : 0;

                setDashboardData({
                    totalProducts,
                    totalOrders,
                    totalUsers,
                    totalRevenue,
                    recentOrders: orders.slice(0, 3), // Store last 3 orders for recent orders section
                    loading: false
                });
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                toast.error("Failed to load dashboard data");
                setDashboardData(prev => ({ ...prev, loading: false }));
            }
        };

        fetchDashboardData();
    }, []);

    const menuItems = [
        { path: "/admin", label: "Dashboard", icon: FaTachometerAlt },
        { path: "/admin/products", label: "Products", icon: FaBoxArchive },
        { path: "/admin/orders", label: "Orders", icon: FaShoppingBag },
        { path: "/admin/users", label: "Users", icon: FaUsers },
        { path: "/admin/settings", label: "Settings", icon: FaCog },
    ];

    const isActive = (path) => {
        if (path === "/admin") {
            return location.pathname === "/admin";
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-linear-to-b from-gray-900 to-gray-800 shadow-xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white">Admin Panel</h2>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-gray-400 hover:text-white"
                    >
                        <FaTimes className="w-6 h-6" />
                    </button>
                </div>
                <nav className="mt-8">
                    <ul className="space-y-2 px-4">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                                            isActive(item.path)
                                                ? 'bg-blue-600 text-white shadow-lg'
                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                        }`}
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <Icon className="w-5 h-5 mr-3" />
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top header */}
                <header className="bg-white shadow-lg border-b border-gray-200 px-4 py-4 lg:px-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden text-gray-600 hover:text-gray-800 mr-4 p-2 rounded-lg hover:bg-gray-100"
                            >
                                <FaBars className="w-6 h-6" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {menuItems.find(item => isActive(item.path))?.label || 'Dashboard'}
                                </h1>
                                <p className="text-sm text-gray-600 mt-1">Welcome back, Admin! Here's what's happening today.</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">Admin User</p>
                                <p className="text-xs text-gray-500">Administrator</p>
                            </div>
                            <div className="w-10 h-10 bg-linear-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-white text-sm font-bold">A</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-linear-to-br from-gray-50 to-gray-100 p-4 lg:p-6">
                    <Routes>
                        <Route index element={
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="bg-linear-to-r from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg border border-blue-200 hover:shadow-xl transition-shadow duration-300">
                                        <div className="flex items-center">
                                            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                                                <FaBoxArchive className="w-8 h-8 text-white" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-blue-100">Total Products</p>
                                                <p className="text-3xl font-bold text-white">
                                                    {dashboardData.loading ? "..." : dashboardData.totalProducts.toLocaleString()}
                                                </p>
                                                <p className="text-xs text-blue-100 mt-1">Active products</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-linear-to-r from-green-500 to-green-600 p-6 rounded-xl shadow-lg border border-green-200 hover:shadow-xl transition-shadow duration-300">
                                        <div className="flex items-center">
                                            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                                                <FaShoppingBag className="w-8 h-8 text-white" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-green-100">Total Orders</p>
                                                <p className="text-3xl font-bold text-white">
                                                    {dashboardData.loading ? "..." : dashboardData.totalOrders.toLocaleString()}
                                                </p>
                                                <p className="text-xs text-green-100 mt-1">All time orders</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-linear-to-r from-yellow-500 to-orange-500 p-6 rounded-xl shadow-lg border border-yellow-200 hover:shadow-xl transition-shadow duration-300">
                                        <div className="flex items-center">
                                            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                                                <FaUsers className="w-8 h-8 text-white" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-yellow-100">Total Users</p>
                                                <p className="text-3xl font-bold text-white">
                                                    {dashboardData.loading ? "..." : (dashboardData.totalUsers || "N/A")}
                                                </p>
                                                <p className="text-xs text-yellow-100 mt-1">Registered users</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-linear-to-r from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg border border-purple-200 hover:shadow-xl transition-shadow duration-300">
                                        <div className="flex items-center">
                                            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                                                <FaDollarSign className="w-8 h-8 text-white" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-purple-100">Revenue</p>
                                                <p className="text-3xl font-bold text-white">
                                                    {dashboardData.loading ? "..." : `LKR ${(dashboardData.totalRevenue / 1000000).toFixed(1)}M`}
                                                </p>
                                                <p className="text-xs text-purple-100 mt-1">From completed orders</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                                            <Link to="/admin/orders" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                                View All
                                            </Link>
                                        </div>
                                        <div className="space-y-3">
                                            {dashboardData.loading ? (
                                                <div className="text-center py-4">
                                                    <p className="text-gray-500">Loading recent orders...</p>
                                                </div>
                                            ) : (
                                                // Show last 3 orders
                                                dashboardData.recentOrders.map((order, index) => (
                                                    <div key={order.orderID || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <div>
                                                            <p className="font-medium text-gray-900">Order #{order.orderID}</p>
                                                            <p className="text-sm text-gray-600">
                                                                {order.customerName || 'Customer'} - {order.items?.length || 0} items
                                                            </p>
                                                        </div>
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {order.status || 'Unknown'}
                                                        </span>
                                                    </div>
                                                )) || (
                                                    <div className="text-center py-4">
                                                        <p className="text-gray-500">No recent orders</p>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <Link to="/admin/newProduct" className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200">
                                                <FaBoxArchive className="w-6 h-6 text-blue-600 mr-3" />
                                                <span className="text-sm font-medium text-blue-900">Add Product</span>
                                            </Link>
                                            <Link to="/admin/products" className="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200">
                                                <FaShoppingBag className="w-6 h-6 text-green-600 mr-3" />
                                                <span className="text-sm font-medium text-green-900">Manage Products</span>
                                            </Link>
                                            <Link to="/admin/orders" className="flex items-center p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors duration-200">
                                                <FaChartLine className="w-6 h-6 text-yellow-600 mr-3" />
                                                <span className="text-sm font-medium text-yellow-900">View Orders</span>
                                            </Link>
                                            <Link to="/admin/users" className="flex items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200">
                                                <FaUsers className="w-6 h-6 text-purple-600 mr-3" />
                                                <span className="text-sm font-medium text-purple-900">Manage Users</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        } />
                        <Route path="orders" element={<OrdersPageAdmin />} />
                        <Route path="products" element={<ProductsAdminPage />} />
                        <Route path="newProduct" element={<AddProductPage />} />
                        <Route path="updateProduct/:productId" element={<UpdateProductPage />} />
                        <Route path="users" element={<UsersAdminPage />} />
                    </Routes>
                </main>
            </div>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}