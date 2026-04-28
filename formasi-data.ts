export interface FormasiRow {
  nomor: string;
  bidang: string;
  subBidang: string;
  jabatan: string;
  jenjangJabatan: string;
  positionGrade: string;
  formasiIdeal: number | null;
  bezetting: number | null;
  isHeader: boolean;
}

export const formasiData: FormasiRow[] = [
  // === BIDANG 1: Senior Manager Unit Pembangkitan Muara Karang ===
  { nomor: "1", bidang: "SM UP Muara Karang", subBidang: "-", jabatan: "Senior Manager  Unit Pembangkitan Muara Karang", jenjangJabatan: "Manajemen Menengah", positionGrade: "20", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "1.1", bidang: "SM UP Muara Karang", subBidang: "Kinerja", jabatan: "Specialist  Kinerja Operasi", jenjangJabatan: "Specialist", positionGrade: "15", formasiIdeal: 1, bezetting: 1, isHeader: false },
  { nomor: "1.2", bidang: "SM UP Muara Karang", subBidang: "Kinerja", jabatan: "Specialist  Kinerja Pemeliharaan", jenjangJabatan: "Specialist", positionGrade: "15", formasiIdeal: 1, bezetting: 1, isHeader: false },
  { nomor: "1.3", bidang: "SM UP Muara Karang", subBidang: "Kinerja", jabatan: "Specialist  Kinerja Enjiniring & Quality Assurance", jenjangJabatan: "Specialist", positionGrade: "15", formasiIdeal: 1, bezetting: 1, isHeader: false },
  // K3 & Keamanan
  { nomor: "1.4", bidang: "SM UP Muara Karang", subBidang: "K3 & Keamanan", jabatan: "Assistant Manager  K3 & Keamanan", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "1.4.1", bidang: "SM UP Muara Karang", subBidang: "K3 & Keamanan", jabatan: "Senior Officer  Kinerja K3 & Keamanan", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 0, bezetting: 1, isHeader: false },
  { nomor: "1.4.2", bidang: "SM UP Muara Karang", subBidang: "K3 & Keamanan", jabatan: "Officer / Junior Officer  K3", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10/11/12", formasiIdeal: 4, bezetting: 3, isHeader: false },
  { nomor: "1.4.3", bidang: "SM UP Muara Karang", subBidang: "K3 & Keamanan", jabatan: "Officer / Junior Officer  Keamanan", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10/11/12", formasiIdeal: 1, bezetting: 1, isHeader: false },
  // Lingkungan
  { nomor: "1.5", bidang: "SM UP Muara Karang", subBidang: "Lingkungan", jabatan: "Assistant Manager  Lingkungan", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "1.5.1", bidang: "SM UP Muara Karang", subBidang: "Lingkungan", jabatan: "Senior Officer  Kinerja Lingkungan", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 0, bezetting: 0, isHeader: false },
  { nomor: "1.5.2", bidang: "SM UP Muara Karang", subBidang: "Lingkungan", jabatan: "Officer / Junior Officer  Lingkungan", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10/11/12", formasiIdeal: 4, bezetting: 4, isHeader: false },

  // === BIDANG 2: Manager Operasi ===
  { nomor: "2", bidang: "Operasi", subBidang: "-", jabatan: "Manager  Operasi", jenjangJabatan: "Manajemen Dasar", positionGrade: "15", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "2.1", bidang: "Operasi", subBidang: "Kinerja", jabatan: "Senior Officer  Kinerja Perencanaan & Pengendalian Operasi", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 5, isHeader: false },
  { nomor: "2.2", bidang: "Operasi", subBidang: "Kinerja", jabatan: "Senior Officer  Kinerja Niaga & Bahan Bakar", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: false },
  { nomor: "2.3", bidang: "Operasi", subBidang: "Kinerja", jabatan: "Senior Officer  Kinerja Kimia & Lab", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: false },
  // Perencanaan & Pengendalian Operasi
  { nomor: "2.4", bidang: "Operasi", subBidang: "Rencana & Dal Op", jabatan: "Assistant Manager  Perencanaan & Pengendalian Operasi", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "2.4.1", bidang: "Operasi", subBidang: "Rencana & Dal Op", jabatan: "Officer / Junior Officer  Perencanaan & Pengendalian Operasi", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10/11/12", formasiIdeal: 8, bezetting: 4, isHeader: false },
  { nomor: "2.4.2", bidang: "Operasi", subBidang: "Rencana & Dal Op", jabatan: "Officer / Junior Officer  Permit to Work", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10/11/12", formasiIdeal: null, bezetting: 0, isHeader: false },
  // Produksi PLTU 4-5
  { nomor: "2.5", bidang: "Operasi", subBidang: "Prod PLTU 4-5", jabatan: "Assistant Manager  Produksi PLTU 4-5 (A,B,C,D)", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 4, bezetting: 4, isHeader: true },
  { nomor: "2.5.1", bidang: "Operasi", subBidang: "Prod PLTU 4-5", jabatan: "Senior Technician  Produksi PLTU 4-5 (A,B,C,D)", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 0, bezetting: 2, isHeader: false },
  { nomor: "2.5.2", bidang: "Operasi", subBidang: "Prod PLTU 4-5", jabatan: "Technician / Junior Technician  Produksi PLTU 4-5 (A,B,C,D)", jenjangJabatan: "Generalist 1-2", positionGrade: "8/9/10/11/12", formasiIdeal: 12, bezetting: 8, isHeader: false },
  // Produksi PLTGU Blok I
  { nomor: "2.6", bidang: "Operasi", subBidang: "Prod PLTGU Blok I", jabatan: "Assistant Manager  Produksi PLTGU Blok I (A,B,C,D)", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 4, bezetting: 4, isHeader: true },
  { nomor: "2.6.1", bidang: "Operasi", subBidang: "Prod PLTGU Blok I", jabatan: "Senior Technician  Produksi PLTGU Blok I (A,B,C,D)", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 0, bezetting: 1, isHeader: false },
  { nomor: "2.6.2", bidang: "Operasi", subBidang: "Prod PLTGU Blok I", jabatan: "Technician / Junior Technician  Produksi PLTGU Blok I (A,B,C,D)", jenjangJabatan: "Generalist 1-2", positionGrade: "8/9/10/11/12", formasiIdeal: 32, bezetting: 28, isHeader: false },
  // Produksi PLTGU Blok II
  { nomor: "2.7", bidang: "Operasi", subBidang: "Prod PLTGU Blok II", jabatan: "Assistant Manager  Produksi PLTGU Blok II (A,B,C,D)", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 4, bezetting: 4, isHeader: true },
  { nomor: "2.7.1", bidang: "Operasi", subBidang: "Prod PLTGU Blok II", jabatan: "Technician / Junior Technician  Produksi PLTGU Blok II (A,B,C,D)", jenjangJabatan: "Generalist 1-2", positionGrade: "8/9/10/11/12", formasiIdeal: 28, bezetting: 25, isHeader: false },
  // Produksi PLTGU Blok III
  { nomor: "2.8", bidang: "Operasi", subBidang: "Prod PLTGU Blok III", jabatan: "Assistant Manager  Produksi PLTGU Blok III (A,B,C,D)", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 4, bezetting: 4, isHeader: true },
  { nomor: "2.8.1", bidang: "Operasi", subBidang: "Prod PLTGU Blok III", jabatan: "Technician / Junior Technician  Produksi PLTGU Blok III (A,B,C,D)", jenjangJabatan: "Generalist 1-2", positionGrade: "8/9/10/11/12", formasiIdeal: 24, bezetting: 21, isHeader: false },
  // Kimia & Laboratorium
  { nomor: "2.9", bidang: "Operasi", subBidang: "Kimia & Lab", jabatan: "Assistant Manager  Kimia & Laboratorium", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "2.9.1", bidang: "Operasi", subBidang: "Kimia & Lab", jabatan: "Technician / Junior Technician  Kimia & Laboratorium", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10/11/12", formasiIdeal: 5, bezetting: 3, isHeader: false },
  // Niaga & Bahan Bakar
  { nomor: "2.10", bidang: "Operasi", subBidang: "Niaga & BB", jabatan: "Assistant Manager  Niaga & Bahan Bakar", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "2.10.1", bidang: "Operasi", subBidang: "Niaga & BB", jabatan: "Officer / Junior Officer  Niaga & Bahan Bakar", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10/11/12", formasiIdeal: 3, bezetting: 3, isHeader: false },

  // === BIDANG 3: Manager Pemeliharaan ===
  { nomor: "3", bidang: "Pemeliharaan", subBidang: "-", jabatan: "Manager  Pemeliharaan", jenjangJabatan: "Manajemen Dasar", positionGrade: "15", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "3.1", bidang: "Pemeliharaan", subBidang: "Kinerja", jabatan: "Senior Officer  Kinerja Pemeliharaan Mesin & Sipil", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 0, bezetting: 2, isHeader: false },
  { nomor: "3.2", bidang: "Pemeliharaan", subBidang: "Kinerja", jabatan: "Senior Officer  Kinerja Inventori Kontrol & Gudang", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 4, isHeader: false },
  { nomor: "3.3", bidang: "Pemeliharaan", subBidang: "Kinerja", jabatan: "Senior Officer  Kinerja Perencanaan & Pengendalian Pemeliharaan", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: false },
  { nomor: "3.4", bidang: "Pemeliharaan", subBidang: "Kinerja", jabatan: "Senior Officer  Kinerja Outage Management", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 0, isHeader: false },
  // Perencanaan & Pengendalian Pemeliharaan
  { nomor: "3.5", bidang: "Pemeliharaan", subBidang: "Rencana & Dal Har", jabatan: "Assistant Manager  Perencanaan & Pengendalian Pemeliharaan", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "3.5.1", bidang: "Pemeliharaan", subBidang: "Rencana & Dal Har", jabatan: "Officer / Junior Officer  Perencanaan & Pengendalian Pemeliharaan", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10/11/12", formasiIdeal: 8, bezetting: 8, isHeader: false },
  // Outage Management
  { nomor: "3.6", bidang: "Pemeliharaan", subBidang: "Outage Mgmt", jabatan: "Assistant Manager  Outage Management", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "3.6.1", bidang: "Pemeliharaan", subBidang: "Outage Mgmt", jabatan: "Officer / Junior Officer  Outage Management", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10/11/12", formasiIdeal: 4, bezetting: 4, isHeader: false },
  // Pemeliharaan Listrik PLTGU Blok I
  { nomor: "3.7", bidang: "Pemeliharaan", subBidang: "Har Listrik I", jabatan: "Assistant Manager  Pemeliharaan Listrik PLTGU Blok I", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "3.7.1", bidang: "Pemeliharaan", subBidang: "Har Listrik I", jabatan: "Technician / Junior Technician  Pemeliharaan Listrik PLTGU Blok I", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10/11/12", formasiIdeal: 5, bezetting: 4, isHeader: false },
  // Pemeliharaan Kontrol & Instrumen PLTGU Blok I
  { nomor: "3.8", bidang: "Pemeliharaan", subBidang: "Har Kontrol I", jabatan: "Assistant Manager  Pemeliharaan Kontrol & Instrumen PLTGU Blok I", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "3.8.1", bidang: "Pemeliharaan", subBidang: "Har Kontrol I", jabatan: "Technician / Junior Technician  Pemeliharaan Kontrol & Instrumen PLTGU Blok I", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10/11/12", formasiIdeal: 8, bezetting: 7, isHeader: false },
  // Pemeliharaan Mesin & Sipil PLTGU Blok I
  { nomor: "3.9", bidang: "Pemeliharaan", subBidang: "Har Mesin & Sipil I", jabatan: "Assistant Manager  Pemeliharaan Mesin & Sipil PLTGU Blok I", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "3.9.1", bidang: "Pemeliharaan", subBidang: "Har Mesin & Sipil I", jabatan: "Technician / Junior Technician  Pemeliharaan Mesin PLTGU Blok I", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10/11/12", formasiIdeal: 6, bezetting: 6, isHeader: false },
  { nomor: "3.9.2", bidang: "Pemeliharaan", subBidang: "Har Mesin & Sipil I", jabatan: "Technician / Junior Technician  Sipil PLTGU Blok I", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10/11/12", formasiIdeal: 1, bezetting: 1, isHeader: false },
  // Pemeliharaan Listrik PLTGU Blok II & PLTU
  { nomor: "3.10", bidang: "Pemeliharaan", subBidang: "Har Listrik II & PLTU", jabatan: "Assistant Manager  Pemeliharaan Listrik PLTGU Blok II & PLTU", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "3.10.1", bidang: "Pemeliharaan", subBidang: "Har Listrik II & PLTU", jabatan: "Technician / Junior Technician  Pemeliharaan Listrik PLTGU Blok II & PLTU", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10/11/12", formasiIdeal: 6, bezetting: 5, isHeader: false },
  // Pemeliharaan Kontrol & Instrumen PLTGU Blok II & PLTU
  { nomor: "3.11", bidang: "Pemeliharaan", subBidang: "Har Kontrol II & PLTU", jabatan: "Assistant Manager  Pemeliharaan Kontrol & Instrumen PLTGU Blok II & PLTU", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "3.11.1", bidang: "Pemeliharaan", subBidang: "Har Kontrol II & PLTU", jabatan: "Technician / Junior Technician  Pemeliharaan Kontrol & Instrumen PLTGU Blok II & PLTU", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10/11/12", formasiIdeal: 6, bezetting: 5, isHeader: false },
  // Pemeliharaan Mesin & Sipil PLTGU Blok II & PLTU
  { nomor: "3.12", bidang: "Pemeliharaan", subBidang: "Har Mesin & Sipil II & PLTU", jabatan: "Assistant Manager  Pemeliharaan Mesin & Sipil PLTGU Blok II & PLTU", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "3.12.1", bidang: "Pemeliharaan", subBidang: "Har Mesin & Sipil II & PLTU", jabatan: "Technician / Junior Technician  Pemeliharaan Mesin PLTGU Blok II & PLTU", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10/11/12", formasiIdeal: 4, bezetting: 4, isHeader: false },
  { nomor: "3.12.2", bidang: "Pemeliharaan", subBidang: "Har Mesin & Sipil II & PLTU", jabatan: "Technician / Junior Technician  Sipil PLTGU Blok II & PLTU", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10/11/12", formasiIdeal: 1, bezetting: 1, isHeader: false },
  // Pemeliharaan Listrik PLTGU Blok III
  { nomor: "3.13", bidang: "Pemeliharaan", subBidang: "Har Listrik III", jabatan: "Assistant Manager  Pemeliharaan Listrik PLTGU Blok III", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "3.13.1", bidang: "Pemeliharaan", subBidang: "Har Listrik III", jabatan: "Technician / Junior Technician  Pemeliharaan Listrik PLTGU Blok III", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10/11/12", formasiIdeal: 4, bezetting: 3, isHeader: false },
  // Pemeliharaan Kontrol & Instrumen PLTGU Blok III
  { nomor: "3.14", bidang: "Pemeliharaan", subBidang: "Har Kontrol III", jabatan: "Assistant Manager  Pemeliharaan Kontrol & Instrumen PLTGU Blok III", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "3.14.1", bidang: "Pemeliharaan", subBidang: "Har Kontrol III", jabatan: "Technician / Junior Technician  Pemeliharaan Kontrol & Instrumen PLTGU Blok III", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10/11/12", formasiIdeal: 4, bezetting: 4, isHeader: false },
  // Pemeliharaan Mesin & Sipil PLTGU Blok III
  { nomor: "3.15", bidang: "Pemeliharaan", subBidang: "Har Mesin & Sipil III", jabatan: "Assistant Manager  Pemeliharaan Mesin & Sipil PLTGU Blok III", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "3.15.1", bidang: "Pemeliharaan", subBidang: "Har Mesin & Sipil III", jabatan: "Technician / Junior Technician  Pemeliharaan Mesin PLTGU Blok III", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10/11/12", formasiIdeal: 3, bezetting: 3, isHeader: false },
  { nomor: "3.15.2", bidang: "Pemeliharaan", subBidang: "Har Mesin & Sipil III", jabatan: "Technician / Junior Technician  Sipil PLTGU Blok III", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10/11/12", formasiIdeal: 1, bezetting: 2, isHeader: false },
  // Inventori Kontrol dan Gudang
  { nomor: "3.16", bidang: "Pemeliharaan", subBidang: "Inventori & Gudang", jabatan: "Assistant Manager  Inventori Kontrol dan Gudang", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "3.16.1", bidang: "Pemeliharaan", subBidang: "Inventori & Gudang", jabatan: "Officer / Junior Officer  Inventori Kontrol & Kataloger", jenjangJabatan: "Generalist 1-2", positionGrade: "8/9/10/11/12", formasiIdeal: 3, bezetting: 3, isHeader: false },
  { nomor: "3.16.2", bidang: "Pemeliharaan", subBidang: "Inventori & Gudang", jabatan: "Officer / Junior Officer  Administrasi Gudang", jenjangJabatan: "Generalist 1-2", positionGrade: "8/9/10/11/12", formasiIdeal: 3, bezetting: 2, isHeader: false },

  // === BIDANG 4: Manager Enjiniring & Quality Assurance ===
  { nomor: "4", bidang: "Enjiniring & QA", subBidang: "-", jabatan: "Manager  Enjiniring & Quality Assurance", jenjangJabatan: "Manajemen Dasar", positionGrade: "15", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "4.1", bidang: "Enjiniring & QA", subBidang: "Kinerja", jabatan: "Senior Technician  Kinerja System Owner", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 4, isHeader: false },
  { nomor: "4.2", bidang: "Enjiniring & QA", subBidang: "Kinerja", jabatan: "Senior Officer  Kinerja Manajemen Mutu, Risiko & Kepatuhan", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: false },
  { nomor: "4.3", bidang: "Enjiniring & QA", subBidang: "Kinerja", jabatan: "Senior Technician  Kinerja Condition Based Maintenance", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 0, isHeader: false },
  // System Owner
  { nomor: "4.4", bidang: "Enjiniring & QA", subBidang: "System Owner", jabatan: "Assistant Manager  System Owner", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "4.4.1", bidang: "Enjiniring & QA", subBidang: "System Owner", jabatan: "Technician / Junior Technician  System Owner", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10/11/12", formasiIdeal: 6, bezetting: 3, isHeader: false },
  { nomor: "4.4.2", bidang: "Enjiniring & QA", subBidang: "System Owner", jabatan: "Technician / Junior Technician  Teknologi & Informasi", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10/11/12", formasiIdeal: 1, bezetting: 1, isHeader: false },
  // Condition Based Maintenance
  { nomor: "4.5", bidang: "Enjiniring & QA", subBidang: "CBM", jabatan: "Assistant Manager  Condition Based Maintenance", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "4.5.1", bidang: "Enjiniring & QA", subBidang: "CBM", jabatan: "Technician / Junior Technician  Condition Based Maintenance", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10/11/12", formasiIdeal: 4, bezetting: 3, isHeader: false },
  // Manajemen Mutu
  { nomor: "4.6", bidang: "Enjiniring & QA", subBidang: "Mutu & Risiko", jabatan: "Assistant Manager  Manajemen Mutu, Risiko & Kepatuhan", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "4.6.1", bidang: "Enjiniring & QA", subBidang: "Mutu & Risiko", jabatan: "Officer / Junior Officer  Manajemen Mutu, Risiko & Kepatuhan", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10/11/12", formasiIdeal: 3, bezetting: 3, isHeader: false },

  // === BIDANG 5: Manager Business Support ===
  { nomor: "5", bidang: "Business Support", subBidang: "-", jabatan: "Manager  Business Support", jenjangJabatan: "Manajemen Dasar", positionGrade: "15", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "5.1", bidang: "Business Support", subBidang: "Kinerja", jabatan: "Senior Officer  Kinerja SDM, Umum & CSR", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 0, bezetting: 3, isHeader: false },
  { nomor: "5.2", bidang: "Business Support", subBidang: "Kinerja", jabatan: "Senior Officer  Kinerja Pengadaan", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 0, bezetting: 1, isHeader: false },
  { nomor: "5.3", bidang: "Business Support", subBidang: "Kinerja", jabatan: "Senior Officer  Kinerja Keuangan", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 0, bezetting: 1, isHeader: false },
  // Pengadaan
  { nomor: "5.4", bidang: "Business Support", subBidang: "Pengadaan", jabatan: "Assistant Manager  Pengadaan", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "5.4.1", bidang: "Business Support", subBidang: "Pengadaan", jabatan: "Officer / Junior Officer  Pengadaan", jenjangJabatan: "Generalist 1-2", positionGrade: "8/9/10/11/12", formasiIdeal: 6, bezetting: 5, isHeader: false },
  // SDM, Umum & CSR
  { nomor: "5.5", bidang: "Business Support", subBidang: "SDM & Umum", jabatan: "Assistant Manager  SDM, Umum & CSR", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "5.5.1", bidang: "Business Support", subBidang: "SDM & Umum", jabatan: "Officer / Junior Officer  SDM", jenjangJabatan: "Generalist 1-2", positionGrade: "8/9/10/11/12", formasiIdeal: 2, bezetting: 2, isHeader: false },
  { nomor: "5.5.2", bidang: "Business Support", subBidang: "SDM & Umum", jabatan: "Officer / Junior Officer  Umum & CSR", jenjangJabatan: "Generalist 1-2", positionGrade: "8/9/10/11/12", formasiIdeal: 4, bezetting: 4, isHeader: false },
  // Keuangan
  { nomor: "5.6", bidang: "Business Support", subBidang: "Keuangan", jabatan: "Assistant Manager  Keuangan", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 0, isHeader: true },
  { nomor: "5.6.1", bidang: "Business Support", subBidang: "Keuangan", jabatan: "Officer / Junior Officer  Keuangan & Anggaran", jenjangJabatan: "Generalist 1-2", positionGrade: "8/9/10/11/12", formasiIdeal: 2, bezetting: 2, isHeader: false },
  { nomor: "5.6.2", bidang: "Business Support", subBidang: "Keuangan", jabatan: "Officer / Junior Officer  Akuntansi", jenjangJabatan: "Generalist 1-2", positionGrade: "8/9/10/11/12", formasiIdeal: 2, bezetting: 2, isHeader: false },
];
