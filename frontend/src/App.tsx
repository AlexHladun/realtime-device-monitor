import { useDeviceStream } from './hooks/useDeviceStream';

function App() {
  const devices = useDeviceStream();

  return (
      <div>
        <h1>Realtime Device Monitor</h1>

        <pre>
          {JSON.stringify(devices, null, 2)}
        </pre>
      </div>
  );
}

export default App;