# Realtime Device Monitor

A simplified IoT monitoring application that demonstrates real-time communication, live device state visualization, and handling unreliable network conditions.

The project simulates multiple IoT devices that periodically send position and sensor data through WebSocket communication. The frontend displays the current device state and handles delayed or out-of-order updates.

---

## Features

### Backend

Implemented with Node.js and WebSocket.

The backend:

- simulates 5 virtual IoT devices;
- periodically generates:
  - device position (`x`, `y`);
  - sensor readings;
  - update sequence numbers;
- randomly simulates device offline periods;
- stops sending messages while a device is offline;
- introduces artificial network delays to simulate delayed messages;
- broadcasts device updates to connected clients.

The devices are stored in memory because this task represents a real-time simulation where persistence is not required.

---

### Frontend

Implemented with React and TypeScript.

The frontend:

- connects to the backend through WebSocket;
- renders devices on a 2D SVG map;
- displays device states:
  - online;
  - stale;
  - offline;
- allows selecting a device;
- displays live sensor value visualization;
- stores recent sensor history for the selected device.

The state management logic is separated into a reducer to keep state transitions predictable and independently testable.

---

# Architecture Decisions

## Handling delayed and out-of-order messages

Real-time systems may receive messages in a different order than they were generated.

To handle this, every device update contains a monotonically increasing `sequence` number.

When the frontend receives an update:

- if the incoming sequence number is greater than the stored one, the update is accepted;
- if the sequence number is older or equal, the update is ignored.

Example:

  Received:
  device-1 seq=10
  device-1 seq=12
  device-1 seq=11

  Accepted:
  10 → 12

  Ignored:
  11
  
---
## Handling offline devices

When a device stops sending updates, the frontend does not immediately remove it.

Instead, the device state is calculated based on the time since the last received update:

Online:
recent update received

Stale:
device has not reported recently, but may recover

Offline:
device has not reported for a longer period

When a device reconnects, the last known position is preserved until a new update arrives.

This approach avoids losing the last confirmed device location and better represents how monitoring systems usually behave.

---

## Data flow

IoT Simulator
|
|
WebSocket
|
|
React Application
|
|
Reducer State Management
|
|
UI Components

---

# Project Structure

src
├── components
│ ├── DeviceMap
│ ├── DeviceDetails
│ └── SensorChart
│
├── hooks
│ └── useDeviceStream
│
├── reducer
│ └── deviceReducer
│
├── utils
│ └── deviceStatus
│
└── types

---
## Device availability logic

Device status is calculated from the time since the last received update:

  - Online:
  recent update received

  - Stale:
  device has not reported recently, but may recover

  - Offline:
  device has not reported for a longer period

The last known position is preserved while a device is offline. This allows operators to see the last confirmed location instead of losing the device completely.

---

## Running locally

Install dependencies:

```bash
npm install
```
Start development servers:
```
npm run dev
```

The application starts:

Frontend:
http://localhost:5173


Backend WebSocket server:
ws://localhost:8080

## Testing

Frontend tests can be executed with:
```
npm run test -w frontend
```

Covered scenarios:

device status calculation;
accepting newer device updates;
ignoring outdated messages;
limiting sensor history size.
