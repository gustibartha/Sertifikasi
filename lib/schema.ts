import { pgTable, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

// === Domain Schema ===
export const employees = pgTable('employees', {
  nid: text('nid').primaryKey(),
  name: text('name').notNull(),
  status_pegawai: text('status_pegawai').notNull().default('Organik'), // 'Organik' | 'TAD'
  perusahaan_asal: text('perusahaan_asal'), // Khusus TAD
  jabatan: text('jabatan'),
  bidang: text('bidang'),
  sub_bidang: text('sub_bidang'),
  grade: text('grade'),
  jenjang_jabatan: text('jenjang_jabatan'),
  tanggal_jabatan: text('tanggal_jabatan'),
  tanggal_lahir: text('tanggal_lahir'), // Disimpan sebagai YYYY-MM-DD
  tanggal_pensiun: text('tanggal_pensiun'),
  jenis_kelamin: text('jenis_kelamin'), // 'L' | 'P'
  pendidikan: text('pendidikan'),
  pog: integer('pog'),
  masa_kerja: integer('masa_kerja'),
  status_aktif: text('status_aktif').default('aktif'), // 'aktif' | 'mutasi' | 'pensiun'
  email: text('email'),
  phone: text('phone'),
  keterangan: text('keterangan'),
});

export const certifications = pgTable('certifications', {
  id: text('id').primaryKey(),
  employee_nid: text('employee_nid').notNull().references(() => employees.nid),
  nama_pelatihan: text('nama_pelatihan').notNull().default(''),
  no_sertifikat: text('no_sertifikat'),
  tanggal_perolehan: text('tanggal_perolehan'),
  masa_berlaku_bulan: integer('masa_berlaku_bulan'),
  tanggal_kadaluarsa: text('tanggal_kadaluarsa').notNull().default(''),
  lembaga: text('lembaga'),
  document_url: text('document_url'),
  status_sertifikasi: text('status_sertifikasi').default('Aktif'), // 'Aktif' | 'Warning' | 'Expired'
  status_eksekusi: text('status_eksekusi').default('Hold'), // 'Dieksekusi' | 'Hold'
});

// === Better Auth Required Schema ===
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull(),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull()
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId').notNull().references(() => user.id)
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId').notNull().references(() => user.id),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull()
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt'),
  updatedAt: timestamp('updatedAt')
});
