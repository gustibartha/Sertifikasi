import { getCertifications } from "@/app/actions/certification";
import { getEmployees } from "@/app/actions/employee";
import { CertificationClient } from "./certification-client";

export default async function CertificationsPage() {
  const [certResponse, empResponse] = await Promise.all([
    getCertifications("Organik"),
    getEmployees("Organik")
  ]);

  const certData = certResponse.success && certResponse.data ? certResponse.data : [];
  const empData = empResponse.success && empResponse.data ? empResponse.data : [];

  return (
    <CertificationClient 
      initialData={certData} 
      employees={empData}
      title="Sertifikasi Karyawan Organik"
      type="Organik"
    />
  );
}
