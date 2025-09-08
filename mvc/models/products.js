const dayjs = require("dayjs");

function getProducts() {
  let products = require("./data/products.json");

  products = products.sort((a, b) => {
    return dayjs(a.purchaseDate).diff(dayjs(b.purchaseDate));
  });

  products = products.map((product) => {
    let days = dayjs().diff(dayjs(product.purchaseDate), "days");
    const originalDays = days;

    let years = 0;
    if (days > 365) {
      years = Math.floor(days / 365);
      days = days % 365;
    }

    product.days = originalDays;
    product.age = `${years != 0 ? years + " years," : ""} ${days} days`;

    // If the days remainder is above 335 days (1 year - 30 days) set the class to 'close'
    // but if it is exactly 0, set it to 'anniv'
    product.annivClass = days > 335 ? "close" : "";
    product.annivClass = days === 0 ? "anniv" : product.annivClass;

    product.weeklyCost = (product.purchasePrice / (originalDays / 7)).toFixed(
      2
    );
    product.monthlyCost = (product.purchasePrice / (originalDays / 30)).toFixed(
      2
    );
    if (originalDays < 30) {
      product.monthlyCost = product.purchasePrice;
    }
    if (originalDays < 7) {
      product.weeklyCost = product.purchasePrice;
    }

    return product;
  });

  return products;
}

module.exports = {
  getProducts,
};
