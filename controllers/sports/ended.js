const { genie } = require("../Oracle");

exports.ended_football = async function() {
  const retrieve_data = await genie("/en/ended/");
  return { data: retrieve_data };
};
