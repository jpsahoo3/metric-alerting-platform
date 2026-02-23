import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export function AlertManagement() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    metricName: '',
    threshold: '',
    comparator: 'GT',
    alertMessage: '',
  });

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const result = await api.getAlerts();
      if (result.success) {
        setAlerts(result.data);
      }
    } catch (err) {
      setError('Failed to fetch alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setValidationErrors([]);
  };

  const isDuplicateMetricName = (nameToCheck) => {
    if (!nameToCheck) return false;
    return alerts.some(
      (a) => a.metricName && a.metricName.toLowerCase() === nameToCheck.toLowerCase()
    );
  };

  const handleMetricNameBlur = () => {
    if (isDuplicateMetricName(formData.metricName)) {
      setValidationErrors(['Metric name must be unique. An alert for this metric already exists.']);
    }
  };

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    setValidationErrors([]);

    // Client-side duplicate metricName check (case-insensitive)
    if (isDuplicateMetricName(formData.metricName)) {
      setValidationErrors(['Metric name must be unique. An alert for this metric already exists.']);
      return;
    }

    try {
      setLoading(true);
      const result = await api.createAlert(formData);
      
      if (result.success) {
        setAlerts(prev => [...prev, result.data]);
        setFormData({
          name: '',
          metricName: '',
          threshold: '',
          comparator: 'GT',
          alertMessage: '',
        });
        setError(null);
        // refresh alerts to ensure local list is up to date
        fetchAlerts();
      } else {
        setValidationErrors(result.errors || ['Unknown error']);
      }
    } catch (err) {
      setError('Failed to create alert');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlert = async (id) => {
    try {
      const result = await api.deleteAlert(id);
      if (result.success) {
        setAlerts(prev => prev.filter(a => a.id !== id));
      }
    } catch (err) {
      setError('Failed to delete alert');
    }
  };

  return (
    <div className="screen">
      <h2>📢 Alert Management</h2>
      
      <form onSubmit={handleCreateAlert} className="form">
        <h3>Create New Alert</h3>
        
        <div className="form-group">
          <label>Alert Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., CPU High"
            required
          />
        </div>

        <div className="form-group">
          <label>Metric Name *</label>
          <input
            type="text"
            name="metricName"
            value={formData.metricName}
            onChange={handleInputChange}
            onBlur={handleMetricNameBlur}
            placeholder="e.g., cpu_usage, memory_usage"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Threshold *</label>
            <input
              type="number"
              name="threshold"
              value={formData.threshold}
              onChange={handleInputChange}
              placeholder="e.g., 80"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label>Comparator *</label>
            <select
              name="comparator"
              value={formData.comparator}
              onChange={handleInputChange}
            >
              <option value="GT">Greater Than (GT)</option>
              <option value="LT">Less Than (LT)</option>
              <option value="GTE">Greater or Equal (GTE)</option>
              <option value="LTE">Less or Equal (LTE)</option>
              <option value="EQ">Equal (EQ)</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Alert Message *</label>
          <textarea
            name="alertMessage"
            value={formData.alertMessage}
            onChange={handleInputChange}
            placeholder="e.g., CPU usage is critical!"
            rows="2"
            required
          />
        </div>

        {validationErrors.length > 0 && (
          <div className="error-box">
            {validationErrors.map((err, i) => (
              <p key={i}>❌ {err}</p>
            ))}
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Alert'}
        </button>
      </form>

      {error && <div className="error-box"><p>{error}</p></div>}

      <div className="alerts-list">
        <h3>Configured Alerts ({alerts.length})</h3>
        {alerts.length === 0 ? (
          <p className="empty-message">No alerts configured yet</p>
        ) : (
          <div className="card-grid">
            {alerts.map(alert => (
              <div key={alert.id} className="card">
                <div className="card-header">
                  <h4>{alert.name}</h4>
                  <button
                    onClick={() => handleDeleteAlert(alert.id)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </div>
                <div className="card-body">
                  <p><strong>Metric:</strong> {alert.metricName}</p>
                  <p><strong>Condition:</strong> {alert.comparator} {alert.threshold}</p>
                  <p><strong>Message:</strong> {alert.alertMessage}</p>
                  <p className="timestamp">Created: {new Date(alert.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
