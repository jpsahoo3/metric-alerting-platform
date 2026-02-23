const API_BASE = 'http://localhost:5000';

export const api = {
  // Alerts
  getAlerts: () => fetch(`${API_BASE}/alerts`).then(r => r.json()),
  createAlert: (alert) => fetch(`${API_BASE}/alerts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(alert),
  }).then(r => r.json()),
  deleteAlert: (id) => fetch(`${API_BASE}/alerts/${id}`, {
    method: 'DELETE',
  }).then(r => r.json()),

  // Metrics
  submitMetric: (metric) => fetch(`${API_BASE}/metrics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(metric),
  }).then(r => r.json()),

  // Alert Events
  getAlertEvents: () => fetch(`${API_BASE}/alert-events`).then(r => r.json()),
};
