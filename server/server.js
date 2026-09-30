const rateLimit = require("express-rate-limit");
const path = require("path");
require("dotenv").config({
    path: path.join(__dirname, ".env")
});

const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
const mailLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: "Too many messages. Please try again later."
    }
});

app.use("/api/mail", mailLimiter);

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

const SCOPES = [
    "https://www.googleapis.com/auth/gmail.send"
];

app.get("/auth", (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
        prompt: "consent"
    });

    res.redirect(authUrl);
});

app.get("/oauth2callback", async (req, res) => {
    try {
        const { code } = req.query;

        const { tokens } = await oauth2Client.getToken(code);

        console.log("Google authorization successful.");
        console.log(tokens);

        res.send("Google authorization successful! Check the VS Code terminal.");
    } catch (error) {
        console.error("OAuth error:", error);
        res.status(500).send("Google authorization failed.");
    }
});

app.post("/api/mail", async (req, res) => {
    const { message } = req.body;

    if (!message || !message.trim()) {
        return res.status(400).json({
            success: false,
            message: "Message cannot be empty."
        });
    }

    if (message.length > 2000) {
    return res.status(400).json({
        success: false,
        message: "Message is too long."
    });
}

    try {
        oauth2Client.setCredentials({
            refresh_token: process.env.GOOGLE_REFRESH_TOKEN
        });

        const gmail = google.gmail({
            version: "v1",
            auth: oauth2Client
        });

        const emailLines = [
            "From: me",
            "To: phanlong795@gmail.com",
            "Subject: New message from my website",
            "",
            message.trim()
        ];

        const rawMessage = emailLines.join("\r\n");

        const encodedMessage = Buffer
            .from(rawMessage)
            .toString("base64url");

        await gmail.users.messages.send({
            userId: "me",
            requestBody: {
                raw: encodedMessage
            }
        });

        console.log("Email sent successfully.");

        res.json({
            success: true,
            message: "Message sent successfully."
        });

    } catch (error) {
        console.error(
            "Gmail error:",
            error.response?.data || error.message || error
        );

        res.status(500).json({
            success: false,
            message: "Failed to send message."
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});