import "dotenv/config";
import express from "express";
import cors from "cors";
import { publicRouter } from "./routes/public.routes.js";
import { adminRouter } from "./routes/admin.routes.js";
import { portalRouter } from "./routes/portal.routes.js";
import { webhooksRouter } from "./routes/webhooks.routes.js";
import { meRouter } from "./routes/me.routes.js";

const app = express();

// Only trust the X-Forwarded-For chain when explicitly told to (e.g. behind a single reverse
// proxy like Render/Fly/nginx). Without this, req.ip / the rate limiter would key off the proxy's
// own IP instead of the real client — either failing to rate-limit at all (everyone shares one
// bucket) or accidentally rate-limiting every request behind that proxy together.
if (process.env.TRUST_PROXY) app.set("trust proxy", process.env.TRUST_PROXY);

app.use(cors({ origin: process.env.CORS_ORIGIN ?? "http://localhost:3000" }));

// Webhook route needs the raw body for signature verification — must come
// before express.json() and must not be affected by it.
app.use("/webhooks", express.raw({ type: "application/json" }), webhooksRouter);

app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api", publicRouter);
app.use("/api/admin", adminRouter);
app.use("/api/portal", portalRouter);
app.use("/api/me", meRouter);

const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () => console.log(`SiliconBrains API listening on :${PORT}`));
