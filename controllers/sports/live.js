const { genie } = require("../Oracle");

exports.live_football = async function() {
  const retrieve_data = await genie("/en/live/");
  return { data: retrieve_data };
};
