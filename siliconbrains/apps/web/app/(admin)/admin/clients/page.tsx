import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { api } from "@/lib/api";
import type { AdminClient } from "@/lib/types";

export default async function AdminClientsPage() {
  let clients: AdminClient[] = [];
  let error = "";
  try {
    const token = await auth().getToken();
    clients = await api.admin.list<AdminClient[]>(token ?? "", "clients");
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load clients";
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-on-surface">Clients</h1>
          <p className="mt-1 max-w-2xl text-sm text-on-surface-variant">
            Clients appear here after they sign up (the Clerk webhook creates their profile). Link them to a project by
            creating an engagement.
          </p>
        </div>
        <Button href="/admin/engagements" variant="primary">
          Create engagement →
        </Button>
      </div>

      {error && (
        <div role="alert" className="rounded-md border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}

      {!error && clients.length === 0 ? (
        <Card>
          <p className="text-sm text-on-surface-variant">No clients yet.</p>
        </Card>
      ) : (
        <Card className="overflow-x-auto !p-0">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-outline text-[10px] uppercase tracking-wide text-on-surface-variant">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Engagements</th>
                <th className="px-4 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} className="border-b border-outline/60 last:border-0">
                  <td className="px-4 py-3 text-on-surface">{c.full_name ?? "—"}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{c.email ?? "—"}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{c.company_name ?? "—"}</td>
                  <td className="px-4 py-3 text-on-surface-variant">
                    {c.client_projects?.length ? (
                      c.client_projects.map((p) => (
                        <div key={p.id}>
                          {p.title} · phase {p.current_phase} · {p.progress_percent}%
                        </div>
                      ))
                    ) : (
                      <Link href="/admin/engagements" className="text-primary hover:underline">
                        None — create one
                      </Link>
                    )}
                  </td>
                  <td className="px-4 py-3 text-on-surface-variant">{new Date(c.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
