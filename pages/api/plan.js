// pages/api/plan.js
// FULL FILE REPLACEMENT – PLAN API

import { buildPlan } from "../../lib/ai/planReasoner";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { intent } = req.body;

    if (!intent || typeof intent !== "object") {
      return res.status(400).json({ error: "Invalid intent payload" });
    }

    const plan = buildPlan(intent);

    return res.status(200).json({
      success: true,
      plan
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Plan generation failed"
    });
  }
}
