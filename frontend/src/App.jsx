import React, { useState } from 'react';
import { AlertManagement } from './components/AlertManagement';
import { MetricSimulation } from './components/MetricSimulation';
import { AlertEvents } from './components/AlertEvents';
import './styles/styles.css';

function App() {
  const [activeScreen, setActiveScreen] = useState('alerts');

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>📊 Real-Time Metric Alerting Platform</h1>
          <p>Configure alerts, simulate metrics, and monitor events</p>
        </div>
      </header>

      <nav className="nav">
        <button
          className={`nav-btn ${activeScreen === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveScreen('alerts')}
        >
          📢 Alert Management
        </button>
        <button
          className={`nav-btn ${activeScreen === 'metrics' ? 'active' : ''}`}
          onClick={() => setActiveScreen('metrics')}
        >
          📊 Metric Simulation
        </button>
        <button
          className={`nav-btn ${activeScreen === 'events' ? 'active' : ''}`}
          onClick={() => setActiveScreen('events')}
        >
          🔔 Alert Events
        </button>
      </nav>

      <main className="main-content">
        {activeScreen === 'alerts' && <AlertManagement />}
        {activeScreen === 'metrics' && <MetricSimulation />}
        {activeScreen === 'events' && <AlertEvents />}
      </main>

      <footer className="footer">
        <p>Real-Time Metric Alerting Platform © 2024</p>
      </footer>
    </div>
  );
}

export default App;
