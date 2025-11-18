const { getProducts } = require("./products");

module.exports = (model) => {
  model.content.products = getProducts().products;

  return model;
};
