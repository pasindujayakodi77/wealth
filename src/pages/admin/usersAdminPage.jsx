import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { BiSearch } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader";

export default function UsersAdminPage() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [verifiedFilter, setVerifiedFilter] = useState("all");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please log in to access admin tools");
                navigate("/login");
                return;
            }

            try {
                setIsLoading(true);
                const res = await axios.get(
                    import.meta.env.VITE_BACKEND_URL + "/api/users/all",
                    {
                        headers: {
                            Authorization: "Bearer " + token,
                        },
                    }
                );
                setUsers(Array.isArray(res.data) ? res.data : []);
            } catch (error) {
                console.error("Error fetching users:", error);
                toast.error(error.response?.data?.message || "Failed to load users");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, [navigate]);

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
            const searchTarget = `${fullName} ${user.email || ""}`.toLowerCase();
            const matchesSearch = searchTarget.includes(searchTerm.toLowerCase());

            const matchesRole =
                roleFilter === "all" || (user.role || "user").toLowerCase() === roleFilter;

            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "blocked" ? user.isBlocked === true : user.isBlocked !== true);

            const matchesVerified =
                verifiedFilter === "all" ||
                (verifiedFilter === "verified" ? user.isEmailVerified === true : user.isEmailVerified !== true);

            return matchesSearch && matchesRole && matchesStatus && matchesVerified;
        });
    }, [users, searchTerm, roleFilter, statusFilter, verifiedFilter]);

    const handleClearFilters = () => {
        setSearchTerm("");
        setRoleFilter("all");
        setStatusFilter("all");
        setVerifiedFilter("all");
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Users Management</h2>
                    <p className="text-sm text-gray-600">Monitor all registered users and their statuses</p>
                </div>
                <div className="text-sm text-gray-500">
                    Total Users: <span className="font-semibold text-gray-900">{users.length}</span>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="relative">
                        <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by name or email"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Roles</option>
                        <option value="admin">Admins</option>
                        <option value="user">Customers</option>
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="blocked">Blocked</option>
                    </select>

                    <select
                        value={verifiedFilter}
                        onChange={(e) => setVerifiedFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Verification</option>
                        <option value="verified">Verified</option>
                        <option value="unverified">Unverified</option>
                    </select>

                    <button
                        onClick={handleClearFilters}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email Verification</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredUsers.map((user) => (
                                    <tr key={user._id ?? user.email} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border">
                                                    {user.image ? (
                                                        <img
                                                            src={user.image}
                                                            alt={user.firstName || "User"}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                                                            {user.firstName?.[0]?.toUpperCase() || "U"}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {`${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unnamed User"}
                                                    </p>
                                                    <p className="text-sm text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                (user.role || "user").toLowerCase() === "admin"
                                                    ? "bg-purple-100 text-purple-800"
                                                    : "bg-blue-100 text-blue-800"
                                            }`}>
                                                {(user.role || "user").charAt(0).toUpperCase() + (user.role || "user").slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                user.isBlocked
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-green-100 text-green-800"
                                            }`}>
                                                {user.isBlocked ? "Blocked" : "Active"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                user.isEmailVerified
                                                    ? "bg-green-50 text-green-800"
                                                    : "bg-yellow-50 text-yellow-800"
                                            }`}>
                                                {user.isEmailVerified ? "Verified" : "Pending"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredUsers.length === 0 && (
                        <div className="text-center py-10">
                            <p className="text-gray-500">No users match the current filters.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
