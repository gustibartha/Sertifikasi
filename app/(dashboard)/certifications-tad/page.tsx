import { getCertifications } from "@/app/actions/certification";
import { getEmployees } from "@/app/actions/employee";
import { CertificationClient } from "../certifications/certification-client";

export default async function CertificationsTadPage() {
  const [certResponse, empResponse] = await Promise.all([
    getCertifications("TAD"),
    getEmployees("TAD")
  ]);

  const certData = certResponse.success && certResponse.data ? certResponse.data : [];
  const empData = empResponse.success && empResponse.data ? empResponse.data : [];

  return (
    <CertificationClient 
      initialData={certData} 
      employees={empData}
      title="Sertifikasi Tenaga Alih Daya"
      type="TAD"
    />
  );
}
