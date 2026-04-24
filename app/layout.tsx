import { Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata = {
  title: "Smart Certification - PLN Nusantara Power",
  description: "Aplikasi pemantauan data karyawan dan sertifikasi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${geistMono.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
