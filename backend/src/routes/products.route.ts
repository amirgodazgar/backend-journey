import type { IncomingMessage, ServerResponse } from "http";
import {
  addProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/products.controller";

type Route = {
  method: string;
  path: string;
  handler: (parameters: Parameters) => void;
};

export type Parameters = {
  req: IncomingMessage | undefined;
  res: ServerResponse<IncomingMessage> & {
    req: IncomingMessage;
  };
  match?: RegExpMatchArray | null;
};

export const routes: Route[] = [
  { method: "GET", path: "/products", handler: getProducts },
  { method: "GET", path: "/products/:id", handler: getProduct },
  { method: "POST", path: "/products", handler: addProduct },
  { method: "PUT", path: "/products/:id", handler: updateProduct },
  { method: "DELETE", path: "/products/:id", handler: deleteProduct },
];

type RouterParams = {
  method: string;
  pathname: string;
  res: Parameters["res"];
  req?: Parameters["req"];
};

export const router = ({ method, pathname, req, res }: RouterParams) => {
  const route = routes.find((route) => {
    if (route.method !== method) return false;
    const regexStr = route.path.replace(/:([\w]+)/g, "([^/]+)");
    const regex = new RegExp(`^${regexStr}$`);
    return regex.test(pathname);
  });

  if (!route) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ data: "Not Found" }));
    return;
  }

  const regexStr = route.path.replace(/:([\w]+)/g, "([^/]+)");
  const regex = new RegExp(`^${regexStr}$`);
  const match = pathname.match(regex);
  route.handler({ req, res, match });
};
