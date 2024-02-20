const { genie } = require("../Oracle");

exports.yesterday_football = async function() {
  const retrieve_data = await genie("/en/yesterday/");
  return { data: retrieve_data };
};


