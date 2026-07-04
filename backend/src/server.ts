import { createServer } from "node:http";

const HOST_NAME = "127.0.0.1";
const PORT = 3000;

const server = createServer((req, res) => {

  if (req.url === "/products" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify([
        { id: 1, title: "Book" },
        { id: 2, title: "Pen" },
      ]),
    );
  } else if (req.url === "/update" && req.method === "POST") {
    let body = "";

    //* Listen for 'first chunk' of data to be received from the request body
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    // * Listen for the end of the request body ('all chunks' have been received)
    req.on("end", () => {
      const responseBody = JSON.parse(body);
      responseBody.products = [
        { id: 1, title: "Book" },
        { id: 2, title: "Pen" },
      ];
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(responseBody));
    });
    
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ data: "Not Found" }));
  }
});

server.listen(PORT, HOST_NAME, () => {
  console.log("Server is running....");
});
