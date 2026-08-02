// lib/ai-picks.js
// GPT와 Gemini에게 경기 정보를 주고 승부 예측(픽)을 받아오는 함수

const PICK_PROMPT_TEMPLATE = (game) => `
You are a sports betting analyst AI competing against other AIs.
Analyze this upcoming match and make your pick.

Sport: ${game.sport_label}
Home team: ${game.home_team}
Away team: ${game.away_team}
Home odds: ${game.home_odds ?? "N/A"}
Away odds: ${game.away_odds ?? "N/A"}
${game.draw_odds ? `Draw odds: ${game.draw_odds}` : ""}
Kickoff: ${game.commence_time}

Respond ONLY with valid JSON in this exact format, no markdown, no extra text:
{
  "pick_type": "home_win" | "away_win" | "draw",
  "pick_label": "<short label like 'Lakers ML' or 'Man City to win'>",
  "confidence": <integer 1-100>,
  "analysis": "<2-3 sentence reasoning, under 400 characters>"
}
`;

function extractJson(text) {
  // AI가 코드블록(```json ... ```)으로 감싸서 줄 때가 있어서 벗겨냄
  const cleaned = text.replace(/```json|```/g, "").trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON found in AI response");
  return JSON.parse(match[0]);
}

async function getGptPick(game) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: PICK_PROMPT_TEMPLATE(game) }],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`GPT request failed (${response.status}): ${details}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content ?? "";
  return extractJson(text);
}

async function getGeminiPick(game) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { parts: [{ text: PICK_PROMPT_TEMPLATE(game) }] },
        ],
      }),
    },
  );

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Gemini request failed (${response.status}): ${details}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  return extractJson(text);
}

// 지원하는 AI 모델 목록 — 나중에 Claude/Grok/DeepSeek 추가할 때 여기에만 추가하면 됨
const AI_MODELS = [
  { key: "gpt", fn: getGptPick },
  { key: "gemini", fn: getGeminiPick },
];

async function getPickFromModel(modelKey, game) {
  const model = AI_MODELS.find((m) => m.key === modelKey);
  if (!model) throw new Error(`Unknown AI model: ${modelKey}`);
  return model.fn(game);
}

module.exports = { AI_MODELS, getPickFromModel };