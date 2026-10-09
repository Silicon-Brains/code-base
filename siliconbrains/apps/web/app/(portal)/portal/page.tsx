import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import ProgressBar from "@/components/portal/ProgressBar";
import StatusBadge from "@/components/portal/StatusBadge";
import SprintKpiRow from "@/components/portal/SprintKpiRow";
import TaskBoard from "@/components/portal/TaskBoard";
import RepoGrid from "@/components/portal/RepoGrid";
import StagingPanel from "@/components/portal/StagingPanel";
import TeamRoster from "@/components/portal/TeamRoster";
import BillingAudit from "@/components/portal/BillingAudit";
import TelemetryFooter from "@/components/portal/TelemetryFooter";
import { api, loadOr } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { PortalProject, PortalMilestone, PortalSprintView } from "@/lib/types";

const TOTAL_PHASES = 5;

export default async function PortalDashboardPage() {
  const user = await currentUser();
  const token = (await auth().getToken()) ?? "";

  let projects: PortalProject[] = [];
  let error = "";
  try {
    projects = await api.portal.getProjects(token);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load your projects";
  }

  const leadProject = projects[0];

  // Load sprint view + milestone timeline for the lead project.
  const sprintView = leadProject
    ? await loadOr<PortalSprintView | null>(
        "portal sprint view",
        () => api.portal.getSprint(token, leadProject.id),
        null
      )
    : null;

  const detail = leadProject
    ? await loadOr("portal project detail", () => api.portal.getProject(token, leadProject.id), null)
    : null;

  const milestones: PortalMilestone[] = detail?.milestones ?? [];
  const nextMilestone = milestones.find((m) => m.status !== "done");

  return (
    <div className="flex flex-col gap-6">
      {/* Hero banner */}
      <Card className="flex flex-col gap-5 !bg-surface-container-high md:flex-row md:items-center md:justify-between">
        <div>
          {leadProject && (
            <Badge active className="mb-3">
              Phase {leadProject.current_phase}/{TOTAL_PHASES} active
            </Badge>
          )}
          <p className="text-[11px] uppercase tracking-wider text-on-surface-variant">
            SiliconBrains Portal · Apex Protocols Marketplace
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-on-surface md:text-4xl">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ""}
          </h1>
          {leadProject && (
            <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
              Live status of <span className="text-on-surface">{leadProject.title}</span>
              {leadProject.status_summary ? ` — ${leadProject.status_summary}` : ""}.
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button href="/contact" variant="secondary">Request Ad-hoc Build ↗</Button>
          <Button href="/portal/invoices" variant="secondary">Staging</Button>
          <Button href="/contact" variant="primary">Standup Call</Button>
        </div>
      </Card>

      {error && (
        <div role="alert" className="rounded-md border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}

      {!error && !leadProject && (
        <Card className="flex flex-col items-start gap-4">
          <p className="text-sm text-on-surface-variant">
            No projects are linked to your account yet. Once we kick off your engagement it will appear here with live
            status, milestones and invoices.
          </p>
          <Button href="/contact" variant="secondary">Contact the team</Button>
        </Card>
      )}

      {!error && leadProject && sprintView && (
        <>
          {/* Sprint KPI row */}
          <SprintKpiRow sprint={sprintView.sprint} project={sprintView.project} />

          {/* Main 2-col: task board + staging */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
            <div className="flex flex-col gap-6">
              <TaskBoard sprint={sprintView.sprint} tasks={sprintView.tasks} />
              <RepoGrid repositories={sprintView.repositories} artifacts={sprintView.artifacts} />
            </div>
            <div className="flex flex-col gap-6">
              <StagingPanel deployments={sprintView.staging} />
              <TeamRoster team={sprintView.team} />
            </div>
          </div>

          {/* Billing audit */}
          <BillingAudit milestones={milestones} />

          {/* Telemetry footer */}
          <TelemetryFooter sprint={sprintView.sprint} />
        </>
      )}

      {/* Fallback: show original project cards + milestones if sprint view isn't populated yet */}
      {!error && leadProject && !sprintView && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
          <section className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-on-surface">Your projects</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {projects.map((p) => (
                <Link key={p.id} href={`/portal/projects/${p.id}`}>
                  <Card interactive className="flex h-full flex-col gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold text-on-surface">{p.title}</h3>
                      <Badge active>Phase {p.current_phase}/{TOTAL_PHASES}</Badge>
                    </div>
                    {p.status_summary && <p className="text-sm text-on-surface-variant">{p.status_summary}</p>}
                    <div className="mt-auto flex flex-col gap-3">
                      <ProgressBar percent={p.progress_percent} showLabel />
                      <p className="text-[10px] uppercase tracking-wide text-on-surface-variant">
                        Updated {formatDate(p.updated_at)}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-on-surface">Upcoming milestones</h2>
            {nextMilestone ? (
              <Card className="flex flex-col gap-2">
                <p className="text-sm font-medium text-on-surface">{nextMilestone.title}</p>
                <p className="text-xs text-on-surface-variant">Due {formatDate(nextMilestone.due_date)}</p>
                <StatusBadge status={nextMilestone.status} />
              </Card>
            ) : (
              <Card>
                <p className="text-sm text-on-surface-variant">No open milestones right now.</p>
              </Card>
            )}
          </section>
        </div>
      )}
    </div>
  );
}