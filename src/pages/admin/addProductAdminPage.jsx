import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import uploadFile from "../../utils/mediaUpload";
import { BiChevronLeft, BiUpload, BiX } from "react-icons/bi";

export default function AddProductPage() {
	const [productId, setProductId] = useState("");
	const [sku, setSku] = useState("");
	const [productName, setProductName] = useState("");
	const [brand, setBrand] = useState("");
	const [alternativeNames, setAlternativeNames] = useState("");
	const [labelledPrice, setLabelledPrice] = useState("");
	const [price, setPrice] = useState("");
	const [currency, setCurrency] = useState("LKR");
	const [images, setImages] = useState([]);
	const [description, setDescription] = useState("");
	const [stock, setStock] = useState("");
	const [isAvailable, setIsAvailable] = useState(true);
	const [category, setCategory] = useState("men");
	const categoryOptions = [
		{ value: "men", label: "Men" },
		{ value: "women", label: "Women" },
		{ value: "kids", label: "Kids" },
	];
	const [color, setColor] = useState("");
	const [material, setMaterial] = useState("");
	const [sizes, setSizes] = useState("");
	const [tags, setTags] = useState("");
	const [isSpotlight, setIsSpotlight] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errors, setErrors] = useState({});
	const navigate = useNavigate();

	const validateForm = () => {
		const newErrors = {};

		if (!productId.trim()) newErrors.productId = "Product ID is required";
		if (!sku.trim()) newErrors.sku = "SKU is required";
		if (!productName.trim()) newErrors.productName = "Product name is required";
		if (!brand.trim()) newErrors.brand = "Brand is required";
		if (!price) newErrors.price = "Price is required";
		else if (isNaN(price) || Number(price) < 0) newErrors.price = "Price must be a positive number";
		if (!labelledPrice) newErrors.labelledPrice = "Labelled price is required";
		else if (isNaN(labelledPrice) || Number(labelledPrice) < 0) newErrors.labelledPrice = "Labelled price must be a positive number";
		if (!currency.trim()) newErrors.currency = "Currency is required";
		if (!stock) newErrors.stock = "Stock is required";
		else if (isNaN(stock) || Number(stock) < 0) newErrors.stock = "Stock must be a positive number";
		if (!description.trim()) newErrors.description = "Description is required";
		if (!color.trim()) newErrors.color = "Color is required";
		if (!material.trim()) newErrors.material = "Material is required";
		if (!sizes.trim()) newErrors.sizes = "Sizes are required";
		if (images.length === 0) newErrors.images = "At least one image is required";
		if (!category || !categoryOptions.some((opt) => opt.value === category)) newErrors.category = "Choose a valid category";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	async function handleSubmit() {
		if (!validateForm()) {
			toast.error("Please fix the errors in the form");
			return;
		}

		setIsSubmitting(true);

		const token = localStorage.getItem("token");
		if (token == null) {
			navigate("/login");
			return;
		}

		try {
			const promisesArray = [];
			for (let i = 0; i < images.length; i++) {
				const promise = uploadFile(images[i]);
				promisesArray[i] = promise;
			}

			const responses = await Promise.all(promisesArray);
			console.log(responses);

			const altNamesInArray = alternativeNames.split(",").map(name => name.trim()).filter(name => name);
			const sizesInArray = sizes.split(",").map(size => Number(size.trim())).filter(size => !isNaN(size));
			const tagsInArray = tags.split(",").map(tag => tag.trim()).filter(tag => tag);

			const productData = {
				productId: productId.trim(),
				sku: sku.trim(),
				name: productName.trim(),
				brand: brand.trim(),
				altNames: altNamesInArray,
				labelledPrice: Number(labelledPrice),
				price: Number(price),
				currency: currency.trim(),
				images: responses,
				description: description.trim(),
				stock: Number(stock),
				isAvailable: isAvailable,
				category: category.trim().toLowerCase(),
				color: color.trim(),
				material: material.trim(),
				sizes: sizesInArray,
				tags: tagsInArray,
				isSpotlight: isSpotlight
			};

			await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/products", productData, {
				headers: {
					Authorization: "Bearer " + token
				}
			});

			console.log("Product added successfully");
			toast.success("Product added successfully");
			navigate("/admin/products");
		} catch (error) {
			console.error("Error adding product:", error);

			if (error.response) {
				if (error.response.status === 403) {
					toast.error(error.response.data?.message || "Access denied.");
				} else if (error.response.status === 400) {
					toast.error(error.response.data?.message || "Invalid product data. Please check all fields.");
				} else if (error.response.status === 401) {
					toast.error("Unauthorized. Please log in again.");
					localStorage.removeItem("token");
					navigate("/login");
				} else {
					toast.error(`Failed to add product: ${error.response.data?.message || 'Unknown error'}`);
				}
			} else {
				toast.error("Network error. Please check your connection and try again.");
			}
		} finally {
			setIsSubmitting(false);
		}
	}

	const handleImageChange = (e) => {
		const files = Array.from(e.target.files);
		setImages(files);
		if (files.length > 0) {
			setErrors(prev => ({ ...prev, images: undefined }));
		}
	};

	const removeImage = (index) => {
		setImages(images.filter((_, i) => i !== index));
	};

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-4">
					<Link
						to="/admin/products"
						className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
					>
						<BiChevronLeft className="w-5 h-5 mr-2" />
						Back to Products
					</Link>
				</div>
				<h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
			</div>

			{/* Form */}
			<div className="bg-white rounded-lg shadow-sm border p-6">
				<form className="space-y-6">
					{/* Basic Information */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Product ID *
								</label>
								<input
									type="text"
									value={productId}
									onChange={(e) => {
										setProductId(e.target.value);
										if (errors.productId) setErrors(prev => ({ ...prev, productId: undefined }));
									}}
									className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
										errors.productId ? 'border-red-500' : 'border-gray-300'
									}`}
									placeholder="Enter product ID"
								/>
								{errors.productId && <p className="mt-1 text-sm text-red-600">{errors.productId}</p>}
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									SKU *
								</label>
								<input
									type="text"
									value={sku}
									onChange={(e) => {
										setSku(e.target.value);
										if (errors.sku) setErrors(prev => ({ ...prev, sku: undefined }));
									}}
									className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
										errors.sku ? 'border-red-500' : 'border-gray-300'
									}`}
									placeholder="Enter SKU"
								/>
								{errors.sku && <p className="mt-1 text-sm text-red-600">{errors.sku}</p>}
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Product Name *
								</label>
								<input
									type="text"
									value={productName}
									onChange={(e) => {
										setProductName(e.target.value);
										if (errors.productName) setErrors(prev => ({ ...prev, productName: undefined }));
									}}
									className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
										errors.productName ? 'border-red-500' : 'border-gray-300'
									}`}
									placeholder="Enter product name"
								/>
								{errors.productName && <p className="mt-1 text-sm text-red-600">{errors.productName}</p>}
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Brand *
								</label>
								<input
									type="text"
									value={brand}
									onChange={(e) => {
										setBrand(e.target.value);
										if (errors.brand) setErrors(prev => ({ ...prev, brand: undefined }));
									}}
									className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
										errors.brand ? 'border-red-500' : 'border-gray-300'
									}`}
									placeholder="Enter brand"
								/>
								{errors.brand && <p className="mt-1 text-sm text-red-600">{errors.brand}</p>}
							</div>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Alternative Names
							</label>
							<input
								type="text"
								value={alternativeNames}
								onChange={(e) => setAlternativeNames(e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Enter alternative names separated by commas"
							/>
						</div>
					</div>

					{/* Pricing */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Pricing</h3>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Labelled Price *
								</label>
								<input
									type="number"
									value={labelledPrice}
									onChange={(e) => {
										setLabelledPrice(e.target.value);
										if (errors.labelledPrice) setErrors(prev => ({ ...prev, labelledPrice: undefined }));
									}}
									className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
										errors.labelledPrice ? 'border-red-500' : 'border-gray-300'
									}`}
									placeholder="0.00"
									min="0"
									step="0.01"
								/>
								{errors.labelledPrice && <p className="mt-1 text-sm text-red-600">{errors.labelledPrice}</p>}
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Selling Price *
								</label>
								<input
									type="number"
									value={price}
									onChange={(e) => {
										setPrice(e.target.value);
										if (errors.price) setErrors(prev => ({ ...prev, price: undefined }));
									}}
									className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
										errors.price ? 'border-red-500' : 'border-gray-300'
									}`}
									placeholder="0.00"
									min="0"
									step="0.01"
								/>
								{errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Currency *
								</label>
								<input
									type="text"
									value={currency}
									onChange={(e) => {
										setCurrency(e.target.value);
										if (errors.currency) setErrors(prev => ({ ...prev, currency: undefined }));
									}}
									className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
										errors.currency ? 'border-red-500' : 'border-gray-300'
									}`}
									placeholder="LKR"
								/>
								{errors.currency && <p className="mt-1 text-sm text-red-600">{errors.currency}</p>}
							</div>
						</div>
					</div>

					{/* Images */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Images *</h3>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Upload Product Images
							</label>
							<div className="flex items-center justify-center w-full">
								<label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
									errors.images ? 'border-red-300 bg-red-50' : 'border-gray-300'
								}`}>
									<div className="flex flex-col items-center justify-center pt-5 pb-6">
										<BiUpload className="w-8 h-8 mb-2 text-gray-500" />
										<p className="mb-2 text-sm text-gray-500">
											<span className="font-semibold">Click to upload</span> or drag and drop
										</p>
										<p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
									</div>
									<input
										type="file"
										multiple
										accept="image/*"
										onChange={handleImageChange}
										className="hidden"
									/>
								</label>
							</div>
							{errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}
						</div>

						{/* Image Preview */}
						{images.length > 0 && (
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								{images.map((image, index) => (
									<div key={index} className="relative group">
										<img
											src={URL.createObjectURL(image)}
											alt={`Preview ${index + 1}`}
											className="w-full h-24 object-cover rounded-lg border"
										/>
										<button
											type="button"
											onClick={() => removeImage(index)}
											className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
										>
											<BiX className="w-4 h-4" />
										</button>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Details */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Product Details</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Stock Quantity *
								</label>
								<input
									type="number"
									value={stock}
									onChange={(e) => {
										setStock(e.target.value);
										if (errors.stock) setErrors(prev => ({ ...prev, stock: undefined }));
									}}
									className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
										errors.stock ? 'border-red-500' : 'border-gray-300'
									}`}
									placeholder="0"
									min="0"
								/>
								{errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Category *
								</label>
								<select
									value={category}
									onChange={(e) => {
										setCategory(e.target.value);
										if (errors.category) setErrors(prev => ({ ...prev, category: undefined }));
									}}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								>
									{categoryOptions.map((opt) => (
										<option key={opt.value} value={opt.value}>
											{opt.label}
										</option>
									))}
								</select>
								{errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Color *
								</label>
								<input
									type="text"
									value={color}
									onChange={(e) => {
										setColor(e.target.value);
										if (errors.color) setErrors(prev => ({ ...prev, color: undefined }));
									}}
									className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
										errors.color ? 'border-red-500' : 'border-gray-300'
									}`}
									placeholder="Enter color"
								/>
								{errors.color && <p className="mt-1 text-sm text-red-600">{errors.color}</p>}
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Material *
								</label>
								<input
									type="text"
									value={material}
									onChange={(e) => {
										setMaterial(e.target.value);
										if (errors.material) setErrors(prev => ({ ...prev, material: undefined }));
									}}
									className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
										errors.material ? 'border-red-500' : 'border-gray-300'
									}`}
									placeholder="Enter material"
								/>
								{errors.material && <p className="mt-1 text-sm text-red-600">{errors.material}</p>}
							</div>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Sizes *
							</label>
							<input
								type="text"
								value={sizes}
								onChange={(e) => {
									setSizes(e.target.value);
									if (errors.sizes) setErrors(prev => ({ ...prev, sizes: undefined }));
								}}
								className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
									errors.sizes ? 'border-red-500' : 'border-gray-300'
								}`}
								placeholder="Enter sizes separated by commas (e.g., 7,8,9,10)"
							/>
							{errors.sizes && <p className="mt-1 text-sm text-red-600">{errors.sizes}</p>}
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Tags
							</label>
							<input
								type="text"
								value={tags}
								onChange={(e) => setTags(e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Enter tags separated by commas"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Availability
							</label>
							<div className="flex items-center space-x-4">
								<label className="flex items-center">
									<input
										type="radio"
										name="availability"
										checked={isAvailable}
										onChange={() => setIsAvailable(true)}
										className="text-blue-600 focus:ring-blue-500"
									/>
									<span className="ml-2 text-sm text-gray-700">Available</span>
								</label>
								<label className="flex items-center">
									<input
										type="radio"
										name="availability"
										checked={!isAvailable}
										onChange={() => setIsAvailable(false)}
										className="text-blue-600 focus:ring-blue-500"
									/>
									<span className="ml-2 text-sm text-gray-700">Unavailable</span>
								</label>
							</div>
						</div>
						<div>
							<label className="flex items-center">
								<input
									type="checkbox"
									checked={isSpotlight}
									onChange={(e) => setIsSpotlight(e.target.checked)}
									className="text-blue-600 focus:ring-blue-500 rounded"
								/>
								<span className="ml-2 text-sm text-gray-700">Feature in This Week&#39;s Spotlight</span>
							</label>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Description *
							</label>
							<textarea
								value={description}
								onChange={(e) => {
									setDescription(e.target.value);
									if (errors.description) setErrors(prev => ({ ...prev, description: undefined }));
								}}
								rows={4}
								className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
									errors.description ? 'border-red-500' : 'border-gray-300'
								}`}
								placeholder="Enter product description"
							/>
							{errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
						</div>
					</div>

					{/* Actions */}
					<div className="flex justify-end space-x-4 pt-6 border-t">
						<Link
							to="/admin/products"
							className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
						>
							Cancel
						</Link>
						<button
							type="button"
							onClick={handleSubmit}
							disabled={isSubmitting}
							className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
						>
							{isSubmitting ? "Adding Product..." : "Add Product"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}