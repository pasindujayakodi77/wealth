import { useEffect, useState } from "react";
import { TbTrash } from "react-icons/tb";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

export default function CheckoutPage() {
   const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token == null) {
      toast.error("Please login to checkout");
      navigate("/login");
      return;
    } else {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setUser(res.data);
          setName(res.data.firstName + " " + res.data.lastName);
          console.log(user);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to fetch user details");
          //navigate("/login");
        });
    }
  }, [navigate, user]);

  const [cart, setCart] = useState(location.state.items || []);
  if (location.state.items == null) {
    toast.error("Please select items to checkout");
    navigate("/products");
  }

  function getTotal() {
    let total = 0;
    cart.forEach((item) => {
      total += item.quantity * item.price;
    });
    return total;
  }
  async function placeOrder() {
    const token = localStorage.getItem("token");
    if (token == null) {
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }
    if (name === "" || address === "" || phone === "") {
      toast.error("Please fill all the fields");
      return;
    }
    const order = {
      address: address,
      phone: phone,
      items: [],
    };
    cart.forEach((item) => {
      order.items.push({
        productId: item.productId,
        qty: item.quantity,
      });
    });
    try {
      await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/orders",
        order,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Order placed successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order");
      return;
    }
  }
   console.log(cart);
  return (
    <div className="w-screen max-w-[100vw] h-screen flex flex-col px-2.5 py-10 items-center">
      {cart.map((item, index) => {
        return (
          <div
            key={item.productId}
            className="w-full md:w-200 h-50 md:h-25 m-2.5 shadow-2xl flex flex-row items-center relative"
          >
            <div className="md:w-25 w-50 justify-center items-center flex flex-col text-2xl md:text-md">
              <img
                src={item.image}
                className="w-25 h-25 object-cover"
              />
              <div className="h-full flex-col justify-center pl-2.5 md:hidden flex">
                <span className="font-bold text-center md:text-left">
                  {item.name}
                </span>
                <span className="font-semibold text-center md:text-left">
                  LKR {item.price.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
            <div className="w-[320px] h-full flex-col justify-center pl-2.5 hidden md:flex">
              <span className="font-bold text-center md:text-left">
                {item.name}
              </span>
              <span className="font-semibold text-center md:text-left">
                LKR {item.price.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="w-47.5 h-full text-4xl md:text-md flex flex-row justify-center items-center">
              <button
                className="flex justify-center items-center w-7.5 rounded-lg bg-accent text-white cursor-pointer hover:bg-blue-400"
                onClick={() => {
                  const newCart = [...cart];
                  newCart[index].quantity -= 1;
                  if (newCart[index].quantity <= 0) {
                    newCart.splice(index, 1);
                  }
                  setCart(newCart);
                }}
              >
                -
              </button>
              <span className="mx-2.5">{item.quantity}</span>
              <button
                className="flex justify-center items-center w-7.5 rounded-lg bg-accent text-white cursor-pointer hover:bg-blue-400"
                onClick={() => {
                  const newCart = [...cart];
                  newCart[index].quantity += 1;
                  setCart(newCart);
                }}
              >
                +
              </button>
            </div>
             <div className="w-47.5 text-3xl md:text-md h-full flex justify-end items-center pr-2.5">
              <span className="font-semibold">
                LKR {(item.quantity * item.price).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
             <button
              className="w-7.5 h-7.5 absolute top-0 right-0 md:top-8.75 md:-right-10 cursor-pointer bg-red-700 shadow rounded-full flex justify-center items-center text-white border-2 border-red-700 hover:bg-white hover:text-red-700"
              onClick={() => {
                const newCart = [...cart];
                newCart.splice(index, 1);
                setCart(newCart);
              }}
            >
              <TbTrash className="text-xl" />
            </button>
          </div>
        );
      })}
       <div className="md:w-200 w-full h-25 m-2.5 p-2.5 shadow-2xl flex flex-row items-center justify-end relative">
        <span className="font-bold text-2xl">
          Total: LKR{" "}
          {getTotal().toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
        <button
          onClick={placeOrder}
          className="absolute left-2.5 w-50 text-2xl md:text-md md:w-37.5 h-12.5 cursor-pointer rounded-lg shadow-2xl bg-accent border-2 border-accent text-white hover:bg-white hover:text-accent"
        >
          Place Order
        </button>
      </div>
       <div className="md:w-200 w-full m-2.5 p-2.5 shadow-2xl flex flex-col md:flex-row items-center justify-center gap-2">
        <input
          className="w-full md:w-50 h-10 border border-gray-300 rounded-lg p-2.5"
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full md:w-50 h-10 border border-gray-300 rounded-lg p-2.5"
          type="text"
          placeholder="Enter your address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          className="w-full md:w-50 h-10 border border-gray-300 rounded-lg p-2.5"
          type="text"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
    </div>
  );
}