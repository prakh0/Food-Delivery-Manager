export default function FilterPanel({
  statusFilter,
  setStatusFilter,
  maxDistance,
  setMaxDistance,
}) {
  return (
    <div className="card">
      <h2>Filters</h2>

      <div style={{ display: "flex", gap: "10px" }}>
        <div>
          <label>Status</label>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="assigned">Out For Delivery</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        <div>
          <label>Max Distance (KM)</label>
          <input
            type="number"
            value={maxDistance}
            onChange={(e) =>
              setMaxDistance(Number(e.target.value))
            }
          />
        </div>
      </div>
    </div>
  );
}