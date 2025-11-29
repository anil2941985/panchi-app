// pages/components/PriceCard.jsx
export default function PriceCard({ flight }) {
  return (
    <div className="rounded-xl p-4 bg-gray-50 flex justify-between items-center">
      <div>
        <div className="font-semibold">{flight.airline}</div>
        <div className="text-sm text-gray-500">{flight.depart} → {flight.arrive} · {flight.duration}</div>
      </div>
      <div className="text-right">
        <div className="text-xl font-semibold">₹{flight.price}</div>
        <button className="mt-3 px-3 py-1 rounded-md border">Book</button>
      </div>
    </div>
  );
}
