import { PipBoyProvider } from './context/PipBoyContext';
import PipBoy from './components/PipBoy';

function App() {
  return (
    <PipBoyProvider>
      <PipBoy />
    </PipBoyProvider>
  );
}

export default App;

