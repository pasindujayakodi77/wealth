import { BiPlus } from "react-icons/bi";
import { Link } from "react-router-dom";

export default function ProductsAdminPage(){
    return(
        <div className="w-full h-full border-[3px]">
            <Link to={"/admin/newProduct"} className="fixed right-15 bottom-15 p-5 text-white bg-black rounded-full shadow-2xl">
                <BiPlus className="text-3xl" />
            </Link>            
        </div>
    )
}