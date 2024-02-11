require("dotenv").config();
const discordWebhookURL = process.env.DISCORD_WEBHOOK_URL;

const { getProducts } = require("../mvc/models/products");

async function run() {
  const products = getProducts();

  for (const product of products) {
    if (product.days % 365 == 0) {
      await fetch(discordWebhookURL, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: `You got ${product.name} ${product.days / 365} years ago today`,
        }),
      });
    }
  }
}

run();
