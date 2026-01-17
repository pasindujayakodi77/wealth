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
	const [showReviewModal, setShowReviewModal] = useState(false);
	const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
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

	const handleSubmitReview = async () => {
		const token = localStorage.getItem("token");
		if (!token) {
			toast.error('Please log in to submit a review');
			return;
		}

		try {
			await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/reviews', {
				productId: product.productId,
				rating: reviewData.rating,
				comment: reviewData.comment
			}, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			toast.success('Review submitted successfully!');
			setShowReviewModal(false);
			setReviewData({ rating: 5, comment: '' });
		} catch (error) {
			if (error.response?.status === 403 && error.response?.data?.message === 'Email verification required to submit reviews') {
				toast.error('Please verify your email to submit reviews');
			} else if (error.response?.status === 401) {
				toast.error('Please log in to submit a review');
			} else {
				toast.error('Failed to submit review');
			}
		}
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
											<p>No reviews</p>
											<p>Have your say. Be the first to review the {product.name}</p>
											{localStorage.getItem("token") ? (
												<button
													onClick={() => setShowReviewModal(true)}
													className="mt-4 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
													style={{
														backgroundColor: "var(--text-primary)",
														color: "var(--bg-base)"
													}}
													onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
													onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
												>
													<span className="flex items-center gap-2">
														<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
														</svg>
														Write a Review
													</span>
												</button>
											) : (
												<p className="mt-4 text-sm" style={{ color: "var(--text-secondary)" }}>
													Please <a href="/login" className="underline hover:opacity-80" style={{ color: "var(--text-primary)" }}>log in</a> to write a review
												</p>
											)}
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

			{/* Review Modal */}
			{showReviewModal && (
				<div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{ backgroundColor: "var(--bg-base)", color: "var(--text-primary)" }}>
						{/* Header */}
						<div className="p-6 border-b" style={{ borderColor: "var(--border)" }}>
							<div className="flex items-center justify-between">
								<h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Share Your Review</h2>
								<button
									onClick={() => setShowReviewModal(false)}
									className="p-2 hover:bg-gray-100 rounded-full transition-colors"
									style={{ backgroundColor: "var(--overlay-bg)" }}
								>
									<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							</div>
							<p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
								Help others by sharing your experience with this product
							</p>
						</div>

						{/* Form */}
						<div className="p-6 space-y-6">
							{/* Rating Section */}
							<div>
								<label className="block text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
									How would you rate this product?
								</label>
								<div className="flex gap-2 justify-center">
									{[1, 2, 3, 4, 5].map((star) => (
										<button
											key={star}
											onClick={() => setReviewData({ ...reviewData, rating: star })}
											className={`p-3 rounded-xl transition-all duration-200 ${
												star <= reviewData.rating
													? 'bg-yellow-100 text-yellow-500 scale-110'
													: 'bg-gray-100 text-gray-300 hover:bg-gray-200'
											}`}
											style={{
												backgroundColor: star <= reviewData.rating ? '#fef3c7' : 'var(--overlay-bg)',
												color: star <= reviewData.rating ? '#f59e0b' : 'var(--text-secondary)'
											}}
										>
											<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
												<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
											</svg>
										</button>
									))}
								</div>
								<p className="text-center text-sm mt-3" style={{ color: "var(--text-secondary)" }}>
									{reviewData.rating} star{reviewData.rating !== 1 ? 's' : ''} selected
								</p>
							</div>

							{/* Comment Section */}
							<div>
								<label className="block text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
									Write your review
								</label>
								<textarea
									value={reviewData.comment}
									onChange={(e) => {
										if (e.target.value.length <= 500) {
											setReviewData({ ...reviewData, comment: e.target.value });
										}
									}}
									className="w-full p-4 border-2 rounded-xl resize-none focus:outline-none focus:ring-2 transition-all duration-200"
									rows="5"
									placeholder="Tell others about your experience... What did you like or dislike about this product?"
									style={{
										borderColor: "var(--border)",
										backgroundColor: "var(--bg-base)",
										color: "var(--text-primary)",
										boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
									}}
									onFocus={(e) => e.target.style.borderColor = "var(--text-primary)"}
									onBlur={(e) => e.target.style.borderColor = "var(--border)"}
								></textarea>
								<p className={`text-sm mt-2 ${reviewData.comment.length > 450 ? 'text-red-500' : 'text-gray-500'}`} style={{ color: reviewData.comment.length > 450 ? '#ef4444' : 'var(--text-secondary)' }}>
									{reviewData.comment.length}/500 characters
								</p>
							</div>
						</div>

						{/* Footer */}
						<div className="p-6 border-t flex gap-4" style={{ borderColor: "var(--border)" }}>
							<button
								onClick={() => setShowReviewModal(false)}
								className="flex-1 py-3 px-6 border-2 rounded-xl font-semibold transition-all duration-200 hover:opacity-80"
								style={{
									borderColor: "var(--border)",
									backgroundColor: "var(--bg-base)",
									color: "var(--text-primary)"
								}}
							>
								Cancel
							</button>
							<button
								onClick={handleSubmitReview}
								disabled={!reviewData.comment.trim()}
								className="flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
								style={{
									backgroundColor: "var(--text-primary)",
									color: "var(--bg-base)"
								}}
								onMouseEnter={(e) => !reviewData.comment.trim() || (e.target.style.transform = "translateY(-1px)")}
								onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
							>
								Submit Review
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
                    
                