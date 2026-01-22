import { useEffect, useState } from "react";
import API from "../services/api";

import { useNavigate } from "react-router-dom";


export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [err, setErr] = useState("");
  const navigate = useNavigate();


  const fetchCart = async () => {
    try {
      const res = await API.get("/api/cart");
      setCart(res.data);
    } catch (e) {
      setErr("Failed to load cart");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (!cart) return <p className="text-muted">Loading cart...</p>;

  const total =
    cart.items?.reduce(
      (sum, item) => sum + item.listing.price * item.quantity,
      0
    ) || 0;

  const handleRemove = async (listingId) => {
    await API.post("/api/cart/remove", { listingId });
    fetchCart();
  };

  
  const handlePlaceOrderClick = () => {
  navigate("/checkout?type=cart");
};

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">My Cart</h2>
          <p className="page-subtitle">
            Review your items before placing the order.
          </p>
        </div>

        {cart.items.length > 0 && (
          <div style={{ textAlign: "right" }}>
            <div className="details-value">Total: ₹ {total}</div>
            <button
              className="btn btn-primary mt-sm"
              type="button"
              onClick={handlePlaceOrderClick}
                disabled={cart.items.length === 0}
            >
              Place Order
            </button>
          </div>
        )}
      </div>

      {err && <p className="form-error">{err}</p>}

      {cart.items.length === 0 && (
        <p className="text-muted">Your cart is empty.</p>
      )}

      <div className="card-grid">
        {cart.items.map((item) => (
          <div key={item._id} className="card">
            <div className="card-title">{item.listing.title}</div>
            <div className="card-price">₹ {item.listing.price}</div>
            <div className="card-meta">Qty: {item.quantity}</div>

            <button
              className="btn btn-outline mt-sm"
              onClick={() => handleRemove(item.listing._id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

