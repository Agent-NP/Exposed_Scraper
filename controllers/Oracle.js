const axios = require("axios");
const cheerio = require("cheerio");
const {
  getRandomUserAgent
} = require("../middleware/util/get_random_user_agent");
const root_url = "https://www.livescore.bz";
const request_timeout = "50000";

exports.genie = async function(action_url) {
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
    
    const data = [];

    // Checking the svg
    redCard.each((i, mainElement) => {
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
        "match link": root_url + element.attr("href"),
        "start time": convertTimeToDisplayFormat(element.attr("start-time")), // Implement conversion function
        status: element.find("st").text().trim(),
        home: element.find("t1 t").text().trim(),
        away: element.find("t2 t").text().trim(),
        "red card": {
          home: extractNumberOfRedCards(element.find("t1 t red")), // Implement extraction function
          away: extractNumberOfRedCards(element.find("t2 t red"))
        }
      };

      data.push(matchData);
    });

    return data;
  } catch (error) {
    if (error.response) {
      // Network errors or HTTP status codes
      console.error("Request failed with status code:", error.response.status);
      console.error("Error data:", error.response.data);
    } else if (error.request) {
      // Network errors without responses
      console.error("Network error");
    } else {
      console.error("Error:", error.message);
    }
    return null;
  }
};
