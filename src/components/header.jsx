import { useState } from "react";
import { BiCart, BiStore } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { HiHome } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";

export default function Header({ theme = "dark", onToggleTheme }) {
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(false);
	return (
		<header className="h-20 flex justify-center items-center relative shadow-lg shadow-black/20 border-b" style={{ background: "var(--header-bg)", color: "var(--text-primary)", borderColor: "var(--border)" }}>
			{isOpen && (
				<div className="fixed z-100 top-0 right-0 w-screen h-screen bg-[#00000050]">
					<div className="h-full w-87.5" style={{ background: "var(--surface-soft)", color: "var(--text-primary)" }}>
						<div className="w-full h-20 flex px-6 flex-row items-center gap-4 border-b" style={{ borderColor: "var(--border)", background: "var(--header-bg)" }}>
							<GiHamburgerMenu className="text-white text-3xl md:hidden " onClick={()=>{
								setIsOpen(false);
							}}/>
							<img
								className="w-32 h-14 object-cover cursor-pointer"
								onClick={() => {
									navigate("/");
									setIsOpen(false);
								}}
								src="/logo.png"
								alt="Logo"
							/>
						</div>
						<div className="w-full h-full flex flex-col p-8 items-start gap-6">
							<button
								className="text-xl flex flex-row items-center gap-2"
								onClick={() => {
									setIsOpen(false);
									navigate("/");
								}}
							>
								<HiHome className="text-2xl" style={{ color: "var(--highlight)" }} />
								Home
							</button>
                            {/* products */}
                            <button
								className="text-xl flex flex-row items-center gap-2"
								onClick={() => {
									setIsOpen(false);
									navigate("/products");
								}}
							>
								<BiStore className="text-2xl" style={{ color: "var(--accent-2)" }} />
								Products
							</button>
                            {/* cart */}
                            <button
								className="text-xl flex flex-row items-center gap-2"
								onClick={() => {
									setIsOpen(false);
									navigate("/cart");
								}}
							>
								<BiCart className="text-2xl" style={{ color: "var(--highlight)" }} />
								Cart
							</button>
						</div>
					</div>
				</div>
			)}
			<img
				className="w-32 h-14 object-cover absolute md:left-10 cursor-pointer"
				onClick={() => {
					navigate("/");
				}}
				src="/logo.png"
				alt="Logo"
			/>
			<GiHamburgerMenu className="text-3xl absolute md:hidden left-10" style={{ color: "var(--text-primary)" }} onClick={
                ()=>{
                    setIsOpen(true);
                }
            }/>
			<div className="hidden w-full md:flex justify-center items-center gap-6 text-[color:var(--text-primary)]">
				<Link to="/" className="text-lg hover:opacity-80 transition-opacity">
					Home
				</Link>
				<Link to="/products" className="text-lg hover:opacity-80 transition-opacity">
					Products
				</Link>
				<Link to="/reviews" className="text-lg hover:opacity-80 transition-opacity">
					Reviews
				</Link>
				<Link to="/about-us" className="text-lg hover:opacity-80 transition-opacity">
					About Us
				</Link>
				<Link to="/contact-us" className="text-lg hover:opacity-80 transition-opacity">
					Contact Us
				</Link>
				<div className="absolute right-6 flex items-center gap-4">
					<button
						onClick={onToggleTheme}
						className="flex items-center gap-2 rounded-full px-3 py-2 text-sm"
						style={{ border: "1px solid var(--border)", background: "var(--surface)" }}
					>
						<span>{theme === "dark" ? "Dark" : "Light"}</span>
						<div className="relative h-5 w-9 rounded-full" style={{ background: "var(--surface-soft)", border: "1px solid var(--border)" }}>
							<div
								className="absolute top-0.5 h-4 w-4 rounded-full transition-all"
								style={{ left: theme === "dark" ? "calc(100% - 1.25rem)" : "0.25rem", background: "var(--highlight)" }}
							/>
						</div>
					</button>
					<Link to="/cart">
						<BiCart className="text-3xl ml-2" style={{ color: "var(--highlight)" }} />
					</Link>
				</div>
			</div>
		</header>
	);
}