import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import Paginator from "../../components/paginator";
import toast from "react-hot-toast";
import { BiSearch, BiX } from "react-icons/bi";

export default function OrdersPageAdmin() {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [limit, setLimit] = useState(10);
	const [popupVisible, setPopupVisible] = useState(false);
	const [clickedOrder, setClickedOrder] = useState(null);
    const [orderStatus, setOrderStatus] = useState("pending");
    const [orderNotes, setOrderNotes] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");

	useEffect(() => {
		if (loading) {
			axios
				.get(
					import.meta.env.VITE_BACKEND_URL +
						"/api/orders/" +
						page +
						"/" +
						limit,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					}
				)
				.then((res) => {
					setOrders(res.data.orders);
					setTotalPages(res.data.totalPages);
					setLoading(false);
					console.log(res.data);
				})
				.catch((err) => {
					console.error(err);
					setLoading(false);
					toast.error("Failed to load orders");
				});
		}
	}, [loading, page, limit]);

	const filteredOrders = useMemo(() => {
		let filtered = orders;

		// Search filter
		if (searchTerm) {
			filtered = filtered.filter(order =>
				order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
				order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		// Status filter
		if (statusFilter !== "all") {
			filtered = filtered.filter(order => order.status === statusFilter);
		}

		return filtered;
	}, [orders, searchTerm, statusFilter]);

	const handleOrderClick = (order) => {
		setOrderStatus(order.status);
		setOrderNotes(order.notes || "");
		setClickedOrder(order);
		setPopupVisible(true);
	};

	const handleSaveChanges = async () => {
		try {
			await axios.put(
				import.meta.env.VITE_BACKEND_URL + "/api/orders/" + clickedOrder.orderID,
				{
					status: orderStatus,
					notes: orderNotes
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				}
			);
			toast.success("Order updated successfully");
			setPopupVisible(false);
			setLoading(true);
		} catch (err) {
			console.error(err);
			toast.error("Failed to update order");
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>
			</div>

			{/* Filters */}
			<div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{/* Search */}
					<div className="relative">
						<BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
						<input
							type="text"
							placeholder="Search orders..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>

					{/* Status Filter */}
					<select
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value)}
						className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					>
						<option value="all">All Status</option>
						<option value="pending">Pending</option>
						<option value="completed">Completed</option>
						<option value="cancelled">Cancelled</option>
					</select>

					{/* Clear Filters */}
					<button
						onClick={() => {
							setSearchTerm("");
							setStatusFilter("all");
						}}
						className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
					>
						Clear Filters
					</button>
				</div>
			</div>

			{/* Orders Table */}
			<div className="bg-white rounded-lg shadow-sm border overflow-hidden">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{filteredOrders.map((order, index) => (
								<tr
									key={index}
									className="hover:bg-gray-50 cursor-pointer"
									onClick={() => handleOrderClick(order)}
								>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
										{order.orderID}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900">{order.name}</div>
										<div className="text-sm text-gray-500">{order.email}</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900">{order.phone}</div>
										<div className="text-sm text-gray-500 max-w-xs truncate">{order.address}{order.address2 ? ', ' + order.address2 : ''}, {order.city}, {order.state} {order.zip}, {order.country}</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
											order.status === "completed"
												? "bg-green-100 text-green-800"
												: order.status === "cancelled"
												? "bg-red-100 text-red-800"
												: "bg-yellow-100 text-yellow-800"
										}`}>
											{order.status.charAt(0).toUpperCase() + order.status.slice(1)}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{new Date(order.date).toLocaleDateString()}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
										LKR {order.total.toLocaleString("en-US", {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										})}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{filteredOrders.length === 0 && !loading && (
					<div className="text-center py-12">
						<p className="text-gray-500">No orders found matching your criteria.</p>
					</div>
				)}
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<Paginator
					currentPage={page}
					totalPages={totalPages}
					setCurrentPage={setPage}
					limit={limit}
					setLimit={setLimit}
					setLoading={setLoading}
				/>
			)}

			{/* Order Details Modal */}
			{popupVisible && clickedOrder && (
				<div className="fixed inset-0 z-50 overflow-y-auto">
					<div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
						<div className="fixed inset-0 transition-opacity" aria-hidden="true">
							<div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setPopupVisible(false)}></div>
						</div>

						<div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
							<div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
								<div className="flex justify-between items-start mb-4">
									<h3 className="text-lg leading-6 font-medium text-gray-900">
										Order Details - {clickedOrder.orderID}
									</h3>
									<button
										onClick={() => setPopupVisible(false)}
										className="text-gray-400 hover:text-gray-600"
									>
										<BiX className="w-6 h-6" />
									</button>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
									{/* Customer Info */}
									<div className="space-y-3">
										<h4 className="font-semibold text-gray-900">Customer Information</h4>
										<div className="space-y-2 text-sm">
											<p><span className="font-medium">Name:</span> {clickedOrder.name}</p>
											<p><span className="font-medium">Email:</span> {clickedOrder.email}</p>
											<p><span className="font-medium">Phone:</span> {clickedOrder.phone}</p>
											<p><span className="font-medium">Address:</span> {clickedOrder.address}{clickedOrder.address2 ? ', ' + clickedOrder.address2 : ''}</p>
											<p><span className="font-medium">City:</span> {clickedOrder.city}</p>
											<p><span className="font-medium">State:</span> {clickedOrder.state}</p>
											<p><span className="font-medium">Zip:</span> {clickedOrder.zip}</p>
											<p><span className="font-medium">Country:</span> {clickedOrder.country}</p>
											<p><span className="font-medium">Payment Method:</span> {clickedOrder.paymentMethod}</p>
											{clickedOrder.paymentMethod === "Card Payment" && (
												<>
													<p><span className="font-medium">Card Holder:</span> {clickedOrder.cardHolderName}</p>
													<p><span className="font-medium">Card Number:</span> **** **** **** {clickedOrder.cardNumber.slice(-4)}</p>
													<p><span className="font-medium">Expiry:</span> {clickedOrder.expiry}</p>
												</>
											)}
											<p><span className="font-medium">Total:</span> Rs. {clickedOrder.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
											<p><span className="font-medium">Date:</span> {new Date(clickedOrder.date).toLocaleString()}</p>
										</div>
									</div>

									{/* Order Status */}
									<div className="space-y-3">
										<h4 className="font-semibold text-gray-900">Order Status</h4>
										<div className="space-y-3">
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
												<select
													value={orderStatus}
													onChange={(e) => setOrderStatus(e.target.value)}
													className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
												>
													<option value="pending">Pending</option>
													<option value="completed">Completed</option>
													<option value="cancelled">Cancelled</option>
												</select>
											</div>
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
												<textarea
													value={orderNotes}
													onChange={(e) => setOrderNotes(e.target.value)}
													rows={3}
													className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
													placeholder="Add notes about this order..."
												/>
											</div>
										</div>
									</div>
								</div>

								{/* Items */}
								<div>
									<h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
									<div className="space-y-3 max-h-60 overflow-y-auto">
										{clickedOrder.items.map((item, index) => (
											<div
												key={item._id || index}
												className="flex items-center gap-4 border border-gray-200 rounded-lg p-3"
											>
												<img
													src={item.image}
													alt={item.name}
													className="w-16 h-16 object-cover rounded-md border"
												/>
												<div className="flex-1">
													<p className="font-semibold text-gray-900">{item.name}</p>
													<p className="text-sm text-gray-600">Quantity: {item.qty}</p>
													<p className="text-sm text-gray-600">
														Price: Rs. {item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
													</p>
													<p className="text-sm font-medium text-gray-900">
														Subtotal: Rs. {(item.qty * item.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
													</p>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>

							{/* Footer */}
							<div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
								<button
									type="button"
									onClick={handleSaveChanges}
									disabled={orderStatus === clickedOrder.status && orderNotes === (clickedOrder.notes || "")}
									className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Save Changes
								</button>
								<button
									type="button"
									onClick={() => setPopupVisible(false)}
									className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}