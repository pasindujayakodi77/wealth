import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
    ShoppingCart, 
    Menu, 
    X, 
    Home, 
    Package, 
    Star, 
    Phone, 
    Info, 
    Moon, 
    Sun 
} from "lucide-react";

export default function Header({ theme = "dark", onToggleTheme, cartItems = 0 }) {
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const navItems = [
		{ name: "Home", icon: Home, path: "/" },
		{ name: "Products", icon: Package, path: "/products" },
		{ name: "Reviews", icon: Star, path: "/reviews" },
		{ name: "About Us", icon: Info, path: "/about-us" },
		{ name: "Contact", icon: Phone, path: "/contact-us" },
	];

	return (
		<>
			<motion.header
				initial={{ y: -100 }}
				animate={{ y: 0 }}
				className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b`}
				style={{ 
                    background: scrolled ? "var(--header-bg)" : "var(--header-bg)", // Ensure background is visible even when not scrolled
                    color: "var(--text-primary)",
                    borderColor: scrolled ? "var(--border)" : "var(--border)"
                }}
			>
				<div className="max-w-7xl mx-auto px-6 lg:px-12">
					<div className="flex items-center justify-between h-20">
						{/* Logo */}
						<img
                            className="w-32 h-14 object-cover cursor-pointer"
                            onClick={() => navigate("/")}
                            src="/logo.png"
                            alt="Logo"
                        />

						{/* Desktop Navigation */}
						<nav className="hidden lg:flex items-center gap-1">
							{navItems.map((item) => (
								<Link 
                                    key={item.name}
                                    to={item.path}
                                    className="relative px-4 py-2 hover:opacity-80 transition-opacity flex items-center gap-2"
                                    style={{ color: "var(--text-primary)" }}
                                >
                                    <item.icon size={18} style={{ color: "var(--highlight)" }} />
                                    <span className="text-sm font-medium">{item.name}</span>
                                </Link>
							))}
						</nav>

						{/* Right Actions */}
						<div className="flex items-center gap-4">
							<button
								onClick={onToggleTheme}
								className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-full border transition-all"
								style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text-primary)" }}
							>
								{theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
                                <div className="relative h-4 w-8 rounded-full bg-black/10 dark:bg-white/10">
                                    <motion.div 
                                        animate={{ x: theme === "dark" ? 16 : 0 }}
                                        className="h-4 w-4 rounded-full"
                                        style={{ background: "var(--highlight)" }}
                                    />
                                </div>
							</button>

							<Link
                                to="/cart"
                                className="relative p-2 flex rounded-full border"
                                style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                            >
                                <ShoppingCart size={22} style={{ color: "var(--text-primary)" }} />
                                <AnimatePresence>
                                    {cartItems > 0 && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                                            style={{ background: "var(--highlight)" }}
                                        >
                                            {cartItems}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Link>

							<button
								onClick={() => setIsOpen(true)}
								className="lg:hidden p-2 rounded-full"
								style={{ color: "var(--text-primary)" }}
							>
								<Menu size={28} />
							</button>
						</div>
					</div>
				</div>
			</motion.header>

			{/* Mobile Sidebar */}
			<AnimatePresence>
				{isOpen && (
					<>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setIsOpen(false)}
							className="fixed inset-0 bg-black/50 z-60 backdrop-blur-sm lg:hidden"
						/>
						<motion.div
							initial={{ x: "100%" }}
							animate={{ x: 0 }}
							exit={{ x: "100%" }}
							transition={{ type: "spring", damping: 25, stiffness: 200 }}
							className="fixed top-0 right-0 bottom-0 w-72 z-70 shadow-xl lg:hidden"
							style={{ background: "var(--surface-soft)", color: "var(--text-primary)" }}
						>
							<div className="p-6">
								<div className="flex items-center justify-between mb-10">
									<img src="/logo.png" className="w-24 object-contain" />
									<X size={28} onClick={() => setIsOpen(false)} className="cursor-pointer" />
								</div>
								<nav className="flex flex-col gap-4">
									{navItems.map((item) => (
										<Link
											key={item.name}
											to={item.path}
											onClick={() => setIsOpen(false)}
											className="flex items-center gap-4 p-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
										>
											<item.icon size={20} style={{ color: "var(--highlight)" }} />
											<span className="text-lg font-medium">{item.name}</span>
										</Link>
									))}
								</nav>
                                
                                <button 
                                    onClick={onToggleTheme}
                                    className="w-full mt-8 flex items-center justify-between p-3 border rounded-lg"
                                    style={{ borderColor: "var(--border)" }}
                                >
                                    <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                                    {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                                </button>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>

            {/* FIX: THIS PUSHES THE CONTENT DOWN SO IT IS NOT HIDDEN */}
            <div className="h-20 w-full"></div>
		</>
	);
}