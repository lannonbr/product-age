import "dotenv/config";
import { getProducts } from "../models/products.js";

const discordWebhookURL = process.env.DISCORD_WEBHOOK_URL;

async function run() {
  const { products } = await getProducts();

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
