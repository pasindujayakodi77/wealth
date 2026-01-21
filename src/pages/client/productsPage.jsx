import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../../components/loader";
import ProductCard from "../../components/productCard";

export default function ProductsPage() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [query, setQuery] = useState("");
	const [category, setCategory] = useState("all");

	const categories = [
		{ key: "all", label: "All" },
		{ key: "men", label: "Men" },
		{ key: "women", label: "Women" },
		{ key: "kids", label: "Kids" },
	];

	const normalizeCategory = (value) => {
		const c = (value || "").trim().toLowerCase();
		if (c.includes("women")) return "women";
		if (c.includes("men")) return "men";
		if (c.includes("kid")) return "kids";
		return c;
	};

	const filterByCategory = (items, selectedCategory) => {
		if (!selectedCategory || selectedCategory === "all") return items;
		return items.filter((product) => normalizeCategory(product.category) === selectedCategory);
	};

  useEffect(() => {
		let canceled = false;

		const fetchProducts = async () => {
			setLoading(true);
			try {
				let response;
				if (query.trim() !== "") {
					response = await axios.get(
						`${import.meta.env.VITE_BACKEND_URL}/api/products/search/${encodeURIComponent(query.trim())}`
					);
				} else {
					const params = category === "all" ? {} : { category };
					response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`, { params });
				}

				if (!canceled) {
					const fetchedProducts = Array.isArray(response.data) ? response.data : [];
					setProducts(filterByCategory(fetchedProducts, category));
				}
			} catch (error) {
				if (!canceled) {
					setProducts([]);
				}
			} finally {
				if (!canceled) {
					setLoading(false);
				}
			}
		};

		fetchProducts();

		return () => {
			canceled = true;
		};
	}, [query, category]);
  return (
		<div className="w-full h-full ">
			<div className="w-full flex flex-col gap-4 items-center py-5">
				<div className="flex flex-wrap gap-3 justify-center">
					{categories.map((item) => (
						<button
							key={item.key}
							onClick={() => setCategory(item.key)}
							className="px-4 py-2 rounded-full border transition-colors"
							style={{
								background: category === item.key ? "var(--accent)" : "var(--surface)",
								color: category === item.key ? "var(--text-on-accent, #000)" : "var(--text-primary)",
								borderColor: "var(--border)",
							}}
						>
							{item.label}
						</button>
					))}
				</div>
				<div className="w-full flex justify-center px-5">
					<input
						type="text"
						placeholder="Search products..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className="w-full max-w-xl h-10 rounded-lg p-2"
						style={{ borderColor: "var(--border)", borderWidth: "1px", borderStyle: "solid", background: "var(--surface)", color: "var(--text-primary)" }}
					/>
				</div>
			</div>
			{loading ? (
				<Loader />
			) : (
				<div className="w-full  flex flex-wrap gap-10 justify-center items-center p-5">
					{products.map((product) => {
						return <ProductCard key={product.productId} product={product} />;
					})}
				</div>
			)}
		</div>
	);
}