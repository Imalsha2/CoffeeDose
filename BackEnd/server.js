
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());``````````````````````
app.use(express.json());

// Twilio WhatsApp API setup (demo)
// You need to set these environment variables with your Twilio credentials
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_FROM = 'whatsapp:+14155238886'; // Twilio sandbox number
const WHATSAPP_TO = 'whatsapp:+94769264200'; // Owner's WhatsApp number
let twilioClient = null;
if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
    twilioClient = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
}

// Contact form endpoint
app.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;
    // ...existing code...
    console.log('Contact form submitted:', { name, email, message });

    // Send WhatsApp message to owner
    if (twilioClient) {
        try {
            const text = `New Contact Message\nName: ${name}\nEmail: ${email}\nMessage: ${message}`;
            await twilioClient.messages.create({
                from: TWILIO_WHATSAPP_FROM,
                to: WHATSAPP_TO,
                body: text
            });
            console.log('WhatsApp message sent to owner');
        } catch (err) {
            console.error('WhatsApp send error:', err.message);
        }
    } else {
        console.log('Twilio not configured, WhatsApp not sent');
    }
    res.json({ success: true, message: 'Contact form received!' });
});

app.get('/', (req, res) => {
    res.send('CoffeeDose.lk Backend Running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
