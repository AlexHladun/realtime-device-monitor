export interface DeviceUpdate {
    type: 'device:update'
    deviceId: string
    sequence: number
    timestamp: number
    position: {
        x: number
        y: number
    }
    sensor: number
}

export interface DeviceState {
    id: string
    position: {
        x: number
        y: number
    }
    sequence: number
    sensor: number
    lastSeen: number
    sensorHistory: number[]
}