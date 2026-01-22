import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

import { useAuth } from "../context/AuthContext";


export default function ListingDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  

  const [listing, setListing] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "Books",
    condition: "Good",
    images: ""
  });
  const [err, setErr] = useState("");

  // Listing load
  useEffect(() => {
    const load = async () => {
      const res = await API.get(`/api/listings/${id}`);
      setListing(res.data);
    };
    load();
  }, [id]);

  // Form prefill jab listing aa jaye
  useEffect(() => {
    if (listing) {
      setForm({
        title: listing.title || "",
        description: listing.description || "",
        price: listing.price?.toString() || "",
        category: listing.category || "Books",
        condition: listing.condition || "Good",
        images: listing.images?.join(", ") || ""
      });
    }
  }, [listing]);

  if (!listing) return <p className="text-muted">Loading...</p>;

  // Check owner
  const isOwner =
    user &&
    listing.seller &&
    (listing.seller._id === user._id || listing.seller.id === user._id);
    

  // Delete
  const handleDelete = async () => {
    const ok = window.confirm("Are you sure you want to delete this listing?");
    if (!ok) return;

    try {
      await API.delete(`/api/listings/${id}`);
      navigate("/my");
    } catch (error) {
      setErr(error.response?.data?.message || "Failed to delete listing");
    }
  };

  // Edit form change
  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        images: form.images
          ? form.images.split(",").map((s) => s.trim())
          : []
      };

      const res = await API.put(`/api/listings/${id}`, payload);
      setListing(res.data);
      setIsEditing(false);
    } catch (error) {
      setErr(error.response?.data?.message || "Failed to update listing");
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">{listing.title}</h2>
          <p className="page-subtitle">Posted in {listing.category}</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div className="chip">Condition: {listing.condition}</div>

          
        </div>
      </div>

      {err && <p className="form-error">{err}</p>}

      <div className="details-layout">
        {/* LEFT: item details */}
        <div className="details-card">
          <div className="details-section-title">Item details</div>
          <p className="details-label mt-sm">Price</p>
          <p className="details-value">₹ {listing.price}</p>

          <p className="details-label mt-md">Description</p>
          <p className="details-value">{listing.description}</p>
          

          {listing.images?.length > 0 && (
            <div
              className="mt-md"
              style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
            >
              {listing.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt="product"
                  className="listing-image"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/180x180/1e293b/94a3b8?text=No+Image";
                  }}
                />
              ))}
            </div>
          )}

          {user && !isOwner && (
  <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
    <button
      className="btn btn-outline"
      onClick={() => navigate(`/checkout?type=buynow&id=${listing._id}`)}
    >
      Buy Now
    </button>
        {" "}
    <button
      className="btn btn-primary"
      onClick={async () => {
        await API.post("/api/cart/add", { listingId: listing._id });
        alert("Added to Cart!");
      }}
    >
      Add to Cart
    </button>
  </div>
)}


        </div>

        {/* RIGHT: seller info OR edit form */}
        <div className="details-card">
          {!isEditing && (
            <>
              <div className="details-section-title">Seller</div>
              <p className="details-label mt-sm">Name</p>
              <p className="details-value">{listing.seller?.name}</p>

              <p className="details-label mt-md">College</p>
              <p className="details-value">{listing.seller?.collegeName}</p>

              <p className="details-label mt-md">Email</p>
              <p className="details-value">{listing.seller?.email}</p>

              <p className="text-muted mt-md">
                Contact the seller via email to finalize the deal.
              </p>
            </>
          )}

          {isOwner && isEditing && (
            <>
              <div className="details-section-title">Edit listing</div>

              <form onSubmit={handleUpdate} className="form" style={{ marginTop: 10 }}>
                <div className="form-row">
                  <label>Item title</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={onChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={onChange}
                    rows={3}
                  />
                </div>

                <div className="form-row">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={onChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <label>Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={onChange}
                  >
                    <option>Books</option>
                    <option>Electronics</option>
                    <option>Hostel Items</option>
                    <option>Cycle</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="form-row">
                  <label>Condition</label>
                  <select
                    name="condition"
                    value={form.condition}
                    onChange={onChange}
                  >
                    <option>New</option>
                    <option>Like New</option>
                    <option>Good</option>
                    <option>Average</option>
                  </select>
                </div>

                <div className="form-row">
                  <label>Image URLs (comma separated)</label>
                  <input
                    name="images"
                    value={form.images}
                    onChange={onChange}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    marginTop: 8,
                    justifyContent: "flex-end"
                  }}
                >
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => {
                      setIsEditing(false);
                      setErr("");
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save changes
                  </button>
                </div>
              </form>
            </>
          )}
          
        </div>
        
      </div>
      <br />
      {isOwner && !isEditing && (
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button
                className="btn btn-outline"
                type="button"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
              <button
                className="btn btn-primary"
                type="button"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          )}
    </>
  );
}


