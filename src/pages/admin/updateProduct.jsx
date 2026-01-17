import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useParams, useNavigate } from "react-router-dom";
import uploadFile from "../../utils/mediaUpload";
import { BiChevronLeft, BiUpload, BiX } from "react-icons/bi";

export default function UpdateProductPage() {
    const { productId } = useParams();
    const [sku, setSku] = useState("");
    const [productName, setProductName] = useState("");
    const [brand, setBrand] = useState("");
    const [alternativeNames, setAlternativeNames] = useState("");
    const [labelledPrice, setLabelledPrice] = useState("");
    const [price, setPrice] = useState("");
    const [currency, setCurrency] = useState("LKR");
    const [images, setImages] = useState([]);
    const [keptImages, setKeptImages] = useState([]);
    const [description, setDescription] = useState("");
    const [stock, setStock] = useState("");
    const [isAvailable, setIsAvailable] = useState(true);
    const [category, setCategory] = useState("");
    const [color, setColor] = useState("");
    const [material, setMaterial] = useState("");
    const [sizes, setSizes] = useState("");
    const [tags, setTags] = useState("");
    const [isSpotlight, setIsSpotlight] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please log in to continue");
                navigate("/login");
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const res = await axios.get(
                    import.meta.env.VITE_BACKEND_URL + "/api/products/" + productId,
                    {
                        headers: {
                            Authorization: "Bearer " + token,
                        },
                    }
                );
                const product = res.data;
                setSku(product.sku || "");
                setProductName(product.name);
                setBrand(product.brand || "");
                setAlternativeNames(product.altNames ? product.altNames.join(",") : "");
                setLabelledPrice(product.labelledPrice);
                setPrice(product.price);
                setCurrency(product.currency || "LKR");
                setKeptImages(product.images || []);
                setDescription(product.description);
                setStock(product.stock);
                setIsAvailable(product.isAvailable !== undefined ? product.isAvailable : true);
                setCategory(product.category);
                setColor(product.color || "");
                setMaterial(product.material || "");
                setSizes(product.sizes ? product.sizes.join(",") : "");
                setTags(product.tags ? product.tags.join(",") : "");
                setIsSpotlight(product.isSpotlight !== undefined ? product.isSpotlight : false);
            } catch (error) {
                console.error("Error fetching product:", error);
                toast.error(error.response?.data?.message || "Failed to load product");
                navigate("/admin/products");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [productId, navigate]);

    const validateForm = () => {
        const newErrors = {};

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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    async function handleSubmit() {
        if (!validateForm()) {
            toast.error("Please fix the errors in the form");
            return;
        }

        setIsSubmitting(true);

        try {
            let imageUrls = [...keptImages];

            if (images.length > 0) {
                const promisesArray = [];
                for (let i = 0; i < images.length; i++) {
                    const promise = uploadFile(images[i]);
                    promisesArray[i] = promise;
                }
                const newImageUrls = await Promise.all(promisesArray);
                imageUrls = [...imageUrls, ...newImageUrls];
            }

            const altNamesInArray = alternativeNames.split(",").map(name => name.trim()).filter(name => name);
            const sizesInArray = sizes.split(",").map(size => Number(size.trim())).filter(size => !isNaN(size));
            const tagsInArray = tags.split(",").map(tag => tag.trim()).filter(tag => tag);

            const productData = {
                sku: sku.trim(),
                name: productName.trim(),
                brand: brand.trim(),
                altNames: altNamesInArray,
                labelledPrice: Number(labelledPrice),
                price: Number(price),
                currency: currency.trim(),
                images: imageUrls,
                description: description.trim(),
                stock: Number(stock),
                isAvailable: isAvailable,
                category: category,
                color: color.trim(),
                material: material.trim(),
                sizes: sizesInArray,
                tags: tagsInArray,
                isSpotlight: isSpotlight
            };

            const token = localStorage.getItem("token");
            if (token == null) {
                navigate("/login");
                return;
            }

            await axios.put(import.meta.env.VITE_BACKEND_URL + "/api/products/" + productId, productData, {
                headers: {
                    Authorization: "Bearer " + token
                }
            });

            console.log("Product updated successfully");
            toast.success("Product updated successfully");
            navigate("/admin/products");
        } catch (error) {
            console.error("Error updating product:", error);
            toast.error("Failed to update product");
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const removeCurrentImage = (index) => {
        setKeptImages(keptImages.filter((_, i) => i !== index));
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

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
                <h1 className="text-2xl font-bold text-gray-900">Update Product</h1>
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
                                    disabled
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                                />
                                <p className="mt-1 text-xs text-gray-500">Product ID cannot be changed</p>
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
                                    Labelled Price (Rs.) *
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
                                    Selling Price (Rs.) *
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
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Images</h3>

                        {/* Current Images */}
                        {keptImages && keptImages.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Current Images
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {keptImages.map((image, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={image}
                                                alt={`Current ${index + 1}`}
                                                className="w-full h-24 object-cover rounded-lg border"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeCurrentImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                            >
                                                <BiX className="w-4 h-4" />
                                            </button>
                                            <span className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                                Current
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Upload New Images */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload New Images (Optional)
                            </label>
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200">
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
                        </div>

                        {/* New Image Preview */}
                        {images.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    New Images to Upload
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {images.map((image, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt={`New ${index + 1}`}
                                                className="w-full h-24 object-cover rounded-lg border"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                            >
                                                <BiX className="w-4 h-4" />
                                            </button>
                                            <span className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                                New
                                            </span>
                                        </div>
                                    ))}
                                </div>
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
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="Men's Shoes">Men's Shoes</option>
                                    <option value="Women's Shoes">Women's Shoes</option>
                                    <option value="Kids' Shoes">Kids' Shoes</option>
                                    <option value="Sports & Active Footwear">Sports & Active Footwear</option>
                                    <option value="Casual Footwear">Casual Footwear</option>
                                    <option value="School Footwear">School Footwear</option>
                                    <option value="Sandals & Slippers">Sandals & Slippers</option>
                                </select>
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
                                <span className="ml-2 text-sm text-gray-700">Feature in This Week's Spotlight</span>
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
                            {isSubmitting ? "Updating Product..." : "Update Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}