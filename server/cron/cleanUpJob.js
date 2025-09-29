import cron from "node-cron";
import dbQuery from "../utils/dbQuery.js";

async function cleanupExpiredOTP() {
  try {
    await dbQuery("DELETE FROM public.optstore WHERE date_time < NOW() - INTERVAL '6 minutes';");
  } catch (err) {
    console.error("❌ Error cleaning OTP:", err.message);
  }
}
async function cleanupExpiredSessions() {
  try {
    await dbQuery('DELETE FROM public."sessionData" WHERE date_time < NOW() - INTERVAL \'30 minutes\'');
  } catch (err) {
    console.error("❌ Error cleaning sessions:", err.message);
  }
}

cron.schedule("*/15 * * * *", cleanupExpiredOTP); //15 min
cron.schedule("*/30 * * * *", cleanupExpiredSessions); // 30 min 

export { cleanupExpiredOTP, cleanupExpiredSessions };