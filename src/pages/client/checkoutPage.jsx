import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { TbShieldCheck, TbTrash } from "react-icons/tb";

import { addToCart, getCart } from "../../utils/cart";

const PROVINCES = [
	"Western Province",
	"Central Province",
	"Southern Province",
	"Northern Province",
	"Eastern Province",
	"North Western Province",
	"North Central Province",
	"Uva Province",
	"Sabaragamuwa Province"
];

export default function CheckoutPage() {
	const location = useLocation();
	const navigate = useNavigate();

	const [cart, setCart] = useState([]);
	const [user, setUser] = useState(null);
	const [initializing, setInitializing] = useState(true);
	const [processing, setProcessing] = useState(false);

	const [name, setName] = useState("");
	const [address, setAddress] = useState("");
	const [address2, setAddress2] = useState("");
	const [city, setCity] = useState("");
	const [province, setProvince] = useState("");
	const [zip, setZip] = useState("");
	const [country, setCountry] = useState("Sri Lanka");
	const [phone, setPhone] = useState("");
	const [orderNotes, setOrderNotes] = useState("");

	const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
	const [cardHolderName, setCardHolderName] = useState("");
	const [cardNumber, setCardNumber] = useState("");
	const [expiry, setExpiry] = useState("");
	const [cvv, setCvv] = useState("");

	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [itemPendingRemoval, setItemPendingRemoval] = useState(null);

	const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.quantity * item.price, 0), [cart]);
	const shipping = 0;
	const grandTotal = useMemo(() => subtotal + shipping, [subtotal]);

	useEffect(() => {
		const initialItems = Array.isArray(location.state?.items) && location.state.items.length
			? location.state.items
			: getCart();
		setCart(initialItems.map((item) => ({ ...item })));

		const handleCartUpdated = () => setCart(getCart());
		window.addEventListener("cartUpdated", handleCartUpdated);
		return () => window.removeEventListener("cartUpdated", handleCartUpdated);
	}, [location.state]);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			toast.error("Please sign in to continue.");
			navigate("/login");
			setInitializing(false);
			return;
		}

		let isMounted = true;
		const fetchUser = async () => {
			try {
				const response = await axios.get("http://localhost:5000/api/users/", {
					headers: { Authorization: `Bearer ${token}` }
				});

				if (!isMounted) {
					return;
				}

				const data = response.data || {};
				setUser(data);

				const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ").trim();
				setName(fullName);

				if (data.phone && data.phone !== "NOT GIVEN") {
					setPhone(data.phone);
				}
			} catch (error) {
				if (!isMounted) {
					return;
				}

				console.error("Failed to load profile", error);
				toast.error("Session expired. Please sign in again.");
				localStorage.removeItem("token");
				navigate("/login");
			} finally {
				if (isMounted) {
					setInitializing(false);
				}
			}
		};

		fetchUser();
		return () => {
			isMounted = false;
		};
	}, [navigate]);

	const handleCardNumberChange = (value) => {
		const digitsOnly = value.replace(/\D/g, "").slice(0, 16);
		const formatted = digitsOnly.replace(/(\d{4})(?=\d)/g, "$1 ");
		setCardNumber(formatted.trim());
	};

	const handleExpiryChange = (value) => {
		const digitsOnly = value.replace(/\D/g, "").slice(0, 4);
		if (digitsOnly.length <= 2) {
			setExpiry(digitsOnly);
			return;
		}
		const formatted = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}`;
		setExpiry(formatted);
	};

	const handleCvvChange = (value) => {
		const digitsOnly = value.replace(/\D/g, "").slice(0, 4);
		setCvv(digitsOnly);
	};

	const handleDeleteClick = (item) => {
		setItemPendingRemoval(item);
		setShowDeleteModal(true);
	};

	const cancelDeletion = () => {
		setShowDeleteModal(false);
		setItemPendingRemoval(null);
	};

	const confirmDeletion = () => {
		if (itemPendingRemoval) {
			addToCart(itemPendingRemoval, -itemPendingRemoval.quantity);
			setCart(getCart());
		}
		cancelDeletion();
	};

	const adjustQuantity = (item, delta) => {
		addToCart(item, delta);
		setCart(getCart());
	};

	const validateForm = () => {
		if (!user?.email) {
			toast.error("Unable to load your account. Please sign in again.");
			return false;
		}
		if (!name.trim()) {
			toast.error("Please enter your full name.");
			return false;
		}
		if (!address.trim()) {
			toast.error("Address line 1 is required.");
			return false;
		}
		if (!city.trim()) {
			toast.error("City is required.");
			return false;
		}
		if (!province.trim()) {
			toast.error("Select your province.");
			return false;
		}
		if (!zip.trim()) {
			toast.error("Postal code is required.");
			return false;
		}
		if (!country.trim()) {
			toast.error("Country is required.");
			return false;
		}
		if (!phone.trim()) {
			toast.error("Phone number is required.");
			return false;
		}
		if (!paymentMethod) {
			toast.error("Select a payment method.");
			return false;
		}

		if (paymentMethod === "Card Payment") {
			const digits = cardNumber.replace(/\s/g, "");
			if (digits.length !== 16) {
				toast.error("Enter a valid 16-digit card number.");
				return false;
			}
			if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) {
				toast.error("Enter a valid expiry in MM/YY format.");
				return false;
			}
			const [mm] = expiry.split("/");
			const month = parseInt(mm, 10);
			if (Number.isNaN(month) || month < 1 || month > 12) {
				toast.error("Expiry month must be between 01 and 12.");
				return false;
			}
			if (!cvv || cvv.length < 3) {
				toast.error("Enter a valid CVV.");
				return false;
			}
			if (!cardHolderName.trim()) {
				toast.error("Enter the card holder name.");
				return false;
			}
		}

		if (!cart.length) {
			toast.error("Your cart is empty.");
			return false;
		}

		return true;
	};

	const simulateCardProcessing = () => new Promise((resolve) => setTimeout(resolve, 1500));

	const placeOrder = async () => {
		if (!validateForm()) {
			return;
		}

		const token = localStorage.getItem("token");
		if (!token) {
			toast.error("Please sign in to place an order.");
			navigate("/login");
			return;
		}

		setProcessing(true);

		try {
			if (paymentMethod === "Card Payment") {
				await simulateCardProcessing();
			}

			const payload = {
				email: user.email.toLowerCase(),
				name: name.trim(),
				address: address.trim(),
				address2: address2.trim(),
				city: city.trim(),
				state: province.trim(),
				zip: zip.trim(),
				country: country.trim(),
				phone: phone.trim(),
				paymentMethod,
				cardNumber: cardNumber.replace(/\s/g, ""),
				expiry: expiry.trim(),
				cvv: cvv.trim(),
				cardHolderName: cardHolderName.trim(),
				items: cart.map((item) => ({
					productId: item.productId,
					name: item.name,
					image: item.image,
					price: item.price,
					qty: item.quantity,
					size: item.size || null
				})),
				total: Number(grandTotal),
				notes: orderNotes.trim() || "No additional notes"
			};

			await axios.post("http://localhost:5000/api/orders", payload, {
				headers: { Authorization: `Bearer ${token}` }
			});

			toast.success("Order placed successfully.");
			localStorage.setItem("cart", "[]");
			setCart([]);
			navigate("/orders");
		} catch (error) {
			const message = error.response?.data?.message || "Failed to place order.";
			toast.error(message);
		} finally {
			setProcessing(false);
		}
	};

	if (initializing) {
		return (
			<div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-base)" }}>
				<div className="flex flex-col items-center gap-4">
					<div className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: "var(--highlight)" }} />
					<p style={{ color: "var(--text-muted)" }}>Preparing your checkout...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen py-10" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
			{showDeleteModal && (
				<div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(0, 0, 0, 0.55)", backdropFilter: "blur(2px)" }}>
					<div className="max-w-sm w-full mx-4 rounded-xl p-6 space-y-4" style={{ background: "var(--surface)", color: "var(--text-primary)" }}>
						<div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto" style={{ background: "var(--surface-soft)" }}>
							<TbTrash size={24} style={{ color: "var(--accent-2)" }} />
						</div>
						<div className="text-center space-y-2">
							<h3 className="text-lg font-semibold">Remove item?</h3>
							<p className="text-sm" style={{ color: "var(--text-muted)" }}>
								{`Are you sure you want to remove ${itemPendingRemoval?.name ?? "this product"} from your cart?`}
							</p>
						</div>
						<div className="flex gap-3">
							<button
								onClick={cancelDeletion}
								className="flex-1 h-11 rounded-lg border"
								style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--text-primary)" }}
							>
								Keep item
							</button>
							<button
								onClick={confirmDeletion}
								className="flex-1 h-11 rounded-lg text-white"
								style={{ background: "#dc2626" }}
							>
								Remove
							</button>
						</div>
					</div>
				</div>
			)}

			<div className="max-w-6xl mx-auto px-4">
				<div className="flex flex-col gap-2 mb-8 text-center lg:text-left">
					<p className="text-sm uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Secure Checkout</p>
					<h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Checkout</h1>
					<p className="text-sm" style={{ color: "var(--text-muted)" }}>
						Review your details, choose a payment option, and place your order confidently.
					</p>
				</div>

				{cart.length === 0 ? (
					<div className="rounded-xl p-10 text-center space-y-6 shadow-md" style={{ background: "var(--surface)" }}>
						<div className="text-6xl">🛍️</div>
						<div className="space-y-2">
							<h2 className="text-2xl font-semibold">Your cart is empty</h2>
							<p style={{ color: "var(--text-muted)" }}>Add a few products and we will meet you back here.</p>
						</div>
						<button
							onClick={() => navigate("/products")}
							className="px-6 py-3 rounded-lg font-semibold text-white"
							style={{ background: "var(--highlight)" }}
						>
							Browse products
						</button>
					</div>
				) : (
					<div className="lg:grid lg:grid-cols-12 lg:gap-6 space-y-6 lg:space-y-0">
						<div className="lg:col-span-8 space-y-6">
							<section className="rounded-xl shadow-md p-6 space-y-4" style={{ background: "var(--surface)" }}>
								<div className="flex items-center justify-between">
									<h2 className="text-xl font-semibold">Contact Information</h2>
									<span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: "var(--surface-soft)", color: "var(--text-muted)" }}>Step 1 of 3</span>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<label className="flex flex-col text-left text-sm" style={{ color: "var(--text-muted)" }}>
										Full name
										<input
											className="mt-1 w-full h-11 rounded-lg px-3 border"
											style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--text-primary)" }}
											type="text"
											value={name}
											onChange={(e) => setName(e.target.value)}
											placeholder="Jane Doe"
										/>
									</label>
									<label className="flex flex-col text-left text-sm" style={{ color: "var(--text-muted)" }}>
										Email address
										<input
											className="mt-1 w-full h-11 rounded-lg px-3 border"
											style={{ borderColor: "var(--border)", background: "var(--surface-soft)", color: "var(--text-primary)" }}
											type="email"
											value={user?.email || ""}
											readOnly
											placeholder="you@example.com"
										/>
									</label>
									<label className="flex flex-col text-left text-sm md:col-span-2" style={{ color: "var(--text-muted)" }}>
										Phone number
										<input
											className="mt-1 w-full h-11 rounded-lg px-3 border"
											style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--text-primary)" }}
											type="tel"
											inputMode="tel"
											value={phone}
											onChange={(e) => setPhone(e.target.value)}
											placeholder="07X XXX XXXX"
										/>
									</label>
								</div>
							</section>

							<section className="rounded-xl shadow-md p-6 space-y-4" style={{ background: "var(--surface)" }}>
								<div className="flex items-center justify-between">
									<h2 className="text-xl font-semibold">Shipping Address</h2>
									<span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: "var(--surface-soft)", color: "var(--text-muted)" }}>Step 2 of 3</span>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<label className="flex flex-col text-left text-sm" style={{ color: "var(--text-muted)" }}>
										Address line 1
										<input
											className="mt-1 w-full h-11 rounded-lg px-3 border"
											style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--text-primary)" }}
											type="text"
											value={address}
											onChange={(e) => setAddress(e.target.value)}
											placeholder="Apartment, street"
										/>
									</label>
									<label className="flex flex-col text-left text-sm" style={{ color: "var(--text-muted)" }}>
										Address line 2 (optional)
										<input
											className="mt-1 w-full h-11 rounded-lg px-3 border"
											style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--text-primary)" }}
											type="text"
											value={address2}
											onChange={(e) => setAddress2(e.target.value)}
											placeholder="Building, floor, landmark"
										/>
									</label>
									<label className="flex flex-col text-left text-sm" style={{ color: "var(--text-muted)" }}>
										City
										<input
											className="mt-1 w-full h-11 rounded-lg px-3 border"
											style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--text-primary)" }}
											type="text"
											value={city}
											onChange={(e) => setCity(e.target.value)}
											placeholder="Colombo"
										/>
									</label>
									<label className="flex flex-col text-left text-sm" style={{ color: "var(--text-muted)" }}>
										Province
										<select
											className="mt-1 w-full h-11 rounded-lg px-3 border"
											style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--text-primary)" }}
											value={province}
											onChange={(e) => setProvince(e.target.value)}
										>
											<option value="">Select Province</option>
											{PROVINCES.map((option) => (
												<option key={option} value={option}>{option}</option>
											))}
										</select>
									</label>
									<label className="flex flex-col text-left text-sm" style={{ color: "var(--text-muted)" }}>
										Postal code
										<input
											className="mt-1 w-full h-11 rounded-lg px-3 border"
											style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--text-primary)" }}
											type="text"
											value={zip}
											onChange={(e) => setZip(e.target.value)}
											placeholder="10350"
										/>
									</label>
									<label className="flex flex-col text-left text-sm" style={{ color: "var(--text-muted)" }}>
										Country/Region
										<input
											className="mt-1 w-full h-11 rounded-lg px-3 border"
											style={{ borderColor: "var(--border)", background: "var(--surface-soft)", color: "var(--text-primary)" }}
											type="text"
											value={country}
											onChange={(e) => setCountry(e.target.value)}
											placeholder="Sri Lanka"
										/>
									</label>
									<p className="text-sm md:col-span-2" style={{ color: "var(--text-muted)" }}>
										Unsure about the postal code? Check a recent utility bill or search for your area online.
									</p>
								</div>
								<label className="flex flex-col text-left text-sm" style={{ color: "var(--text-muted)" }}>
									Delivery notes (optional)
									<textarea
										className="mt-1 w-full rounded-lg px-3 py-2 border resize-none"
										rows={3}
										style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--text-primary)" }}
										value={orderNotes}
										onChange={(e) => setOrderNotes(e.target.value)}
										placeholder="Add helpful instructions for the courier."
									/>
								</label>
							</section>

							<section className="rounded-xl shadow-md p-6 space-y-4" style={{ background: "var(--surface)" }}>
								<div className="flex items-center justify-between">
									<h2 className="text-xl font-semibold">Payment Method</h2>
									<span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: "var(--surface-soft)", color: "var(--text-muted)" }}>Step 3 of 3</span>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<button
										type="button"
										onClick={() => setPaymentMethod("Cash on Delivery")}
										className={`w-full border rounded-xl p-4 text-left transition-all ${paymentMethod === "Cash on Delivery" ? "shadow-md" : ""}`}
										style={{
											borderColor: paymentMethod === "Cash on Delivery" ? "var(--highlight)" : "var(--border)",
											background: paymentMethod === "Cash on Delivery" ? "var(--surface-soft)" : "var(--surface)",
											color: "var(--text-primary)"
										}}
									>
										<p className="font-semibold">Cash on Delivery</p>
										<p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Pay with cash or card when the order arrives.</p>
									</button>
									<button
										type="button"
										onClick={() => setPaymentMethod("Card Payment")}
										className={`w-full border rounded-xl p-4 text-left transition-all ${paymentMethod === "Card Payment" ? "shadow-md" : ""}`}
										style={{
											borderColor: paymentMethod === "Card Payment" ? "var(--highlight)" : "var(--border)",
											background: paymentMethod === "Card Payment" ? "var(--surface-soft)" : "var(--surface)",
											color: "var(--text-primary)"
										}}
									>
										<p className="font-semibold">Card Payment</p>
										<p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>We support Visa, Mastercard, and AMEX.</p>
									</button>
								</div>

								{paymentMethod === "Card Payment" && (
									<div className="space-y-4 mt-2">
										<h3 className="text-lg font-semibold">Card Details</h3>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<label className="flex flex-col text-left text-sm" style={{ color: "var(--text-muted)" }}>
												Card holder name
												<input
													className="mt-1 w-full h-11 rounded-lg px-3 border"
													style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--text-primary)" }}
													type="text"
													value={cardHolderName}
													onChange={(e) => setCardHolderName(e.target.value)}
													placeholder="As printed on the card"
												/>
											</label>
											<label className="flex flex-col text-left text-sm" style={{ color: "var(--text-muted)" }}>
												Card number
												<input
													className="mt-1 w-full h-11 rounded-lg px-3 border tracking-widest"
													style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--text-primary)" }}
													type="text"
													inputMode="numeric"
													value={cardNumber}
													onChange={(e) => handleCardNumberChange(e.target.value)}
													placeholder="1234 5678 9012 3456"
												/>
											</label>
											<label className="flex flex-col text-left text-sm" style={{ color: "var(--text-muted)" }}>
												Expiry date
												<input
													className="mt-1 w-full h-11 rounded-lg px-3 border"
													style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--text-primary)" }}
													type="text"
													inputMode="numeric"
													value={expiry}
													onChange={(e) => handleExpiryChange(e.target.value)}
													placeholder="MM/YY"
													maxLength={5}
												/>
											</label>
											<label className="flex flex-col text-left text-sm" style={{ color: "var(--text-muted)" }}>
												CVV
												<input
													className="mt-1 w-full h-11 rounded-lg px-3 border"
													style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--text-primary)" }}
													type="password"
													inputMode="numeric"
													value={cvv}
													onChange={(e) => handleCvvChange(e.target.value)}
													placeholder="123"
													maxLength={4}
												/>
											</label>
										</div>
									</div>
								)}
							</section>
						</div>

						<aside className="lg:col-span-4 space-y-6">
							<section className="rounded-xl shadow-md p-6 space-y-4" style={{ background: "var(--surface)" }}>
								<div className="flex items-center justify-between">
									<h2 className="text-lg font-semibold">Order Summary</h2>
									<span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: "var(--surface-soft)", color: "var(--text-muted)" }}>Review</span>
								</div>
								<div className="max-h-64 overflow-y-auto divide-y" style={{ borderColor: "var(--border)" }}>
									{cart.map((item) => {
										const key = `${item.productId}-${item.size ?? "default"}`;
										return (
											<div key={key} className="py-4 flex gap-3">
												<div className="w-16 h-16 rounded-lg overflow-hidden border" style={{ borderColor: "var(--border)" }}>
													<img src={item.image} alt={item.name} className="w-full h-full object-cover" />
												</div>
												<div className="flex-1 min-w-0">
													<div className="flex items-start justify-between gap-2">
														<div className="min-w-0">
															<p className="font-semibold truncate">{item.name}</p>
															<p className="text-xs" style={{ color: "var(--text-muted)" }}>
																LKR {item.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
																{item.size ? ` · Size UK ${item.size}` : ""}
															</p>
														</div>
														<button
															onClick={() => handleDeleteClick(item)}
															className="text-red-500 hover:text-red-600 transition-colors"
															aria-label={`Remove ${item.name}`}
														>
															<TbTrash size={16} />
														</button>
													</div>
													<div className="flex items-center justify-between mt-3">
														<div className="flex items-center gap-2">
															<button
																disabled={item.quantity <= 1}
																onClick={() => adjustQuantity(item, -1)}
																className="w-7 h-7 rounded-full flex items-center justify-center text-sm disabled:opacity-40 disabled:cursor-not-allowed"
																style={{ background: "var(--surface-soft)", color: "var(--text-primary)" }}
															>
																−
															</button>
															<span className="text-sm font-medium">{item.quantity}</span>
															<button
																onClick={() => adjustQuantity(item, 1)}
																className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
																style={{ background: "var(--surface-soft)", color: "var(--text-primary)" }}
															>
																+
															</button>
														</div>
														<p className="text-sm font-semibold">
															LKR {(item.quantity * item.price).toLocaleString("en-US", { minimumFractionDigits: 2 })}
														</p>
													</div>
												</div>
											</div>
										);
									})}
								</div>

								<div className="space-y-2 text-sm">
									<div className="flex justify-between">
										<span style={{ color: "var(--text-muted)" }}>Subtotal</span>
										<span>LKR {subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
									</div>
									<div className="flex justify-between">
										<span style={{ color: "var(--text-muted)" }}>Shipping</span>
										<span style={{ color: "var(--text-primary)" }}>{shipping === 0 ? "Free" : `LKR ${shipping.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}</span>
									</div>
									<div className="flex justify-between items-center pt-2" style={{ borderTop: "1px solid var(--border)" }}>
										<span className="font-semibold">Order total</span>
										<span className="text-lg font-semibold">LKR {grandTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
									</div>
								</div>

								<button
									onClick={placeOrder}
									disabled={!cart.length || processing}
									className="w-full mt-4 px-4 py-3 rounded-lg font-semibold transition-colors text-white disabled:opacity-70 disabled:cursor-not-allowed"
									style={{ background: "var(--highlight)" }}
								>
									{processing ? "Processing order..." : "Place Secure Order"}
								</button>
								<button
									onClick={() => navigate("/products")}
									className="w-full mt-2 px-4 py-3 rounded-lg font-semibold border transition-colors"
									style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--text-primary)" }}
								>
									Continue Shopping
								</button>
							</section>

							<section className="rounded-xl border p-4 flex items-center gap-3" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
								<div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "var(--surface-soft)" }}>
									<TbShieldCheck size={20} style={{ color: "var(--highlight)" }} />
								</div>
								<p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
									Your payment information is encrypted and processed securely. We do not store sensitive card details.
								</p>
							</section>
						</aside>
					</div>
				)}
			</div>
		</div>
	);
}
