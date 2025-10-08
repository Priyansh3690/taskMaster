import { SendNotficTouser } from "../server/cron/SendNotifiTotelegram.js"; // adjust path as needed

export default async function handler(req, res) {
  try {
    await SendNotficTouser(); // your function to send yesterday’s task notifications
    res.status(200).json({ success: true, message: "Reminder sent successfully" });
  } catch (err) {
    console.error("Send Reminder Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}