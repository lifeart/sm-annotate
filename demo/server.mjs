import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 4300;

const MIME_TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".rv": "application/octet-stream",
  ".wasm": "application/wasm",
};

const server = http.createServer((req, res) => {
  // Required headers for SharedArrayBuffer (needed by FFmpeg WASM)
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");

  let filePath = path.join(__dirname, req.url === "/" ? "index.html" : req.url);

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === "ENOENT") {
        res.writeHead(404);
        res.end("File not found");
      } else {
        res.writeHead(500);
        res.end("Server error: " + err.code);
      }
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}/`);
  console.log("Headers enabled for SharedArrayBuffer (FFmpeg WASM)");
  console.log("Press Ctrl+C to stop");
});
