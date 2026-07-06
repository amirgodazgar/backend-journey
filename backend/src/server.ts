import { createServer } from "node:http";
import {
  addProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "./routes/products.route";

const HOST_NAME = "127.0.0.1";
const PORT = 3000;

const server = createServer((req, res) => {
  const url = new URL(req.url!, `http://${req.headers.host}`);
  const method = req.method;
  const match = url.pathname.match(/^\/products\/(\d+)$/);

  if (url.pathname === "/products" && method === "GET") {
    getProducts({ res });
  } else if (match && method === "GET") {
    getProduct({ res, match });
  } else if (url.pathname === "/products" && method === "POST") {
    addProduct({ res });
  } else if (match && method === "PUT") {
    updateProduct({ req, res, match });
  } else if (match && method === "DELETE") {
    deleteProduct({ res, match });
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ data: "Not Found" }));
  }
});

server.listen(PORT, HOST_NAME, () => {
  console.log("Server is running....");
});
