import fastify from "fastify";
import fastifyView from "@fastify/view";
import { Liquid } from "liquidjs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { getProducts } from "./models/products.js";
import { cpSync, existsSync, mkdirSync } from "node:fs";
import fastifyStatic from "@fastify/static";
import webpack from "webpack";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const viewsPath = join(__dirname, "views");

const staticsPath = join(__dirname, "statics");
const publicPath = join(__dirname, "public");

const routePrefix = process.env.PRODUCT_AGE_ROUTE_PREFIX || "";

function getRoutePath(path = "") {
  const basePath = routePrefix ? `/${routePrefix}` : "/";
  if (!path) {
    return basePath;
  }
  return routePrefix ? `/${routePrefix}/${path}` : `/${path}`;
}

function buildClientsideAssets() {
  // copy files from staticsPath to publicPath, make publicPath if it doesn't exist yet
  if (!existsSync(publicPath)) {
    mkdirSync(publicPath);
  }
  cpSync(join(staticsPath, "css"), join(publicPath, "css"), {
    recursive: true,
  });

  // build js bundle with webpack
  const compiler = webpack({
    entry: join(staticsPath, "js", "main.js"),
    mode: "production",
    output: {
      path: join(publicPath, "js"),
      filename: "main.js",
    },
    resolve: {
      alias: {
        fs: false,
        path: false,
      },
      modules: [join(staticsPath, "js"), "node_modules"],
    },
  });
  compiler.run();
}

buildClientsideAssets();

const app = fastify({
  routerOptions: {
    ignoreTrailingSlash: true,
  },
});

app.register(fastifyStatic, {
  root: publicPath,
  prefix: getRoutePath(),
});

app.register(fastifyView, {
  engine: {
    liquid: new Liquid({
      root: viewsPath,
      extname: ".liquid",
    }),
  },
});

app.get(getRoutePath(), async (req, reply) => {
  try {
    const { products, avgDays } = await getProducts();

    return reply.view("./views/index.liquid", {
      title: "Product Age - Homepage",
      content: {
        appTitle: "Product Age",
        pageTitle: "Homepage",
      },
      products,
      avgDays,
      routePrefix,
    });
  } catch (error) {
    console.error("Error rendering view:", error);
    return reply.status(500).send({ error: error.message, stack: error.stack });
  }
});

app.get(getRoutePath("products"), async (req, res) => {
  const products = await getProducts();

  res.send(products);
});

app.listen({ port: 3006, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is running on ${address}${getRoutePath()}`);
});
