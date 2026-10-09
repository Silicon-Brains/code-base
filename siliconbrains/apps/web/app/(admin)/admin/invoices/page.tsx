import ResourceManager from "@/components/admin/ResourceManager";
import { INVOICES } from "@/lib/admin-config";

export default function AdminInvoicesPage() {
  return <ResourceManager {...INVOICES} />;
}
