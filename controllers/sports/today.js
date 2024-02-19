const { genie } = require("../Oracle");

exports.today_football = async function() {
  const retrieve_data = await genie("/en/");
  return { data: retrieve_data };
};
