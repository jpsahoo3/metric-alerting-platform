import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { store } from './models.js';
import { AlertService } from './alertService.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ==================== ALERT ROUTES ====================

// GET /alerts - Retrieve all alerts
app.get('/alerts', (req, res) => {
  try {
    const alerts = store.getAlerts();
    res.json({ success: true, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /alerts - Create a new alert
app.post('/alerts', (req, res) => {
  try {
    const { name, metricName, threshold, comparator, alertMessage } = req.body;

    // Validate input
    const validation = AlertService.validateAlert({
      name,
      metricName,
      threshold,
      comparator,
      alertMessage,
    });

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        errors: validation.errors,
      });
    }

    // Enforce unique metricName across alerts (case-insensitive)
    const existing = store
      .getAlerts()
      .find((a) => a.metricName && a.metricName.toLowerCase() === metricName.toLowerCase());

    if (existing) {
      return res.status(400).json({
        success: false,
        errors: ['Metric name must be unique. An alert for this metric already exists.'],
      });
    }

    const alert = {
      id: uuidv4(),
      name,
      metricName,
      threshold: parseFloat(threshold),
      comparator,
      alertMessage,
      createdAt: new Date().toISOString(),
    };

    store.addAlert(alert);
    res.status(201).json({ success: true, data: alert });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /alerts/:id - Delete an alert
app.delete('/alerts/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleted = store.deleteAlert(id);

    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Alert not found' });
    }

    res.json({ success: true, message: 'Alert deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== METRIC ROUTES ====================

// POST /metrics - Ingest and evaluate metric data
app.post('/metrics', (req, res) => {
  try {
    const { metricName, value, timestamp } = req.body;

    if (!metricName || metricName.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'metricName is required',
      });
    }

    if (value === undefined || value === null) {
      return res.status(400).json({
        success: false,
        error: 'value is required',
      });
    }

    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) {
      return res.status(400).json({
        success: false,
        error: 'value must be a number',
      });
    }

    const metricTimestamp = timestamp || new Date().toISOString();

    // Evaluate metric against all alerts
    const triggeredEvents = AlertService.evaluateMetric(
      metricName,
      parsedValue,
      metricTimestamp
    );

    res.json({
      success: true,
      data: {
        metricName,
        value: parsedValue,
        timestamp: metricTimestamp,
        triggeredAlerts: triggeredEvents.length,
        events: triggeredEvents,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== ALERT EVENTS ROUTES ====================

// GET /alert-events - Retrieve all triggered alert events
app.get('/alert-events', (req, res) => {
  try {
    const events = store.getAlertEvents();
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /alert-events/:alertId - Get events for specific alert
app.get('/alert-events/:alertId', (req, res) => {
  try {
    const { alertId } = req.params;
    const events = store.getAlertEventsByAlertId(alertId);
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== HEALTH CHECK ====================

// GET /health - Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ==================== ERROR HANDLING ====================

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Metric Alerting Backend listening on http://localhost:${PORT}`);
});

export default app;
