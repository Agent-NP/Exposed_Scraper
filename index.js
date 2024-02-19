// Checking if all folders are installed
// What are teh folders needed (?)

// Checking if the database is set

// Making axios call to the live football website

// Checking if any match has red card present

// If there exist a red card then return the match and the time when the red card occurs, and if none exist then return empty

// At the end of the day store all matches that has red card and their full time score

//How do I organise the code

const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 3001;

const app = express();
//Terminate
let terminate = false;


//Import all neccessary routes
const football_routes = require("./routes/sports/football");


function start() {
  terminate = false;
  const intervalId = setInterval(async () => {
    await live();
  }, 60000); // 60000 milliseconds = 1 minute
  // Clear the interval after a certain time (optional)

  setTimeout(() => {
    if (terminate) {
      clearInterval(intervalId);
    }
  }, 1800000); // Clear after 5 minutes
}

function disrupt() {
  terminate = true;
}

app.use(cors());
app.use("/api", football_routes);



app.listen(PORT, () => {
  console.log("Server Listening at PORT:", PORT);
});
