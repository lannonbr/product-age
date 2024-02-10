const dayjs = require("dayjs");

function getProducts() {
  let products = require("./products.json");

  products = products.sort((a, b) => {
    return dayjs(a.purchaseDate).diff(dayjs(b.purchaseDate));
  });

  products = products.map((product) => {
    let days = dayjs().diff(dayjs(product.purchaseDate), "days");
    let years = 0;
    if (days > 365) {
      years = Math.floor(days / 365);
      days = days % 365;
    }

    product.age = `${years != 0 ? years + " years, " : ""} ${days} days`;

    return product;
  });

  return products;
}

module.exports = {
  getProducts,
};
