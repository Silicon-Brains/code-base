import ResourceManager from "@/components/admin/ResourceManager";
import { SERVICES } from "@/lib/admin-config";

export default function AdminServicesPage() {
  return <ResourceManager {...SERVICES} />;
}
