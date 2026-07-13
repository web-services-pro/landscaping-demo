// api/chat.js
export default async function handler(req, res) {
    // 1. Only allow POST requests for security
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 2. Retrieve the hidden API key from Vercel's secure environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Server configuration error: API key missing.' });
    }

    try {
        // 3. Forward the exact payload sent by your frontend to the Gemini API
        // (We use gemini-3.5-flash as the default standard model)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body) // Pass the payload directly
        });

        const data = await response.json();
        
        // 4. Send Gemini's response back to your frontend
        return res.status(response.status).json(data);

    } catch (error) {
        console.error("Backend Proxy Error:", error);
        return res.status(500).json({ error: 'Internal server error while fetching Gemini API.' });
    }
}
