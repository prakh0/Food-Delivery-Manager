export default function OrderTable({
  orders,
  markAsPaid,
}) {
  return (
    <div className="card">
      <h2>Orders</h2>

      <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Restaurant</th>
            <th>Items</th>
            <th>Status</th>
            <th>Distance</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.orderId}>
              <td>{order.orderId}</td>
              <td>{order.restaurantName}</td>
              <td>{order.itemCount}</td>
              <td>
                  <span
                    className={
                      order.isPaid
                        ? "status paid"
                        : order.isAssigned
                        ? "status assigned"
                        : "status pending"
                    }
                  >
                    {order.isPaid
                      ? "Paid"
                      : order.isAssigned
                      ? "Out For Delivery"
                      : "Pending"}
                  </span>
                </td>
              <td>
                {order.deliveryDistance} km
              </td>
              <td>
                {order.isAssigned &&
                  !order.isPaid && (
                    <button
                      onClick={() =>
                        markAsPaid(order.orderId)
                      }
                    >
                      Mark Paid
                    </button>
                  )}
                </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {orders.length === 0 && (
        <p>No orders found</p>
      )}
      </div>
  );
}