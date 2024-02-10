const { getProducts } = require("./products");

module.exports = (model) => {
  model.content.products = getProducts();

  return model;
};
