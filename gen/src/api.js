
const API_BASE = "https://gen-ai-rxym.onrender.com";

export async function generateAd(prompt, tone) {
  const res = await fetch(`${API_BASE}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      tone,
      quality: "hd"   
    })
  });

  if (!res.ok) throw new Error("API failed");
  return res.json();
}