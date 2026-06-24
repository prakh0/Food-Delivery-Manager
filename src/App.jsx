import { useState, useEffect } from "react";
import AddOrderForm from "./components/AddOrder";
import OrderTable from "./components/OrderTable";
import FilterPanel from "./components/Filter";
import OutputPanel from "./components/Output";

function App() {
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("orders");
    return saved ? JSON.parse(saved) : [];
});
  const [statusFilter, setStatusFilter] = useState("all");
  const [maxDistance, setMaxDistance] = useState(20);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    localStorage.setItem(
      "orders",
      JSON.stringify(orders)
    );
  }, [orders]);

  const addOrder = (order) => {
  if (
    orders.some(
      (o) =>
        o.orderId.trim().toLowerCase() ===
        order.orderId.trim().toLowerCase()
    )
  ) {
    alert("Order ID already exists");
    return;
  }

  setOrders((prev) => [...prev, order]);
};

const markAsPaid = (orderId) => {
  setOrders((prev) =>
    prev.map((order) =>
      order.orderId === orderId
        ? {
            ...order,
            isPaid: true,
            isAssigned: false,
          }
        : order
    )
  );

  setMessages((prev) => [
  `Order ${orderId} marked as Paid`,
  ...prev,
]);
};

  const filteredOrders = orders.filter((order) => {
  let statusMatch = true;

  if (statusFilter === "paid") {
    statusMatch = order.isPaid;
  }

  else if (statusFilter === "assigned") {
    statusMatch =
      order.isAssigned &&
      !order.isPaid;
  }

  else if (statusFilter === "pending") {
    statusMatch =
      !order.isAssigned &&
      !order.isPaid;
  }

  const distanceMatch =
    order.deliveryDistance <= maxDistance;

  return statusMatch && distanceMatch;
});

  const assignDelivery = () => {
  const candidates = orders.filter(
    (order) =>
      !order.isPaid &&
      !order.isAssigned &&
      order.deliveryDistance <= maxDistance
  );

  if (!candidates.length) {
    setMessage("No order available");
    return;
  }

  const nearest = candidates.reduce((a, b) =>
    a.deliveryDistance < b.deliveryDistance
      ? a
      : b
  );
  
  setMessages((prev) => [
  `Order ${nearest.orderId} from ${nearest.restaurantName} is Out For Delivery`,
  ...prev,
]);

  setOrders((prev) =>
    prev.map((order) =>
      order.orderId === nearest.orderId
        ? { ...order, isAssigned: true }
        : order
    )
  );
};
  return (
    <div className="container">
      <h1>Food Delivery Manager</h1>

      <AddOrderForm onAddOrder={addOrder} />

      <FilterPanel
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        maxDistance={maxDistance}
        setMaxDistance={setMaxDistance}
      />

      <button onClick={assignDelivery}>
        Assign Delivery
      </button>

      <OrderTable 
      orders={filteredOrders}
      markAsPaid={markAsPaid} 
      />

      <OutputPanel messages={messages} />
    </div>
  );
}

export default App;