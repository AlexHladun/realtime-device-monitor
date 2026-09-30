import { useEffect, useReducer, useState } from 'react';
import type { DeviceUpdate } from '../types';
import {
    deviceReducer,
    type DeviceStateMap,
} from '../reducer/deviceReducer';

export function useDeviceStream(): DeviceStateMap {
    const [devices, dispatch] = useReducer(deviceReducer, {});
    const [, setNow] = useState(Date.now());

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(Date.now());
        }, 500)
        return () => {
            clearInterval(timer);
        }
    }, []);

    useEffect(() => {
        let ws: WebSocket | null = null;
        let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
        let isUnmounted = false;

        const connect = () => {
            if (isUnmounted) {
                return;
            }

            ws = new WebSocket('ws://localhost:8080');

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

                if (!isUnmounted) {
                    reconnectTimer = setTimeout(connect, 1000);
                }
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        };

        connect();

        return () => {
            isUnmounted = true;

            if (reconnectTimer) {
                clearTimeout(reconnectTimer);
            }

            ws?.close();
        };
    }, []);

    return devices;
}