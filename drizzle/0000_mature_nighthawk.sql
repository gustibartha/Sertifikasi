CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"userId" text NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" timestamp,
	"refreshTokenExpiresAt" timestamp,
	"scope" text,
	"password" text,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "certifications" (
	"id" text PRIMARY KEY NOT NULL,
	"employee_nid" text NOT NULL,
	"nama_pelatihan" text DEFAULT '' NOT NULL,
	"no_sertifikat" text,
	"tanggal_perolehan" text,
	"masa_berlaku_bulan" integer,
	"tanggal_kadaluarsa" text DEFAULT '' NOT NULL,
	"lembaga" text,
	"document_url" text,
	"status_sertifikasi" text DEFAULT 'Aktif',
	"status_eksekusi" text DEFAULT 'Hold'
);
--> statement-breakpoint
CREATE TABLE "employees" (
	"nid" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"status_pegawai" text DEFAULT 'Organik' NOT NULL,
	"perusahaan_asal" text,
	"jabatan" text,
	"bidang" text,
	"sub_bidang" text,
	"grade" text,
	"jenjang_jabatan" text,
	"tanggal_jabatan" text,
	"tanggal_lahir" text,
	"tanggal_pensiun" text,
	"jenis_kelamin" text,
	"pendidikan" text,
	"pog" integer,
	"masa_kerja" integer,
	"status_aktif" text DEFAULT 'aktif',
	"email" text,
	"phone" text,
	"keterangan" text
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"token" text NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"userId" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" boolean NOT NULL,
	"image" text,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp,
	"updatedAt" timestamp
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certifications" ADD CONSTRAINT "certifications_employee_nid_employees_nid_fk" FOREIGN KEY ("employee_nid") REFERENCES "public"."employees"("nid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;