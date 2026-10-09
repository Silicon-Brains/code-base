import ResourceManager from "@/components/admin/ResourceManager";
import { FAQS } from "@/lib/admin-config";

export default function AdminFaqsPage() {
  return <ResourceManager {...FAQS} />;
}
