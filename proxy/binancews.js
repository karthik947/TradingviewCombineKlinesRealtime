import WebSocket from "ws";

class BinanceKlineWS {
  constructor() {
    this.ws = null;
  }

  connect() {
    // Create WebSocket connection to Binance for 1min BTCUSDT klines
    this.ws = new WebSocket(
      "wss://stream.binance.com:9443/ws/btcusdt@kline_1m"
    );

    this.ws.on("open", () => {
      console.log("Connected to Binance WebSocket for BTCUSDT 1min klines");
    });

    this.ws.on("message", (data) => {
      const parsedData = JSON.parse(data);
      if (parsedData.e === "kline") {
        const kline = parsedData.k;
        const formattedData = {
          time: Math.round(kline.t / 1000),
          open: Number(kline.o),
          high: Number(kline.h),
          low: Number(kline.l),
          close: Number(kline.c),
          volume: Number(kline.v),
        };
        // Emit event with kline data
        this.onKline(formattedData);
      }
    });

    this.ws.on("close", () => {
      console.log("Binance WebSocket closed, reconnecting...");
      setTimeout(() => this.connect(), 5000);
    });

    this.ws.on("error", (error) => {
      console.error("WebSocket error:", error);
      this.ws.close();
    });
  }

  // Placeholder for the event handler
  onKline(kline) {
    // This will be overridden when the instance is created
  }
}

export default BinanceKlineWS;
