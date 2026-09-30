import type { DeviceState, DeviceUpdate } from '../types';

export const MAX_SENSOR_HISTORY = 30;

export type DeviceStateMap = Record<string, DeviceState>;

export type DeviceAction = {
    type: 'device:update';
    payload: DeviceUpdate;
};

export function deviceReducer(
    state: DeviceStateMap,
    action: DeviceAction,
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