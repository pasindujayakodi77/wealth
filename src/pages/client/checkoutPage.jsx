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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

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

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      const newCart = [...cart];
      const index = newCart.findIndex((i) => i.productId === itemToDelete.productId);
      if (index !== -1) {
        newCart.splice(index, 1);
        setCart(newCart);
      }
    }
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

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
    <div className="min-h-screen py-8" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(2px)"
        }}>
          <div className="rounded-lg p-6 max-w-sm mx-4 shadow-xl" style={{ background: "var(--surface)", color: "var(--text-primary)" }}>
            <div className="text-center">
              <div className="mb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "var(--surface-soft)" }}>
                  <TbTrash className="w-8 h-8" style={{ color: "var(--accent-2)" }} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                  Remove Item
                </h3>
                <p style={{ color: "var(--text-muted)" }}>
                  Are you sure you want to remove{" "}
                  <span className="font-medium">{itemToDelete?.name}</span> from your cart?
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-4 py-2 rounded-lg transition-colors"
                  style={{ background: "var(--surface-soft)", color: "var(--text-primary)" }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Content */}
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8" style={{ color: "var(--text-primary)" }}>Checkout</h1>

        {cart.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Your cart is empty</h2>
            <p className="mb-6" style={{ color: "var(--text-muted)" }}>Add some products to get started!</p>
            <button
              onClick={() => navigate("/products")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-4 mb-8">
              {cart.map((item, index) => (
                <div
                  key={item.productId}
                  className="rounded-lg shadow-md p-4 flex items-center relative hover:shadow-lg transition-shadow"
                  style={{ background: "var(--surface)" }}
                >
                  <div className="w-20 h-20 shrink-0 mr-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg" style={{ color: "var(--text-primary)" }}>{item.name}</h3>
                    <p style={{ color: "var(--text-muted)" }}>
                      LKR {item.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center mr-4">
                    <button
                      disabled={item.quantity <= 1}
                      onClick={() => {
                        const newCart = [...cart];
                        newCart[index].quantity -= 1;
                        if (newCart[index].quantity <= 0) {
                          newCart.splice(index, 1);
                        }
                        setCart(newCart);
                      }}
                      className="w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      style={{ background: "var(--surface-soft)", color: "var(--text-primary)" }}
                    >
                      −
                    </button>
                    <span className="px-3 font-medium">{item.quantity}</span>
                    <button
                      onClick={() => {
                        const newCart = [...cart];
                        newCart[index].quantity += 1;
                        setCart(newCart);
                      }}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                      style={{ background: "var(--surface-soft)", color: "var(--text-primary)" }}
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right mr-4">
                    <p className="font-semibold text-lg" style={{ color: "var(--text-primary)" }}>
                      LKR {(item.quantity * item.price).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteClick(item)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                    aria-label="Remove item"
                  >
                    <TbTrash size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary and Form */}
            <div className="space-y-4">
              <div className="rounded-lg shadow-md p-6 flex justify-between items-center" style={{ background: "var(--surface)" }}>
                <button
                  onClick={placeOrder}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Place Order
                </button>

                <div className="text-right">
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>Total</p>
                  <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                    LKR {getTotal().toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              <div className="rounded-lg shadow-md p-6 space-y-4" style={{ background: "var(--surface)" }}>
                <h2 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    className="w-full h-10 rounded-lg p-3 border"
                    style={{
                      borderColor: "var(--border)",
                      background: "var(--surface)",
                      color: "var(--text-primary)"
                    }}
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    className="w-full h-10 rounded-lg p-3 border"
                    style={{
                      borderColor: "var(--border)",
                      background: "var(--surface)",
                      color: "var(--text-primary)"
                    }}
                    type="text"
                    placeholder="Enter your address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <input
                    className="w-full h-10 rounded-lg p-3 border"
                    style={{
                      borderColor: "var(--border)",
                      background: "var(--surface)",
                      color: "var(--text-primary)"
                    }}
                    type="text"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}