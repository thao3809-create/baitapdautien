const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS so fetch works even when page is loaded from file://
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Serve static files
app.use(express.static('.'));

// Telegram Bot Token - Thay thế bằng token của bạn
const TELEGRAM_BOT_TOKEN = '8202497474:AAGtJlsGUxzzj7pZNpOGVpswdlEaRFFVkLo';
// Chat ID - Thay thế bằng chat ID của bạn (lấy từ getUpdates)
const CHAT_ID = '5632302610'; // Hoặc chat ID thực tế

// Route để gửi tin nhắn
app.post('/send-message', async (req, res) => {
    const { sender, content } = req.body;
    const message = `Tin nhắn từ ${sender}: ${content}`;

    try {
        const response = await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text: message
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Error sending message:', error);
        res.json({ success: false, error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});