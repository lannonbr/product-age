module.exports = (router, app) => {
  router.route("/").get((req, res) => {
    let model = require("models/global")(req, res);
    model = require("models/homepage")(model);
    model.content.pageTitle = "Homepage";
    res.render("homepage", model);
  });

  router.route("/products").get((req, res) => {
    const products = require("models/products").getProducts();

    res.json(products);
  });
};
