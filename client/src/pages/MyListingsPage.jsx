import { useEffect, useState } from "react";
import API from "../services/api";


import { useAuth } from "../context/AuthContext";
import ListingCard from "../components/ListingCard";

export default function MyListingsPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await API.get("/listings/my");
      setListings(res.data);
    };
    if (user) load();
  }, [user]);

  if (!user) {
    return <p style={{ padding: "20px" }}>Please login to view your listings.</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Listings</h2>
      <div
        style={{
          marginTop: "20px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "15px"
        }}
      >
        {listings.map((l) => (
          <ListingCard key={l._id} listing={l} />
        ))}
      </div>
    </div>
  );
}

