
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Remove dark mode class addition
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root not found in index.html. Check your HTML template.');
}
createRoot(rootElement).render(<App />);
