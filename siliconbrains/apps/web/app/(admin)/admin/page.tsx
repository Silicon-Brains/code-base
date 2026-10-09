import { auth } from "@clerk/nextjs/server";
import Card from "@/components/Card";
import { api, loadOr } from "@/lib/api";
import WelcomeBanner from "@/components/admin/dashboard/WelcomeBanner";
import StatCard from "@/components/admin/dashboard/StatCard";
import EnquiriesTrend from "@/components/admin/dashboard/EnquiriesTrend";
import ProjectStatusDonut from "@/components/admin/dashboard/ProjectStatusDonut";
import RecentEnquiries from "@/components/admin/dashboard/RecentEnquiries";
import RecentProjects from "@/components/admin/dashboard/RecentProjects";
import RecentMessages from "@/components/admin/dashboard/RecentMessages";
import UpcomingTasks from "@/components/admin/dashboard/UpcomingTasks";
import QuickActions from "@/components/admin/dashboard/QuickActions";
import type { AdminDashboard } from "@/lib/types";

const EMPTY: AdminDashboard = {
  kpis: {
    totalEnquiries:  { value: 0, delta: 0, trend: "flat" },
    activeProjects:  { value: 0, delta: 0, trend: "flat" },
    totalClients:    { value: 0, delta: 0, trend: "flat" },
    unreadMessages:  { value: 0, delta: 0, trend: "flat" },
  },
  enquiryTrend: [],
  projectStatus: [],
  recentEnquiries: [],
  recentProjects: [],
  recentMessages: [],
  upcomingTasks: [],
};

export default async function AdminDashboardPage() {
  const token = (await auth().getToken()) ?? "";

  const data = await loadOr<AdminDashboard>(
    "admin dashboard",
    () => api.admin.dashboard<AdminDashboard>(token),
    EMPTY
  );

  return (
    <div className="flex flex-col gap-6">
      <WelcomeBanner />

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Enquiries"  kpi={data.kpis.totalEnquiries}  tone="enquiries" />
        <StatCard label="Active Projects"  kpi={data.kpis.activeProjects}  tone="projects" />
        <StatCard label="Total Clients"    kpi={data.kpis.totalClients}    tone="clients" />
        <StatCard label="Unread Messages"  kpi={data.kpis.unreadMessages}  tone="messages" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
        <EnquiriesTrend data={data.enquiryTrend} />
        <ProjectStatusDonut data={data.projectStatus} />
      </div>

      {/* Recent row: enquiries table (wide) + projects list */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
        <RecentEnquiries items={data.recentEnquiries} />
        <RecentProjects items={data.recentProjects} />
      </div>

      {/* Bottom row: messages + quick actions + tasks */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr_1fr]">
        <RecentMessages items={data.recentMessages} />
        <QuickActions />
        <UpcomingTasks items={data.upcomingTasks} />
      </div>
    </div>
  );
}