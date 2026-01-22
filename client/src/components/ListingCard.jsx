import { Link } from "react-router-dom";

export default function ListingCard({ listing }) {
  return (
    <div className="card">
      <div className="card-title">{listing.title}</div>
      <div className="card-price">₹ {listing.price}</div>
      <div className="card-meta">
        {listing.category} • {listing.condition}
      </div>
      <div className="card-desc">
        {listing.description?.slice(0, 80)}
        {listing.description?.length > 80 && "..."}
      </div>
      <div className="mt-sm">
        <Link to={`/listing/${listing._id}`}>View details →</Link>
      </div>
    </div>
  );
}

