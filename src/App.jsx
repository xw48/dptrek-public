import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { initPostHog } from './posthog';
import Home from './pages/Home';
import Module from './pages/Module';

function App() {
  // Initialize PostHog when app loads
  useEffect(() => {
    initPostHog();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/module/:id" element={<Module />} />
      </Routes>
    </Router>
  );
}

export default App;