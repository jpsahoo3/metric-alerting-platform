import React, { useState } from 'react';
import { api } from '../services/api';

export function MetricSimulation() {
  const [formData, setFormData] = useState({
    metricName: 'cpu_usage',
    value: '',
    timestamp: new Date().toISOString().slice(0, 16),
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!formData.metricName.trim() || !formData.value) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const result = await api.submitMetric({
        metricName: formData.metricName,
        value: parseFloat(formData.value),
        timestamp: new Date(formData.timestamp).toISOString(),
      });

      if (result.success) {
        setResult(result.data);
        setError(null);
      } else {
        setError(result.error || 'Failed to submit metric');
      }
    } catch (err) {
      setError('Failed to submit metric');
    } finally {
      setLoading(false);
    }
  };

  const quickSubmit = async (metricName, value) => {
    try {
      setLoading(true);
      const result = await api.submitMetric({
        metricName,
        value,
        timestamp: new Date().toISOString(),
      });

      if (result.success) {
        setResult(result.data);
        setError(null);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen">
      <h2>📊 Metric Simulation</h2>

      <form onSubmit={handleSubmit} className="form">
        <h3>Submit Metric Data</h3>

        <div className="form-group">
          <label>Metric Name *</label>
          <input
            type="text"
            name="metricName"
            value={formData.metricName}
            onChange={handleInputChange}
            placeholder="e.g., cpu_usage"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Value *</label>
            <input
              type="number"
              name="value"
              value={formData.value}
              onChange={handleInputChange}
              placeholder="e.g., 85.5"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label>Timestamp</label>
            <input
              type="datetime-local"
              name="timestamp"
              value={formData.timestamp}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Metric'}
        </button>
      </form>

      <div className="quick-actions">
        <h3>Quick Test Scenarios</h3>
        <div className="button-group">
          <button 
            onClick={() => quickSubmit('cpu_usage', 95)}
            disabled={loading}
            className="btn-secondary"
          >
            High CPU (95%)
          </button>
          <button 
            onClick={() => quickSubmit('memory_usage', 85)}
            disabled={loading}
            className="btn-secondary"
          >
            High Memory (85%)
          </button>
          <button 
            onClick={() => quickSubmit('disk_usage', 92)}
            disabled={loading}
            className="btn-secondary"
          >
            High Disk (92%)
          </button>
          <button 
            onClick={() => quickSubmit('api_latency', 2500)}
            disabled={loading}
            className="btn-secondary"
          >
            High Latency (2500ms)
          </button>
        </div>
      </div>

      {error && <div className="error-box"><p>{error}</p></div>}

      {result && (
        <div className="result-box success-box">
          <h3>✓ Metric Submitted</h3>
          <p><strong>Metric:</strong> {result.metricName}</p>
          <p><strong>Value:</strong> {result.value}</p>
          <p><strong>Timestamp:</strong> {new Date(result.timestamp).toLocaleString()}</p>
          
          {result.triggeredAlerts > 0 ? (
            <div className="alert-triggered">
              <h4>🚨 {result.triggeredAlerts} Alert(s) Triggered!</h4>
              {result.events.map(event => (
                <div key={event.id} className="triggered-event">
                  <strong>{event.alertMessage}</strong>
                  <p>{event.alertName} - Value {event.metricValue} {event.comparator} {event.threshold}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-alerts">No alerts triggered for this metric</p>
          )}
        </div>
      )}
    </div>
  );
}
