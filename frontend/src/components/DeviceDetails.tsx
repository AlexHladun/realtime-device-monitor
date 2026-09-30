import type { DeviceState } from '../types';
import { getDeviceStatus } from '../utils/deviceStatus';
import { SensorChart } from "./SensorChart.tsx";


interface DeviceDetailsProps {
    device: DeviceState | null;
}

export function DeviceDetails({ device }: DeviceDetailsProps) {
    if (!device) {
        return (
            <section>
                <h2>Device details</h2>
                <p>Select a device to see its details.</p>
            </section>
        );
    }

    const status = getDeviceStatus(device.lastSeen);
    const lastSeenAgo = Date.now() - device.lastSeen;

    return (
        <section>
            <h2>{device.id}</h2>

            <p>Status: {status}</p>

            <p>
                Position: ({device.position.x.toFixed(1)},{' '}
                {device.position.y.toFixed(1)})
            </p>

            <p>Sensor: {device.sensor.toFixed(1)}</p>

            <SensorChart values={device.sensorHistory} />

            <p>Last seen: {lastSeenAgo} ms ago</p>

            <p>Sequence: {device.sequence}</p>
        </section>
    );
}