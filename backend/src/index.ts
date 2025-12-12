import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";

dotenv.config();

const port = Number(process.env.PORT || 3000);
const allowedOriginsEnv = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean)
  : undefined;
const corsOptions = allowedOriginsEnv?.length ? { origin: allowedOriginsEnv } : { origin: true };

const dataDir = path.join(__dirname, "..", "data");
const scansFile = path.join(dataDir, "scans.jsonl");

fs.mkdirSync(dataDir, { recursive: true });

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", true);

app.use((req: Request, res: Response, next: NextFunction) => {
  const startedAt = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - startedAt;
    console.log(
      `[${new Date().toISOString()}] ${req.ip} ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`
    );
  });
  next();
});

app.use(cors(corsOptions));
app.use(express.json());

const healthHandler = (_req: Request, res: Response) => {
  res.json({ ok: true });
};

const scanHandler = (req: Request, res: Response) => {
  const { code, symbology, device_id, scanned_at } = req.body || {};

  if (!code || typeof code !== "string") {
    return res.status(400).json({ ok: false, error: "code is required" });
  }

  const receivedAt = new Date().toISOString();
  const payload = {
    code,
    symbology: symbology ?? null,
    device_id: device_id ?? null,
    scanned_at: scanned_at ?? receivedAt,
    received_at: receivedAt,
  };

  try {
    fs.appendFileSync(scansFile, `${JSON.stringify(payload)}\n`, "utf8");
  } catch (err) {
    console.error("Failed to persist scan", err);
    return res.status(500).json({ ok: false, error: "failed to persist scan" });
  }

  return res.json({ ok: true, received_at: receivedAt });
};

app.get("/health", healthHandler);
app.post("/scan", scanHandler);

const apiRouter = express.Router();
apiRouter.get("/health", healthHandler);
apiRouter.post("/scan", scanHandler);
app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Scan server listening on http://localhost:${port}`);
});
