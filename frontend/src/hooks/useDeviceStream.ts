import { useEffect, useReducer } from 'react';
import type { DeviceState, DeviceUpdate } from '../types';

const MAX_SENSOR_HISTORY = 30;

type DeviceStateMap = Record<string, DeviceState>;

type Action = {
    type: 'device:update';
    payload: DeviceUpdate;
};

function deviceReducer(
    state: DeviceStateMap,
    action: Action,
): DeviceStateMap {
    const update = action.payload;
    const existing = state[update.deviceId];

    if (existing && update.sequence <= existing.sequence) {
        return state;
    }

    const previousHistory = existing?.sensorHistory ?? [];

    return {
        ...state,
        [update.deviceId]: {
            id: update.deviceId,
            position: update.position,
            sensor: update.sensor,
            sequence: update.sequence,
            lastSeen: Date.now(),
            sensorHistory: [
                ...previousHistory,
                update.sensor,
            ].slice(-MAX_SENSOR_HISTORY),
        },
    };
}

export function useDeviceStream(): DeviceStateMap {
    const [devices, dispatch] = useReducer(deviceReducer, {});

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8080');

        ws.onopen = () => {
            console.log('Connected to WebSocket server');
        };

        ws.onmessage = (event) => {
            const update: DeviceUpdate = JSON.parse(event.data);

            if (update.type !== 'device:update') {
                return;
            }

            dispatch({
                type: 'device:update',
                payload: update,
            });
        };

        ws.onclose = () => {
            console.log('Disconnected from WebSocket server');
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            ws.close();
        };
    }, []);

    return devices;
}