import { describe, expect, it } from 'vitest';
import { getDeviceStatus } from './deviceStatus';

describe('getDeviceStatus', () => {
    const now = 10_000;

    it('returns online for recent updates', () => {
        expect(getDeviceStatus(9_500, now)).toBe('online');
    });

    it('returns stale when update is older', () => {
        expect(getDeviceStatus(8_000, now)).toBe('stale');
    });

    it('returns offline when device has not reported for a long time', () => {
        expect(getDeviceStatus(5_000, now)).toBe('offline');
    });
});