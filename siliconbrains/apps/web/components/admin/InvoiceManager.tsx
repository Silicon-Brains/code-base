"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { api } from "@/lib/api";

type PaymentStatus = "unpaid" | "partial" | "paid";
type InvoiceStatus = "pending" | "paid" | "overdue";
type LineItem = { description: string; qty: number; rate: number };
type Client = { full_name?: string | null; email?: string | null; company_name?: string | null };
type Engagement = { id: string; title: string; client?: Client | null; client_profile_id?: string };
type Invoice = {
  id: string;
  client_project_id: string;
  invoice_number: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  issued_date: string | null;
  due_date: string | null;
  line_items?: LineItem[] | null;
  po_ref?: string | null;
  discount_percent?: number | null;
  other_charges?: number | null;
  payment_status?: PaymentStatus | null;
  billed_to_name?: string | null;
  billed_to_company?: string | null;
  billed_to_email?: string | null;
  billed_to_phone?: string | null;
  billed_to_address?: string | null;
  bank_account_name?: string | null;
  bank_branch?: string | null;
  bank_account_no?: string | null;
  bank_ifsc_swift?: string | null;
  upi_id?: string | null;
  cheque_in_favour?: string | null;
  payment_link?: string | null;
  late_fee_percent?: number | null;
  created_at?: string;
};
type Settings = { site_name?: string; location?: string | null; phone?: string | null; contact_email?: string | null };
type Draft = Omit<Invoice, "id" | "created_at">;

const INPUT = "w-full rounded-lg border border-outline bg-surface px-3 py-2.5 text-sm text-on-surface outline-none transition placeholder:text-on-surface-variant/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/10";
const EMPTY_ITEM: LineItem = { description: "Software development services", qty: 1, rate: 0 };

function today() {
  return dateInputValue(new Date());
}

function dateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function round2(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function totalFor(draft: Pick<Draft, "line_items" | "discount_percent" | "other_charges">) {
  const subtotal = (draft.line_items ?? []).reduce((sum, item) => sum + round2(item.qty * item.rate), 0);
  return {
    subtotal: round2(subtotal),
    discount: round2(subtotal * Number(draft.discount_percent ?? 0) / 100),
    total: round2(subtotal - subtotal * Number(draft.discount_percent ?? 0) / 100 + Number(draft.other_charges ?? 0)),
  };
}

function money(value: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 2 }).format(value);
  } catch {
    return `${currency} ${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}

function freshDraft(): Draft {
  const issued = today();
  const due = new Date(`${issued}T00:00:00`);
  due.setDate(due.getDate() + 15);
  return {
    client_project_id: "", invoice_number: "", amount: 0, currency: "INR",
    status: "pending", payment_status: "unpaid", issued_date: issued, due_date: dateInputValue(due),
    line_items: [{ ...EMPTY_ITEM }], po_ref: "", discount_percent: 0, other_charges: 0,
    billed_to_name: "", billed_to_company: "", billed_to_email: "", billed_to_phone: "", billed_to_address: "",
    bank_account_name: "", bank_branch: "", bank_account_no: "", bank_ifsc_swift: "",
    upi_id: "", cheque_in_favour: "", payment_link: "", late_fee_percent: null,
  };
}

function toDraft(invoice: Invoice): Draft {
  const items = invoice.line_items?.length ? invoice.line_items : [{
    description: "Software development services", qty: 1, rate: Number(invoice.amount) || 0,
  }];
  return {
    client_project_id: invoice.client_project_id,
    invoice_number: invoice.invoice_number,
    amount: Number(invoice.amount) || 0,
    currency: invoice.currency || "INR",
    status: invoice.status || "pending",
    payment_status: invoice.payment_status ?? (invoice.status === "paid" ? "paid" : "unpaid"),
    issued_date: invoice.issued_date?.slice(0, 10) ?? "",
    due_date: invoice.due_date?.slice(0, 10) ?? "",
    line_items: items.map((item) => ({ ...item, qty: Number(item.qty), rate: Number(item.rate) })),
    po_ref: invoice.po_ref ?? "", discount_percent: Number(invoice.discount_percent ?? 0), other_charges: Number(invoice.other_charges ?? 0),
    billed_to_name: invoice.billed_to_name ?? "", billed_to_company: invoice.billed_to_company ?? "",
    billed_to_email: invoice.billed_to_email ?? "", billed_to_phone: invoice.billed_to_phone ?? "", billed_to_address: invoice.billed_to_address ?? "",
    bank_account_name: invoice.bank_account_name ?? "", bank_branch: invoice.bank_branch ?? "",
    bank_account_no: invoice.bank_account_no ?? "", bank_ifsc_swift: invoice.bank_ifsc_swift ?? "",
    upi_id: invoice.upi_id ?? "", cheque_in_favour: invoice.cheque_in_favour ?? "", payment_link: invoice.payment_link ?? "",
    late_fee_percent: invoice.late_fee_percent == null ? null : Number(invoice.late_fee_percent),
  };
}

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
};
const esc = (value: unknown) => String(value ?? "").replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);

function dateLabel(value?: string | null) {
  if (!value) return "________________";
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? esc(value) : date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

const ONES = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
function underThousand(n: number): string {
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? ` ${ONES[n % 10]}` : "");
  return `${ONES[Math.floor(n / 100)]} Hundred${n % 100 ? ` ${underThousand(n % 100)}` : ""}`;
}
function wordsFor(n: number, indian: boolean): string {
  if (n === 0) return "Zero";
  const scales = indian ? [[10000000, "Crore"], [100000, "Lakh"], [1000, "Thousand"]] as const : [[1000000000, "Billion"], [1000000, "Million"], [1000, "Thousand"]] as const;
  const parts: string[] = [];
  let rest = n;
  for (const [scale, label] of scales) {
    const amount = Math.floor(rest / scale);
    if (amount) { parts.push(`${wordsFor(amount, indian)} ${label}`); rest %= scale; }
  }
  if (rest) parts.push(underThousand(rest));
  return parts.join(" ");
}

function amountWords(amount: number, currency: string) {
  const names: Record<string, [string, string]> = {
    INR: ["Rupees", "Paise"], USD: ["US Dollars", "Cents"], EUR: ["Euros", "Cents"], GBP: ["Pounds", "Pence"],
    AED: ["Dirhams", "Fils"], SGD: ["Singapore Dollars", "Cents"], AUD: ["Australian Dollars", "Cents"], CAD: ["Canadian Dollars", "Cents"],
  };
  const [majorName, minorName] = names[currency] ?? [currency, "Minor Units"];
  const total = Math.round(amount * 100);
  const major = Math.floor(total / 100);
  const minor = total % 100;
  return `${majorName} ${wordsFor(major, currency === "INR")}${minor ? ` and ${wordsFor(minor, currency === "INR")} ${minorName}` : ""} Only`;
}

function invoiceDocument(invoice: Invoice, engagement: Engagement | undefined, settings: Settings | null) {
  const currency = invoice.currency || "INR";
  const lines = invoice.line_items?.length ? invoice.line_items : [{ description: "Software development services", qty: 1, rate: Number(invoice.amount) || 0 }];
  const subtotal = round2(lines.reduce((sum, line) => sum + round2(Number(line.qty) * Number(line.rate)), 0));
  const discount = round2(subtotal * Number(invoice.discount_percent ?? 0) / 100);
  const charges = round2(Number(invoice.other_charges ?? 0));
  const total = round2(subtotal - discount + charges);
  const company = settings?.site_name || "SiliconBrains";
  const paymentStatus = invoice.payment_status ?? (invoice.status === "paid" ? "paid" : "unpaid");
  const statusMark = (status: PaymentStatus) => paymentStatus === status ? "☒" : "☐";
  const blank = (value?: string | null) => esc(value || "________________");
  const address = (value?: string | null) => (value || "________________").split(/\r?\n/).map(esc).join("<br>");
  const itemRows = lines.map((item, index) => `<tr><td class="n">${index + 1}</td><td class="description">${esc(item.description).replace(/\r?\n/g, "<br>")}</td><td class="center">${esc(item.qty)}</td><td class="right">${esc(money(Number(item.rate), currency))}</td><td class="right">${esc(money(round2(Number(item.qty) * Number(item.rate)), currency))}</td></tr>`).join("");
  const statusLabel = invoice.status === "paid" ? "Paid" : invoice.status === "overdue" ? "Overdue" : "Pending";
  const safeTitle = esc(`SiliconBrains Invoice ${invoice.invoice_number}`);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${safeTitle}</title><style>
    @font-face{font-family:Cinzel;src:url('/invoice/fonts/Cinzel-Medium.ttf')}@font-face{font-family:Cinzel;src:url('/invoice/fonts/Cinzel-Bold.ttf');font-weight:700}@font-face{font-family:Cormorant;src:url('/invoice/fonts/Cormorant-Italic.ttf');font-style:italic}
    *{box-sizing:border-box}body{margin:0;background:#eef2ef;color:#051f20;font:10px Arial,Helvetica,sans-serif;line-height:1.4}.sheet{position:relative;width:210mm;min-height:297mm;margin:16px auto;padding:22mm 16mm 18mm;background:#fff}.sheet:before{content:"";position:absolute;z-index:0;inset:0;background:url('/invoice/assets/logo_watermark_doc.png') center 53%/78mm auto no-repeat;opacity:.14;pointer-events:none}.content{position:relative;z-index:1}.page-header{position:absolute;top:7mm;left:16mm;right:16mm;display:flex;align-items:center;justify-content:space-between;padding-bottom:4mm;border-bottom:.7px solid #8eb69b;color:#163832;font:700 10pt Cinzel,serif}.brand-mini{display:flex;align-items:center;gap:7px}.brand-mini img{width:22px;height:22px;object-fit:contain}.page-footer{position:absolute;bottom:6mm;left:16mm;right:16mm;display:flex;justify-content:space-between;align-items:center;padding-top:3mm;border-top:.7px solid #8eb69b;color:#235347;font-size:7.5px}.brand{display:block;width:82px;height:75px;object-fit:contain;margin:0 auto 2px}.title{text-align:center;color:#051f20;font:700 21pt Cinzel,serif;margin:0}.subtitle{text-align:center;color:#235347;font:9pt Cinzel,serif;letter-spacing:2px;margin:1px 0 4px}.rule{height:1px;width:60px;margin:0 auto 5px;background:#8eb69b}.ref{text-align:center;color:#235347;font:8px Cinzel,serif;margin-bottom:12px}.meta{display:grid;grid-template-columns:1fr 1fr 1fr;background:#f0f9f2;border:1px solid #8eb69b;margin-bottom:12px}.meta>section{padding:8px;border-right:1px solid #8eb69b;min-height:90px}.meta>section:last-child{border-right:0}.label{font:700 8px Cinzel,serif;color:#163832;letter-spacing:.4px;margin:0 0 5px}.meta p,.pay p{margin:2px 0;font-size:8.5px;overflow-wrap:anywhere}.items{width:100%;border-collapse:collapse;font-size:8.5px}.items thead{background:#235347;color:white}.items th{text-align:left;padding:6px 5px;font:700 7.5px Cinzel,serif}.items td{padding:6px 5px;border-bottom:1px solid #8eb69b;vertical-align:top}.items tbody tr:nth-child(even){background:#f0f9f2}.n,.center{text-align:center}.right{text-align:right;white-space:nowrap}.description{white-space:normal}.totals-wrap{display:grid;grid-template-columns:1fr auto;gap:12px;margin:9px 0 10px;align-items:start}.words{font-size:9px}.words p{margin:2px 0 7px}.totals{width:205px;border-collapse:collapse}.totals td{padding:4px 6px;border-bottom:1px solid #8eb69b;text-align:right}.totals td:first-child{text-align:left;font:9px Cinzel,serif}.totals tr:last-child{background:#daf1dd;font:700 10px Cinzel,serif;border:1px solid #235347}.pay{display:grid;grid-template-columns:1fr 1fr;border:1px solid #8eb69b;margin:8px 0}.pay section{padding:8px}.pay section+section{border-left:1px solid #8eb69b}.terms h2{font:700 9px Cinzel,serif;color:#163832;margin:8px 0 2px}.terms p{font-size:8px;line-height:1.35;margin:0}.thanks{text-align:center;color:#235347;font:italic 12px Cormorant,serif;margin:10px 0}.signatures{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;text-align:center;margin-top:6px}.signature{min-height:68px;display:flex;flex-direction:column;justify-content:flex-end}.signature .line{border-top:1px solid #235347;margin:0 auto 3px;width:80%}.signature strong{font:700 7.5px Cinzel,serif;color:#163832}.signature span{font-size:7px;color:#235347}.signature small{font-size:6.5px;color:#235347}.status{font-size:8px}.statusline{margin:5px 0}.print-note{text-align:center;color:#6b7568;font-size:10px;margin:10px}.print-button{display:block;margin:14px auto;padding:10px 18px;border:0;border-radius:24px;background:#1f4e3d;color:#fff;font-weight:700;cursor:pointer}
    @page{size:A4;margin:0}@media print{body{background:#fff}.sheet{margin:0;width:210mm;min-height:297mm;page-break-after:always;box-shadow:none}.print-note,.print-button{display:none}}
  </style></head><body><button class="print-button" onclick="window.print()">Print / Save as PDF</button><p class="print-note">In the print dialog, choose “Save as PDF” to download this invoice.</p><main class="sheet"><header class="page-header"><span class="brand-mini"><img src="/invoice/assets/logo_emblem.png" alt="">${esc(company)}</span><span>PAYMENT INVOICE</span></header><footer class="page-footer"><span>Doc. Ref: ${esc(invoice.invoice_number)}</span><span>Confidential — ${esc(company)}</span><span>Payment record · ${esc(statusLabel)}</span></footer><div class="content"><img class="brand" src="/invoice/assets/logo_full.png" alt="${esc(company)}"><h1 class="title">Invoice</h1><p class="subtitle">PAYMENT INVOICE</p><div class="rule"></div><p class="ref">Document Reference ${esc(invoice.invoice_number)}</p>
    <div class="meta"><section><h2 class="label">BILLED BY</h2><p><b>${esc(company)}</b></p><p>Address: ${blank(settings?.location)}</p><p>Phone: ${blank(settings?.phone)}</p><p>Email: ${blank(settings?.contact_email)}</p></section><section><h2 class="label">BILLED TO</h2><p>Client Name: <b>${blank(invoice.billed_to_name || engagement?.client?.full_name)}</b></p><p>Company: <b>${blank(invoice.billed_to_company || engagement?.client?.company_name)}</b></p><p>Address: ${address(invoice.billed_to_address)}</p><p>Phone: ${blank(invoice.billed_to_phone)}</p><p>Email: ${blank(invoice.billed_to_email || engagement?.client?.email)}</p></section><section><h2 class="label">INVOICE DETAILS</h2><p>Invoice No.: <b>${esc(invoice.invoice_number)}</b></p><p>Invoice Date: <b>${dateLabel(invoice.issued_date)}</b></p><p>Due Date: <b>${dateLabel(invoice.due_date)}</b></p><p>PO / Project Ref.: <b>${blank(invoice.po_ref || engagement?.title)}</b></p><p>Currency: <b>${esc(currency)}</b></p></section></div>
    <table class="items"><thead><tr><th class="n">#</th><th>DESCRIPTION OF SERVICES / DELIVERABLES</th><th class="center">QTY</th><th class="right">RATE (${esc(currency)})</th><th class="right">AMOUNT (${esc(currency)})</th></tr></thead><tbody>${itemRows}</tbody></table>
    <div class="totals-wrap"><section class="words"><h2 class="label">AMOUNT IN WORDS</h2><p><b>${esc(amountWords(total, currency))}</b></p><h2 class="label">PAYMENT STATUS</h2><p class="statusline">${statusMark("unpaid")} Unpaid &nbsp;&nbsp; ${statusMark("partial")} Partially Paid &nbsp;&nbsp; ${statusMark("paid")} Paid</p></section><table class="totals"><tbody><tr><td>Subtotal</td><td>${esc(money(subtotal, currency))}</td></tr><tr><td>Discount (${esc(invoice.discount_percent ?? 0)}%)</td><td>−${esc(money(discount, currency))}</td></tr><tr><td>Other Charges</td><td>${esc(money(charges, currency))}</td></tr><tr><td>TOTAL DUE</td><td>${esc(money(total, currency))}</td></tr></tbody></table></div>
    <section><h2 class="label">1. PAYMENT DETAILS</h2><div class="pay"><section><h2 class="label">BANK TRANSFER</h2><p>Account Name: ${blank(invoice.bank_account_name)}</p><p>Bank &amp; Branch: ${blank(invoice.bank_branch)}</p><p>Account No.: ${blank(invoice.bank_account_no)}</p><p>IFSC / SWIFT: ${blank(invoice.bank_ifsc_swift)}</p></section><section><h2 class="label">OTHER METHODS</h2><p>UPI ID: ${blank(invoice.upi_id)}</p><p>Cheque / DD in favour of: ${blank(invoice.cheque_in_favour)}</p><p>Payment Link: ${invoice.payment_link ? `<a href="${esc(invoice.payment_link)}">${esc(invoice.payment_link)}</a>` : "________________"}</p><p>Reference to quote: <b>${esc(invoice.invoice_number)}</b></p></section></div></section>
    <section class="terms"><h2>2. PAYMENT TERMS</h2><p>Payment is due in full by the Due Date shown above, unless otherwise agreed in writing. Please quote the invoice number as the payment reference so that the remittance can be matched to your account without delay. Bank charges, if any, are to be borne by the payer.</p><h2>3. LATE PAYMENT</h2><p>Invoices not settled by the Due Date may attract a late-payment charge of <b>${invoice.late_fee_percent == null ? "____" : esc(invoice.late_fee_percent)}%</b> per month on the outstanding balance. Silicon Brains reserves the right to pause ongoing work until the account is brought up to date.</p><h2>4. QUERIES</h2><p>For clarification regarding this invoice, please contact us within seven (7) days of the Invoice Date, quoting the document reference.</p></section><p class="thanks">Thank you for choosing ${esc(company)} — Be the Premium.</p>
    <section><h2 class="label">AUTHORISED SIGNATURES</h2><div class="signatures"><div class="signature"><div class="line"></div><strong>FOUNDER</strong><span>${esc(company)}</span><small>SB-M1810-A2626</small></div><div class="signature"><div class="line"></div><strong>CO-FOUNDER</strong><span>${esc(company)}</span><small>SB-A0926-SK926</small></div><div class="signature"><div class="line"></div><strong>AUTHORISED SIGNATORY</strong><span>(Name &amp; Designation)</span></div></div></section></div></main><script>window.addEventListener('load',()=>{Promise.all([document.fonts?.ready||Promise.resolve(),...Array.from(document.images).map(i=>i.decode?.().catch(()=>{}))]).then(()=>setTimeout(()=>window.print(),250))})</script></body></html>`;
}

export default function InvoiceManager() {
  const { getToken } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | InvoiceStatus>("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const token = useCallback(async () => {
    const value = await getToken();
    if (!value) throw new Error("Your session expired. Sign in again to manage invoices.");
    return value;
  }, [getToken]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const authToken = await token();
      const [invoiceRows, projectRows] = await Promise.all([
        api.admin.list<Invoice[]>(authToken, "invoices"),
        api.admin.list<Engagement[]>(authToken, "client-projects"),
      ]);
      setInvoices(invoiceRows);
      setEngagements(projectRows);
      setSettings(await api.admin.list<Settings>(authToken, "settings").catch(() => null));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load invoice data.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { void load(); }, [load]);

  const projectsById = useMemo(() => Object.fromEntries(engagements.map((project) => [project.id, project])), [engagements]);
  const visibleInvoices = useMemo(() => {
    const q = query.trim().toLowerCase();
    return invoices.filter((invoice) => {
      const project = projectsById[invoice.client_project_id];
      const matchesStatus = filter === "all" || invoice.status === filter;
      const matchesQuery = !q || [invoice.invoice_number, project?.title, project?.client?.full_name, project?.client?.company_name].some((value) => String(value ?? "").toLowerCase().includes(q));
      return matchesStatus && matchesQuery;
    });
  }, [invoices, projectsById, query, filter]);

  function startNew() {
    setEditing(freshDraft());
    setEditingId(null);
    setError("");
    setNotice("");
  }

  function startEdit(invoice: Invoice) {
    setEditing(toDraft(invoice));
    setEditingId(invoice.id);
    setError("");
    setNotice("");
  }

  function patch<K extends keyof Draft>(key: K, value: Draft[K]) {
    setEditing((current) => current ? { ...current, [key]: value } : current);
  }

  function selectEngagement(id: string) {
    const project = projectsById[id];
    setEditing((current) => current ? {
      ...current,
      client_project_id: id,
      billed_to_name: project?.client?.full_name ?? current.billed_to_name,
      billed_to_company: project?.client?.company_name ?? current.billed_to_company,
      billed_to_email: project?.client?.email ?? current.billed_to_email,
    } : current);
  }

  function updateItem(index: number, key: keyof LineItem, value: string) {
    setEditing((current) => {
      if (!current) return current;
      const lineItems = [...(current.line_items ?? [])];
      lineItems[index] = { ...lineItems[index], [key]: key === "description" ? value : Number(value) };
      return { ...current, line_items: lineItems };
    });
  }

  async function saveInvoice(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing || saving) return;
    const items = (editing.line_items ?? []).map((item) => ({ ...item, description: item.description.trim(), qty: Number(item.qty), rate: Number(item.rate) }));
    if (!editing.client_project_id) return setError("Choose the client engagement for this invoice.");
    if (editingId && !editing.invoice_number.trim()) return setError("Saved invoice number is missing.");
    if (!items.length || items.some((item) => !item.description || !Number.isFinite(item.qty) || item.qty <= 0 || !Number.isFinite(item.rate) || item.rate < 0)) return setError("Add at least one valid line item with a description, quantity, and rate.");
    const amounts = totalFor({ line_items: items, discount_percent: editing.discount_percent, other_charges: editing.other_charges });
    if (amounts.total <= 0) return setError("Invoice total must be greater than zero.");
    const payload = {
      ...editing,
      amount: amounts.total,
      line_items: items,
      invoice_number: editingId ? editing.invoice_number.trim() : "",
      currency: editing.currency.trim().toUpperCase(),
      discount_percent: Number(editing.discount_percent ?? 0),
      other_charges: Number(editing.other_charges ?? 0),
      late_fee_percent: editing.late_fee_percent == null || String(editing.late_fee_percent) === "" ? null : Number(editing.late_fee_percent),
    };
    setSaving(true);
    setError("");
    try {
      const authToken = await token();
      let assignedInvoiceNumber = editing.invoice_number;
      if (editingId) await api.admin.update(authToken, "invoices", editingId, payload);
      else {
        const savedInvoice = await api.admin.create<Invoice>(authToken, "invoices", payload);
        assignedInvoiceNumber = savedInvoice.invoice_number;
      }
      setEditing(null);
      setEditingId(null);
      setNotice(editingId ? "Invoice updated." : `Invoice ${assignedInvoiceNumber} created. You can now download its PDF.`);
      await load();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save invoice.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(invoice: Invoice) {
    setBusyId(invoice.id);
    try {
      await api.admin.remove(await token(), "invoices", invoice.id);
      setInvoices((rows) => rows.filter((row) => row.id !== invoice.id));
      setConfirmId(null);
      setNotice("Invoice deleted.");
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "Could not delete invoice.");
    } finally {
      setBusyId(null);
    }
  }

  function downloadPdf(invoice: Invoice) {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      setError("Your browser blocked the invoice window. Allow pop-ups for this site, then try again.");
      return;
    }
    printWindow.opener = null;
    printWindow.document.open();
    printWindow.document.write(invoiceDocument(invoice, projectsById[invoice.client_project_id], settings));
    printWindow.document.close();
  }

  const filterTabs: { key: "all" | InvoiceStatus; label: string }[] = [
    { key: "all", label: "All" }, { key: "pending", label: "Pending" }, { key: "overdue", label: "Overdue" }, { key: "paid", label: "Paid" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">Billing & documents</p>
          <h1 className="text-2xl font-semibold tracking-tight text-on-surface">Invoices</h1>
          <p className="mt-1 max-w-2xl text-sm text-on-surface-variant">Create client invoices, track payment status, and export branded A4 PDFs.</p>
        </div>
        {!editing && <Button variant="primary" onClick={startNew}><span aria-hidden="true">＋</span> Create invoice</Button>}
      </div>

      {notice && <div role="status" className="rounded-xl border border-primary/15 bg-secondary-container px-4 py-3 text-sm text-on-surface">{notice}</div>}
      {error && <div role="alert" className="rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">{error}</div>}

      {editing && (
        <Card className="invoice-editor flex flex-col gap-6 !p-5 sm:!p-7">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-outline pb-4">
            <div><p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-primary">{editingId ? "Update saved record" : "New document"}</p><h2 className="mt-1 text-lg font-semibold text-on-surface">{editingId ? `Edit ${editing.invoice_number}` : "Create an invoice"}</h2></div>
            <button type="button" onClick={() => { setEditing(null); setEditingId(null); setError(""); }} className="rounded-lg border border-outline px-3 py-2 text-xs text-on-surface-variant transition hover:text-on-surface">Close</button>
          </div>
          <form onSubmit={saveInvoice} className="flex flex-col gap-6">
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <label className="field"><span>Client engagement *</span><select className={INPUT} value={editing.client_project_id} onChange={(event) => selectEngagement(event.target.value)}><option value="">Select an engagement</option>{engagements.map((project) => <option key={project.id} value={project.id}>{project.title}{project.client?.full_name ? ` · ${project.client.full_name}` : ""}</option>)}</select></label>
              <label className="field"><span>Invoice number</span><input className={`${INPUT} read-only:cursor-not-allowed read-only:bg-surface-container-low`} value={editing.invoice_number || "Assigned automatically on save"} readOnly aria-describedby="invoice-number-help" /><span id="invoice-number-help" className="text-[10px] font-normal">Generated sequentially when you create the invoice.</span></label>
              <label className="field"><span>PO / project reference</span><input className={INPUT} value={editing.po_ref ?? ""} onChange={(event) => patch("po_ref", event.target.value)} placeholder="Optional reference" /></label>
              <label className="field"><span>Invoice date</span><input type="date" className={INPUT} value={editing.issued_date ?? ""} onChange={(event) => patch("issued_date", event.target.value)} /></label>
              <label className="field"><span>Due date</span><input type="date" className={INPUT} value={editing.due_date ?? ""} onChange={(event) => patch("due_date", event.target.value)} /></label>
              <label className="field"><span>Currency</span><select className={INPUT} value={editing.currency} onChange={(event) => patch("currency", event.target.value)}>{["INR", "USD", "EUR", "GBP", "AED", "SGD", "AUD", "CAD"].map((currency) => <option key={currency}>{currency}</option>)}</select></label>
              <label className="field"><span>Invoice status</span><select className={INPUT} value={editing.status} onChange={(event) => patch("status", event.target.value as InvoiceStatus)}><option value="pending">Pending</option><option value="overdue">Overdue</option><option value="paid">Paid</option></select></label>
              <label className="field"><span>Payment status on PDF</span><select className={INPUT} value={editing.payment_status ?? "unpaid"} onChange={(event) => patch("payment_status", event.target.value as PaymentStatus)}><option value="unpaid">Unpaid</option><option value="partial">Partially paid</option><option value="paid">Paid</option></select></label>
            </section>

            <section className="flex flex-col gap-3">
              <div className="flex flex-wrap items-end justify-between gap-3"><div><h3 className="text-sm font-semibold text-on-surface">Services & deliverables</h3><p className="mt-1 text-xs text-on-surface-variant">Line totals and the invoice total are calculated automatically.</p></div><button type="button" onClick={() => patch("line_items", [...(editing.line_items ?? []), { description: "", qty: 1, rate: 0 }])} className="rounded-lg border border-outline px-3 py-2 text-xs font-medium text-primary transition hover:bg-secondary-container">＋ Add line item</button></div>
              <div className="overflow-x-auto rounded-xl border border-outline"><table className="w-full min-w-[660px] text-left text-sm"><thead className="bg-surface-container-low text-[10px] uppercase tracking-wider text-on-surface-variant"><tr><th className="px-3 py-2.5">Description</th><th className="w-24 px-3 py-2.5">Qty</th><th className="w-36 px-3 py-2.5">Rate</th><th className="w-36 px-3 py-2.5 text-right">Amount</th><th className="w-12 px-2" /></tr></thead><tbody>{(editing.line_items ?? []).map((item, index) => <tr key={index} className="border-t border-outline"><td className="px-3 py-2"><textarea className={`${INPUT} min-h-10 resize-y`} value={item.description} onChange={(event) => updateItem(index, "description", event.target.value)} placeholder="Describe the service" rows={2} /></td><td className="px-3 py-2"><input type="number" min="0.01" step="any" className={INPUT} value={item.qty} onChange={(event) => updateItem(index, "qty", event.target.value)} /></td><td className="px-3 py-2"><input type="number" min="0" step="0.01" className={INPUT} value={item.rate} onChange={(event) => updateItem(index, "rate", event.target.value)} /></td><td className="px-3 py-2 text-right font-medium text-on-surface">{money(round2(item.qty * item.rate), editing.currency)}</td><td className="px-2 py-2"><button type="button" aria-label={`Remove line ${index + 1}`} disabled={(editing.line_items ?? []).length <= 1} onClick={() => patch("line_items", (editing.line_items ?? []).filter((_, itemIndex) => itemIndex !== index))} className="rounded-md p-2 text-on-surface-variant transition hover:bg-error/10 hover:text-error disabled:opacity-30">×</button></td></tr>)}</tbody></table></div>
            </section>

            <section className="grid gap-4 sm:grid-cols-3">
              <label className="field"><span>Discount (%)</span><input type="number" min="0" max="100" step="0.01" className={INPUT} value={editing.discount_percent ?? 0} onChange={(event) => patch("discount_percent", Number(event.target.value))} /></label>
              <label className="field"><span>Other charges</span><input type="number" min="0" step="0.01" className={INPUT} value={editing.other_charges ?? 0} onChange={(event) => patch("other_charges", Number(event.target.value))} /></label>
              <div className="rounded-xl bg-secondary-container px-4 py-3"><p className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">Total due</p><p className="mt-1 text-xl font-semibold text-primary">{money(totalFor(editing).total, editing.currency)}</p></div>
            </section>

            <details className="group rounded-xl border border-outline">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-on-surface marker:hidden">Invoice details & payment instructions <span className="float-right text-on-surface-variant transition group-open:rotate-180">⌄</span></summary>
              <div className="grid gap-5 border-t border-outline p-4 lg:grid-cols-2">
                <div className="grid gap-3 sm:grid-cols-2"><h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant sm:col-span-2">Client billing snapshot</h3><label className="field"><span>Name</span><input className={INPUT} value={editing.billed_to_name ?? ""} onChange={(event) => patch("billed_to_name", event.target.value)} /></label><label className="field"><span>Company</span><input className={INPUT} value={editing.billed_to_company ?? ""} onChange={(event) => patch("billed_to_company", event.target.value)} /></label><label className="field"><span>Email</span><input type="email" className={INPUT} value={editing.billed_to_email ?? ""} onChange={(event) => patch("billed_to_email", event.target.value)} /></label><label className="field"><span>Phone</span><input className={INPUT} value={editing.billed_to_phone ?? ""} onChange={(event) => patch("billed_to_phone", event.target.value)} /></label><label className="field sm:col-span-2"><span>Billing address</span><textarea className={INPUT} rows={2} value={editing.billed_to_address ?? ""} onChange={(event) => patch("billed_to_address", event.target.value)} /></label></div>
                <div className="grid gap-3 sm:grid-cols-2"><h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant sm:col-span-2">Payment instructions</h3><label className="field"><span>Account name</span><input className={INPUT} value={editing.bank_account_name ?? ""} onChange={(event) => patch("bank_account_name", event.target.value)} /></label><label className="field"><span>Bank & branch</span><input className={INPUT} value={editing.bank_branch ?? ""} onChange={(event) => patch("bank_branch", event.target.value)} /></label><label className="field"><span>Account number</span><input className={INPUT} value={editing.bank_account_no ?? ""} onChange={(event) => patch("bank_account_no", event.target.value)} /></label><label className="field"><span>IFSC / SWIFT</span><input className={INPUT} value={editing.bank_ifsc_swift ?? ""} onChange={(event) => patch("bank_ifsc_swift", event.target.value)} /></label><label className="field"><span>UPI ID</span><input className={INPUT} value={editing.upi_id ?? ""} onChange={(event) => patch("upi_id", event.target.value)} /></label><label className="field"><span>Cheque payable to</span><input className={INPUT} value={editing.cheque_in_favour ?? ""} onChange={(event) => patch("cheque_in_favour", event.target.value)} /></label><label className="field"><span>Payment link</span><input type="url" className={INPUT} value={editing.payment_link ?? ""} onChange={(event) => patch("payment_link", event.target.value)} /></label><label className="field"><span>Late fee (% per month)</span><input type="number" min="0" max="100" step="0.01" className={INPUT} value={editing.late_fee_percent ?? ""} onChange={(event) => patch("late_fee_percent", event.target.value === "" ? null : Number(event.target.value))} /></label></div>
              </div>
            </details>

            <div className="flex flex-wrap items-center gap-3 border-t border-outline pt-4"><Button type="submit" variant="primary" className={saving ? "pointer-events-none opacity-60" : ""}>{saving ? "Saving…" : editingId ? "Save changes" : "Create invoice"}</Button><Button type="button" variant="secondary" onClick={() => { setEditing(null); setEditingId(null); }}>Cancel</Button><p className="text-xs text-on-surface-variant">Client billing details are saved as a snapshot on this invoice.</p></div>
          </form>
        </Card>
      )}

      <Card className="overflow-hidden !p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline px-4 py-3 sm:px-5">
          <label className="flex min-w-[210px] flex-1 items-center gap-2 rounded-lg border border-outline bg-surface-container-low px-3 py-2 sm:max-w-sm"><span className="sr-only">Search invoices</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-on-surface-variant" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" strokeLinecap="round" /></svg><input className="min-w-0 flex-1 bg-transparent text-xs text-on-surface outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search invoice, client, project…" /></label>
          <div className="flex flex-wrap items-center gap-2">{filterTabs.map((tab) => <button key={tab.key} type="button" onClick={() => setFilter(tab.key)} aria-pressed={filter === tab.key} className={`rounded-full border px-3 py-1.5 text-[11px] font-medium transition ${filter === tab.key ? "border-primary bg-primary text-on-primary" : "border-outline text-on-surface-variant hover:border-primary/40"}`}>{tab.label}{tab.key !== "all" && <span className="ml-1 opacity-70">{invoices.filter((invoice) => invoice.status === tab.key).length}</span>}</button>)}<button type="button" onClick={() => void load()} disabled={loading} className="rounded-lg border border-outline px-3 py-2 text-xs text-on-surface-variant transition hover:border-primary/40 disabled:opacity-50">{loading ? "Loading…" : "Refresh"}</button></div>
        </div>
        {error && loading === false && invoices.length === 0 ? <div role="alert" className="px-6 py-12 text-center text-sm text-error">Invoice data could not be loaded. Check the API and database connection, then refresh.</div> : loading ? <div className="space-y-3 p-5" aria-busy="true">{[0, 1, 2].map((index) => <div key={index} className="h-12 animate-pulse rounded-lg bg-surface-container-high/70" />)}</div> : invoices.length === 0 ? <div className="px-6 py-12 text-center"><p className="text-sm font-medium text-on-surface">No invoices yet</p><p className="mt-1 text-xs text-on-surface-variant">Create an invoice to record the billing details and generate its branded PDF.</p><Button variant="primary" onClick={startNew} className="mt-4">Create first invoice</Button></div> : visibleInvoices.length === 0 ? <div className="px-6 py-12 text-center text-sm text-on-surface-variant">No invoices match this search or status.</div> : (
          <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-surface-container-low text-[10px] uppercase tracking-wider text-on-surface-variant"><tr><th className="px-4 py-3">Invoice</th><th className="px-4 py-3">Client / project</th><th className="px-4 py-3">Issued · Due</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Total</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody>{visibleInvoices.map((invoice) => { const project = projectsById[invoice.client_project_id]; return <tr key={invoice.id} className="admin-table-row border-t border-outline/70"><td className="px-4 py-4"><p className="font-semibold text-on-surface">{invoice.invoice_number}</p><p className="mt-1 text-[10px] text-on-surface-variant">{invoice.payment_status ?? (invoice.status === "paid" ? "paid" : "unpaid")} payment</p></td><td className="px-4 py-4"><p className="font-medium text-on-surface">{invoice.billed_to_name || project?.client?.full_name || "Client"}</p><p className="mt-1 text-xs text-on-surface-variant">{invoice.billed_to_company || project?.client?.company_name || project?.title || "—"}</p></td><td className="px-4 py-4 text-xs text-on-surface-variant"><p>{dateLabel(invoice.issued_date)}</p><p className="mt-1">Due {dateLabel(invoice.due_date)}</p></td><td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${invoice.status === "paid" ? "bg-secondary-container text-primary" : invoice.status === "overdue" ? "bg-error/10 text-error" : "bg-surface-container-high text-on-surface-variant"}`}>{invoice.status}</span></td><td className="px-4 py-4 text-right font-semibold text-on-surface">{money(Number(invoice.amount), invoice.currency || "INR")}</td><td className="px-4 py-4"><div className="flex justify-end gap-2"><button type="button" onClick={() => downloadPdf(invoice)} className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-on-primary transition hover:shadow-[0_6px_18px_rgba(31,78,61,0.18)]">Download PDF</button><button type="button" onClick={() => startEdit(invoice)} className="rounded-lg border border-outline px-3 py-2 text-xs font-medium text-on-surface-variant transition hover:border-primary/40 hover:text-on-surface">Edit</button>{confirmId === invoice.id ? <><button type="button" disabled={busyId === invoice.id} onClick={() => void remove(invoice)} className="rounded-lg border border-error/25 px-2.5 py-2 text-xs text-error disabled:opacity-50">{busyId === invoice.id ? "Deleting…" : "Confirm"}</button><button type="button" onClick={() => setConfirmId(null)} className="rounded-lg border border-outline px-2.5 py-2 text-xs text-on-surface-variant">Cancel</button></> : <button type="button" onClick={() => setConfirmId(invoice.id)} className="rounded-lg border border-outline px-2.5 py-2 text-xs text-on-surface-variant transition hover:border-error/30 hover:text-error">Delete</button>}</div></td></tr>; })}</tbody></table></div>
        )}
        <div className="border-t border-outline bg-surface-container-low px-4 py-2.5 text-[10px] text-on-surface-variant">PDF uses the saved invoice snapshot and SiliconBrains invoice branding. In the print window, select “Save as PDF”.</div>
      </Card>
    </div>
  );
}
