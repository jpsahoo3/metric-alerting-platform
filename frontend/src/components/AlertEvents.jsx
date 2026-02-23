import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export function AlertEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 3000); // Auto-refresh every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchEvents = async () => {
    try {
      const result = await api.getAlertEvents();
      if (result.success) {
        setEvents(result.data);
      }
    } catch (err) {
      setError('Failed to fetch alert events');
    }
  };

  const filteredEvents = filter
    ? events.filter(event =>
        event.metricName.toLowerCase().includes(filter.toLowerCase()) ||
        event.alertName.toLowerCase().includes(filter.toLowerCase())
      )
    : events;

  return (
    <div className="screen">
      <h2>🔔 Alert Events History</h2>

      <div className="filter-section">
        <input
          type="text"
          placeholder="Filter by metric name or alert name..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-input"
        />
      </div>

      {error && <div className="error-box"><p>{error}</p></div>}

      <div className="events-summary">
        <div className="stat-box">
          <div className="stat-number">{events.length}</div>
          <div className="stat-label">Total Events</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">
            {new Set(events.map(e => e.metricName)).size}
          </div>
          <div className="stat-label">Unique Metrics</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">
            {new Set(events.map(e => e.alertId)).size}
          </div>
          <div className="stat-label">Triggered Alerts</div>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="empty-message">
          <p>No alert events triggered yet</p>
          <p>Create alerts and submit metrics to trigger events</p>
        </div>
      ) : (
        <div className="events-list">
          <h3>Latest Events ({filteredEvents.length})</h3>
          {filteredEvents.length === 0 ? (
            <p className="empty-message">No events match your filter</p>
          ) : (
            filteredEvents.map(event => (
              <div key={event.id} className="event-card">
                <div className="event-header">
                  <span className="alert-badge">🚨 {event.alertName}</span>
                  <span className="timestamp-badge">
                    {new Date(event.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="event-body">
                  <p><strong>Message:</strong> {event.alertMessage}</p>
                  <div className="event-details">
                    <div className="detail-item">
                      <span className="label">Metric:</span>
                      <span className="value">{event.metricName}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Value:</span>
                      <span className="value">{event.metricValue}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Condition:</span>
                      <span className="value">
                        {event.comparator} {event.threshold}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <button onClick={fetchEvents} className="btn-refresh" disabled={loading}>
        {loading ? 'Refreshing...' : 'Refresh'}
      </button>
    </div>
  );
}
