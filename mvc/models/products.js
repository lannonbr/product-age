const dayjs = require("dayjs");

function daysToFormatted(days) {
  let innerDays = days;
  let years = 0;
  if (innerDays > 365) {
    years = Math.floor(innerDays / 365);
    innerDays = innerDays % 365;
  }

  return { days: innerDays, years };
}

function getProducts() {
  let products = require("./data/products.json");

  products = products.sort((a, b) => {
    return dayjs(a.purchaseDate).diff(dayjs(b.purchaseDate));
  });

  let avgDays = 0;

  products = products.map((product) => {
    let days = dayjs().diff(dayjs(product.purchaseDate), "days");
    const originalDays = days;

    let { days: modDays, years } = daysToFormatted(days);

    product.days = originalDays;
    avgDays += originalDays;
    product.age = `${years != 0 ? years + " years," : ""} ${modDays} days`;

    // If the days remainder is above 335 days (1 year - 30 days) set the class to 'close'
    // but if it is exactly 0, set it to 'anniv'
    product.annivClass = modDays > 335 ? "close" : "";
    product.annivClass = modDays === 0 ? "anniv" : product.annivClass;

    product.weeklyCost = (product.purchasePrice / (originalDays / 7)).toFixed(
      2,
    );
    product.monthlyCost = (product.purchasePrice / (originalDays / 30)).toFixed(
      2,
    );
    if (originalDays < 30) {
      product.monthlyCost = product.purchasePrice;
    }
    if (originalDays < 7) {
      product.weeklyCost = product.purchasePrice;
    }

    return product;
  });

  avgDays = Math.floor(avgDays / products.length);

  let { days: modDays, years } = daysToFormatted(avgDays);

  let avgDaysStr = `${years != 0 ? years + " years," : ""} ${modDays} days`;

  return { products, avgDays: avgDaysStr };
}

module.exports = {
  getProducts,
};
