import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { uploadImages } from "../services/upload";


export default function AddListingPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "Books",
    condition: "Good"
  });
  const [files, setFiles] = useState([]);
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  //this is for frontend protection
  if (!user) {
    return (
      <>
        <div className="page-header">
          <div>
            <h2 className="page-title">Sell an item</h2>
            <p className="page-subtitle">
              Log in to post a listing and reach students in your college.
            </p>
          </div>
        </div>
        <p className="text-muted">You need to be logged in to add a listing.</p>
      </>
    );
  }

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFilesChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setErr("");

  try {
    let imageUrls = [];

    // ✅ STEP 4: upload via service
    if (files.length > 0) {
      imageUrls = await uploadImages(files);
    }

    const payload = {
      ...form,
      price: Number(form.price),
      images: imageUrls
    };

    await API.post("/api/listings", payload);
    navigate("/");
  } catch (error) {
    setErr(error.response?.data?.message || "Failed to create listing");
  }
};


  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Post a new listing</h2>
          <p className="page-subtitle">
            Share books, electronics, hostel items and more with your campus.
          </p>
        </div>
      </div>

      {err && <p className="form-error">{err}</p>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-row">
          <label>Item title</label>
          <input
            name="title"
            placeholder="e.g. DSA book, Lenovo laptop, Hero cycle"
            value={form.title}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-row">
          <label>Description</label>
          <textarea
            name="description"
            placeholder="Condition, how long used, any issues, what’s included…"
            value={form.description}
            onChange={onChange}
            rows={3}
          />
        </div>

        <div className="form-row">
          <label>Price (₹)</label>
          <input
            name="price"
            type="number"
            placeholder="Enter price"
            value={form.price}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-row">
          <label>Category</label>
          <select name="category" value={form.category} onChange={onChange}>
            <option>Books</option>
            <option>Electronics</option>
            <option>Hostel Items</option>
            <option>Cycle</option>
            <option>Other</option>
          </select>
        </div>

        <div className="form-row">
          <label>Condition</label>
          <select name="condition" value={form.condition} onChange={onChange}>
            <option>New</option>
            <option>Like New</option>
            <option>Good</option>
            <option>Average</option>
          </select>
        </div>

        <div className="form-row">
          <label>Photos</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesChange}
          />
          <span className="text-muted">
            You can upload up to 5 images. First image is used as main preview.
          </span>
        </div>

        <button className="btn btn-primary mt-md" type="submit">
          Post listing
        </button>
      </form>
    </>
  );
}

