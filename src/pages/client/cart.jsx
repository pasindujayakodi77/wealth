import { useState } from "react";
import { addToCart, getCart, getTotal } from "../../utils/cart";
import { TbTrash } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
	const [cart, setCart] = useState(getCart());
    const navigate = useNavigate();
	console.log(cart);
	return (
		<div className="w-screen max-w-[100vw] h-screen flex flex-col px-2.5 py-10 items-center">
			{cart.map((item) => {
				return (
					<div
						key={item.productId}
						className="w-full md:w-200 h-50 md:h-25 m-2.5 shadow-2xl flex flex-row items-center relative rounded-lg"
						style={{ background: "var(--surface)", borderColor: "var(--border)", borderWidth: "1px", borderStyle: "solid" }}
					>
						<div className="md:w-25 w-50 justify-center items-center flex flex-col text-2xl md:text-md">
							<img
								src={item.image}
								className="w-25 h-25 object-cover"
							/>
							<div className=" h-full   flex-col justify-center pl-2.5 md:hidden flex">
								<span className=" font-bold text-center md:text-left">
									{item.name}
								</span>
								{/* price */}
								<span className=" font-semibold text-center md:text-left">
									LKR {item.price.toLocaleString("en-US", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}
								</span>
							</div>
						</div>
						<div className="w-[320px] h-full   flex-col justify-center pl-2.5 hidden md:flex">
							<span className=" font-bold text-center md:text-left">
								{item.name}
							</span>
							{/* price */}
							<span className=" font-semibold text-center md:text-left">
								LKR {item.price.toLocaleString("en-US", {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
							</span>
						</div>
						<div className="w-47.5 h-full text-4xl md:text-md  flex flex-row justify-center items-center ">
							<button
								className="flex justify-center items-center w-6 h-6 rounded-full cursor-pointer transition-colors duration-200 text-lg font-bold"
								style={{
									backgroundColor: "var(--accent)",
									color: "white",
									border: "2px solid var(--accent)"
								}}
								onMouseEnter={(e) => {
									e.target.style.backgroundColor = "var(--surface)";
									e.target.style.color = "var(--accent)";
								}}
								onMouseLeave={(e) => {
									e.target.style.backgroundColor = "var(--accent)";
									e.target.style.color = "white";
								}}
								onClick={() => {
									addToCart(item, -1);
									setCart(getCart());
								}}
							>
								-
							</button>
							<span className="mx-2.5">{item.quantity}</span>
							<button
								className="flex justify-center items-center w-6 h-6 rounded-full cursor-pointer transition-colors duration-200 text-lg font-bold"
								style={{
									backgroundColor: "var(--accent)",
									color: "white",
									border: "2px solid var(--accent)"
								}}
								onMouseEnter={(e) => {
									e.target.style.backgroundColor = "var(--surface)";
									e.target.style.color = "var(--accent)";
								}}
								onMouseLeave={(e) => {
									e.target.style.backgroundColor = "var(--accent)";
									e.target.style.color = "white";
								}}
								onClick={() => {
									addToCart(item, 1);
									setCart(getCart());
								}}
							>
								+
							</button>
						</div>
						<div className="w-47.5 text-3xl md:text-md h-full flex justify-end items-center pr-2.5">
							{/* total quantity * price */}
							<span className="font-semibold">
								{(item.quantity * item.price).toLocaleString("en-US", {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
							</span>
						</div>
						<button
							className="w-7.5 h-7.5 absolute top-0 right-0 md:top-8.75 md:-right-10 cursor-pointer bg-red-700 shadow rounded-full flex justify-center items-center text-white border-2 border-red-700 hover:bg-white hover:text-red-700"
							onClick={() => {
								addToCart(item, -item.quantity);
								setCart(getCart());
							}}
						>
							<TbTrash className="text-xl" />
						</button>
					</div>
				);
			})}
            <div className="md:w-200 w-full h-25 m-2.5 p-2.5 shadow-2xl flex flex-row items-center justify-between relative rounded-lg"
				style={{ background: "var(--surface)", borderColor: "var(--border)", borderWidth: "1px", borderStyle: "solid" }}
			>
				<button
					className="w-50 text-xl md:text-lg md:w-37.5 h-12 cursor-pointer rounded-xl font-semibold border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg"
					style={{
						backgroundColor: "var(--accent)",
						color: "white",
						borderColor: "var(--accent)",
						fontFamily: "Inter, sans-serif"
					}}
					onMouseEnter={(e) => {
						e.target.style.backgroundColor = "var(--surface)";
						e.target.style.color = "var(--accent)";
						e.target.style.boxShadow = "0 10px 25px rgba(0,0,0,0.15)";
					}}
					onMouseLeave={(e) => {
						e.target.style.backgroundColor = "var(--accent)";
						e.target.style.color = "white";
						e.target.style.boxShadow = "";
					}}
					onClick={() => {
						navigate("/checkout", { state: { items: cart } });
					}}
				>
					Checkout
				</button>
				<span className="font-bold text-2xl ">
					Total: LKR{" "}
					{getTotal().toLocaleString("en-US", {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})}
				</span>
			</div>
		</div>
	);
}