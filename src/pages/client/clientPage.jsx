import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "../../components/header";
import ProductsPage from "./productsPage";
import ProductOverViewPage from "./productOverView";
import CartPage from "./cart";
import CheckoutPage from "./checkoutPage";
import HomePage from "../homePage";

export default function ClientWebPage() {
	const prefersDark = typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches;
	const storedTheme = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
	const [theme, setTheme] = useState(storedTheme || (prefersDark ? "dark" : "light"));

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
		localStorage.setItem("theme", theme);
	}, [theme]);

	const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

	return (
		<div className="w-full min-h-screen flex flex-col" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
			<Header theme={theme} onToggleTheme={toggleTheme} />
			<main className="w-full flex-1 overflow-x-hidden">
				<Routes>
					<Route path="/" element={<HomePage theme={theme} />} />
					<Route path="/products" element={<ProductsPage />} />
					<Route path="/reviews" element={<h1 className="text-3xl text-center">Reviews Page</h1>} />
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
   
