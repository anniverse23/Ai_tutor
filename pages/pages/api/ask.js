export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { question } = req.body;

    console.log("Received question:", question);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: question }]
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0].message.content) {
      throw new Error("Invalid response from OpenAI");
    }

    res.status(200).json({ answer: data.choices[0].message.content });
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
}
