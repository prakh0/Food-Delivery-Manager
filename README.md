# Food Delivery Manager

## Overview

Food Delivery Manager is a React-based web application that manages food delivery orders and automates delivery assignment based on distance and payment status.

The application allows users to:

* Create new food delivery orders
* View all orders
* Filter orders by status and distance
* Automatically assign deliveries to the nearest eligible order
* Track delivery progress
* Mark completed deliveries as paid
* Maintain an activity log of all actions
* Persist data across browser refreshes using Local Storage

This project was developed as part of an assignment focused on filtering logic, prioritization algorithms, UI development, and state management.

---

## Problem Statement

Food delivery companies receive multiple orders simultaneously. The system needs to determine:

* Which orders are eligible for delivery
* Which order should be assigned first
* How delivery progress should be tracked
* How users can easily manage and review order statuses

The assignment specifically required assigning delivery to the nearest unpaid order while providing filtering and order management capabilities.

---

## Technology Stack

### Frontend

* React
* JavaScript (ES6+)
* Vite
* HTML5
* CSS3

### Storage

* Browser Local Storage

No backend was used because the assignment requirements can be fulfilled entirely on the client side.

---

## Application Architecture

The application is divided into multiple reusable components:

```text
App
│
├── AddOrderForm
├── FilterPanel
├── OrderTable
└── OutputPanel
```

The `App` component acts as the central controller and manages application state.

---

## Data Model

Each order contains the following fields:

```javascript
{
  orderId: "O1",
  restaurantName: "KFC",
  itemCount: 2,
  isPaid: false,
  isAssigned: false,
  deliveryDistance: 5
}
```

### Field Explanation

| Field            | Purpose                                                   |
| ---------------- | --------------------------------------------------------- |
| orderId          | Unique order identifier                                   |
| restaurantName   | Restaurant name                                           |
| itemCount        | Number of items ordered                                   |
| isPaid           | Indicates payment completion                              |
| isAssigned       | Indicates whether the order is currently out for delivery |
| deliveryDistance | Distance from delivery location                           |

---

# Features

## 1. Add Order Panel

The Add Order panel allows users to create new orders.

### Fields

* Order ID
* Restaurant Name
* Item Count
* Distance
* Paid Status

### Validation

The following validations are implemented:

* All fields are required
* Item count must be greater than zero
* Distance cannot be negative
* Duplicate Order IDs are not allowed
* Empty or whitespace-only values are rejected

### Why Validation Was Added

Validation ensures data consistency and prevents invalid orders from entering the system.

---

## 2. Orders Table

The Orders Table displays all orders currently stored in the system.

### Information Displayed

* Order ID
* Restaurant Name
* Item Count
* Current Status
* Delivery Distance
* Available Actions

### Status Types

#### Pending

Order has not yet been assigned.

```text
isPaid = false
isAssigned = false
```

#### Out For Delivery

Order has been assigned to a delivery agent.

```text
isPaid = false
isAssigned = true
```

#### Paid

Order has been successfully delivered and payment has been completed.

```text
isPaid = true
```

---

## 3. Filter Panel

The Filter Panel allows users to narrow down the visible orders.

### Available Filters

#### Status Filter

* All
* Pending
* Out For Delivery
* Paid

#### Distance Filter

Users can specify a maximum distance.

Only orders within that distance are displayed.

### Filtering Logic

An order must satisfy:

1. Selected status criteria
2. Distance criteria

Both conditions must be true for the order to appear.

---

## 4. Delivery Assignment System

This is the core feature of the application.

### Assignment Rules

Only orders that satisfy all of the following conditions are eligible:

* Not paid
* Not already assigned
* Within maximum distance

### Candidate Selection

The application first creates a list of eligible orders.

Example:

```text
Order O1 -> 5 KM
Order O2 -> 2 KM
Order O3 -> Paid
```

Eligible orders:

```text
O1
O2
```

### Nearest Order Selection

The application uses JavaScript's `reduce()` function to find the nearest order.

Example:

```text
O1 -> 5 KM
O2 -> 2 KM
O3 -> 7 KM
```

Selected:

```text
O2
```

### Result

The selected order is moved from:

```text
Pending
```

to

```text
Out For Delivery
```

---

## 5. Mark Paid Feature

Once a delivery is completed, the user can click:

```text
Mark Paid
```

The application updates:

```javascript
{
  isPaid: true,
  isAssigned: false
}
```

The order status becomes:

```text
Paid
```

---

## 6. Activity Log Panel

The Output Panel acts as an activity log.

### Examples

```text
Order O1 from KFC is Out For Delivery

Order O2 marked as Paid

No order available
```

### Why It Was Added

Instead of showing only the latest action, the panel maintains a history of events.

This improves visibility and user experience.

---

## Local Storage Persistence

### Problem

React state is lost after a page refresh.

### Solution

Orders are automatically saved to Local Storage whenever changes occur.

### Save

```javascript
localStorage.setItem(
  "orders",
  JSON.stringify(orders)
);
```

### Load

```javascript
localStorage.getItem("orders");
```

This ensures orders remain available after browser refreshes.

---

## Workflow

```text
Create Order
      ↓
Pending
      ↓
Assign Delivery
      ↓
Out For Delivery
      ↓
Mark Paid
      ↓
Paid
```

---

## Design Decisions

### Why React?

React provides component-based architecture and efficient state management.

### Why Local Storage?

The assignment did not require a backend.

Local Storage provides a lightweight persistence solution and demonstrates state persistence.

### Why Separate Components?

Separating UI into multiple components improves:

* Readability
* Maintainability
* Reusability

### Why Add `isAssigned`?

The original model only contained Paid and Unpaid states.

In real delivery systems, an order can be:

* Pending
* Out For Delivery
* Paid

Introducing `isAssigned` creates a more realistic order lifecycle.

---

## Installation

```bash
git clone <repository-url>
cd food-delivery-app
npm install
npm run dev
```

Application will be available at:

```text
http://localhost:5173
```

---

## Build for Production

```bash
npm run build
```
