import { store } from './models.js';
import { v4 as uuidv4 } from 'uuid';

// Alert evaluation logic
export class AlertService {
  // Evaluate metric against alerts
  static evaluateMetric(metricName, metricValue, timestamp) {
    const alerts = store.getAlertsByMetricName(metricName);
    const triggeredEvents = [];

    for (const alert of alerts) {
      const condition = this.checkCondition(
        metricValue,
        alert.threshold,
        alert.comparator
      );

      if (condition) {
        const alertEvent = {
          id: uuidv4(),
          alertId: alert.id,
          alertName: alert.name,
          metricName,
          metricValue,
          threshold: alert.threshold,
          comparator: alert.comparator,
          alertMessage: alert.alertMessage,
          timestamp: timestamp || new Date().toISOString(),
        };
        
        store.addAlertEvent(alertEvent);
        triggeredEvents.push(alertEvent);
      }
    }

    return triggeredEvents;
  }

  // Check if metric value matches alert condition
  static checkCondition(value, threshold, comparator) {
    switch (comparator) {
      case 'GT':
        return value > threshold;
      case 'LT':
        return value < threshold;
      case 'GTE':
        return value >= threshold;
      case 'LTE':
        return value <= threshold;
      case 'EQ':
        return value === threshold;
      default:
        return false;
    }
  }

  // Validate alert rule
  static validateAlert(alert) {
    const errors = [];

    if (!alert.name || alert.name.trim() === '') {
      errors.push('Alert name is required');
    }

    if (!alert.metricName || alert.metricName.trim() === '') {
      errors.push('Metric name is required');
    }

    if (alert.threshold === undefined || alert.threshold === null) {
      errors.push('Threshold is required');
    }

    if (!['GT', 'LT', 'GTE', 'LTE', 'EQ'].includes(alert.comparator)) {
      errors.push('Invalid comparator. Must be GT, LT, GTE, LTE, or EQ');
    }

    if (!alert.alertMessage || alert.alertMessage.trim() === '') {
      errors.push('Alert message is required');
    }

    return { isValid: errors.length === 0, errors };
  }
}
