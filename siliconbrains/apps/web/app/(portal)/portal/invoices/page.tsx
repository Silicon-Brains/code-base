import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import Card from "@/components/Card";
import StatusBadge from "@/components/portal/StatusBadge";
import { api } from "@/lib/api";
import { formatDate, formatMoney } from "@/lib/format";
import type { PortalInvoice } from "@/lib/types";

export default async function PortalInvoicesPage() {
  let invoices: PortalInvoice[] = [];
  let error = "";
  try {
    invoices = await api.portal.getInvoices((await auth().getToken()) ?? "");
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load invoices";
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/portal" className="text-xs text-on-surface-variant hover:text-on-surface">
          ← Dashboard
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-on-surface">Invoices</h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          A record of invoices issued for your projects. Questions about an invoice? Reply to it or use the contact page.
        </p>
      </div>

      {error && (
        <div role="alert" className="rounded-md border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}

      {!error && invoices.length === 0 ? (
        <Card>
          <p className="text-sm text-on-surface-variant">No invoices yet.</p>
        </Card>
      ) : (
        !error && (
          <Card className="overflow-x-auto !p-0">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-outline text-[10px] uppercase tracking-wide text-on-surface-variant">
                  <th className="px-4 py-3 font-medium">Invoice</th>
                  <th className="px-4 py-3 font-medium">Project</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Issued</th>
                  <th className="px-4 py-3 font-medium">Due</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-outline/60 last:border-0">
                    <td className="px-4 py-3 text-on-surface">{inv.invoice_number}</td>
                    <td className="px-4 py-3 text-on-surface-variant">
                      <Link href={`/portal/projects/${inv.client_project_id}`} className="hover:text-primary">
                        {inv.project_title ?? "—"}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-on-surface">{formatMoney(Number(inv.amount), inv.currency)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant">{formatDate(inv.issued_date)}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{formatDate(inv.due_date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )
      )}
    </div>
  );
}
