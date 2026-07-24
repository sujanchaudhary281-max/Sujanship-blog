// Gemini-backed "Ask AI" endpoint.
// Uses the REST API directly via global fetch (Node 18+), so no extra dependency.

// This key's project has 0 free-tier quota for gemini-2.0-flash; flash-lite-latest
// has working quota and is a stable alias, so it won't break on version rotation.
const GEMINI_MODEL = "gemini-flash-lite-latest";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const SYSTEM_PROMPT =
    "You are sujanship AI, a helpful assistant on a web development blog. " +
    "Answer questions about the MERN stack (MongoDB, Express, React, Node.js), " +
    "Generative AI, and web development in general. Be concise and use Markdown.";

// POST /api/ask  { prompt: string }
const ask_ai = async (req, res, next) => {
    try {
        const { prompt } = req.body || {};
        if (!prompt || !prompt.trim()) {
            return res.status(400).json({ message: "Prompt is required" });
        }
        if (prompt.length > 4000) {
            return res.status(400).json({ message: "Prompt is too long" });
        }
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ message: "AI is not configured: set GEMINI_API_KEY in .env" });
        }

        const response = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
                contents: [{ role: "user", parts: [{ text: prompt.trim() }] }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
            }),
        });

        if (!response.ok) {
            const errText = await response.text().catch(() => "");
            console.error("Gemini API error:", response.status, errText);
            // Surface rate limits distinctly so the client can tell the user to slow down.
            if (response.status === 429) {
                return res.status(429).json({ message: "AI is busy right now — please try again in a moment." });
            }
            return res.status(502).json({ message: "AI request failed" });
        }

        const data = await response.json();
        const reply = data?.candidates?.[0]?.content?.parts
            ?.map((p) => p.text)
            .filter(Boolean)
            .join("")
            .trim();

        if (!reply) {
            return res.status(502).json({ message: "AI returned an empty response" });
        }

        res.status(200).json({ reply });
    } catch (err) {
        next(err);
    }
};

module.exports = { ask_ai };
