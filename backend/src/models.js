// In-memory storage for alerts and alert events
class AlertStore {
  constructor() {
    this.alerts = new Map();
    this.alertEvents = [];
  }

  // Alert methods
  addAlert(alert) {
    this.alerts.set(alert.id, alert);
    return alert;
  }

  getAlerts() {
    return Array.from(this.alerts.values());
  }

  getAlertById(id) {
    return this.alerts.get(id);
  }

  getAlertsByMetricName(metricName) {
    return Array.from(this.alerts.values()).filter(
      (alert) => alert.metricName === metricName
    );
  }

  deleteAlert(id) {
    return this.alerts.delete(id);
  }

  // Alert events methods
  addAlertEvent(event) {
    this.alertEvents.push(event);
    return event;
  }

  getAlertEvents() {
    return this.alertEvents.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  getAlertEventsByAlertId(alertId) {
    return this.alertEvents.filter((event) => event.alertId === alertId);
  }

  clearAlertEvents() {
    this.alertEvents = [];
  }
}

export const store = new AlertStore();
