import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";


export default function BuyNowPage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await API.get(`/api/listings/${id}`);
      setListing(res.data);
    };
    load();
  }, [id]);

  if (!listing) return <p className="text-muted">Loading...</p>;

  const handleBuy = async () => {
    alert("Purchase successful! (Demo)");
  };

  return (
    <>
      <div className="page-header">
        <h2 className="page-title">Buy Now</h2>
      </div>

      <div className="details-card">
        <h3>{listing.title}</h3>
        <p className="details-value">₹ {listing.price}</p>

        <button className="btn btn-primary mt-md" onClick={handleBuy}>
          Confirm Purchase
        </button>
      </div>
    </>
  );
}
