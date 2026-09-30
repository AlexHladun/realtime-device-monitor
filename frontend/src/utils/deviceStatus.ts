export type DeviceStatus = 'online' | 'stale' | 'offline';

const ONLINE_THRESHOLD_MS = 1500;
const STALE_THRESHOLD_MS = 4000;

export function getDeviceStatus(
    lastSeen: number,
    now: number = Date.now(),
): DeviceStatus {
    const elapsed = now - lastSeen;

    if (elapsed < ONLINE_THRESHOLD_MS) {
        return 'online';
    }

    if (elapsed < STALE_THRESHOLD_MS) {
        return 'stale';
    }

    return 'offline';
}