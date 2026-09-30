import type { DeviceState } from '../types';
import { getDeviceStatus } from "../utils/deviceStatus.ts";

interface DeviceMapProps {
    devices: DeviceState[];
    selectedDeviceId: string | null;
    onSelectDevice: (deviceId: string) => void;
}

export function DeviceMap({ devices, selectedDeviceId, onSelectDevice, }: DeviceMapProps) {
    return (
        <svg
            viewBox="-5 -5 110 110"
            width="100%"
            height="500"
            role="img"
            aria-label="Device map"
        >
            {devices.map((device) => {
                const status  = getDeviceStatus(device.lastSeen)
                return (
                    <g key={device.id}>
                        <circle
                            cx={device.position.x}
                            cy={device.position.y}
                            r="1.5"
                            className={`device device--${status} ${
                                selectedDeviceId === device.id ? 'device--selected' : ''
                            }`}
                            cursor="pointer"
                            onClick={() => onSelectDevice(device.id)}
                        />

                        <text
                            x={device.position.x + 2}
                            y={device.position.y - 2}
                            className="device-label"
                        >
                            {device.id}
                        </text>
                    </g>)
                })
            }
        </svg>
    );
}