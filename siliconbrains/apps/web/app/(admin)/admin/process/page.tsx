import ResourceManager from "@/components/admin/ResourceManager";
import { PROCESS_STEPS } from "@/lib/admin-config";

export default function AdminProcessPage() {
  return <ResourceManager {...PROCESS_STEPS} />;
}
