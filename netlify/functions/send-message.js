const axios = require('axios');

exports.handler = async (event, context) => {
    // Chỉ cho phép POST request
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ success: false, error: 'Method Not Allowed' })
        };
    }

    try {
        const { sender, content } = JSON.parse(event.body);

        // Lấy token và chat ID từ environment variables
        const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

        if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
            return {
                statusCode: 500,
                body: JSON.stringify({ 
                    success: false, 
                    error: 'Bot token hoặc chat ID chưa được cấu hình' 
                })
            };
        }

        const message = `Tin nhắn từ ${sender}: ${content}`;

        // Gửi tin nhắn tới Telegram
        const response = await axios.post(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                chat_id: TELEGRAM_CHAT_ID,
                text: message
            }
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                success: false, 
                error: error.message 
            })
        };
    }
};