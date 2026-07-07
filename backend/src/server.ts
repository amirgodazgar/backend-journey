import { createServer } from "node:http";
import { router } from "./routes/products.route";

const HOST_NAME = "127.0.0.1";
const PORT = 3000;

const server = createServer((req, res) => {
  const url = new URL(req.url!, `http://${req.headers.host}`);
  router({ method: req.method!, pathname: url.pathname, req, res });
});

server.listen(PORT, HOST_NAME, () => {
  console.log("Server is running....");
});
