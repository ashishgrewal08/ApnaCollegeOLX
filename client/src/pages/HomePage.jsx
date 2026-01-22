import { useEffect, useState } from "react";
import API from "../services/api";

import ListingCard from "../components/ListingCard";

export default function HomePage() {
  const [listings, setListings] = useState([]);
  const [q, setQ] = useState("");

  const fetchListings = async () => {
    const res = await API.get("/api/listings", {
      params: q ? { q } : {}
    });
    setListings(res.data);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchListings();
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Discover pre-loved campus gear</h2>
          <p className="page-subtitle">
            Books, electronics, hostel items and more — all from students around you.
          </p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="search-row">
        <input
          className="search-input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search for DSA book, cycle, laptop..."
        />
        <button className="btn btn-primary" type="submit">
          Search
        </button>
      </form>

      <div className="card-grid mt-md">
        {listings.map((l) => (
          <ListingCard key={l._id} listing={l} />
        ))}
        {listings.length === 0 && (
          <p className="text-muted mt-md">No listings yet. Be the first to sell something!</p>
        )}
      </div>
    </>
  );
}

