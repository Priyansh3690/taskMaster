import fetch from "node-fetch";

export async function sendTelegramMessage(chatId, text) {
    const token = "8483371944:AAEPkBPzT_oWUhqVVVOWR_5J6OnI41ui-vk";
    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text })
    });
}