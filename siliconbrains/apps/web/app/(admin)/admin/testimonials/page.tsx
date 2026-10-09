import ResourceManager from "@/components/admin/ResourceManager";
import { TESTIMONIALS } from "@/lib/admin-config";

export default function AdminTestimonialsPage() {
  return <ResourceManager {...TESTIMONIALS} />;
}
