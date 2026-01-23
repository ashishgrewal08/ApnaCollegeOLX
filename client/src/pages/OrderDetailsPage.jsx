import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";


export default function OrderDetailsPage() {
  const { id } = useParams();          // URL se order id
  const [order, setOrder] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setErr("");
        const res = await API.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (e) {
        setErr(e.response?.data?.message || "Failed to load order details");
      }
    };
    load();
  }, [id]);

  if (err && !order) {
    return (
      <>
        <div className="page-header">
          <h2 className="page-title">Order details</h2>
        </div>
        <p className="form-error">{err}</p>
      </>
    );
  }

  if (!order) {
    return <p className="text-muted">Loading your order...</p>;
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Order confirmed 🎉</h2>
          <p className="page-subtitle">
            Thank you for your purchase!
            <br />
            Order ID: <span style={{ fontSize: "0.8rem" }}>{order._id}</span>
            <br />
            Placed on:{" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <div style={{ textAlign: "right" }}>
          <div className="details-label">Total amount</div>
          <div className="details-value">₹ {order.totalAmount}</div>
          
        </div>
      </div>

      <div className="details-card">
        <div className="details-section-title">Items in this order</div>

        {order.items.map((item) => (
          <div
            key={item._id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid rgba(30,41,59,0.7)"
            }}
          >
            <div>
              <div className="details-value">
                {item.listing?.title || "Item"}
              </div>
              <div className="text-muted">
                Qty: {item.quantity} • Price: ₹ {item.price}
              </div>
            </div>
            <div className="details-value">
              ₹ {item.price * item.quantity}
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
          <div className="details-label">Total</div>
          <div className="details-value">₹ {order.totalAmount}</div>
        </div>
      </div>
      <div style={{ textAlign: "right", marginTop: "1rem"}}>
        <Link className="nav-link nav-pill-primary" to="/" style={{textDecoration:"none"}}>
            Back to home
          </Link>
      </div>
    </>
  );
}
