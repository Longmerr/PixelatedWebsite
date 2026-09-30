require("dotenv").config({ path: "./server/.env" });

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { google } = require("googleapis");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const mailLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: "Too many messages. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false
});

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

// Use the refresh token obtained during Google authorization
oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

const gmail = google.gmail({
    version: "v1",
    auth: oauth2Client
});

app.post("/api/mail",mailLimiter, async (req, res) => {
    const { message } = req.body;

    if (!message || !message.trim()) {
        return res.status(400).json({
            success: false,
            message: "Message cannot be empty."
        });
    }

    try {
        const email = [
            "To: phanlong795@gmail.com",
            "Subject: New message from website",
            "Content-Type: text/plain; charset=utf-8",
            "",
            message.trim()
        ].join("\r\n");

        const encodedMessage = Buffer
            .from(email)
            .toString("base64url");

        await gmail.users.messages.send({
            userId: "me",
            requestBody: {
                raw: encodedMessage
            }
        });

        console.log("New message sent to Gmail.");

        res.json({
            success: true,
            message: "Message sent successfully."
        });

    } catch (error) {
        console.error("Gmail error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to send message."
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});