import math
from typing import List, Dict, Any
from datetime import datetime, timedelta

# Simple Linear Regression for Trendcasting
def calculate_trend_prediction(history: List[float], days_to_predict: int = 7) -> List[float]:
    """
    Given a list of historical values, predict the next `days_to_predict` values 
    using simple linear regression.
    """
    n = len(history)
    if n < 2:
        return [history[-1] if history else 0.0] * days_to_predict
        
    x_sum = sum(range(n))
    y_sum = sum(history)
    xx_sum = sum(x * x for x in range(n))
    xy_sum = sum(x * y for x, y in enumerate(history))
    
    slope = (n * xy_sum - x_sum * y_sum) / (n * xx_sum - x_sum * x_sum + 1e-9)
    intercept = (y_sum - slope * x_sum) / n
    
    predictions = []
    for i in range(n, n + days_to_predict):
        pred = slope * i + intercept
        predictions.append(max(0.0, pred))  # Ensure non-negative predictions
        
    return predictions

# Z-Score based Anomaly Detection
def detect_anomalies(history: List[float], threshold: float = 2.0) -> List[bool]:
    """
    Detect anomalies using Z-score. Returns a list of booleans indicating anomalies.
    """
    n = len(history)
    if n < 3:
        return [False] * n
        
    mean = sum(history) / n
    variance = sum((x - mean) ** 2 for x in history) / n
    std_dev = math.sqrt(variance)
    
    if std_dev == 0:
        return [False] * n
        
    return [abs(x - mean) / std_dev > threshold for x in history]

# Dummy Data Generator for Analytics
def generate_mock_timeseries(days: int = 30) -> Dict[str, Any]:
    """Returns a mock timeseries of spend, conversions, and dates"""
    base_spend = 50000.0
    base_conversions = 120.0
    
    history_spend = []
    history_conv = []
    dates = []
    
    now = datetime.utcnow()
    
    # Generate past days
    for i in range(days - 1, -1, -1):
        # Adding some noise and slight upward trend
        noise_factor = 1.0 + (math.sin(i) * 0.1)
        spend = base_spend * noise_factor + (days - i) * 500
        conversions = base_conversions * noise_factor + (days - i) * 2
        
        # Inject an anomaly 5 days ago (drop in conversions)
        if i == 5:
            conversions *= 0.3 
            
        history_spend.append(spend)
        history_conv.append(conversions)
        dates.append((now - timedelta(days=i)).strftime("%Y-%m-%d"))
        
    # Generate predictions
    pred_days = 7
    pred_spend = calculate_trend_prediction(history_spend, pred_days)
    pred_conv = calculate_trend_prediction(history_conv, pred_days)
    
    pred_dates = [(now + timedelta(days=i)).strftime("%Y-%m-%d") for i in range(1, pred_days + 1)]
    
    # Detect anomalies
    spend_anomalies = detect_anomalies(history_spend)
    conv_anomalies = detect_anomalies(history_conv)
    
    anomaly_alerts = []
    for i in range(days):
        if conv_anomalies[i] and history_conv[i] < sum(history_conv)/len(history_conv):
            anomaly_alerts.append({
                "date": dates[i],
                "metric": "Conversions",
                "value": history_conv[i],
                "issue": "Sudden drop detected"
            })
            
    return {
        "historical": {
            "dates": dates,
            "spend": history_spend,
            "conversions": history_conv
        },
        "predictions": {
            "dates": pred_dates,
            "spend": pred_spend,
            "conversions": pred_conv
        },
        "anomalies": anomaly_alerts
    }
