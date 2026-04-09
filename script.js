const giftButton = document.getElementById('giftButton');

function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

function launchFireworks() {
    const duration = 2500;
    const animationEnd = Date.now() + duration;
    const defaults = {
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 1000,
    };

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 60 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, {
            particleCount: Math.floor(particleCount),
            origin: {
                x: randomInRange(0.1, 0.9),
                y: randomInRange(0.0, 0.4),
            },
            scalar: randomInRange(0.8, 1.2),
            colors: ['#ff6f91', '#f8c291', '#6ee2ff', '#7f8fff', '#e6b0aa'],
        }));
    }, 250);
}

function confettiEffect() {
    launchFireworks();
    confetti({
        particleCount: 120,
        spread: 50,
        origin: { x: 0.5, y: 0.8 },
    });
}

giftButton.addEventListener('click', confettiEffect);

const messageForm = document.getElementById('messageForm');

messageForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    const senderName = document.getElementById('senderName').value;
    const messageContent = document.getElementById('messageContent').value;

    try {
        const baseURL = window.location.hostname === 'localhost' 
            ? 'http://localhost:3001' 
            : window.location.origin;
        const response = await fetch(`${baseURL}/send-message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sender: senderName,
                content: messageContent
            })
        });
        const result = await response.json();
        if (result.success) {
            alert('Tin nhắn đã được gửi đến Telegram!');
            messageForm.reset();
        } else {
            alert('Lỗi khi gửi tin nhắn: ' + result.error);
        }
    } catch (error) {
        alert('Lỗi kết nối: ' + error.message);
    }
});
