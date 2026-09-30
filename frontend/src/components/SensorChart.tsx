interface SensorChartProps {
    values: number[];
}

const WIDTH = 300;
const HEIGHT = 100;

const GRID_VALUES = [0, 25, 50, 75, 100];

export function SensorChart({ values }: SensorChartProps) {
    if (values.length < 2) {
        return <p>Waiting for sensor data...</p>;
    }

    const points = values
        .map((value, index) => {
            const x = (index / (values.length - 1)) * WIDTH;
            const y = HEIGHT - (value / 100) * HEIGHT;

            return `${x},${y}`;
        })
        .join(' ');

    return (
        <div>
            <p>Sensor history</p>

            <svg
                viewBox={`0 0 ${WIDTH + 35} ${HEIGHT + 10}`}
                width="100%"
                height="150"
                role="img"
                aria-label="Sensor history"
            >
                {GRID_VALUES.map((value) => {
                    const y = HEIGHT - (value / 100) * HEIGHT;

                    return (
                        <g key={value}>
                            <line
                                x1="30"
                                y1={y}
                                x2={WIDTH + 30}
                                y2={y}
                                stroke="currentColor"
                                strokeOpacity="0.15"
                                strokeWidth="0.5"
                            />

                            <text
                                x="25"
                                y={y + 2}
                                textAnchor="end"
                                fontSize="5"
                                fill="currentColor"
                                opacity="0.6"
                            >
                                {value}
                            </text>
                        </g>
                    );
                })}

                <polyline
                    points={points
                        .split(' ')
                        .map((point) => {
                            const [x, y] = point.split(',').map(Number);
                            return `${x + 30},${y}`;
                        })
                        .join(' ')}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                />
            </svg>
        </div>
    );
}