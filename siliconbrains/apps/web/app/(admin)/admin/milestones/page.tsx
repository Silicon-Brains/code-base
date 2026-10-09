import ResourceManager from "@/components/admin/ResourceManager";
import { MILESTONES } from "@/lib/admin-config";

export default function AdminMilestonesPage() {
  return <ResourceManager {...MILESTONES} />;
}
