// pages/api/intent.ts
// FULL FILE REPLACEMENT – SAFE API HANDLER

import type { NextApiRequest, NextApiResponse } from "next";
import { parseIntent } from "@/lib/ai/intentParser";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { query } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Invalid query" });
    }

    const intent = parseIntent(query);

    return res.status(200).json({
      success: true,
      intent,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Intent parsing failed",
    });
  }
}
