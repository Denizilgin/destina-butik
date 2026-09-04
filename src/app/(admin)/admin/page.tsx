import { readProducts, readCategories } from "@/lib/store";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default async function AdminPage() {
  const [products, categories] = await Promise.all([readProducts(), readCategories()]);

  return <AdminDashboard initialProducts={products} initialCategories={categories} />;
}
