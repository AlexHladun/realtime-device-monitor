import { DeviceUpdate } from "./types";

interface DeviceSimulatorOptions {
    id: string
    updateIntervalMs?: number
    offlineProbability?: number
}

export class DeviceSimulator {
    private readonly id: string;
    private readonly updateIntervalMs: number;
    private readonly offlineProbability: number;

    private position = {
        x: Math.random() * 100,
        y: Math.random() * 100,
    }

    private sensor = Math.random() * 100;
    private sequence = 0

    private isOffline = false
    private offlineUntil = 0

    private timer?: ReturnType<typeof setInterval>;

    constructor(options: DeviceSimulatorOptions) {
        this.id = options.id;
        this.updateIntervalMs = options.updateIntervalMs ?? 500;
        this.offlineProbability = options.offlineProbability ?? 0.05;
    }

    start(onUpdate: (onUpdate: DeviceUpdate) => void): void {
        this.timer = setInterval(() => {
            const update  = this.tick()

            if(update) {
                onUpdate(update)
            }
        }, this.updateIntervalMs)
    }

    stop(): void {
        if(this.timer) {
            clearInterval(this.timer)
            this.timer = undefined
        }
    }

    private tick(): DeviceUpdate | null {
        const now = Date.now()

        if(this.isOffline) {
            if(now < this.offlineUntil) {
                return null
            }
            this.isOffline = false
        } else if (Math.random() < this.offlineProbability) {
            this.isOffline = true
            this.offlineUntil = now + this.randomOfflineDuration()

            return null
        }

        this.updatePosition();
        this.updateSensor()

        this.sequence += 1

        return {
            type: 'device:update',
            deviceId: this.id,
            sequence: this.sequence,
            timestamp: now,
            position: {...this.position},
            sensor: this.sensor,
        }
    }

    private updatePosition(): void {
        this.position.x = this.moveValue(this.position.x)
        this.position.y = this.moveValue(this.position.y)
    }

    private updateSensor(): void {
        this.sensor = this.moveValue(this.sensor)
    }

    private moveValue(value: number): number {
        const delta = Math.random() * 10 - 5

        return Math.min(100, Math.max(0, value + delta))
    }

    private randomOfflineDuration(): number {
        return 2000 + Math.random() * 4000
    }
}