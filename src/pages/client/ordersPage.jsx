import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to view your orders");
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/api/orders/user",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-t-transparent" style={{ borderColor: "var(--highlight)" }} />
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
        <h1 className="text-2xl font-semibold">You have no orders yet</h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Browse products and place your first order.
        </p>
        <button
          onClick={() => navigate("/products")}
          className="px-4 py-2 rounded-md text-sm font-medium"
          style={{ background: "var(--highlight)", color: "white" }}
        >
          Go to products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <p className="text-sm uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>My orders</p>
            <h1 className="text-3xl font-semibold">Order history</h1>
          </div>
          <button
            onClick={() => navigate("/products")}
            className="px-4 py-2 rounded-md text-sm font-medium"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
          >
            Shop more
          </button>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id || order.orderID}
              className="rounded-xl p-4 shadow-sm"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
                <div>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Order ID</p>
                  <p className="text-sm font-semibold">{order.orderID}</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Placed</p>
                  <p className="text-sm font-semibold">{new Date(order.date).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Status</p>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: "var(--surface-soft)",
                      color: order.status === "completed" ? "#0f9d58" : order.status === "cancelled" ? "#d93025" : "var(--text-primary)",
                      border: "1px solid var(--border)"
                    }}
                  >
                    {order.status || "pending"}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Total</p>
                  <p className="text-lg font-semibold">LKR {order.total?.toFixed(2)}</p>
                </div>
              </div>

              <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                {order.items?.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-md object-cover border"
                      style={{ borderColor: "var(--border)" }}
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm" style={{ color: "var(--text-muted)" }}>Qty: {item.qty}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">LKR {(item.price * item.qty).toFixed(2)}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>Unit {item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {order.notes && (
                <p className="text-sm mt-3" style={{ color: "var(--text-muted)" }}>
                  Note: {order.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
