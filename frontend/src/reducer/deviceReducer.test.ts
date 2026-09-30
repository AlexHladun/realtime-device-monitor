import { describe, expect, it } from 'vitest';
import { deviceReducer, type DeviceStateMap, } from './deviceReducer';
import type { DeviceUpdate } from '../types';

function createUpdate(
    sequence: number,
    sensor: number,
): DeviceUpdate {
    return {
        type: 'device:update',
        deviceId: 'device-1',
        sequence,
        timestamp: Date.now(),
        position: {
            x: sequence,
            y: sequence,
        },
        sensor,
    };
}

describe('deviceReducer', () => {
    it('accepts a newer update', () => {
        const state = deviceReducer(
            {},
            {
                type: 'device:update',
                payload: createUpdate(1, 50),
            },
        );

        const nextState = deviceReducer(
            state,
            {
                type: 'device:update',
                payload: createUpdate(2, 60),
            },
        );

        expect(nextState['device-1'].sequence).toBe(2);
        expect(nextState['device-1'].sensor).toBe(60);
    });

    it('ignores an older update', () => {
        const state = deviceReducer(
            {},
            {
                type: 'device:update',
                payload: createUpdate(10, 80),
            },
        );

        const nextState = deviceReducer(
            state,
            {
                type: 'device:update',
                payload: createUpdate(9, 20),
            },
        );

        expect(nextState['device-1'].sequence).toBe(10);
        expect(nextState['device-1'].sensor).toBe(80);
    });

    it('ignores an update with the same sequence', () => {
        const state = deviceReducer(
            {},
            {
                type: 'device:update',
                payload: createUpdate(10, 80),
            },
        );

        const nextState = deviceReducer(
            state,
            {
                type: 'device:update',
                payload: createUpdate(10, 20),
            },
        );

        expect(nextState['device-1'].sequence).toBe(10);
        expect(nextState['device-1'].sensor).toBe(80);
    });

    it('keeps only the latest 30 sensor values', () => {
        let state: DeviceStateMap = {};

        for (let sequence = 1; sequence <= 35; sequence += 1) {
            state = deviceReducer(
                state,
                {
                    type: 'device:update',
                    payload: createUpdate(sequence, sequence),
                },
            );
        }

        expect(state['device-1'].sensorHistory).toHaveLength(30);
        expect(state['device-1'].sensorHistory[0]).toBe(6);
        expect(state['device-1'].sensorHistory[29]).toBe(35);
    });
});