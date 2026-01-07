import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import uploadFile from "../../utils/mediaUpload";

export default function AddProductPage() {
	const [productId, setProductId] = useState("");
	const [productName, setProductName] = useState("");
	const [alternativeNames, setAlternativeNames] = useState("");
	const [labelledPrice, setLabelledPrice] = useState("");
	const [price, setPrice] = useState("");
	const [images, setImages] = useState([]);
	const [description, setDescription] = useState("");
	const [stock, setStock] = useState("");
	const [isAvailable, setIsAvailable] = useState(true);
	const [category, setCategory] = useState("cream");
    const navigate = useNavigate()

    async function handleSubmit(){
        const promisesArray = []

		    for(let i=0; i<images.length; i++){

			  const promise = uploadFile(images[i])
		  	promisesArray[i] = promise}

		    const responses = await Promise.all(promisesArray)
	      console.log(responses)
        	
        const altNamesInArray = alternativeNames.split(",")
        const productData = {
            productId: productId,
            name: productName,
            altNames: altNamesInArray,
            labelledPrice: labelledPrice,
            price: price,
            images: responses,
            description: description,
            stock: stock,
            isAvailable: isAvailable,
            category: category
        }

        const token = localStorage.getItem("token");

        if(token == null){
            navigate("/login");
            return;
        }

        axios.post(import.meta.env.VITE_BACKEND_URL + "/api/products", productData, 
            {
                headers:{
                    Authorization: "Bearer "+token
                }
            }
        ).then(
            (res)=>{
                console.log("Product added successfully");
                console.log(res.data);
                toast.success("Product added successfully");
                navigate("/admin/products");
            }
        ).catch(
            (error)=>{
                console.error("Error adding product:", error);
                toast.error("Failed to add product");              
            }
        )

        console.log(productData);


    }

	return (
		<div className="w-full h-full flex justify-center items-center">
			<div className="w-150 border-[3px] rounded-[15px] p-10 flex flex-wrap justify-between">
				<div className="w-50 flex flex-col gap-1.25">
					<label className="text-sm font-semibold">Product ID</label>
					<input
						type="text"
						value={productId}
						onChange={(e) => {
							setProductId(e.target.value);
						}}
						className="w-full border h-10 rounded-md"
					/>
				</div>
				<div className="w-75 flex flex-col gap-1.25">
					<label className="text-sm font-semibold">Product Name</label>
					<input
						type="text"
						value={productName}
						onChange={(e) => setProductName(e.target.value)}
						className="w-full border h-10 rounded-md"
					/>
				</div>
				<div className="w-125 flex flex-col gap-1.25">
					<label className="text-sm font-semibold">Alternative Names</label>
					<input
						type="text"
						value={alternativeNames}
						onChange={(e) => setAlternativeNames(e.target.value)}
						className="w-full border h-10 rounded-md"
					/>
				</div>
				<div className="w-50 flex flex-col gap-1.25">
					<label className="text-sm font-semibold">Labelled Price</label>
					<input
						type="number"
						value={labelledPrice}
						onChange={(e) => setLabelledPrice(e.target.value)}
						className="w-full border h-10 rounded-md"
					/>
				</div>
				<div className="w-50 flex flex-col gap-1.25">
					<label className="text-sm font-semibold">Price</label>
					<input
						type="number"
						value={price}
						onChange={(e) => setPrice(e.target.value)}
						className="w-full border h-10 rounded-md"
					/>
				</div>
				<div className="w-125 flex flex-col gap-1.25">
					<label className="text-sm font-semibold">Images</label>
					<input
						multiple
						type="file"
						onChange={(e) => {
							setImages(e.target.files);
						}}
						className="w-full border h-10 rounded-md"
					/>
				</div>
				<div className="w-125 flex flex-col gap-1.25">
					<label className="text-sm font-semibold">Description</label>
					<textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className="w-full border h-25 rounded-md"
					></textarea>
				</div>
				<div className="w-50 flex flex-col gap-1.25">
					<label className="text-sm font-semibold">Stock</label>
					<input
						type="number"
						value={stock}
						onChange={(e) => setStock(e.target.value)}
						className="w-full border h-10 rounded-md"
					/>
				</div>
				<div className="w-50 flex flex-col gap-1.25">
					<label className="text-sm font-semibold">Is Available</label>
					<select
						value={isAvailable}
						onChange={(e) => {
							setIsAvailable(e.target.value === "true");
						}}
						className="w-full border h-10 rounded-md"
					>
						<option value={true}>Available</option>
						<option value={false}>Not Available</option>
					</select>
				</div>
				<div className="w-50 flex flex-col gap-1.25">
					<label className="text-sm font-semibold">Category</label>
					<select
						value={category}
						onChange={(e) => {
							setCategory(e.target.value);
						}}
						className="w-full border h-10 rounded-md"
					>
						<option value="cream">Cream</option>
						<option value="face wash">Face Wash</option>
						<option value="soap">Soap</option>
						<option value="fragrance">Fragrance</option>
					</select>
				</div>
				<div className="w-full flex justify-center flex-row py-5">
					<Link
						to={"/admin/products"}
						className="w-50 h-12.5 bg-white text-black border-2 rounded-md flex justify-center items-center"
					>
						Cancel
					</Link>
					<button onClick={handleSubmit} className="w-50 h-12.5 bg-black text-white border-2 rounded-md flex justify-center items-center ml-5">
						Add Product
					</button>
				</div>
			</div>
		</div>
	);
}