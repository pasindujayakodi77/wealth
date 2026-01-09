import { Link, Route, Routes, useLocation } from "react-router-dom";
import { FaBoxArchive } from "react-icons/fa6";
import { FaShoppingBag, FaUsers, FaCog, FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import ProductsAdminPage from "./admin/productsAdminPage";
import AddProductPage from "./admin/addProductAdminPage";
import UpdateProductPage from "./admin/updateProduct";
import OrdersPageAdmin from "./admin/ordersPageAdmin";

export default function AdminPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    const menuItems = [
        { path: "/admin", label: "Dashboard", icon: FaBoxArchive },
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
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-gray-500 hover:text-gray-700"
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
                                        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                            isActive(item.path)
                                                ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700'
                                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
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
                <header className="bg-white shadow-sm border-b px-4 py-3 lg:px-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden text-gray-500 hover:text-gray-700 mr-4"
                            >
                                <FaBars className="w-6 h-6" />
                            </button>
                            <h1 className="text-2xl font-semibold text-gray-800">
                                {menuItems.find(item => isActive(item.path))?.label || 'Dashboard'}
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">Welcome, Admin</span>
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">A</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 lg:p-6">
                    <Routes>
                        <Route path="/" element={
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                                        <div className="flex items-center">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <FaBoxArchive className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-600">Total Products</p>
                                                <p className="text-2xl font-bold text-gray-900">--</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                                        <div className="flex items-center">
                                            <div className="p-2 bg-green-100 rounded-lg">
                                                <FaShoppingBag className="w-6 h-6 text-green-600" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                                                <p className="text-2xl font-bold text-gray-900">--</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                                        <div className="flex items-center">
                                            <div className="p-2 bg-yellow-100 rounded-lg">
                                                <FaUsers className="w-6 h-6 text-yellow-600" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-600">Total Users</p>
                                                <p className="text-2xl font-bold text-gray-900">--</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                                        <div className="flex items-center">
                                            <div className="p-2 bg-purple-100 rounded-lg">
                                                <FaCog className="w-6 h-6 text-purple-600" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-600">Revenue</p>
                                                <p className="text-2xl font-bold text-gray-900">LKR --</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-sm border">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                                    <p className="text-gray-600">Dashboard content coming soon...</p>
                                </div>
                            </div>
                        } />
                        <Route path="/orders" element={<OrdersPageAdmin />} />
                        <Route path="/products" element={<ProductsAdminPage />} />
                        <Route path="/newProduct" element={<AddProductPage />} />
                        <Route path="/updateProduct" element={<UpdateProductPage />} />
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