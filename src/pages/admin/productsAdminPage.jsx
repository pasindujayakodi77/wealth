import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiEdit, BiPlus, BiTrash, BiSearch } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/loader";

export default function ProductsAdminPage() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [availabilityFilter, setAvailabilityFilter] = useState("all");

    useEffect(() => {
        if (isLoading) {
            axios
                .get(import.meta.env.VITE_BACKEND_URL + "/api/products")
                .then((res) => {
                    setProducts(res.data);
                    setFilteredProducts(res.data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching products:", error);
                    toast.error("Failed to load products");
                    setIsLoading(false);
                });
        }
    }, [isLoading]);

    useEffect(() => {
        let filtered = products;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.productId.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Category filter
        if (categoryFilter !== "all") {
            filtered = filtered.filter(product => product.category === categoryFilter);
        }

        // Availability filter
        if (availabilityFilter !== "all") {
            const isAvailable = availabilityFilter === "available";
            filtered = filtered.filter(product => product.isAvailable === isAvailable);
        }

        setFilteredProducts(filtered);
    }, [products, searchTerm, categoryFilter, availabilityFilter]);

    const navigate = useNavigate();

    const handleDelete = (product) => {
        const token = localStorage.getItem("token");
        if (token == null) {
            navigate("/login");
            return;
        }

        if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
            axios
                .delete(
                    import.meta.env.VITE_BACKEND_URL + "/api/products/" + product.productId,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                .then((res) => {
                    console.log("Product deleted successfully");
                    toast.success("Product deleted successfully");
                    setIsLoading(true);
                })
                .catch((error) => {
                    console.error("Error deleting product:", error);
                    toast.error("Failed to delete product");
                });
        }
    };

    const categories = [...new Set(products.map(p => p.category))];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">Products Management</h2>
                <Link
                    to="/admin/newProduct"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                    <BiPlus className="w-4 h-4 mr-2" />
                    Add Product
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Category Filter */}
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Categories</option>
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>

                    {/* Availability Filter */}
                    <select
                        value={availabilityFilter}
                        onChange={(e) => setAvailabilityFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Status</option>
                        <option value="available">Available</option>
                        <option value="unavailable">Unavailable</option>
                    </select>

                    {/* Clear Filters */}
                    <button
                        onClick={() => {
                            setSearchTerm("");
                            setCategoryFilter("all");
                            setAvailabilityFilter("all");
                        }}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Products Table */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader />
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredProducts.map((product, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                className="w-12 h-12 object-cover rounded-lg border"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {product.productId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {product.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div>
                                                <div className="font-medium">Rs. {product.price.toLocaleString()}</div>
                                                {product.labelledPrice > product.price && (
                                                    <div className="text-xs text-gray-500 line-through">
                                                        Rs. {product.labelledPrice.toLocaleString()}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {product.category}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {product.stock}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                product.isAvailable
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {product.isAvailable ? 'Available' : 'Unavailable'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => {
                                                        navigate("/admin/updateProduct", {
                                                            state: product,
                                                        });
                                                    }}
                                                    className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors duration-200"
                                                    title="Edit"
                                                >
                                                    <BiEdit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product)}
                                                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors duration-200"
                                                    title="Delete"
                                                >
                                                    <BiTrash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No products found matching your criteria.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}