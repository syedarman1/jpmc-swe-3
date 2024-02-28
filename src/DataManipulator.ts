import { ServerRespond } from './DataStreamer';

export interface Row {
  // Updated Row interface to include new fields and remove the old ones
  timestamp: Date,
  ratio: number,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | null, // Use null to indicate no alert
}

export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]): Row {
    // Assuming serverResponds[0] is stock A and serverResponds[1] is stock B
    const priceA = serverResponds[0].top_ask.price + serverResponds[0].top_bid.price / 2;
    const priceB = serverResponds[1].top_ask.price + serverResponds[1].top_bid.price / 2;
    const ratio = priceA / priceB;

    // Placeholder for the historical average ratio; adjust as necessary
    const historicalAverageRatio = 1.0; // This should be based on actual historical data
    const upperBound = historicalAverageRatio * 1.05;
    const lowerBound = historicalAverageRatio * 0.95;

    // Trigger alert if ratio exceeds the bounds
    let triggerAlert = null;
    if (ratio > upperBound || ratio < lowerBound) {
      triggerAlert = ratio;
    }

    return {
      timestamp: new Date((serverResponds[0].timestamp > serverResponds[1].timestamp) ? serverResponds[0].timestamp : serverResponds[1].timestamp),
      ratio,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      trigger_alert: triggerAlert,
    };
  }
}
