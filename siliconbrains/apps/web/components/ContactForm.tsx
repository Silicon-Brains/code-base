"use client";

import { useState } from "react";
import Button from "./Button";
import { api } from "@/lib/api";
import { Icon } from "@/components/public/ui";
import type { LeadPayload } from "@/lib/types";

const PROJECT_TYPES = ["Web Application", "Android Application", "Both Web & Android", "Consulting"];
const BUDGETS = ["Under $5,000", "$5,000 – $15,000", "$15,000 – $50,000", "$50,000+", "Not sure yet"];

const INPUT_CLASS =
  "rounded-lg border border-outline bg-surface px-4 py-3 text-sm text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/60 focus:border-primary/50";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [projectType, setProjectType] = useState(PROJECT_TYPES[0]);
  const [budget, setBudget] = useState(BUDGETS[2]);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const text = (key: string) => String(data.get(key) ?? "").trim();

    const payload: LeadPayload = {
      full_name: text("full_name"),
      work_email: text("work_email"),
      message: text("message"),
      budget_range: budget,
      domain_interest: [projectType],
    };
    if (text("organization")) payload.organization = text("organization");

    setStatus("submitting");
    setErrorMessage("");
    try {
      await api.submitLead(payload);
      setStatus("success");
      form.reset();
      setProjectType(PROJECT_TYPES[0]);
      setBudget(BUDGETS[2]);
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error && err.message !== "Invalid submission"
          ? err.message
          : "Please check your details and try again, or email us directly."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-sm font-medium text-on-surface">Send Us a Message</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-xs text-on-surface-variant">
          Your Name *
          <input required name="full_name" maxLength={200} type="text" placeholder="Enter your name" className={INPUT_CLASS} />
        </label>
        <label className="flex flex-col gap-1.5 text-xs text-on-surface-variant">
          Email Address *
          <input required name="work_email" maxLength={320} type="email" placeholder="Enter your email" className={INPUT_CLASS} />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-xs text-on-surface-variant">
        Company / Organization (Optional)
        <input name="organization" maxLength={200} type="text" placeholder="Enter company name" className={INPUT_CLASS} />
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-xs text-on-surface-variant">
          Project Type
          <select value={projectType} onChange={(e) => setProjectType(e.target.value)} className={INPUT_CLASS}>
            {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-xs text-on-surface-variant">
          Budget (Optional)
          <select value={budget} onChange={(e) => setBudget(e.target.value)} className={INPUT_CLASS}>
            {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-xs text-on-surface-variant">
        Tell us about your project *
        <textarea
          required
          name="message"
          maxLength={5000}
          rows={5}
          placeholder="Describe your requirements..."
          className={`resize-none ${INPUT_CLASS}`}
        />
      </label>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className={`w-full ${status === "submitting" ? "pointer-events-none opacity-60" : ""}`}
      >
        {status === "submitting" ? "Sending…" : "Send Enquiry"}
        <Icon name="arrow" size={14} />
      </Button>

      <p role="status" aria-live="polite" className={`text-center text-xs ${status === "error" ? "text-error" : "text-on-surface-variant"}`}>
        {status === "success" && "Thanks — your enquiry has been recorded. We'll respond within 24 hours."}
        {status === "error" && errorMessage}
        {(status === "idle" || status === "submitting") && "Guaranteed response within 24 hours."}
      </p>
    </form>
  );
}