const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const PORT = process.env.PORT || 3001;
const football_routes = require("./routes/sports/football");
const { live_football } = require("./controllers/sports/live");

const app = express();
let previous = [];

// Function to fetch and broadcast live football data
async function updateAndBroadcast() {
  const current = await live_football();
  if (JSON.stringify(previous) !== JSON.stringify(current)) {
    previous = current;
    io.emit("live_football_update", current);
  }
}

// Start periodic updates and set a timeout for cleanup
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const intervalId = setInterval(updateAndBroadcast, 60000); // Fetch every minute
setTimeout(() => clearInterval(intervalId), 1800000); // Clear after 5 minutes

// API routes
app.use("/api", football_routes);

// Default route for invalid requests
app.get("*", (req, res) => {
  res.status(401).send("Invalid API call");
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
});

server.listen(PORT, () => {
  console.log("Server (SOCKET.IO) Listening at PORT:", PORT);
});
