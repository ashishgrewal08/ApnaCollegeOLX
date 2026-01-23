import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../services/api";


export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const type = searchParams.get("type"); // "buynow" or "cart"
  const listingId = searchParams.get("id");

  const [items, setItems] = useState([]); // [{ listing, quantity }]
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
          setErr("Invalid checkout mode.");
        }
      } catch (e) {
        setErr("Failed to load checkout items.");
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

  const handleProceedToPayment = () => {
  // type and listingId ko payment page me bhej rahe hain
  const params = new URLSearchParams();
  if (type) params.set("type", type);
  if (listingId) params.set("id", listingId);

  navigate(`/payment?${params.toString()}`);
};


  if (loading) return <p className="text-muted">Loading checkout...</p>;

  if (err && items.length === 0) {
    return (
      <>
        <div className="page-header">
          <h2 className="page-title">Checkout</h2>
        </div>
        <p className="form-error">{err}</p>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Checkout</h2>
          <p className="page-subtitle">
            Review your order items and total before confirming.
          </p>
        </div>

        
      </div>

      {err && <p className="form-error">{err}</p>}

      <div className="details-card">
        {items.map((item) => (
          <div
            key={item.listing._id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
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

        {items.length > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: 10,
              marginTop: 6
            }}
          >
            <div className="details-label">Total</div>
            <div className="details-value">₹ {total}</div>
          </div>
        )}
            
      </div>
      <div style={{ textAlign: "right" }}>
          
          <button
  className="btn btn-primary mt-sm"
  type="button"
  onClick={handleProceedToPayment}
  disabled={items.length === 0}
>
  Proceed to Payment
</button>

        </div>
    </>
  );
}
