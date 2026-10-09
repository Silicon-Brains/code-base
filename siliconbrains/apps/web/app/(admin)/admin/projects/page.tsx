import ResourceManager from "@/components/admin/ResourceManager";
import { PROJECTS } from "@/lib/admin-config";

export default function AdminProjectsPage() {
  return <ResourceManager {...PROJECTS} />;
}
