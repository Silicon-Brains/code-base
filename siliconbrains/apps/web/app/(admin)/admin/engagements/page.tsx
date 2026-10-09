import ResourceManager from "@/components/admin/ResourceManager";
import { ENGAGEMENTS } from "@/lib/admin-config";

export default function AdminEngagementsPage() {
  return <ResourceManager {...ENGAGEMENTS} />;
}
