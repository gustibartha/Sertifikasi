import { getEmployees } from "@/app/actions/employee";
import { OrganikClient } from "./organik-client";

export default async function OrganikPage() {
  const response = await getEmployees("Organik");
  const data = response.success && response.data ? response.data : [];

  return <OrganikClient initialData={data} />;
}
