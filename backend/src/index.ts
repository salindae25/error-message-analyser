import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { analyzeRouter } from "./routes/analyze";

const app = new Hono();

// Middleware
app.use("*", cors());

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

// API routes
const apiRoutes = new Hono().route("/analyze", analyzeRouter);

app.route("/api", apiRoutes);

// Start the server
const port = parseInt(process.env.PORT || "3000");
console.log(`Server is running on port ${port}`);

if (process.env.NODE_ENV !== "test") {
  serve({
    fetch: app.fetch,
    port,
  });
}

export default app;
