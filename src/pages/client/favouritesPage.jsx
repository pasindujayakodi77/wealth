import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../../components/loader";
import ProductCard from "../../components/productCard";

export default function FavouritesPage() {
	const [favourites, setFavourites] = useState([]);
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchFavourites = async () => {
			const favouriteIds = JSON.parse(localStorage.getItem('favourites') || '[]');
			setFavourites(favouriteIds);

			if (favouriteIds.length > 0) {
				try {
					const productPromises = favouriteIds.map(id =>
						axios.get(import.meta.env.VITE_BACKEND_URL + `/api/products/${id}`)
					);
					const responses = await Promise.all(productPromises);
					const productData = responses.map(res => res.data);
					setProducts(productData);
				} catch (error) {
					console.error('Failed to fetch favourite products:', error);
				}
			}
			setLoading(false);
		};

		fetchFavourites();
	}, []);

	const removeFavourite = (productId) => {
		const updated = favourites.filter(id => id !== productId);
		localStorage.setItem('favourites', JSON.stringify(updated));
		setFavourites(updated);
		setProducts(products.filter(p => p.productId !== productId));
	};

	if (loading) {
		return <Loader />;
	}

	return (
		<div className="w-full min-h-screen p-4" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
			<div className="max-w-7xl mx-auto">
				<h1 className="text-3xl font-bold mb-8">My Favourites</h1>
				{products.length === 0 ? (
					<div className="text-center py-12">
						<p className="text-xl mb-4">No favourites yet</p>
						<Link to="/products" className="px-6 py-3 rounded-full font-medium transition-colors" style={{ background: "var(--text-primary)", color: "var(--bg-base)" }}>
							Browse Products
						</Link>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{products.map((product) => (
							<div key={product.productId} className="relative">
								<ProductCard product={product} />
								<button
									onClick={() => removeFavourite(product.productId)}
									className="absolute top-2 right-2 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
									title="Remove from favourites"
								>
									✕
								</button>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}