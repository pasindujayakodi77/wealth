import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiPlus, BiTrash } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";

const sampleProducts = [
	[
  {
    productId: "BATA001",
    name: "Men's Classic Leather Office Shoe",
    altNames: ["Men Formal Shoe", "Leather Office Shoe"],
    labelledPrice: 8990,
    price: 6990,
    images: ["/images/bata-men-formal-black.jpg"],
    description:
      "Premium men's leather office shoe by Bata. Designed for long-lasting comfort and professional style.",
    stock: 120,
    isAvailable: true,
    category: "Men's Shoes"
  },
  {
    productId: "BATA002",
    name: "Women's Comfortable Block Heel",
    altNames: ["Women Heel", "Office Heel"],
    labelledPrice: 6490,
    price: 5490,
    images: ["/images/bata-women-heel.jpg"],
    description:
      "Elegant women's block heel shoe offering stability, comfort, and a stylish look for daily wear.",
    stock: 75,
    isAvailable: true,
    category: "Women's Shoes"
  },
  {
    productId: "BATA003",
    name: "Men's Casual Sneakers",
    altNames: ["Men Sneakers", "Casual Shoes"],
    labelledPrice: 7490,
    price: 6290,
    images: ["/images/bata-men-sneakers.jpg"],
    description:
      "Lightweight and breathable casual sneakers ideal for everyday use and weekend outings.",
    stock: 90,
    isAvailable: true,
    category: "Casual Footwear"
  },
  {
    productId: "BATA004",
    name: "Kids School Shoes",
    altNames: ["School Shoes", "Kids Formal Shoes"],
    labelledPrice: 4990,
    price: 4290,
    images: ["/images/bata-kids-school.jpg"],
    description:
      "Durable and comfortable kids' school shoes designed to withstand daily school activities.",
    stock: 60,
    isAvailable: true,
    category: "School Footwear"
  },
  {
    productId: "BATA005",
    name: "Men's Comfort Sandals",
    altNames: ["Men Sandals", "Casual Sandals"],
    labelledPrice: 3990,
    price: 3290,
    images: ["/images/bata-men-sandals.jpg"],
    description:
      "Comfortable and stylish men's sandals suitable for casual wear and outdoor use.",
    stock: 100,
    isAvailable: true,
    category: "Sandals & Slippers"
  }
],
];

export default function ProductsAdminPage() {
    const [products,setProducts] = useState(sampleProducts)
    const [a,setA] = useState(0);
    useEffect(
        ()=>{
            axios.get(import.meta.env.VITE_BACKEND_URL+"/api/products").then(
                (res)=>{
                    setProducts(res.data)
                }
            )
        },
        [a]
         )
          const navigate = useNavigate()

	return (
		<div className="w-full h-full border-[3px]">
			<table>
                <thead>

                    <tr>
                        <th className="p-2.5">Image</th>
                        <th className="p-2.5">Product ID</th>
                        <th className="p-2.5">Name</th>
                        <th className="p-2.5">Price</th>
                        <th className="p-2.5">Labelled Price</th>
                        <th className="p-2.5">Category</th>
                        <th className="p-2.5">Stock</th>
                        <th className="p-2.5">Actions</th>
                    </tr>

                </thead>

                <tbody>
                    {
                        products.map(
                            (product,index)=>{
                                return(
                                    <tr key={index}>
                                        <td>
                                            <img src={product.images[0]} alt={product.name} className="w-12.5 h-12.5" />
                                        </td>
                                        <td className="p-2.5">{product.productId}</td>
                                        <td className="p-2.5">{product.name}</td>
                                        <td className="p-2.5">{product.price}</td>
                                        <td className="p-2.5">{product.labelledPrice}</td>
                                        <td className="p-2.5">{product.category}</td>
                                        <td className="p-2.5">{product.stock}</td>
                                        <td className="p-2.5">
                                            <BiTrash className="bg-red-500 p-1.75 text-3xl rounded-full text-white shadow-2xl shadow-black cursor-pointer" onClick={
                                                ()=>{
                                                    const token = localStorage.getItem("token");
                                                    if(token == null){
                                                        navigate("/login");
                                                        return;
                                                    }
                                                    axios.delete(import.meta.env.VITE_BACKEND_URL + "/api/products/" + product.productId, 
                                                        {
                                                            headers:{
                                                                Authorization: `Bearer ${token}`
                                                            }
                                                        }
                                                    ).then(
                                                        (res)=>{
                                                            console.log("Product deleted successfully");
                                                            console.log(res.data);
                                                            toast.success("Product deleted successfully");
                                                            setA(a+1);
                                                        }
                                                    ).catch(
                                                        (error)=>{
                                                            console.error("Error deleting product:", error);
                                                            toast.error("Failed to delete product");
                                                        }
                                                    )
                                                }
                                            }/>
                                        </td>
                                    </tr>
                                )
                            }
                        )
                    }
                </tbody>
            </table>
			<Link
				to={"/admin/newProduct"}
				className="fixed right-15 bottom-15 p-5 text-white bg-black rounded-full shadow-2xl"
			>
				<BiPlus className="text-3xl" />
			</Link>
		</div>
	);
}