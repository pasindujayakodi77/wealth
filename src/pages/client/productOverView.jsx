import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Heart, ChevronDown, ChevronUp } from "lucide-react";
import Loader from "../../components/loader";
import ImageSlider from "../../components/imageSlider";
import { addToCart } from "../../utils/cart";
import toast from "react-hot-toast";

export default function ProductOverViewPage() {
	const params = useParams();
	const [product, setProduct] = useState(null);
	const navigate = useNavigate();
	const [status, setStatus] = useState("loading");
	const [selectedSize, setSelectedSize] = useState(null);
	const [isFavorite, setIsFavorite] = useState(false);
	const [expandedSections, setExpandedSections] = useState({
		details: true,
		delivery: false,
		reviews: false,
		info: false
	});

	// Get sizes from product data instead of hardcoded array
	const sizes = product?.sizes || [];

	useEffect(() => {
		if (status === "loading") {
			axios
				.get(
					import.meta.env.VITE_BACKEND_URL + `/api/products/${params.productId}`
				)
				.then((res) => {
					setProduct({
						...res.data,
						altNames: Array.isArray(res.data.altNames) ? res.data.altNames : [],
						images: Array.isArray(res.data.images) && res.data.images.length > 0
							? res.data.images
							: ["https://via.placeholder.com/600x600?text=No+Image"],
					});
					setStatus("success");
				})
				.catch(() => {
					setStatus("error");
				});
		}
	}, [params.productId, status]);

	const toggleSection = (section) => {
		setExpandedSections(prev => ({
			...prev,
			[section]: !prev[section]
		}));
	};

	const handleAddToBag = () => {
		if (!selectedSize) {
			toast.error("Please select a size");
			return;
		}
		addToCart(product, 1, selectedSize);
		toast.success("Product added to bag");
	};

	return (
		<div className="w-full min-h-screen" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
			{status === "loading" && <Loader />}

			{status === "success" && product && (
				<div className="max-w-7xl mx-auto px-4 py-8">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						{/* Image Section */}
						<div className="w-full">
							<ImageSlider images={product.images} />
						</div>

						{/* Product Info Section */}
						<div className="w-full lg:pl-8">
							{/* Product Title */}
							<h1 className="text-2xl font-medium mb-2" style={{ color: "var(--text-primary)" }}>{product.name}</h1>
							{product.altNames?.length > 0 && (
								<p className="mb-4" style={{ color: "var(--text-secondary)" }}>{product.altNames.join(" | ")}</p>
							)}

							{/* Price */}
							<div className="mb-6">
								{product.labelledPrice > product.price ? (
									<div className="flex items-center gap-3">
										<span className="text-xl font-medium line-through" style={{ color: "var(--text-secondary)" }}>
											LKR {product.labelledPrice.toLocaleString("en-US", {
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
											})}
										</span>
										<span className="text-xl font-medium" style={{ color: "var(--text-primary)" }}>
											LKR {product.price.toLocaleString("en-US", {
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
											})}
										</span>
									</div>
								) : (
									<span className="text-xl font-medium" style={{ color: "var(--text-primary)" }}>
										LKR {product.price.toLocaleString("en-US", {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										})}
									</span>
								)}
								<p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Inclusive of all taxes</p>
								<p className="text-sm" style={{ color: "var(--text-secondary)" }}>(Also includes all applicable duties)</p>
							</div>

							{/* Size Selection */}
							<div className="mb-6">
								<div className="flex justify-between items-center mb-3">
									<span className="font-medium" style={{ color: "var(--text-primary)" }}>Select Size</span>
									<button className="text-sm hover:opacity-80 transition-opacity" style={{ color: "var(--text-secondary)" }}>Size Guide</button>
								</div>
								<div className="grid grid-cols-3 gap-2">
									{sizes.map((size) => (
										<button
											key={size}
											onClick={() => setSelectedSize(size)}
											className={`py-3 px-4 border rounded-lg text-sm font-medium transition-all ${
												selectedSize === size
													? "bg-black text-white border-black"
													: "border-gray-300 hover:border-black"
											}`}
											style={{
												borderColor: selectedSize === size ? "var(--text-primary)" : "var(--border)",
												backgroundColor: selectedSize === size ? "var(--text-primary)" : "var(--bg-base)",
												color: selectedSize === size ? "var(--bg-base)" : "var(--text-primary)"
											}}
										>
											UK {size}
										</button>
									))}
								</div>
							</div>

							{/* Action Buttons */}
							<div className="space-y-3 mb-8">
								<button
									onClick={handleAddToBag}
									className="w-full py-4 rounded-full font-medium transition-colors"
									style={{
										backgroundColor: "var(--text-primary)",
										color: "var(--bg-base)",
									}}
									onMouseEnter={(e) => e.target.style.opacity = "0.8"}
									onMouseLeave={(e) => e.target.style.opacity = "1"}
								>
									Add to Bag
								</button>
								<button
									onClick={() => setIsFavorite(!isFavorite)}
									className="w-full py-4 border rounded-full font-medium transition-colors flex items-center justify-center gap-2"
									style={{
										borderColor: "var(--border)",
										backgroundColor: "var(--bg-base)",
										color: "var(--text-primary)"
									}}
									onMouseEnter={(e) => e.target.style.borderColor = "var(--text-primary)"}
									onMouseLeave={(e) => e.target.style.borderColor = "var(--border)"}
								>
									Favourite
									<Heart
										className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
									/>
								</button>
							</div>

							{/* Disclaimer */}
							<p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
								This product is excluded from site promotions and discounts.
							</p>

							{/* Product Description */}
							<div className="mb-6">
								<p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{product.description}</p>
							</div>

							{/* Expandable Sections */}
							<div style={{ borderTop: "1px solid var(--border)" }}>
								{/* Product Details */}
								<div style={{ borderBottom: "1px solid var(--border)" }}>
									<button
										onClick={() => toggleSection('details')}
										className="w-full py-4 flex justify-between items-center transition-colors"
										style={{
											color: "var(--text-primary)",
											backgroundColor: "var(--bg-base)"
										}}
										onMouseEnter={(e) => e.target.style.backgroundColor = "var(--overlay-bg)"}
										onMouseLeave={(e) => e.target.style.backgroundColor = "var(--bg-base)"}
									>
										<span className="font-medium">View Product Details</span>
										{expandedSections.details ? (
											<ChevronUp className="w-5 h-5" />
										) : (
											<ChevronDown className="w-5 h-5" />
										)}
									</button>
									{expandedSections.details && (
										<div className="pb-4 px-4 text-sm space-y-2">
											<div className="flex">
												<span className="font-medium w-32" style={{ color: "var(--text-primary)" }}>Style:</span>
												<span style={{ color: "var(--text-secondary)" }}>{product.productId}</span>
											</div>
											{/* Add more product details here */}
										</div>
									)}
								</div>

								{/* Delivery & Returns */}
								<div style={{ borderBottom: "1px solid var(--border)" }}>
									<button
										onClick={() => toggleSection('delivery')}
										className="w-full py-4 flex justify-between items-center transition-colors"
										style={{
											color: "var(--text-primary)",
											backgroundColor: "var(--bg-base)"
										}}
										onMouseEnter={(e) => e.target.style.backgroundColor = "var(--overlay-bg)"}
										onMouseLeave={(e) => e.target.style.backgroundColor = "var(--bg-base)"}
									>
										<span className="font-medium">Delivery & Returns</span>
										{expandedSections.delivery ? (
											<ChevronUp className="w-5 h-5" />
										) : (
											<ChevronDown className="w-5 h-5" />
										)}
									</button>
									{expandedSections.delivery && (
										<div className="pb-4 px-4 text-sm" style={{ color: "var(--text-secondary)" }}>
											<p>Standard delivery 4-9 Business Days</p>
											<p className="mt-2">Free returns within 30 days</p>
										</div>
									)}
								</div>

								{/* Reviews */}
								<div style={{ borderBottom: "1px solid var(--border)" }}>
									<button
										onClick={() => toggleSection('reviews')}
										className="w-full py-4 flex justify-between items-center transition-colors"
										style={{
											color: "var(--text-primary)",
											backgroundColor: "var(--bg-base)"
										}}
										onMouseEnter={(e) => e.target.style.backgroundColor = "var(--overlay-bg)"}
										onMouseLeave={(e) => e.target.style.backgroundColor = "var(--bg-base)"}
									>
										<div className="flex items-center gap-2">
											<span className="font-medium">Reviews (0)</span>
											<div className="flex">
												{[1, 2, 3, 4, 5].map((star) => (
													<span key={star} className="text-gray-300">★</span>
												))}
											</div>
										</div>
										{expandedSections.reviews ? (
											<ChevronUp className="w-5 h-5" />
										) : (
											<ChevronDown className="w-5 h-5" />
										)}
									</button>
									{expandedSections.reviews && (
										<div className="pb-4 px-4 text-sm" style={{ color: "var(--text-secondary)" }}>
											<p>No reviews yet. Be the first to review this product.</p>
										</div>
									)}
								</div>

								{/* Product Information */}
								<div>
									<button
										onClick={() => toggleSection('info')}
										className="w-full py-4 flex justify-between items-center transition-colors"
										style={{
											color: "var(--text-primary)",
											backgroundColor: "var(--bg-base)"
										}}
										onMouseEnter={(e) => e.target.style.backgroundColor = "var(--overlay-bg)"}
										onMouseLeave={(e) => e.target.style.backgroundColor = "var(--bg-base)"}
									>
										<span className="font-medium">Product Information</span>
										{expandedSections.info ? (
											<ChevronUp className="w-5 h-5" />
										) : (
											<ChevronDown className="w-5 h-5" />
										)}
									</button>
									{expandedSections.info && (
										<div className="pb-4 px-4 text-sm" style={{ color: "var(--text-secondary)" }}>
											<p>Additional product information and care instructions.</p>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{status === "error" && (
				<div className="w-full flex flex-col items-center justify-center py-12 space-y-4">
					<p className="text-lg" style={{ color: "var(--text-secondary)" }}>Failed to load product.</p>
					<button
						onClick={() => navigate("/products")}
						className="px-6 py-3 rounded-full transition-colors"
						style={{
							backgroundColor: "var(--text-primary)",
							color: "var(--bg-base)"
						}}
						onMouseEnter={(e) => e.target.style.opacity = "0.8"}
						onMouseLeave={(e) => e.target.style.opacity = "1"}
					>
						Continue Shopping
					</button>
				</div>
			)}
		</div>
	);
}
                    
                