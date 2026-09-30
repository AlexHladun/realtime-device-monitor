import { useDeviceStream } from './hooks/useDeviceStream';
import { DeviceMap } from "./components/DeviceMap.tsx";
import { DeviceDetails } from "./components/DeviceDetails.tsx";
import { useState } from "react";

function App() {
  const devices = useDeviceStream();
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null)

    return (
        <div className="app">
            <h1>Realtime Device Monitor</h1>

            <div className="map-container">
                <DeviceMap
                    devices={Object.values(devices)}
                    selectedDeviceId={selectedDeviceId}
                    onSelectDevice={setSelectedDeviceId}
                />
            </div>

            <div className="details-container">
                <DeviceDetails
                    device={selectedDeviceId ? devices[selectedDeviceId] : null}
                />
            </div>
        </div>
    );
}

export default App;