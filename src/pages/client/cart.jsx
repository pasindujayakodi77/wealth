import { useState } from "react";
import { addToCart, getCart, getTotal } from "../../utils/cart";
import { TbTrash } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const [cart, setCart] = useState(getCart());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const navigate = useNavigate();

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      addToCart(itemToDelete, -itemToDelete.quantity);
      setCart(getCart());
    }
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

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

      {/* Cart Content */}
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8" style={{ color: "var(--text-primary)" }}>Your Cart</h1>
        
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
              {cart.map((item) => (
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
                        addToCart(item, -1);
                        setCart(getCart());
                      }}
                      className="w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      style={{ background: "var(--surface-soft)", color: "var(--text-primary)" }}
                    >
                      −
                    </button>
                    <span className="px-3 font-medium">{item.quantity}</span>
                    <button
                      onClick={() => {
                        addToCart(item, 1);
                        setCart(getCart());
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

            {/* Summary */}
            <div className="rounded-lg shadow-md p-6 flex justify-between items-center" style={{ background: "var(--surface)" }}>
              <button
                onClick={() => navigate("/checkout", { state: { items: cart } })}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Proceed to Checkout
              </button>

              <div className="text-right">
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>Total</p>
                <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                  LKR {getTotal().toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
