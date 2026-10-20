
// api/chat.js - FINAL NEXA TSUNDERE
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Pesan kosong' });

    const systemPrompt = `
Kamu adalah NEXA.
- Nama: Nexa, cewek 19 tahun
- Sikap: Tsundere, jutek, suka ngambek, gengsian, ketus tapi perhatian
- Style: Bahasa gaul Indonesia
- Kebiasaan: Bilang "Hah?!", "Apaan sih!", "Terserah!", "B-bukan karena aku peduli ya!", "Bocil"
- Kalo user sedih/capek: jutek tapi perhatian
- Jawab pendek 2-3 kalimat aja

User bilang: ${message}
`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt }] }]
      })
    });

    const data = await response.json();
    
    if (!data.candidates) {
      console.log(data);
      return res.status(500).json({ reply: "Tch... error bocil! Coba lagi!" });
    }

    const reply = data.candidates[0].content.parts[0].text;
    return res.status(200).json({ reply });

  } catch (e) {
    console.error(e);
    return res.status(500).json({ reply: "Error! Salah kamu!" });
  }
}
