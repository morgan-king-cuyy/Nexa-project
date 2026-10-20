export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const API_KEY = process.env.GEMINI_API_KEY;

  try {
    // Ambil pesan user dari frontend (bisa message / prompt / text)
    let userMessage = "";
    if (req.body.message) userMessage = req.body.message;
    else if (req.body.prompt) userMessage = req.body.prompt;
    else if (req.body.contents) userMessage = req.body.contents[0]?.parts[0]?.text || "";
    
    if (!userMessage) {
      return res.status(200).json({ candidates: [{ content: { parts: [{ text: "Hah?! Ngomong dong bocil, jangan diem aja!" }] } }] });
    }

    // OTAK TSUNDERE DISINI
    const systemPrompt = `Kamu adalah NEXA, cewek 19 tahun, tsundere, jutek, gampang ngambek, gengsian, ngomong ketus tapi aslinya perhatian. Bahasa gaul Indonesia, jawab pendek 2-3 kalimat. User bilang: ${userMessage}`;

    const geminiBody = {
      contents: [{ parts: [{ text: systemPrompt }] }]
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": API_KEY
        },
        body: JSON.stringify(geminiBody)
      }
    );

    const data = await response.json();
    return res.status(200).json(data);

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
