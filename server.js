require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// Load API credentials from .env
const apiUrl = process.env.AZURE_API_URL;
const apiKey = process.env.AZURE_API_KEY;

// Chatbot API route
app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await axios.post(apiUrl, 
            { question: userMessage },
            {
                headers: {
                    'Ocp-Apim-Subscription-Key': "EPNO9bBoMRMOkxgf69WomUWNhDhiKTP9tVPV0gOqTGUhrtsl9HpWJQQJ99BAACYeBjFXJ3w3AAAaACOGUH0a",
                    'Content-Type': 'application/json'
                }
            }
        );

        const botResponse = response.data.answers?.[0]?.answer || "I don't have an answer for that.";
        res.json({ reply: botResponse });
    } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        res.json({ reply: "Error: Unable to process your request at the moment." });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
