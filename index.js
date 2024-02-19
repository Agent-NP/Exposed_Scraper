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
const axios = require("axios");
const cheerio = require("cheerio");
const {
  getRandomUserAgent
} = require("./middleware/util/get_random_user_agent");
const root_url = "https://www.livescore.bz";
const request_timeout = "50000";

async function main(action_url) {
  const params = {
    headers: {
      "User-Agent": getRandomUserAgent().userAgent
    }
  };

  try {
    const response = await axios.get(`${root_url}${action_url}`, params, {
      timeout: request_timeout
    });
    const html = response.data;

    // Use Cheerio to parse the HTML
    const $ = cheerio.load(html);

    // Get all the red card
    const redCard = $("red");

    // Checking the svg
    return redCard.each((i, mainElement) => {
      //I've gotten the match with the red card
      const grandparent = $(mainElement).parent().parent();
      const greatGrandparent = grandparent.parent();

      // Select the target element using appropriate selectors
      const element = $(greatGrandparent); // Adjust selector as needed

      //Converting Time to Display format
      function convertTimeToDisplayFormat(timestamp) {
        // Create a Date object from the timestamp
        const date = new Date(timestamp * 1000);

        // Get the hours (0-23), minutes (0-59), and AM/PM indicator
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";

        // Adjust hours for 12-hour format (12:00 instead of 24:00)
        const displayHours = hours % 12 || 12;

        // Format the time string, using locale-specific formatting if possible
        const localeString = date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true
        });
        const formattedTime = localeString
          ? localeString
          : displayHours + ":" + minutes + " " + ampm;

        return formattedTime;
      }

      function extractNumberOfRedCards(redElement) {
        // Assuming the attribute looks like 'v="1"'
        const attributeValue = redElement.attr("v");
        if (attributeValue) {
          return attributeValue; // Extract the number after '='
        } else {
          return 0; // No red card indicator
        }
      }

      // Extract data and construct the object
      const matchData = {
        "match link": element.attr("href"),
        "start time": convertTimeToDisplayFormat(element.attr("start-time")), // Implement conversion function
        status: element.find("st").text().trim(),
        home: element.find("t1 t").text().trim(),
        away: element.find("t2 t").text().trim(),
        "red card": {
          home: extractNumberOfRedCards(element.find("t1 t red")), // Implement extraction function
          away: extractNumberOfRedCards(element.find("t2 t red"))
        }
      };

      return matchData;
    });
  } catch (error) {
    if (error.response) {
      // Network errors or HTTP status codes
      console.error("Request failed with status code:", error.response.status);
      console.error("Error data:", error.response.data);
    } else if (error.request) {
      // Network errors without responses
      console.error("Network error:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    return null;
  }
}

async function live() {
  await main("/en/live/");
}

async function ended() {
  await main("/en/ended/");
}

async function today() {
  await main("/en/");
}

async function yesterday() {
  await main("/en/yesterday/");
}

//Not avaiiable yet
function otherDays() {}

function disrupt() {}

function start() {
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

app.use(cors());

app.listen(PORT, () => {
  console.log("Server Listening at PORT:", PORT);
});
