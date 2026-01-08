import { useState } from "react";
import { BiCart, BiStore } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { HiHome } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(false);
	return (
		<header className="h-25 bg-accent flex justify-center items-center relative">
			{isOpen && (
				<div className="fixed z-100 top-0 right-0 w-screen h-screen bg-[#00000050]">
					<div className="h-full w-87.5 bg-white flex flex-col">
						<div className="w-full bg-accent h-25 flex pl-11.25 flex-row items-center gap-5">
							<GiHamburgerMenu className="text-white text-4xl  md:hidden " onClick={()=>{
                                setIsOpen(close);
                            }}/>
							<img
								className="w-37.5 h-20 object-cover  cursor-pointer"
								onClick={() => {
									navigate("/");
								}}
								src="/logo.png"
								alt="Logo"
							/>
						</div>
						<div className="w-full h-full flex flex-col p-11.25 items-start">
							<button
								className="text-accent text-2xl flex flex-row items-center"
								onClick={() => {
									setIsOpen(false);
									navigate("/");
								}}
							>
								<HiHome className="text-accent text-2xl mr-2" />
								Home
							</button>
                            {/* products */}
                            <button
								className="text-accent text-2xl flex flex-row items-center"
								onClick={() => {
									setIsOpen(false);
									navigate("/products");
								}}
							>
								<BiStore className="text-accent text-2xl mr-2" />
								Products
							</button>
                            {/* cart */}
                            <button
								className="text-accent text-2xl flex flex-row items-center"
								onClick={() => {
									setIsOpen(false);
									navigate("/cart");
								}}
							>
								<BiCart className="text-accent text-2xl mr-2" />
								Cart
							</button>
						</div>
					</div>
				</div>
			)}
			<img
				className="w-37.5 h-20 object-cover absolute md:left-10 cursor-pointer"
				onClick={() => {
					navigate("/");
				}}
				src="/logo.png"
				alt="Logo"
			/>
			<GiHamburgerMenu className="text-white text-4xl absolute md:hidden left-10" onClick={
                ()=>{
                    setIsOpen(true);
                }
            }/>
			<div className="hidden w-full md:flex justify-center items-center">
				<Link to="/" className="text-white text-xl ">
					Home
				</Link>
				<Link to="/products" className="ml-4 text-white text-xl">
					Products
				</Link>
				<Link to="/reviews" className="ml-4 text-white text-xl">
					Reviews
				</Link>
				<Link to="/about-us" className="ml-4 text-white text-xl">
					About Us
				</Link>
				<Link to="/contact-us" className="ml-4 text-white text-xl">
					Contact Us
				</Link>
				<Link to="/cart" className="absolute right-20 ">
					<BiCart className="text-white text-3xl ml-4" />
				</Link>
			</div>
		</header>
	);
}