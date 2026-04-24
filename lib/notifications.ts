import { Resend } from 'resend';

// Gunakan API Key dari environment variable
const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

/**
 * Mengirim notifikasi email menggunakan Resend
 */
export async function sendEmailNotification(to: string, subject: string, message: string) {
  if (!to) return { success: false, error: "Email tujuan tidak ada" };
  
  try {
    // Jika menggunakan domain dummy, mungkin perlu verifikasi domain di Resend
    const { data, error } = await resend.emails.send({
      from: 'SMART SDM <onboarding@resend.dev>', // Ubah ke email resmi setelah domain diverifikasi
      to: [to],
      subject: subject,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #0066cc;">Notifikasi SMART SDM</h2>
          <p>${message}</p>
          <hr />
          <p style="font-size: 12px; color: #888;">Ini adalah pesan otomatis, mohon tidak membalas email ini.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
      return { success: false, error };
    }

    return { success: true, id: data?.id };
  } catch (error: any) {
    console.error('Exception sending email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Mengirim notifikasi WhatsApp (Simulasi/Fonnte)
 */
export async function sendWhatsAppNotification(phone: string, message: string) {
  if (!phone) return { success: false, error: "Nomor telepon tidak ada" };

  try {
    // Simulasi integrasi Fonnte / WATS
    // const response = await fetch('https://api.fonnte.com/send', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': process.env.FONNTE_TOKEN || '',
    //   },
    //   body: JSON.stringify({
    //     target: phone,
    //     message: message,
    //   })
    // });

    console.log(`[WA SIMULATION] Mengirim ke ${phone}: ${message}`);
    
    // Anggap berhasil untuk simulasi
    return { success: true };
  } catch (error: any) {
    console.error('Exception sending WA:', error);
    return { success: false, error: error.message };
  }
}
