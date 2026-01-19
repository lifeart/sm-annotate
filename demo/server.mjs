import * as esbuild from "esbuild";
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

// Create esbuild context for watch mode
const ctx = await esbuild.context({
  entryPoints: ["demo/index.ts"],
  bundle: true,
  outfile: "demo/index.js",
  sourcemap: true,
  logLevel: "info",
});

// Start esbuild watch mode
await ctx.watch();

// Start esbuild's built-in server on a different port for SSE events
const { host: esbuildHost, port: esbuildPort } = await ctx.serve({
  servedir: __dirname,
});

// Create proxy server with required headers for SharedArrayBuffer (FFmpeg WASM)
const server = http.createServer((req, res) => {
  // Required headers for SharedArrayBuffer (needed by FFmpeg WASM)
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");

  // Proxy to esbuild server for SSE events
  if (req.url === "/esbuild") {
    const proxyReq = http.request(
      {
        hostname: esbuildHost,
        port: esbuildPort,
        path: req.url,
        method: req.method,
        headers: req.headers,
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
      }
    );
    req.pipe(proxyReq, { end: true });
    return;
  }

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
  console.log("");
  console.log("\x1b[36m%s\x1b[0m", "  SmAnnotate Dev Server");
  console.log("");
  console.log("  \x1b[32m➜\x1b[0m  Local:   \x1b[36mhttp://localhost:" + PORT + "/\x1b[0m");
  console.log("  \x1b[32m➜\x1b[0m  Network: \x1b[36mhttp://127.0.0.1:" + PORT + "/\x1b[0m");
  console.log("");
  console.log("  \x1b[33m⚡\x1b[0m Live reload enabled");
  console.log("  \x1b[33m🔒\x1b[0m SharedArrayBuffer headers enabled (FFmpeg WASM)");
  console.log("");
  console.log("  Press \x1b[1mCtrl+C\x1b[0m to stop");
  console.log("");
});
