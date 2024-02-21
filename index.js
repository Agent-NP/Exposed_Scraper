const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const PORT = process.env.PORT || 3001;

const app = express();
//Terminate
let terminate = false;

//Import all neccessary routes
const football_routes = require("./routes/sports/football");

// function start() {
//   terminate = false;
//   const intervalId = setInterval(async () => {
//     await live();
//   }, 60000); // 60000 milliseconds = 1 minute
//   // Clear the interval after a certain time (optional)

//   setTimeout(() => {
//     if (terminate) {
//       clearInterval(intervalId);
//     }
//   }, 1800000); // Clear after 5 minutes
// }

// function disrupt() {
//   terminate = true;
// }

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// app.use("/api", football_routes);

// app.get("*", (req, res) => {
//   res.status(401).end("Invalid API call");
// });

io.on("connection", socket => {
  console.log(`User Connected: ${socket.id}`);
});

server.listen(PORT, () => {
  console.log("Server (SOCKET.IO) Listening at PORT:", PORT);
});
