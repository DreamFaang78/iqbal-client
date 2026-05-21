/**
 * Helper utility to send messages via a Telegram Bot API.
 * Messages are sent as markdown to enable text formatting.
 */
export async function sendTelegramNotification(message: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.log("INFO: Telegram bot credentials not set. Console log alert:\n", message);
    return false;
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn("Telegram API responded with error: ", errorText);
      return false;
    }

    console.log("Telegram notification sent successfully.");
    return true;
  } catch (err) {
    console.error("Failed to send Telegram notification: ", err);
    return false;
  }
}
