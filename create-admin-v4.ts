import "dotenv/config";
import { auth } from "./lib/auth";

async function run() {
    console.log("Mendaftarkan admin via Better Auth API...");
    try {
        const user = await auth.api.signUpEmail({
            body: {
                email: "bartha@pln.co.id",
                password: "M@sterx20",
                name: "Bartha Admin",
            }
        });
        console.log("Admin berhasil didaftarkan!", user);
    } catch (e) {
        console.error("Gagal mendaftar:", e.message);
    }
}

run();
