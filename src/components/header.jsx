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
    Sun,
    User,
    LogIn 
} from "lucide-react";
import PropTypes from 'prop-types';

export default function Header({ theme = "dark", onToggleTheme, cartItems = 0, user, setUser }) {
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const [userMenuOpen, setUserMenuOpen] = useState(false);

	const handleLogout = () => {
		setUser(null);
		localStorage.removeItem('token');
		navigate('/login');
		setUserMenuOpen(false);
	};

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

							<div className="relative hidden lg:block">
								{user ? (
									<>
										<button
											onClick={() => setUserMenuOpen(!userMenuOpen)}
											className="flex items-center gap-2 px-3 py-2 rounded-full border transition-all"
											style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text-primary)" }}
										>
											<User size={18} />
											<span className="text-sm font-medium">{user.name}</span>
										</button>
										<AnimatePresence>
											{userMenuOpen && (
												<motion.div
													initial={{ opacity: 0, y: -10 }}
													animate={{ opacity: 1, y: 0 }}
													exit={{ opacity: 0, y: -10 }}
													className="absolute right-0 top-full mt-2 w-48 rounded-lg border shadow-lg z-50"
													style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text-primary)" }}
												>
													<div className="p-4">
														<p className="text-sm font-medium">{user.name}</p>
														<p className="text-xs opacity-70">{user.email}</p>
													</div>
													<div className="border-t" style={{ borderColor: "var(--border)" }}>
														<button className="w-full text-left px-4 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5" onClick={() => { navigate('/favourites'); setUserMenuOpen(false); }}>Favourites</button>
														<button className="w-full text-left px-4 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5" onClick={() => { navigate('/orders'); setUserMenuOpen(false); }}>Orders</button>
														<button className="w-full text-left px-4 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5" onClick={handleLogout}>Logout</button>
													</div>
												</motion.div>
											)}
										</AnimatePresence>
									</>
								) : (
									<Link
										to="/login"
										className="flex items-center gap-2 px-3 py-2 rounded-full border transition-all"
										style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text-primary)" }}
									>
										<LogIn size={18} />
										<span className="text-sm font-medium">Login</span>
									</Link>
								)}
							</div>

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
                                
                                {user ? (
                                    <div className="mt-6 p-3 border rounded-lg" style={{ borderColor: "var(--border)" }}>
                                        <div className="flex items-center gap-3">
                                            <User size={24} style={{ color: "var(--highlight)" }} />
                                            <div>
                                                <p className="text-sm font-medium">{user.name}</p>
                                                <p className="text-xs opacity-70">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex flex-col gap-2">
                                            <button className="text-left text-sm hover:opacity-80" onClick={() => { navigate('/profile'); setIsOpen(false); }}>Profile</button>
                                            <button className="text-left text-sm hover:opacity-80" onClick={() => { navigate('/favourites'); setIsOpen(false); }}>Favourites</button>
                                            <button className="text-left text-sm hover:opacity-80" onClick={() => { navigate('/orders'); setIsOpen(false); }}>Orders</button>
                                            <button className="text-left text-sm hover:opacity-80" onClick={handleLogout}>Logout</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-6 p-3 border rounded-lg" style={{ borderColor: "var(--border)" }}>
                                        <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center gap-3">
                                            <LogIn size={24} style={{ color: "var(--highlight)" }} />
                                            <span className="text-lg font-medium">Login</span>
                                        </Link>
                                    </div>
                                )}
                                
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

Header.propTypes = {
    theme: PropTypes.string,
    onToggleTheme: PropTypes.func.isRequired,
    cartItems: PropTypes.number,
    user: PropTypes.oneOfType([
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
        }),
        PropTypes.oneOf([null])
    ]),
    setUser: PropTypes.func.isRequired,
};