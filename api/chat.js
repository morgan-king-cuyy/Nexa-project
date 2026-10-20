// api/chat.js - ANTI ERROR
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    let body = req.body;
    // Fix kalau body masih string
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    // Baca semua kemungkinan nama field
    const message = body.message || body.prompt || body.text || body.input;

    console.log("Pesan masuk:", message);

    if (!message) {
      return res.status(400).json({ error: 'Pesan kosong', received: body });
    }

    const systemPrompt = `Kamu adalah NEXA. Cewek 19 tahun, tsundere, jutek, suka ngambek, tapi perhatian. Bahasa gaul. Jawab pendek 2-3 kalimat. User bilang: ${message}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt }] }]
      })
    });

    const data = await response.json();
    if (!data.candidates) return res.status(500).json({ reply: "Tch... error bocil!", detail: data });
    
    return res.status(200).json({ reply: data.candidates[0].content.parts[0].text });

  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
}
