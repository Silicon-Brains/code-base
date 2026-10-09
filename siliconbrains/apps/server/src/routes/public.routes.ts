import { Router } from "express";
import { z } from "zod";
import { supabase } from "../lib/supabase.js";
import { rateLimit } from "../middleware/rateLimit.js";

export const publicRouter = Router();

// Unauthenticated + unrelated to any per-user quota, so this is the one public endpoint that
// needs its own abuse guard (Phase 7 carry-over). 5 submissions / 10 minutes / IP is generous for
// a real prospect filling the form once, tight enough to blunt scripted spam.
const leadsRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: "Too many submissions from this network — please try again in a few minutes, or email us directly.",
});

// --- Content reads (published only) ---

publicRouter.get("/services", async (_req, res) => {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

publicRouter.get("/projects", async (_req, res) => {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

publicRouter.get("/projects/:slug", async (req, res) => {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", req.params.slug)
    .eq("published", true)
    .single();
  if (error) return res.status(404).json({ error: "Project not found" });
  res.json(data);
});

publicRouter.get("/testimonials", async (_req, res) => {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

publicRouter.get("/faqs", async (req, res) => {
  let query = supabase.from("faqs").select("*").order("sort_order", { ascending: true });
  if (req.query.page) query = query.eq("page", String(req.query.page));
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

publicRouter.get("/process-steps", async (_req, res) => {
  const { data, error } = await supabase
    .from("process_steps")
    .select("*")
    .order("phase_number", { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// --- Contact form → leads ---

const leadSchema = z.object({
  full_name: z.string().trim().min(1).max(200),
  work_email: z.string().trim().email().max(320),
  organization: z.string().trim().max(200).optional(),
  website: z.string().trim().max(500).optional(),
  domain_interest: z.array(z.string().max(100)).max(10).optional(),
  budget_range: z.string().max(100).optional(),
  timeline: z.string().max(100).optional(),
  message: z.string().trim().min(1).max(5000),
  nda_requested: z.boolean().optional(),
});

publicRouter.post("/leads", leadsRateLimit, async (req, res) => {
  const parsed = leadSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid submission", details: parsed.error.flatten() });
  }
  const { data, error } = await supabase.from("leads").insert(parsed.data).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});
