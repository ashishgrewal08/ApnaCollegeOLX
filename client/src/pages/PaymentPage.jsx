import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../services/api";


export default function PaymentPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const type = searchParams.get("type"); // "buynow" or "cart"
  const listingId = searchParams.get("id");

  const [items, setItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setErr("");

        if (type === "buynow" && listingId) {
          const res = await API.get(`/listings/${listingId}`);
          setItems([{ listing: res.data, quantity: 1 }]);
        } else if (type === "cart") {
          const res = await API.get("/cart");
          setItems(
            (res.data.items || []).map((item) => ({
              listing: item.listing,
              quantity: item.quantity
            }))
          );
          if (!res.data.items || res.data.items.length === 0) {
            setErr("Your cart is empty.");
          }
        } else {
          setErr("Invalid payment mode.");
        }
      } catch (e) {
        setErr("Failed to load payment details.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [type, listingId]);

  const total = items.reduce(
    (sum, item) => sum + item.listing.price * item.quantity,
    0
  );

  const handlePayAndPlaceOrder = async () => {
    try {
      setErr("");

      // Demo: yahan sirf paymentMethod ko log kar rahe hain.
      console.log("Payment method:", paymentMethod);

      let res;
      if (type === "buynow" && listingId) {
        res = await API.post("/orders/single", {
          listingId,
          quantity: 1
        });
      } else if (type === "cart") {
        res = await API.post("/orders/from-cart");
      } else {
        return;
      }

      const orderId = res.data._id;
      navigate(`/orders/${orderId}`);
    } catch (e) {
      setErr(
        e.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    }
  };

  if (loading) return <p className="text-muted">Loading payment...</p>;

  if (err && items.length === 0) {
    return (
      <>
        <div className="page-header">
          <h2 className="page-title">Payment</h2>
        </div>
        <p className="form-error">{err}</p>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Payment</h2>
          <p className="page-subtitle">
            Choose how you want to pay and confirm your order.
          </p>
        </div>

        <div style={{ textAlign: "right" }}>
          <div className="details-label">Amount payable</div>
          <div className="details-value">₹ {total}</div>
        </div>
      </div>

      {err && <p className="form-error">{err}</p>}

      {/* Payment methods */}
      <div className="details-card" style={{ marginBottom: 16 }}>
        <div className="details-section-title">Payment method</div>

        <div className="mt-sm" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input
              type="radio"
              name="payment"
              value="upi"
              checked={paymentMethod === "upi"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span className="details-value">UPI (GPay / PhonePe / Paytm)</span>
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input
              type="radio"
              name="payment"
              value="card"
              checked={paymentMethod === "card"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span className="details-value">Debit / Credit Card</span>
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span className="details-value">Cash on Delivery (COD)</span>
          </label>
        </div>
      </div>

      {/* Order summary again on payment page */}
      <div className="details-card">
        <div className="details-section-title">Order summary</div>

        {items.map((item) => (
          <div
            key={item.listing._id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid rgba(30,41,59,0.7)"
            }}
          >
            <div>
              <div className="details-value">{item.listing.title}</div>
              <div className="text-muted">
                Qty: {item.quantity} • Price: ₹ {item.listing.price}
              </div>
            </div>
            <div className="details-value">
              ₹ {item.listing.price * item.quantity}
            </div>
          </div>
        ))}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: 10,
            marginTop: 6
          }}
        >
          <div className="details-label">Total payable</div>
          <div className="details-value">₹ {total}</div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 12
          }}
        >
          <button
            className="btn btn-primary"
            type="button"
            onClick={handlePayAndPlaceOrder}
            disabled={items.length === 0}
          >
            Pay & Place Order
          </button>
        </div>
      </div>
    </>
  );
}
