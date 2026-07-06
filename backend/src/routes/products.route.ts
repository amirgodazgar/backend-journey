import type { IncomingMessage, ServerResponse } from "http";

export let products = [
  { id: 1, title: "Book" },
  { id: 2, title: "Pen" },
  { id: 3, title: "Eraser" },
  { id: 4, title: "Notebook" },
];

type Parameters = {
  req?: IncomingMessage;
  res: ServerResponse<IncomingMessage> & {
    req: IncomingMessage;
  };
  match?: RegExpMatchArray | null;
};

export const getProducts = ({ res }: Parameters) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(products));
};

export const getProduct = ({ res, match }: Parameters) => {
  const id = Number(match![1]);
  const item = products.find((i) => i.id === id);
  if (!item) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Product not found" }));
    return; //* ← important: stop execution
  }
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(item));
};

export const addProduct = ({ req, res }: Parameters) => {
  let body = "";
  //* Listen for 'first chunk' of data to be received from the request body
  req?.on("data", (chunk: any) => {
    body += chunk.toString();
  });
  // * Listen for the end of the request body ('all chunks' have been received)
  req?.on("end", () => {
    try {
      const parsed = JSON.parse(body);
      const newItem = { id: products.length + 1, ...parsed };
      products.push(newItem);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(newItem));
    } catch (error) {
      console.log("Error in server");
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid JSON" }));
    }
  });
};

export const updateProduct = ({ req, res, match }: Parameters) => {
  const id = match![1];
  let body = "";
  req?.on("data", (chunk) => {
    body += chunk.toString();
  });
  req?.on("end", () => {
    try {
      const parsed: { title: string } = JSON.parse(body);
      const index = products.findIndex((i) => i.id === Number(id));
      if (index === -1) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Product not found" }));
        return;
      }
      products[index] = { ...products[index], title: parsed.title };
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(products[index]));
    } catch (error) {
      console.log("Error in server");
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid JSON" }));
    }
  });
};

export const deleteProduct = ({ res, match }: Parameters) => {
  try {
    const id = match![1];
    const updatedProducts = products.filter((i) => i.id !== Number(id));
    products = updatedProducts;
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Item Deleted Successfully." }));
  } catch (error) {
    console.log("Error in server");
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Invalid JSON" }));
  }
};
