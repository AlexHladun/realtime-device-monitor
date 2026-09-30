export interface DeviceUpdate {
    type: 'device:update';
    deviceId: string;
    sequence: number;
    timestamp: number;
    position: {
        x: number;
        y: number;
    };
    sensor: number;
}
