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
  { nomor: "1", bidang: "SM UP Muara Karang", subBidang: "-", jabatan: "SENIOR MANAGER  UNIT PEMBANGKITAN", jenjangJabatan: "Manajemen Menengah", positionGrade: "20", formasiIdeal: 1, bezetting: 0, isHeader: true },
  { nomor: "1.1", bidang: "SM UP Muara Karang", subBidang: "Kinerja", jabatan: "SPECIALIST  KINERJA OPERASI", jenjangJabatan: "Specialist", positionGrade: "15", formasiIdeal: 1, bezetting: 0, isHeader: false },
  { nomor: "1.2", bidang: "SM UP Muara Karang", subBidang: "Kinerja", jabatan: "SPECIALIST  KINERJA PEMELIHARAAN", jenjangJabatan: "Specialist", positionGrade: "15", formasiIdeal: 1, bezetting: 0, isHeader: false },
  { nomor: "1.3", bidang: "SM UP Muara Karang", subBidang: "Kinerja", jabatan: "SPECIALIST  KINERJA ENJINIRING & QA", jenjangJabatan: "Specialist", positionGrade: "15", formasiIdeal: 1, bezetting: 0, isHeader: false },
  // K3 & Keamanan
  { nomor: "1.4", bidang: "SM UP Muara Karang", subBidang: "K3 & Keamanan", jabatan: "ASSISTANT MANAGER  K3 & KEAMANAN", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 0, isHeader: true },
  { nomor: "1.4.1", bidang: "SM UP Muara Karang", subBidang: "K3 & Keamanan", jabatan: "SENIOR OFFICER  K3 & KEAMANAN", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 0, bezetting: 0, isHeader: false },
  { nomor: "1.4.2", bidang: "SM UP Muara Karang", subBidang: "K3 & Keamanan", jabatan: "OFFICER  K3", jenjangJabatan: "Generalist 1-2", positionGrade: "11/12", formasiIdeal: 4, bezetting: 0, isHeader: false },
  { nomor: "1.4.3", bidang: "SM UP Muara Karang", subBidang: "K3 & Keamanan", jabatan: "JUNIOR OFFICER  K3", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10", formasiIdeal: null, bezetting: 0, isHeader: false },
  { nomor: "1.4.4", bidang: "SM UP Muara Karang", subBidang: "K3 & Keamanan", jabatan: "OFFICER  KEAMANAN", jenjangJabatan: "Generalist 1-2", positionGrade: "11/12", formasiIdeal: 1, bezetting: 0, isHeader: false },
  { nomor: "1.4.5", bidang: "SM UP Muara Karang", subBidang: "K3 & Keamanan", jabatan: "JUNIOR OFFICER  KEAMANAN", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10", formasiIdeal: null, bezetting: 0, isHeader: false },
  // Lingkungan
  { nomor: "1.5", bidang: "SM UP Muara Karang", subBidang: "Lingkungan", jabatan: "ASSISTANT MANAGER  LINGKUNGAN", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 0, isHeader: true },
  { nomor: "1.5.1", bidang: "SM UP Muara Karang", subBidang: "Lingkungan", jabatan: "SENIOR OFFICER  LINGKUNGAN", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 0, bezetting: 0, isHeader: false },
  { nomor: "1.5.2", bidang: "SM UP Muara Karang", subBidang: "Lingkungan", jabatan: "OFFICER  LINGKUNGAN", jenjangJabatan: "Generalist 1-2", positionGrade: "11/12", formasiIdeal: 4, bezetting: 0, isHeader: false },
  { nomor: "1.5.3", bidang: "SM UP Muara Karang", subBidang: "Lingkungan", jabatan: "JUNIOR OFFICER  LINGKUNGAN", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10", formasiIdeal: null, bezetting: 0, isHeader: false },

  // === BIDANG 2: Manager Operasi ===
  { nomor: "2", bidang: "Operasi", subBidang: "-", jabatan: "MANAGER  OPERASI", jenjangJabatan: "Manajemen Dasar", positionGrade: "15", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "2.1", bidang: "Operasi", subBidang: "Kinerja", jabatan: "SENIOR OFFICER  KINERJA PERENCANAAN & PENGENDALIAN OPERASI", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 5, isHeader: false },
  { nomor: "2.2", bidang: "Operasi", subBidang: "Kinerja", jabatan: "SENIOR OFFICER  KINERJA NIAGA & BAHAN BAKAR", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: false },
  { nomor: "2.3", bidang: "Operasi", subBidang: "Kinerja", jabatan: "SENIOR OFFICER  KINERJA KIMIA & LAB", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: false },
  // Perencanaan & Pengendalian Operasi
  { nomor: "2.4", bidang: "Operasi", subBidang: "Rencana & Dal Op", jabatan: "ASSISTANT MANAGER  PERENCANAAN & PENGENDALIAN OPERASI", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "2.4.1", bidang: "Operasi", subBidang: "Rencana & Dal Op", jabatan: "OFFICER  PERENCANAAN & PENGENDALIAN OPERASI", jenjangJabatan: "Generalist 1-2", positionGrade: "11/12", formasiIdeal: 8, bezetting: 4, isHeader: false },
  { nomor: "2.4.2", bidang: "Operasi", subBidang: "Rencana & Dal Op", jabatan: "JUNIOR OFFICER  PERENCANAAN & PENGENDALIAN OPERASI", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10", formasiIdeal: null, bezetting: 0, isHeader: false },
  { nomor: "2.4.3", bidang: "Operasi", subBidang: "Rencana & Dal Op", jabatan: "OFFICER  PERMIT TO WORK", jenjangJabatan: "Generalist 1-2", positionGrade: "11/12", formasiIdeal: 1, bezetting: 0, isHeader: false },
  { nomor: "2.4.4", bidang: "Operasi", subBidang: "Rencana & Dal Op", jabatan: "JUNIOR OFFICER  PERMIT TO WORK", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10", formasiIdeal: null, bezetting: 0, isHeader: false },
  // Produksi PLTU 4-5
  { nomor: "2.5", bidang: "Operasi", subBidang: "Prod PLTU 4-5", jabatan: "ASSISTANT MANAGER  PRODUKSI PLTU 4-5 (A,B,C,D)", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 4, bezetting: 4, isHeader: true },
  { nomor: "2.5.1", bidang: "Operasi", subBidang: "Prod PLTU 4-5", jabatan: "SENIOR TECHNICIAN  PRODUKSI PLTU 4-5 (A,B,C,D)", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 0, bezetting: 2, isHeader: false },
  { nomor: "2.5.2", bidang: "Operasi", subBidang: "Prod PLTU 4-5", jabatan: "TECHNICIAN  PRODUKSI PLTU 4-5 (A,B,C,D)", jenjangJabatan: "Generalist 1-2", positionGrade: "11/12", formasiIdeal: 12, bezetting: 8, isHeader: false },
  { nomor: "2.5.3", bidang: "Operasi", subBidang: "Prod PLTU 4-5", jabatan: "JUNIOR TECHNICIAN  PRODUKSI PLTU 4-5 (A,B,C,D)", jenjangJabatan: "Generalist 1-2", positionGrade: "8/9/10", formasiIdeal: null, bezetting: 0, isHeader: false },
  // Produksi PLTGU Blok I
  { nomor: "2.6", bidang: "Operasi", subBidang: "Prod PLTGU Blok I", jabatan: "ASSISTANT MANAGER  PRODUKSI PLTGU BLOK I (A,B,C,D)", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 4, bezetting: 4, isHeader: true },
  { nomor: "2.6.1", bidang: "Operasi", subBidang: "Prod PLTGU Blok I", jabatan: "SENIOR TECHNICIAN  PRODUKSI PLTGU BLOK I (A,B,C,D)", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 0, bezetting: 1, isHeader: false },
  { nomor: "2.6.2", bidang: "Operasi", subBidang: "Prod PLTGU Blok I", jabatan: "TECHNICIAN  PRODUKSI PLTGU BLOK I (A,B,C,D)", jenjangJabatan: "Generalist 1-2", positionGrade: "11/12", formasiIdeal: 32, bezetting: 28, isHeader: false },
  { nomor: "2.6.3", bidang: "Operasi", subBidang: "Prod PLTGU Blok I", jabatan: "JUNIOR TECHNICIAN  PRODUKSI PLTGU BLOK I (A,B,C,D)", jenjangJabatan: "Generalist 1-2", positionGrade: "8/9/10", formasiIdeal: null, bezetting: 0, isHeader: false },
  // Produksi PLTGU Blok II
  { nomor: "2.7", bidang: "Operasi", subBidang: "Prod PLTGU Blok II", jabatan: "ASSISTANT MANAGER  PRODUKSI PLTGU BLOK II (A,B,C,D)", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 4, bezetting: 4, isHeader: true },
  { nomor: "2.7.1", bidang: "Operasi", subBidang: "Prod PLTGU Blok II", jabatan: "TECHNICIAN  PRODUKSI PLTGU BLOK II (A,B,C,D)", jenjangJabatan: "Generalist 1-2", positionGrade: "11/12", formasiIdeal: 28, bezetting: 25, isHeader: false },
  { nomor: "2.7.2", bidang: "Operasi", subBidang: "Prod PLTGU Blok II", jabatan: "JUNIOR TECHNICIAN  PRODUKSI PLTGU BLOK II (A,B,C,D)", jenjangJabatan: "Generalist 1-2", positionGrade: "8/9/10", formasiIdeal: null, bezetting: 0, isHeader: false },
  // Produksi PLTGU Blok III
  { nomor: "2.8", bidang: "Operasi", subBidang: "Prod PLTGU Blok III", jabatan: "ASSISTANT MANAGER  PRODUKSI PLTGU BLOK III (A,B,C,D)", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 4, bezetting: 4, isHeader: true },
  { nomor: "2.8.1", bidang: "Operasi", subBidang: "Prod PLTGU Blok III", jabatan: "TECHNICIAN  PRODUKSI PLTGU BLOK III (A,B,C,D)", jenjangJabatan: "Generalist 1-2", positionGrade: "11/12", formasiIdeal: 24, bezetting: 21, isHeader: false },
  { nomor: "2.8.2", bidang: "Operasi", subBidang: "Prod PLTGU Blok III", jabatan: "JUNIOR TECHNICIAN  PRODUKSI PLTGU BLOK III (A,B,C,D)", jenjangJabatan: "Generalist 1-2", positionGrade: "8/9/10", formasiIdeal: null, bezetting: 0, isHeader: false },
  // Kimia & Laboratorium
  { nomor: "2.9", bidang: "Operasi", subBidang: "Kimia & Lab", jabatan: "ASSISTANT MANAGER  KIMIA & LABORATORIUM", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "2.9.1", bidang: "Operasi", subBidang: "Kimia & Lab", jabatan: "TECHNICIAN  KIMIA & LABORATORIUM", jenjangJabatan: "Generalist 1-2", positionGrade: "11/12", formasiIdeal: 5, bezetting: 3, isHeader: false },
  { nomor: "2.9.2", bidang: "Operasi", subBidang: "Kimia & Lab", jabatan: "JUNIOR TECHNICIAN  KIMIA & LABORATORIUM", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10", formasiIdeal: null, bezetting: 0, isHeader: false },
  // Niaga & Bahan Bakar
  { nomor: "2.10", bidang: "Operasi", subBidang: "Niaga & BB", jabatan: "ASSISTANT MANAGER  NIAGA & BAHAN BAKAR", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "2.10.1", bidang: "Operasi", subBidang: "Niaga & BB", jabatan: "OFFICER  NIAGA & BAHAN BAKAR", jenjangJabatan: "Generalist 1-2", positionGrade: "11/12", formasiIdeal: 3, bezetting: 3, isHeader: false },
  { nomor: "2.10.2", bidang: "Operasi", subBidang: "Niaga & BB", jabatan: "JUNIOR OFFICER  NIAGA & BAHAN BAKAR", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10", formasiIdeal: null, bezetting: 0, isHeader: false },

  // === BIDANG 3: Manager Pemeliharaan ===
  { nomor: "3", bidang: "Pemeliharaan", subBidang: "-", jabatan: "MANAGER  PEMELIHARAAN", jenjangJabatan: "Manajemen Dasar", positionGrade: "15", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "3.1", bidang: "Pemeliharaan", subBidang: "Kinerja", jabatan: "SENIOR OFFICER  KINERJA PEMELIHARAAN MESIN & SIPIL", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 0, bezetting: 2, isHeader: false },
  { nomor: "3.2", bidang: "Pemeliharaan", subBidang: "Kinerja", jabatan: "SENIOR OFFICER  KINERJA INVENTORI KONTROL & GUDANG", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 4, isHeader: false },
  { nomor: "3.3", bidang: "Pemeliharaan", subBidang: "Kinerja", jabatan: "SENIOR OFFICER  KINERJA PERENCANAAN & PENGENDALIAN PEMELIHARAAN", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: false },
  { nomor: "3.4", bidang: "Pemeliharaan", subBidang: "Kinerja", jabatan: "SENIOR OFFICER  KINERJA OUTAGE MANAGEMENT", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 0, isHeader: false },
  // Perencanaan & Pengendalian Pemeliharaan
  { nomor: "3.5", bidang: "Pemeliharaan", subBidang: "Rencana & Dal Har", jabatan: "ASSISTANT MANAGER  PERENCANAAN & PENGENDALIAN PEMELIHARAAN", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "3.5.1", bidang: "Pemeliharaan", subBidang: "Rencana & Dal Har", jabatan: "OFFICER  PERENCANAAN & PENGENDALIAN PEMELIHARAAN", jenjangJabatan: "Generalist 1-2", positionGrade: "11/12", formasiIdeal: 8, bezetting: 8, isHeader: false },
  { nomor: "3.5.2", bidang: "Pemeliharaan", subBidang: "Rencana & Dal Har", jabatan: "JUNIOR OFFICER  PERENCANAAN & PENGENDALIAN PEMELIHARAAN", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10", formasiIdeal: null, bezetting: 0, isHeader: false },
  // Outage Management
  { nomor: "3.6", bidang: "Pemeliharaan", subBidang: "Outage Mgmt", jabatan: "ASSISTANT MANAGER  OUTAGE MANAGEMENT", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "3.6.1", bidang: "Pemeliharaan", subBidang: "Outage Mgmt", jabatan: "OFFICER  OUTAGE MANAGEMENT", jenjangJabatan: "Generalist 1-2", positionGrade: "11/12", formasiIdeal: 4, bezetting: 4, isHeader: false },
  { nomor: "3.6.2", bidang: "Pemeliharaan", subBidang: "Outage Mgmt", jabatan: "JUNIOR OFFICER  OUTAGE MANAGEMENT", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10", formasiIdeal: null, bezetting: 0, isHeader: false },
  // Pemeliharaan Listrik PLTGU Blok I
  { nomor: "3.7", bidang: "Pemeliharaan", subBidang: "Har Listrik I", jabatan: "ASSISTANT MANAGER  PEMELIHARAAN LISTRIK PLTGU BLOK I", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "3.7.1", bidang: "Pemeliharaan", subBidang: "Har Listrik I", jabatan: "TECHNICIAN  PEMELIHARAAN LISTRIK PLTGU BLOK I", jenjangJabatan: "Generalist 1-2", positionGrade: "11/12", formasiIdeal: 5, bezetting: 4, isHeader: false },
  { nomor: "3.7.2", bidang: "Pemeliharaan", subBidang: "Har Listrik I", jabatan: "JUNIOR TECHNICIAN  PEMELIHARAAN LISTRIK PLTGU BLOK I", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10", formasiIdeal: null, bezetting: 0, isHeader: false },
  // Har Kontrol & Instrumen PLTGU Blok I
  { nomor: "3.8", bidang: "Pemeliharaan", subBidang: "Har Kontrol I", jabatan: "ASSISTANT MANAGER  PEMELIHARAAN KONTROL & INSTRUMEN PLTGU BLOK I", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "3.8.1", bidang: "Pemeliharaan", subBidang: "Har Kontrol I", jabatan: "TECHNICIAN  PEMELIHARAAN KONTROL & INSTRUMEN PLTGU BLOK I", jenjangJabatan: "Generalist 1-2", positionGrade: "11/12", formasiIdeal: 8, bezetting: 7, isHeader: false },
  { nomor: "3.8.2", bidang: "Pemeliharaan", subBidang: "Har Kontrol I", jabatan: "JUNIOR TECHNICIAN  PEMELIHARAAN KONTROL & INSTRUMEN PLTGU BLOK I", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10", formasiIdeal: null, bezetting: 0, isHeader: false },
  // Har Mesin & Sipil PLTGU Blok I
  { nomor: "3.9", bidang: "Pemeliharaan", subBidang: "Har Mesin & Sipil I", jabatan: "ASSISTANT MANAGER  PEMELIHARAAN MESIN & SIPIL PLTGU BLOK I", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "3.9.1", bidang: "Pemeliharaan", subBidang: "Har Mesin & Sipil I", jabatan: "TECHNICIAN  PEMELIHARAAN MESIN PLTGU BLOK I", jenjangJabatan: "Generalist 1-2", positionGrade: "11/12", formasiIdeal: 6, bezetting: 6, isHeader: false },
  { nomor: "3.9.2", bidang: "Pemeliharaan", subBidang: "Har Mesin & Sipil I", jabatan: "JUNIOR TECHNICIAN  PEMELIHARAAN MESIN PLTGU BLOK I", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10", formasiIdeal: null, bezetting: 0, isHeader: false },
  { nomor: "3.9.3", bidang: "Pemeliharaan", subBidang: "Har Mesin & Sipil I", jabatan: "TECHNICIAN  SIPIL PLTGU BLOK I", jenjangJabatan: "Generalist 1-2", positionGrade: "11/12", formasiIdeal: 1, bezetting: 1, isHeader: false },
  { nomor: "3.9.4", bidang: "Pemeliharaan", subBidang: "Har Mesin & Sipil I", jabatan: "JUNIOR TECHNICIAN  SIPIL PLTGU BLOK I", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10", formasiIdeal: null, bezetting: 0, isHeader: false },
  // Har Listrik PLTGU Blok II & PLTU
  { nomor: "3.10", bidang: "Pemeliharaan", subBidang: "Har Listrik II & PLTU", jabatan: "ASSISTANT MANAGER  PEMELIHARAAN LISTRIK PLTGU BLOK II & PLTU", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "3.10.1", bidang: "Pemeliharaan", subBidang: "Har Listrik II & PLTU", jabatan: "TECHNICIAN  PEMELIHARAAN LISTRIK PLTGU BLOK II & PLTU", jenjangJabatan: "Generalist 1-2", positionGrade: "11/12", formasiIdeal: 6, bezetting: 5, isHeader: false },
  { nomor: "3.10.2", bidang: "Pemeliharaan", subBidang: "Har Listrik II & PLTU", jabatan: "JUNIOR TECHNICIAN  PEMELIHARAAN LISTRIK PLTGU BLOK II & PLTU", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10", formasiIdeal: null, bezetting: 0, isHeader: false },
  // Har Kontrol & Instrumen PLTGU Blok II & PLTU
  { nomor: "3.11", bidang: "Pemeliharaan", subBidang: "Har Kontrol II & PLTU", jabatan: "ASSISTANT MANAGER  PEMELIHARAAN KONTROL & INSTRUMEN PLTGU BLOK II & PLTU", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "3.11.1", bidang: "Pemeliharaan", subBidang: "Har Kontrol II & PLTU", jabatan: "TECHNICIAN  PEMELIHARAAN KONTROL & INSTRUMEN PLTGU BLOK II & PLTU", jenjangJabatan: "Generalist 1-2", positionGrade: "11/12", formasiIdeal: 6, bezetting: 5, isHeader: false },
  { nomor: "3.11.2", bidang: "Pemeliharaan", subBidang: "Har Kontrol II & PLTU", jabatan: "JUNIOR TECHNICIAN  PEMELIHARAAN KONTROL & INSTRUMEN PLTGU BLOK II & PLTU", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10", formasiIdeal: null, bezetting: 0, isHeader: false },
  // Har Mesin & Sipil PLTGU Blok II & PLTU
  { nomor: "3.12", bidang: "Pemeliharaan", subBidang: "Har Mesin & Sipil II & PLTU", jabatan: "ASSISTANT MANAGER  PEMELIHARAAN MESIN & SIPIL PLTGU BLOK II & PLTU", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "3.12.1", bidang: "Pemeliharaan", subBidang: "Har Mesin & Sipil II & PLTU", jabatan: "TECHNICIAN  PEMELIHARAAN MESIN PLTGU BLOK II & PLTU", jenjangJabatan: "Generalist 1-2", positionGrade: "11/12", formasiIdeal: 4, bezetting: 4, isHeader: false },
  { nomor: "3.12.2", bidang: "Pemeliharaan", subBidang: "Har Mesin & Sipil II & PLTU", jabatan: "JUNIOR TECHNICIAN  PEMELIHARAAN MESIN PLTGU BLOK II & PLTU", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10", formasiIdeal: null, bezetting: 0, isHeader: false },
  { nomor: "3.12.3", bidang: "Pemeliharaan", subBidang: "Har Mesin & Sipil II & PLTU", jabatan: "TECHNICIAN  SIPIL PLTGU BLOK II & PLTU", jenjangJabatan: "Generalist 1-2", positionGrade: "11/12", formasiIdeal: 1, bezetting: 1, isHeader: false },
  { nomor: "3.12.4", bidang: "Pemeliharaan", subBidang: "Har Mesin & Sipil II & PLTU", jabatan: "JUNIOR TECHNICIAN  SIPIL PLTGU BLOK II & PLTU", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10", formasiIdeal: null, bezetting: 0, isHeader: false },
  // Har Listrik PLTGU Blok III
  { nomor: "3.13", bidang: "Pemeliharaan", subBidang: "Har Listrik III", jabatan: "ASSISTANT MANAGER  PEMELIHARAAN LISTRIK PLTGU BLOK III", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "3.13.1", bidang: "Pemeliharaan", subBidang: "Har Listrik III", jabatan: "TECHNICIAN  PEMELIHARAAN LISTRIK PLTGU BLOK III", jenjangJabatan: "Generalist 1-2", positionGrade: "11/12", formasiIdeal: 4, bezetting: 3, isHeader: false },
  { nomor: "3.13.2", bidang: "Pemeliharaan", subBidang: "Har Listrik III", jabatan: "JUNIOR TECHNICIAN  PEMELIHARAAN LISTRIK PLTGU BLOK III", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10", formasiIdeal: null, bezetting: 0, isHeader: false },
  // Har Kontrol & Instrumen PLTGU Blok III
  { nomor: "3.14", bidang: "Pemeliharaan", subBidang: "Har Kontrol III", jabatan: "ASSISTANT MANAGER  PEMELIHARAAN KONTROL & INSTRUMEN PLTGU BLOK III", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "3.14.1", bidang: "Pemeliharaan", subBidang: "Har Kontrol III", jabatan: "TECHNICIAN  PEMELIHARAAN KONTROL & INSTRUMEN PLTGU BLOK III", jenjangJabatan: "Generalist 1-2", positionGrade: "11/12", formasiIdeal: 4, bezetting: 4, isHeader: false },
  { nomor: "3.14.2", bidang: "Pemeliharaan", subBidang: "Har Kontrol III", jabatan: "JUNIOR TECHNICIAN  PEMELIHARAAN KONTROL & INSTRUMEN PLTGU BLOK III", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10", formasiIdeal: null, bezetting: 0, isHeader: false },
  // Har Mesin & Sipil PLTGU Blok III
  { nomor: "3.15", bidang: "Pemeliharaan", subBidang: "Har Mesin & Sipil III", jabatan: "ASSISTANT MANAGER  PEMELIHARAAN MESIN & SIPIL PLTGU BLOK III", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "3.15.1", bidang: "Pemeliharaan", subBidang: "Har Mesin & Sipil III", jabatan: "TECHNICIAN  PEMELIHARAAN MESIN PLTGU BLOK III", jenjangJabatan: "Generalist 1-2", positionGrade: "11/12", formasiIdeal: 3, bezetting: 3, isHeader: false },
  { nomor: "3.15.2", bidang: "Pemeliharaan", subBidang: "Har Mesin & Sipil III", jabatan: "JUNIOR TECHNICIAN  PEMELIHARAAN MESIN PLTGU BLOK III", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10", formasiIdeal: null, bezetting: 0, isHeader: false },
  { nomor: "3.15.3", bidang: "Pemeliharaan", subBidang: "Har Mesin & Sipil III", jabatan: "TECHNICIAN  SIPIL PLTGU BLOK III", jenjangJabatan: "Generalist 1-2", positionGrade: "11/12", formasiIdeal: 1, bezetting: 2, isHeader: false },
  { nomor: "3.15.4", bidang: "Pemeliharaan", subBidang: "Har Mesin & Sipil III", jabatan: "JUNIOR TECHNICIAN  SIPIL PLTGU BLOK III", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10", formasiIdeal: null, bezetting: 0, isHeader: false },
  // Inventori Kontrol dan Gudang
  { nomor: "3.16", bidang: "Pemeliharaan", subBidang: "Inventori & Gudang", jabatan: "ASSISTANT MANAGER  INVENTORI KONTROL DAN GUDANG", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "3.16.1", bidang: "Pemeliharaan", subBidang: "Inventori & Gudang", jabatan: "OFFICER  INVENTORI KONTROL & KATALOGER", jenjangJabatan: "Generalist 1-2", positionGrade: "11/12", formasiIdeal: 3, bezetting: 3, isHeader: false },
  { nomor: "3.16.2", bidang: "Pemeliharaan", subBidang: "Inventori & Gudang", jabatan: "JUNIOR OFFICER  INVENTORI KONTROL & KATALOGER", jenjangJabatan: "Generalist 1-2", positionGrade: "8/9/10", formasiIdeal: null, bezetting: 0, isHeader: false },
  { nomor: "3.16.3", bidang: "Pemeliharaan", subBidang: "Inventori & Gudang", jabatan: "OFFICER  ADMINISTRASI GUDANG", jenjangJabatan: "Generalist 1-2", positionGrade: "11/12", formasiIdeal: 3, bezetting: 2, isHeader: false },
  { nomor: "3.16.4", bidang: "Pemeliharaan", subBidang: "Inventori & Gudang", jabatan: "JUNIOR OFFICER  ADMINISTRASI GUDANG", jenjangJabatan: "Generalist 1-2", positionGrade: "8/9/10", formasiIdeal: null, bezetting: 0, isHeader: false },

  // === BIDANG 4: Manager Enjiniring & Quality Assurance ===
  { nomor: "4", bidang: "Enjiniring & QA", subBidang: "-", jabatan: "MANAGER  ENJINIRING & QUALITY ASSURANCE", jenjangJabatan: "Manajemen Dasar", positionGrade: "15", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "4.1", bidang: "Enjiniring & QA", subBidang: "Kinerja", jabatan: "SENIOR TECHNICIAN  KINERJA SYSTEM OWNER", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 4, isHeader: false },
  { nomor: "4.2", bidang: "Enjiniring & QA", subBidang: "Kinerja", jabatan: "SENIOR OFFICER  KINERJA MANAJEMEN MUTU, RISIKO & KEPATUHAN", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: false },
  { nomor: "4.3", bidang: "Enjiniring & QA", subBidang: "Kinerja", jabatan: "SENIOR TECHNICIAN  KINERJA CONDITION BASED MAINTENANCE", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 0, isHeader: false },
  // System Owner
  { nomor: "4.4", bidang: "Enjiniring & QA", subBidang: "System Owner", jabatan: "ASSISTANT MANAGER  SYSTEM OWNER", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "4.4.1", bidang: "Enjiniring & QA", subBidang: "System Owner", jabatan: "TECHNICIAN  SYSTEM OWNER", jenjangJabatan: "Generalist 1-2", positionGrade: "11/12", formasiIdeal: 6, bezetting: 3, isHeader: false },
  { nomor: "4.4.2", bidang: "Enjiniring & QA", subBidang: "System Owner", jabatan: "JUNIOR TECHNICIAN  SYSTEM OWNER", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10", formasiIdeal: null, bezetting: 0, isHeader: false },
  { nomor: "4.4.3", bidang: "Enjiniring & QA", subBidang: "System Owner", jabatan: "TECHNICIAN  TEKNOLOGI & INFORMASI", jenjangJabatan: "Generalist 1-2", positionGrade: "11/12", formasiIdeal: 1, bezetting: 1, isHeader: false },
  { nomor: "4.4.4", bidang: "Enjiniring & QA", subBidang: "System Owner", jabatan: "JUNIOR TECHNICIAN  TEKNOLOGI & INFORMASI", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10", formasiIdeal: null, bezetting: 0, isHeader: false },
  // Condition Based Maintenance
  { nomor: "4.5", bidang: "Enjiniring & QA", subBidang: "CBM", jabatan: "ASSISTANT MANAGER  CONDITION BASED MAINTENANCE", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "4.5.1", bidang: "Enjiniring & QA", subBidang: "CBM", jabatan: "TECHNICIAN  CONDITION BASED MAINTENANCE", jenjangJabatan: "Generalist 1-2", positionGrade: "11/12", formasiIdeal: 4, bezetting: 3, isHeader: false },
  { nomor: "4.5.2", bidang: "Enjiniring & QA", subBidang: "CBM", jabatan: "JUNIOR TECHNICIAN  CONDITION BASED MAINTENANCE", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10", formasiIdeal: null, bezetting: 0, isHeader: false },
  // Manajemen Mutu
  { nomor: "4.6", bidang: "Enjiniring & QA", subBidang: "Mutu & Risiko", jabatan: "ASSISTANT MANAGER  MANAJEMEN MUTU, RISIKO & KEPATUHAN", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "4.6.1", bidang: "Enjiniring & QA", subBidang: "Mutu & Risiko", jabatan: "OFFICER  MANAJEMEN MUTU, RISIKO & KEPATUHAN", jenjangJabatan: "Generalist 1-2", positionGrade: "11/12", formasiIdeal: 3, bezetting: 3, isHeader: false },
  { nomor: "4.6.2", bidang: "Enjiniring & QA", subBidang: "Mutu & Risiko", jabatan: "JUNIOR OFFICER  MANAJEMEN MUTU, RISIKO & KEPATUHAN", jenjangJabatan: "Generalist 1-2", positionGrade: "9/10", formasiIdeal: null, bezetting: 0, isHeader: false },

  // === BIDANG 5: Manager Business Support ===
  { nomor: "5", bidang: "Business Support", subBidang: "-", jabatan: "MANAGER  BUSINESS SUPPORT", jenjangJabatan: "Manajemen Dasar", positionGrade: "15", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "5.1", bidang: "Business Support", subBidang: "Kinerja", jabatan: "SENIOR OFFICER  KINERJA SDM, UMUM, HUMAS & CSR", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 0, bezetting: 3, isHeader: false },
  { nomor: "5.2", bidang: "Business Support", subBidang: "Kinerja", jabatan: "SENIOR OFFICER  KINERJA PENGADAAN", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 0, bezetting: 1, isHeader: false },
  { nomor: "5.3", bidang: "Business Support", subBidang: "Kinerja", jabatan: "SENIOR OFFICER  KINERJA KEUANGAN", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 0, bezetting: 1, isHeader: false },
  // Pengadaan
  { nomor: "5.4", bidang: "Business Support", subBidang: "Pengadaan", jabatan: "ASSISTANT MANAGER  PENGADAAN", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "5.4.1", bidang: "Business Support", subBidang: "Pengadaan", jabatan: "OFFICER  PENGADAAN", jenjangJabatan: "Generalist 1-2", positionGrade: "11/12", formasiIdeal: 6, bezetting: 5, isHeader: false },
  { nomor: "5.4.2", bidang: "Business Support", subBidang: "Pengadaan", jabatan: "JUNIOR OFFICER  PENGADAAN", jenjangJabatan: "Generalist 1-2", positionGrade: "8/9/10", formasiIdeal: null, bezetting: 0, isHeader: false },
  // SDM, Umum & CSR
  { nomor: "5.5", bidang: "Business Support", subBidang: "SDM & Umum", jabatan: "ASSISTANT MANAGER  SDM, UMUM, HUMAS & CSR", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 1, isHeader: true },
  { nomor: "5.5.1", bidang: "Business Support", subBidang: "SDM & Umum", jabatan: "OFFICER  SDM", jenjangJabatan: "Generalist 1-2", positionGrade: "11/12", formasiIdeal: 2, bezetting: 2, isHeader: false },
  { nomor: "5.5.2", bidang: "Business Support", subBidang: "SDM & Umum", jabatan: "JUNIOR OFFICER  SDM", jenjangJabatan: "Generalist 1-2", positionGrade: "8/9/10", formasiIdeal: null, bezetting: 0, isHeader: false },
  { nomor: "5.5.3", bidang: "Business Support", subBidang: "SDM & Umum", jabatan: "OFFICER  UMUM", jenjangJabatan: "Generalist 1-2", positionGrade: "11/12", formasiIdeal: 3, bezetting: 3, isHeader: false },
  { nomor: "5.5.4", bidang: "Business Support", subBidang: "SDM & Umum", jabatan: "JUNIOR OFFICER  UMUM", jenjangJabatan: "Generalist 1-2", positionGrade: "8/9/10", formasiIdeal: null, bezetting: 0, isHeader: false },
  { nomor: "5.5.5", bidang: "Business Support", subBidang: "SDM & Umum", jabatan: "OFFICER  HUMAS & CSR", jenjangJabatan: "Generalist 1-2", positionGrade: "11/12", formasiIdeal: 1, bezetting: 1, isHeader: false },
  { nomor: "5.5.6", bidang: "Business Support", subBidang: "SDM & Umum", jabatan: "JUNIOR OFFICER  HUMAS & CSR", jenjangJabatan: "Generalist 1-2", positionGrade: "8/9/10", formasiIdeal: null, bezetting: 0, isHeader: false },
  // Keuangan
  { nomor: "5.6", bidang: "Business Support", subBidang: "Keuangan", jabatan: "ASSISTANT MANAGER  KEUANGAN", jenjangJabatan: "Generalist 3", positionGrade: "13", formasiIdeal: 1, bezetting: 0, isHeader: true },
  { nomor: "5.6.1", bidang: "Business Support", subBidang: "Keuangan", jabatan: "OFFICER  KEUANGAN & ANGGARAN", jenjangJabatan: "Generalist 1-2", positionGrade: "11/12", formasiIdeal: 2, bezetting: 2, isHeader: false },
  { nomor: "5.6.2", bidang: "Business Support", subBidang: "Keuangan", jabatan: "JUNIOR OFFICER  KEUANGAN & ANGGARAN", jenjangJabatan: "Generalist 1-2", positionGrade: "8/9/10", formasiIdeal: null, bezetting: 0, isHeader: false },
  { nomor: "5.6.3", bidang: "Business Support", subBidang: "Keuangan", jabatan: "OFFICER  AKUNTANSI", jenjangJabatan: "Generalist 1-2", positionGrade: "11/12", formasiIdeal: 2, bezetting: 2, isHeader: false },
  { nomor: "5.6.4", bidang: "Business Support", subBidang: "Keuangan", jabatan: "JUNIOR OFFICER  AKUNTANSI", jenjangJabatan: "Generalist 1-2", positionGrade: "8/9/10", formasiIdeal: null, bezetting: 0, isHeader: false },
];
