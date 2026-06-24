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
  const [maxDistance, setMaxDistance] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] =
  useState(() => {
    const saved =
      localStorage.getItem(
        "messages"
      );

    return saved
      ? JSON.parse(saved)
      : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "orders",
      JSON.stringify(orders)
    );
  }, [orders]);

  useEffect(() => {
  localStorage.setItem(
    "messages",
    JSON.stringify(messages)
  );
}, [messages]);

const addOrder = (order) => {
  let newId;

  do {
    newId =
      "#" +
      Math.floor(
        10000 + Math.random() * 90000
      );
  } while (
    orders.some(
      (o) => o.orderId === newId
    )
  );

  const newOrder = {
    ...order,
    orderId: newId,
  };

  setOrders((prev) => [
    ...prev,
    newOrder,
  ]);
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
  `[${new Date().toLocaleTimeString()}] Order ${orderId} marked as Paid`,
  ...prev,
]);
};

const deleteOrder = (orderId) => {
  if (
    window.confirm(
      `Delete Order ${orderId}?`
    )
  ) {
    setOrders((prev) =>
      prev.filter(
        (order) =>
          order.orderId !== orderId
      )
    );

    setMessages((prev) => [
      `[${new Date().toLocaleTimeString()}] Order ${orderId} deleted`,
      ...prev,
    ]);
  }
};

const clearLogs = () => {
  if (
    window.confirm(
      "Clear all activity logs?"
    )
  ) {
    setMessages([]);
    localStorage.removeItem(
      "messages"
    );
  }
};
const exportOrders = () => {
  const blob = new Blob(
    [JSON.stringify(orders, null, 2)],
    {
      type: "application/json",
    }
  );

  const url =
    URL.createObjectURL(blob);

  const a =
    document.createElement("a");

  a.href = url;
  a.download = "orders.json";

  a.click();

  URL.revokeObjectURL(url);

  setMessages((prev) => [
    `[${new Date().toLocaleTimeString()}] Orders exported`,
    ...prev,
  ]);
};

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
  (o) => !o.isAssigned && !o.isPaid).length;
  
  const assignedOrders = orders.filter(
  (o) => o.isAssigned && !o.isPaid).length;

  const paidOrders = orders.filter(
    (o) => o.isPaid).length;

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

  const searchMatch =
  order.orderId
    .toLowerCase()
    .includes(
      searchTerm.toLowerCase()
    );

  return (statusMatch && distanceMatch && searchMatch);
});

  const assignDelivery = () => {
  const candidates = orders.filter(
    (order) =>
      !order.isPaid &&
      !order.isAssigned &&
      order.deliveryDistance <= maxDistance
  );

  if (!candidates.length) {
    setMessages((prev) => [
      `[${new Date().toLocaleTimeString()}] No order available`,
      ...prev,
    ]);
    return;
  }

  const nearest = candidates.reduce((a, b) =>
    a.deliveryDistance < b.deliveryDistance
      ? a
      : b
  );
  
  setMessages((prev) => [
  `[${new Date().toLocaleTimeString()}] Order ${nearest.orderId} from ${nearest.restaurantName} is Out For Delivery`,
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

      <div className="card stats">
          <h2>Dashboard</h2>
        
          <div className="stats-grid">
            <div className="stats-card">
              Total Orders
            <h3>{totalOrders}</h3>
          </div>
          <div className="stats-card">
            Pending
          <h3>{pendingOrders}</h3>
          </div>

          <div className="stats-card">
            Out For Delivery
          <h3>{assignedOrders}</h3>
          </div>
          
          <div className="stats-card">
            Paid
          <h3>{paidOrders}</h3>
          </div>
        </div>
      </div>

      <AddOrderForm onAddOrder={addOrder} />

      <div className="card">
        <input
          type="text"
          placeholder="Search by Order ID"
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />
      </div>

      <FilterPanel
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        maxDistance={maxDistance}
        setMaxDistance={setMaxDistance}
      />

      <div className="buttons">
        <button onClick={assignDelivery}>
          Assign Delivery
        </button>
  
        <button onClick={exportOrders}>
        Export Orders
        </button>
      </div>
 
      <OrderTable
        orders={filteredOrders}
        markAsPaid={markAsPaid}
        deleteOrder={deleteOrder}
      />
      <button onClick={clearLogs}>
        Clear Activity Log
      </button>

      <OutputPanel messages={messages} />
    </div>
  );
}

export default App;