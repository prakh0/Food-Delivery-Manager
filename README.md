# [Food Delivery Manager](https://github.com/YOUR_GITHUB_USERNAME/food-delivery-app)

[Live Demo](https://food-delivery-manager.vercel.app/) | [Source Code](https://github.com/YOUR_GITHUB_USERNAME/food-delivery-app)

---

# Overview

Food Delivery Manager is a React-based web application that manages food delivery orders and automates delivery assignment based on business rules.

The application allows users to:

* Create food delivery orders
* View all orders
* Filter orders by status and distance
* Automatically assign deliveries
* Track delivery progress
* Mark deliveries as paid
* View activity history
* Persist data across browser refreshes

The project was built to demonstrate:

* State management using React Hooks
* Data validation
* Filtering and sorting logic
* Delivery prioritization algorithms
* Component-based architecture
* Browser storage persistence

---

# Assignment Requirements

The system was required to:

### Create Orders

Users should be able to add new food delivery orders.

### Manage Orders

Orders should be displayed in a structured table.

### Filter Orders

Users should be able to filter orders based on:

* Status
* Distance

### Assign Delivery

The system should automatically assign delivery to the nearest unpaid order.

### Track Delivery Progress

The system should provide visibility into order status changes.

---

# Constraints Considered

Several constraints were implemented to maintain data integrity.

## Required Fields

Every order must contain:

* Order ID
* Restaurant Name
* Item Count
* Delivery Distance

No field can be left empty.

### Why?

Incomplete orders would make delivery assignment unreliable and could break business logic.

---

## Unique Order IDs

Duplicate Order IDs are not allowed.

### Why?

Each order must be uniquely identifiable.

Without uniqueness:

```text
Order O1
Order O1
```

The system would not know which order should be updated.

To solve this, duplicate checking is performed before inserting a new order.

---

## Item Count Validation

Item count must be greater than 0.

Invalid:

```text
0
-1
```

Valid:

```text
1
2
10
```

### Why?

An order cannot contain zero or negative items.

---

## Distance Validation

Delivery distance cannot be negative.

Invalid:

```text
-5
```

Valid:

```text
0
2
10
```

### Why?

Negative distances are not meaningful in a delivery system.

---

# Application Architecture

The application follows a component-based architecture.

```text
App
│
├── AddOrderForm
├── FilterPanel
├── OrderTable
└── OutputPanel
```

---

## App Component

Acts as the central controller.

Responsible for:

* Managing state
* Delivery assignment logic
* Filtering logic
* Activity log management
* Browser storage integration

---

## AddOrderForm Component

Responsible for:

* Capturing user input
* Validating orders
* Creating new orders

---

## FilterPanel Component

Responsible for:

* Status filtering
* Distance filtering

---

## OrderTable Component

Responsible for:

* Displaying orders
* Showing order status
* Providing actions such as Mark Paid

---

## OutputPanel Component

Responsible for:

* Displaying activity history
* Showing assignment events
* Showing payment events

---

# Data Model

Each order is represented as:

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

---

## Field Explanation

| Field            | Purpose                    |
| ---------------- | -------------------------- |
| orderId          | Unique order identifier    |
| restaurantName   | Restaurant name            |
| itemCount        | Number of ordered items    |
| isPaid           | Payment status             |
| isAssigned       | Delivery assignment status |
| deliveryDistance | Distance of delivery       |

---

# Order Lifecycle

Initially, the assignment only required tracking paid and unpaid orders.

However, in a real delivery workflow an order typically progresses through multiple stages.

To represent this more accurately, an additional field called `isAssigned` was introduced.

This allows an order to move through the following lifecycle:

```text
Pending
    ↓
Out For Delivery
    ↓
Paid
```

---

## Pending

Order created but not assigned.

```javascript
isPaid: false
isAssigned: false
```

---

## Out For Delivery

Order assigned to a delivery agent.

```javascript
isPaid: false
isAssigned: true
```

---

## Paid

Delivery completed and payment received.

```javascript
isPaid: true
```

---

# Delivery Assignment Algorithm

This is the core functionality of the application.

---

## Step 1: Identify Eligible Orders

Only orders satisfying all conditions are eligible:

* Not paid
* Not already assigned
* Within maximum distance

Example:

| Order | Paid | Assigned | Distance |
| ----- | ---- | -------- | -------- |
| O1    | No   | No       | 5 KM     |
| O2    | No   | No       | 2 KM     |
| O3    | Yes  | No       | 1 KM     |

Eligible orders:

```text
O1
O2
```

O3 is excluded because it has already been paid.

---

## Step 2: Select Nearest Order

Among eligible orders, the nearest order is selected.

Example:

| Order | Distance |
| ----- | -------- |
| O1    | 5 KM     |
| O2    | 2 KM     |
| O3    | 7 KM     |

Selected:

```text
O2
```

because it has the smallest delivery distance.

This is implemented using JavaScript's `reduce()` function.

---

## Step 3: Update Status

After assignment:

Before:

```javascript
{
  isPaid: false,
  isAssigned: false
}
```

After:

```javascript
{
  isPaid: false,
  isAssigned: true
}
```

The order becomes:

```text
Out For Delivery
```

---

# Filtering Logic

The system supports filtering based on:

## Status

* All
* Pending
* Out For Delivery
* Paid

---

## Distance

Users can specify a maximum delivery distance.

Example:

```text
Maximum Distance = 5 KM
```

Only orders with:

```text
distance <= 5
```

are displayed.

---

## Combined Filtering

An order must satisfy:

```text
Status Filter
AND
Distance Filter
```

to be displayed.

---

# Mark Paid Feature

Once delivery is completed, users can click:

```text
Mark Paid
```

The order is updated:

Before:

```javascript
{
  isPaid: false,
  isAssigned: true
}
```

After:

```javascript
{
  isPaid: true,
  isAssigned: false
}
```

Status becomes:

```text
Paid
```

---

# Activity Log

The Output Panel acts as an activity log.

Examples:

```text
Order O1 from KFC is Out For Delivery

Order O1 marked as Paid

No order available
```

Instead of displaying only the latest event, the application stores a history of actions for better visibility.

---

# Browser Storage Persistence

## Problem

React state exists only in memory.

Refreshing the page would normally remove all orders.

---

## Solution

Browser Local Storage is used.

### Saving Orders

```javascript
localStorage.setItem(
  "orders",
  JSON.stringify(orders)
);
```

Whenever the orders list changes, it is automatically saved.

---

### Loading Orders

```javascript
localStorage.getItem("orders");
```

Previously saved orders are loaded when the application starts.

---

## Benefits

* Orders survive browser refreshes.
* No backend required.
* Better user experience.
* Demonstrates client-side persistence.

---

# Design Decisions

## Why React?

React provides:

* Reusable components
* Efficient rendering
* Simple state management

---

## Why Local Storage?

The assignment did not require a backend database.

Local Storage provides a lightweight persistence solution.

---

## Why Introduce isAssigned?

The original requirement only distinguished between paid and unpaid orders.

However, a realistic delivery workflow requires tracking orders that have already been assigned.

Adding `isAssigned` prevents the same order from being assigned multiple times.

---

## Why Maintain an Activity Log?

Users should be able to review previous actions.

The activity log provides visibility into:

* Assignments
* Payments
* System notifications

---

# Installation

```bash
git clone <repository-url>
cd food-delivery-app
npm install
npm run dev
```

Application runs at:

```text
http://localhost:5173
```

---

# Build

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

