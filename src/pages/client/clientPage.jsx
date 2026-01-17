import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "../../components/header";
import ProductsPage from "./productsPage";
import ProductOverViewPage from "./productOverView";
import CartPage from "./cart";
import CheckoutPage from "./checkoutPage";
import HomePage from "../homePage";
import ReviewsPage from "./reviewsPage";
import FavouritesPage from "./favouritesPage";
import { getCartItemCount } from "../../utils/cart";

export default function ClientWebPage() {
	const prefersDark = typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches;
	const storedTheme = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
	const [theme, setTheme] = useState(storedTheme || (prefersDark ? "dark" : "light"));
	const [cartCount, setCartCount] = useState(0);
	const [user, setUser] = useState(null);

	const fetchUser = async () => {
		const token = localStorage.getItem('token');
		if (token) {
			try {
				const response = await fetch('http://localhost:5000/api/users/', {
					headers: {
						Authorization: `Bearer ${token}`
					}
				});
				if (response.ok) {
					const userData = await response.json();
					setUser(userData);
				} else {
					localStorage.removeItem('token');
				}
			} catch (error) {
				console.error('Failed to fetch user:', error);
				localStorage.removeItem('token');
			}
		}
	};

	useEffect(() => {
		const loadUser = async () => {
			await fetchUser();
		};
		loadUser();
	}, []);

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
		localStorage.setItem("theme", theme);
	}, [theme]);

	useEffect(() => {
		// Update cart count when component mounts and listen for storage changes
		const updateCartCount = () => {
			setCartCount(getCartItemCount());
		};
		
		updateCartCount();
		
		// Listen for storage changes (when cart is updated in other tabs/windows)
		window.addEventListener('storage', updateCartCount);
		
		// Listen for cart updates within the same tab
		window.addEventListener('cartUpdated', updateCartCount);
		
		return () => {
			window.removeEventListener('storage', updateCartCount);
			window.removeEventListener('cartUpdated', updateCartCount);
		};
	}, []);

	const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

	return (
		<div className="w-full min-h-screen flex flex-col" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
			<Header theme={theme} onToggleTheme={toggleTheme} cartItems={cartCount} user={user} setUser={setUser} />
			<main className="w-full flex-1 overflow-x-hidden">
				<Routes>
					<Route path="/" element={<HomePage theme={theme} />} />
					<Route path="/products" element={<ProductsPage />} />
					<Route path="/reviews" element={<ReviewsPage />} />
					<Route path="/favourites" element={<FavouritesPage />} />
					<Route path="/about-us" element={<h1 className="text-3xl text-center">About Us Page</h1>} />
					<Route path="/contact-us" element={<h1 className="text-3xl text-center">Contact Us Page</h1>} />
					<Route path="/cart" element={<CartPage />} />
					<Route path="/overview/:productId" element={<ProductOverViewPage />} />
					<Route path="/checkout" element={<CheckoutPage />} />
					<Route path="/*" element={<h1 className="text-3xl text-center">404 Not Found</h1>} />
				</Routes>
			</main>
		</div>
	);
}
   
