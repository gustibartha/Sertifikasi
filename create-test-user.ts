import { auth } from "./lib/auth";
import "dotenv/config";

async function run() {
    console.log("Mendaftarkan akun TEST via Better Auth...");
    try {
        const email = "admin@admin.com";
        const password = "admin12345";
        
        const user = await auth.api.signUpEmail({
            body: {
                email,
                password,
                name: "Test Admin",
            }
        });
        console.log("SUKSES! Silakan login dengan admin@admin.com / admin12345");
    } catch (e) {
        console.error("Gagal mendaftar:", e.message);
    }
}

run();
