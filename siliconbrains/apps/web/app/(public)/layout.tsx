import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Public marketing area is the light-themed surface. Admin + Portal stay dark.
// Wrapping here (not in the root layout) keeps the theme opt-in per route group.
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="theme-light min-h-screen bg-background text-on-surface">
      <div className="pt-4">
        <Navbar />
      </div>
      <main>{children}</main>
      <Footer />
    </div>
  );
}
