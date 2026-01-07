import { Link, Route, Routes } from "react-router-dom";
import { FaBoxArchive } from "react-icons/fa6";
import { GiShoppingBag } from "react-icons/gi";
import { IoPeople } from "react-icons/io5";
import { IoSettings } from "react-icons/io5";
export default function AdminPage(){
    return(
           <div className="w-full h-screen  flex">
            <div className="w-75 h-full flex flex-col items-center">
                <span className="text-3xl font-bold my-5">Admin Panel</span>

                <Link className="flex flex-row h-15 w-full  border p-5 items-center text-xl  gap-6.25" to="/admin/products"><FaBoxArchive /> Products</Link>
                <Link className="flex flex-row h-15 w-full border p-5 items-center text-xl  gap-6.25" to="/admin/orders"><GiShoppingBag /> Orders</Link>
                <Link className="flex flex-row h-15 w-full border p-5 items-center text-xl  gap-6.25" to="/admin/users"><IoPeople /> Users</Link>
                <Link className="flex flex-row h-15 w-full border p-5 items-center text-xl  gap-6.25" to="/admin/settings"><IoSettings /> Settings</Link>
            </div>
                <Routes path="/*">
                    <Route path="/" element={<h1>Dashboard</h1>}/>
                    <Route path="/products" element={<h1>Products</h1>}/>
                    <Route path="/orders" element={<h1>Orders</h1>}/>
                </Routes>
            </div>
    )
    
}