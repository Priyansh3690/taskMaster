import cron from "node-cron";
import { sendTelegramMessage } from '../services/TelegramAutoMessageService.js';
import { GetAllUserIDToSendNoficYesterDayTaskNotCompleted, StoreMessageToDB } from '../models/taskModel.js';

async function SendNotficTouser() {
    const userInfo = await GetAllUserIDToSendNoficYesterDayTaskNotCompleted();
    if (userInfo.isRows) {
        for (const Element of userInfo.rows) {
            let text = `⏰ Reminder: Your task "${Element.task}" is still incomplete from yesterday. Please take action today!`;
            await StoreMessageToDB(Element.uid, Element.taskID, text);
            await sendTelegramMessage(Element.chatid, text);
        };
        console.log("ok Message Done....");
    }
    else {
        console.log("no...");
        return;
    }
}

cron.schedule("0 7 * * *", SendNotficTouser, {
    scheduled: true,
    timezone: "Asia/Kolkata", 
});

export { SendNotficTouser };