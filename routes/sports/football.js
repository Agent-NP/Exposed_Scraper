const express = require("express");
const router = express.Router();
const { live_football } = require("../../controllers/sports/live");
const { today_football } = require("../../controllers/sports/today");
const { yesterday_football } = require("../../controllers/sports/yesterday");
const { ended_football } = require("../../controllers/sports/ended");

// Define your routes here
router.get("/live", async (req, res) => {
  try {
    const data = await live_football();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(401).json({
      error: "Error Occured when trying to retrieve data for live football"
    });
  }
});

router.get("/today", async (req, res) => {
  try {
    const data = await today_football();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(401).json({
      error: "Error Occured when trying to retrieve data for today football"
    });
  }
});

router.get("/yesterday", async (req, res) => {
  try {
    const data = await yesterday_football();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(401).json({
      error: "Error Occured when trying to retrieve data for yesterday football"
    });
  }
});

router.get("/ended", async (req, res) => {
  try {
    const data = await ended_football();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(401).json({
      error: "Error Occured when trying to retrieve data for ended football"
    });
  }
});

module.exports = router;
