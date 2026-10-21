"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "./Button";
import { api, ApiError } from "@/lib/api";
import { Icon } from "@/components/public/ui";
import type { LeadPayload } from "@/lib/types";

const PROJECT_TYPES = ["Web Application", "Android Application", "Both Web & Android", "Consulting"];
const BUDGETS = ["Under ₹15,000", "₹25,000 – ₹35,000", "₹55,000 – ₹100,000", "₹150,000+", "Not sure yet"];

const INPUT_CLASS =
  "w-full min-w-0 rounded-xl border border-outline bg-surface px-4 py-3 text-sm text-on-surface outline-none transition duration-200 placeholder:text-on-surface-variant/60 hover:border-primary/30 focus:border-primary focus:ring-4 focus:ring-primary/10";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [projectType, setProjectType] = useState(PROJECT_TYPES[0]);
  const [budget, setBudget] = useState(BUDGETS[2]);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;

    // The checkbox is also `required`, but never rely on the browser alone.
    if (!consent) {
      setStatus("error");
      setErrorMessage("Please accept the Privacy Policy to send your enquiry.");
      return;
    }

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
      setConsent(false);
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof ApiError && err.status === 429
          ? "We’ve received several requests from you. Please wait a moment and try again."
          : "We couldn’t send your enquiry just now. Please try again or email us directly."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex min-w-0 flex-col gap-6" aria-busy={status === "submitting"}>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Start a conversation</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-on-surface sm:text-3xl">Tell us about your project</h2>
        <p className="mt-2 text-sm leading-6 text-on-surface-variant">Share a few details and our team will get back to you within one business day.</p>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex min-w-0 flex-col gap-2 text-xs font-medium text-on-surface-variant">
          Your name <span className="text-primary">*</span>
          <input required name="full_name" maxLength={200} type="text" placeholder="Enter your name" className={INPUT_CLASS} />
        </label>
        <label className="flex min-w-0 flex-col gap-2 text-xs font-medium text-on-surface-variant">
          Work email <span className="text-primary">*</span>
          <input required name="work_email" maxLength={320} type="email" placeholder="Enter your email" className={INPUT_CLASS} />
        </label>
      </div>

      <label className="flex min-w-0 flex-col gap-2 text-xs font-medium text-on-surface-variant">
        Company or organization <span className="font-normal text-on-surface-variant/70">(optional)</span>
        <input name="organization" maxLength={200} type="text" placeholder="Enter company name" className={INPUT_CLASS} />
      </label>

      <fieldset className="min-w-0">
        <legend className="mb-2 text-xs font-medium text-on-surface-variant">What are you looking to build?</legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {PROJECT_TYPES.map((type) => {
            const selected = projectType === type;
            return (
              <button
                key={type}
                type="button"
                aria-pressed={selected}
                onClick={() => setProjectType(type)}
                className={`flex min-h-12 min-w-0 items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 ${selected ? "border-primary bg-primary/5 font-semibold text-primary shadow-sm" : "border-outline bg-surface text-on-surface-variant hover:border-primary/40 hover:bg-surface-container-low"}`}
              >
                <span className="min-w-0 break-words">{type}</span>
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selected ? "border-primary bg-primary text-on-primary" : "border-outline"}`}>
                  {selected && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <label className="flex min-w-0 flex-col gap-2 text-xs font-medium text-on-surface-variant">
        Estimated budget <span className="font-normal text-on-surface-variant/70">(optional)</span>
        <select value={budget} onChange={(e) => setBudget(e.target.value)} className={INPUT_CLASS}>
          {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
      </label>

      <label className="flex min-w-0 flex-col gap-2 text-xs font-medium text-on-surface-variant">
        Tell us about your project <span className="text-primary">*</span>
        <textarea
          required
          name="message"
          maxLength={5000}
          rows={5}
          placeholder="What are you hoping to achieve? Include any goals, key features, or timing you have in mind."
          className={`resize-y ${INPUT_CLASS}`}
        />
      </label>

      <label className="flex items-start gap-3 text-xs leading-relaxed text-on-surface-variant">
        <input
          required
          type="checkbox"
          name="privacy_consent"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[var(--color-primary)]"
        />
        <span>
          I have read and agree to the{" "}
          <Link
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2 transition-colors hover:text-on-surface"
          >
            Privacy Policy
          </Link>{" "}
          and consent to SiliconBrains using my details to respond to this enquiry. *
        </span>
      </label>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className={`w-full justify-center rounded-xl ${status === "submitting" ? "pointer-events-none opacity-75" : ""}`}
      >
        {status === "submitting" ? (
          <><span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" /> Sending your enquiry…</>
        ) : (
          <>Send enquiry <Icon name="arrow" size={15} /></>
        )}
      </Button>

      <p role={status === "error" ? "alert" : "status"} aria-live="polite" className={`rounded-xl text-center text-xs leading-relaxed transition-all ${status === "success" ? "bg-primary/5 px-4 py-3 text-primary" : status === "error" ? "bg-error/5 px-4 py-3 text-error" : "text-on-surface-variant"}`}>
        {status === "success" && "Thanks — your enquiry has been received. We'll be in touch within one business day."}
        {status === "error" && errorMessage}
        {(status === "idle" || status === "submitting") && "Your information stays private. We typically reply within one business day."}
      </p>
    </form>
  );
}
