// pages/api/image-proxy.ts
import type { NextApiRequest, NextApiResponse } from "next";
import http from "http";
import https from "https";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "Missing URL" });
  }

  const client = url.startsWith("https") ? https : http;

  client
    .get(url, (streamRes) => {
      res.setHeader("Content-Type", streamRes.headers["content-type"] || "");
      streamRes.pipe(res);
    })
    .on("error", (err) => {
      res.status(500).json({ error: "Failed to fetch image" });
    });
}
