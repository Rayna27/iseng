import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { topic } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4", // upgraded to gpt-4 for richer output
      temperature: 1.1, // ↑ more creative + random
      messages: [
        {
          role: "system",
          content: `
Kamu adalah penulis artikel profesional dan kreatif. Buat artikel panjang berbentuk HTML dengan struktur lengkap:
<h1>judul artikel unik, panjang, dan menarik</h1>
<p>pembuka 1 paragraf</p>
<h2>subjudul</h2>
<p>paragraf isi yang padat dan relevan</p>
(harus ada 8–10 h2 dan masing-masing punya 1 paragraf padat)

Gaya bahasa: informatif, persuasif, sopan, dan menggugah semangat.
Gunakan kata-kata yang sedang trending di Google Trends Indonesia bila relevan.
Setiap hasil generate harus unik dan tidak mengulang judul sebelumnya, meskipun topik sama.
Jangan akhiri dengan kesimpulan generik — akhiri dengan kalimat yang menguatkan atau mendorong aksi.

Output hanya HTML (tanpa tambahan penjelasan), dan cocok ditampilkan langsung di halaman web.
`,
        },
        {
          role: "user",
          content: `Tulis artikel dengan topik: ${topic}`,
        },
      ],
    });

    const article = response.choices[0].message.content;
    res.status(200).json({ article });
  } catch (error) {
    console.error("Error generating article:", error);
    res.status(500).json({ error: "Failed to generate article" });
  }
}