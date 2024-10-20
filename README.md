# 📊 Real-time Candlestick Data Aggregation

This project demonstrates how to combine a real-time stream of candlestick data from lower timeframes (e.g., 1m) into higher timeframes (e.g., 5m, 15m, 1h) using JavaScript. The project includes a proxy that retrieves candlestick data via a WebSocket connection to Binance and emits real-time data to the client. The client then visualizes the aggregated data on a candlestick chart using the LightweightCharts library, along with corresponding volume data.

---

## 🚀 Features

- **Real-time Timeframe Aggregation**: Dynamically aggregate lower timeframe candlestick data into higher timeframes (like 5m, 15m, or 1h) in real time.
- **WebSocket Proxy**: A Node.js proxy that connects to Binance's WebSocket for real-time BTCUSDT 1-minute candlesticks, serving this data through Socket.IO.
- **Candlestick Chart**: Visualize aggregated data with real-time updates on the client.
- **Volume Histogram**: Display trading volume with color-coded bars (green for price increases, red for decreases).
- **Interactive Timeframe Selector**: Choose different timeframes dynamically on the client to update the chart.

---

## 🛠️ Usage

1. **Set up the proxy:**

   - Navigate to the `proxy` folder and run the proxy server on port 4000 using Node.js.
   - The proxy offers an API route that retrieves kline data for any symbol and interval (e.g., BTCUSDT, 1m).
   - It also establishes a WebSocket connection to Binance, specifically listening for BTCUSDT 1-minute klines, and emits this data to the client via Socket.IO.

2. **Launch the client:**

   - Open the file `index.html` in the `client` folder using Live Server or any local server.
   - The client automatically connects to the proxy's Socket.IO connection and renders real-time candlestick and volume data on the chart.

3. **Select a timeframe:**
   - Use the interactive dropdown menu to dynamically aggregate and display data for different timeframes:
     - 2m
     - 3m
     - 5m
     - 10m
     - 15m
     - 1h

---

## 📊 How It Works

1. **Proxy Setup**:
   - The proxy (`proxy.js`) establishes a WebSocket connection to Binance for the BTCUSDT 1-minute candlestick data and emits this data through a Socket.IO connection to the client.
   - The proxy also exposes an API route that allows fetching historical kline data for any symbol and interval.
2. **Client-side Setup**:

   - The client connects to the proxy via Socket.IO to receive real-time kline data.
   - The data is then processed and aggregated into higher timeframes (like 5m or 15m) using the `convertTimeframe` function.

3. **Charting**:
   - Using the LightweightCharts library, the client visualizes both the candlestick data and volume in separate series:
     - A candlestick series for price data (open, high, low, close).
     - A volume series for trade volume data with color-coded bars.

---

## 🔔 Stay Updated!

If you enjoyed this project and want to see more or similar projects, follow me for updates! 🚀  
You can also follow me on **YouTube** for more awesome content:  
👉 [YouTube Channel](https://www.youtube.com/@karthik947/videos)

Stay tuned! 🎥✨
