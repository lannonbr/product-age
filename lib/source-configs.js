const sourceConfigs = require("source-configs");

let configs;

if (!configs) {
  const schema = require("../configurationSchema");
  configs = sourceConfigs(schema);
}

module.exports = configs;
