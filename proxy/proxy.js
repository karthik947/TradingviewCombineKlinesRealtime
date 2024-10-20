import express from "express";
import got from "got";
import cors from "cors";
import { Server } from "socket.io";
import BinanceKlineWS from "./binancews.js";

const app = express();
const PORT = 4000;

// CORS middleware
app.use(cors());

// Proxy route
app.get("/proxy", async (req, res) => {
  const { symbol, interval } = req.query;

  if (!symbol || !interval) {
    return res
      .status(400)
      .json({ error: "Missing symbol or interval parameter." });
  }

  try {
    // Make the API call using got
    const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}`;
    const response = await got(url);
    // Send the API response back to the client
    res.send(response.body);
  } catch (error) {
    console.error("Error making request:", error.message);
    res.status(500).json({ error: "Failed to fetch data from the endpoint." });
  }
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Socket io proxy
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Initialize BinanceKlineWS
const binanceKlineWS = new BinanceKlineWS();

// Set up the kline event handler to emit kline data to all connected users
binanceKlineWS.onKline = (klineData) => {
  // Emit kline data to all connected clients on 'KLINE' topic
  // console.log("Kline data emitted:", klineData);
  io.emit("KLINE", klineData);
};

// Start the WebSocket connection to Binance
binanceKlineWS.connect();

// Handle socket.io connections
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});
