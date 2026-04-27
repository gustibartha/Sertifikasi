import { getEmployees } from "@/app/actions/employee";
import { TadClient } from "./tad-client";

export const dynamic = 'force-dynamic';

export default async function TadPage() {
  const response = await getEmployees("TAD");
  const data = response.success && response.data ? response.data : [];

  return <TadClient initialData={data} />;
}
