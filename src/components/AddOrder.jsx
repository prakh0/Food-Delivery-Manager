import { useState } from "react";

export default function AddOrderForm({
  onAddOrder,
}) {
  const [form, setForm] = useState({
    restaurantName: "",
    itemCount: "",
    isPaid: false,
    isAssigned: false,
    deliveryDistance: "",
  });

  const handleSubmit = (e) => {
  e.preventDefault();

  if (
    !form.restaurantName.trim() ||
    !form.itemCount ||
    !form.deliveryDistance
  ) {
    alert("All fields are required");
    return;
  }

  if (Number(form.itemCount) <= 0) {
    alert("Item count must be greater than 0");
    return;
  }

  if (Number(form.deliveryDistance) < 0) {
    alert("Distance cannot be negative");
    return;
  }
  if (Number(form.deliveryDistance) > 25) {
  alert("Maximum delivery distance is 25 km");
  return;
}

  onAddOrder({
    ...form,
    itemCount: Number(form.itemCount),
    deliveryDistance: Number(form.deliveryDistance),
  });

  setForm({
    restaurantName: "",
    itemCount: "",
    isPaid: false,
    isAssigned: false,
    deliveryDistance: "",
  });
};

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        required
        placeholder="Restaurant"
        value={form.restaurantName}
        onChange={(e) =>
          setForm({
            ...form,
            restaurantName:
              e.target.value,
          })
        }
      />

      <input
        type="number"
        min="1"
        required
        placeholder="Items"
        value={form.itemCount}
        onChange={(e) =>
          setForm({
            ...form,
            itemCount: e.target.value,
          })
  }
/>

      <input
        type="number"
        min="0"
        step="0.1"
        required
        placeholder="Distance"
        value={form.deliveryDistance}
        onChange={(e) =>
          setForm({
            ...form,
            deliveryDistance:
              e.target.value,
          })
        }
      />

      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={form.isPaid}
          onChange={(e) =>
            setForm({
              ...form,
              isPaid: e.target.checked,
            })
          }
        />
        Paid
      </label>

      <button type="submit">
        Add Order
      </button>
    </form>
  );
}