// lib/ai-picks.js
// GPT와 Gemini에게 사용 가능한 배팅 마켓을 주고 가장 자신 있는 픽을 받는다.

function marketOptions(game) {
  const options = [
    game.home_odds ? `moneyline home_win: ${game.home_team} @ ${game.home_odds}` : null,
    game.away_odds ? `moneyline away_win: ${game.away_team} @ ${game.away_odds}` : null,
    game.draw_odds ? `moneyline draw: Draw @ ${game.draw_odds}` : null,
    game.home_spread_odds && game.home_spread_point != null ? `spread home_spread: ${game.home_team} ${formatLine(game.home_spread_point)} @ ${game.home_spread_odds}` : null,
    game.away_spread_odds && game.away_spread_point != null ? `spread away_spread: ${game.away_team} ${formatLine(game.away_spread_point)} @ ${game.away_spread_odds}` : null,
    game.over_odds && game.total_point != null ? `total over: Over ${game.total_point} @ ${game.over_odds}` : null,
    game.under_odds && game.total_point != null ? `total under: Under ${game.total_point} @ ${game.under_odds}` : null,
  ];
  return options.filter(Boolean).join("\n");
}

function formatLine(value) {
  const number = Number(value);
  return number > 0 ? `+${number}` : String(number);
}

const PICK_PROMPT_TEMPLATE = (game) => `
You are a sports betting analyst AI competing against other AIs.
Analyze this upcoming match on its actual merits and make the pick you believe is the strongest bet — not necessarily the team the market favors.

Sport/game: ${game.sport}
League/tournament: ${game.sport_label}
Home team: ${game.home_team}
Away team: ${game.away_team}
Kickoff: ${game.commence_time}

Available markets (choose exactly one listed option):
${marketOptions(game)}

How to decide:
- Weigh concrete factors: starting pitcher/roster condition, head-to-head history, recent form, injuries, home/away split, schedule/rest, and any other signal relevant to this sport.
- Then compare your own assessment of each side's real chance of winning against what the listed odds imply. Odds reflect the market's (bookmaker's) view, not the truth — if your analysis shows the market has underpriced the underdog relative to their actual chances, that underdog is the better-value pick even though the favorite is statistically "safer." Do not default to the favorite just because it looks like the safer or more popular choice.
- That said, do not pick the underdog for its own sake either. Only take the value side when your analysis genuinely supports it; if the favorite truly is the stronger side, pick the favorite.
- Set "confidence" to your honest belief in how likely this specific pick is to win, based only on your analysis. It must not be inflated for favorites or deflated for underdogs by default — a well-supported underdog pick can carry high confidence, and a favorite pick with only weak justification should carry lower confidence.

Respond ONLY with valid JSON in this exact format, no markdown, no extra text:
{
  "market_type": "moneyline" | "spread" | "total",
  "pick_type": "home_win" | "away_win" | "draw" | "home_spread" | "away_spread" | "over" | "under",
  "line_value": <spread or total line number, null for moneyline>,
  "pick_label": "<short readable label like 'Dodgers ML', 'Lakers -1.5', 'Over 8.5'>",
  "confidence": <integer 1-100, your honest win probability for this pick, independent of favorite/underdog status>,
  "analysis": "<2-3 sentence reasoning that cites the concrete factors behind your pick, under 400 characters>"
}
`;

function extractJson(text) {
  // AI가 코드블록(```json ... ```)으로 감싸거나, JSON 앞뒤로 설명 문장을 덧붙여 줄 때가 있어서
  // 첫 "{"부터 중괄호 짝이 맞는 지점까지만 잘라낸다 (단순 첫/마지막 "{"~"}" 매칭은 후행 텍스트에
  // 다른 "{"/"}"가 섞이면 깨진 JSON을 만들어낼 수 있어서 balanced-brace 방식으로 바꿈).
  const cleaned = text.replace(/```json|```/gi, "").trim();
  const start = cleaned.indexOf("{");
  if (start === -1) throw new Error(`No JSON object found in AI response: ${cleaned.slice(0, 200)}`);
  let depth = 0;
  for (let i = start; i < cleaned.length; i += 1) {
    if (cleaned[i] === "{") depth += 1;
    else if (cleaned[i] === "}") {
      depth -= 1;
      if (depth === 0) {
        const candidate = cleaned.slice(start, i + 1);
        try {
          return JSON.parse(candidate);
        } catch (parseError) {
          throw new Error(`Failed to parse AI JSON response (${parseError.message}): ${candidate.slice(0, 300)}`);
        }
      }
    }
  }
  throw new Error(`No balanced JSON object found in AI response: ${cleaned.slice(0, 200)}`);
}

function normalizePick(raw, game) {
  const choices = {
    home_win: { market_type: "moneyline", line_value: null, odds: game.home_odds, label: `${game.home_team} ML` },
    away_win: { market_type: "moneyline", line_value: null, odds: game.away_odds, label: `${game.away_team} ML` },
    draw: { market_type: "moneyline", line_value: null, odds: game.draw_odds, label: "Draw" },
    home_spread: { market_type: "spread", line_value: game.home_spread_point, odds: game.home_spread_odds, label: `${game.home_team} ${formatLine(game.home_spread_point)}` },
    away_spread: { market_type: "spread", line_value: game.away_spread_point, odds: game.away_spread_odds, label: `${game.away_team} ${formatLine(game.away_spread_point)}` },
    over: { market_type: "total", line_value: game.total_point, odds: game.over_odds, label: `Over ${game.total_point}` },
    under: { market_type: "total", line_value: game.total_point, odds: game.under_odds, label: `Under ${game.total_point}` },
  };
  const pickType = String(raw?.pick_type ?? "").trim().toLowerCase();
  const choice = choices[pickType];
  if (!choice || choice.odds == null || Number(choice.odds) <= 1) throw new Error(`AI selected an unavailable market: ${JSON.stringify(raw?.pick_type ?? null)}`);
  // Some models wrap confidence as "85%" or "85/100" instead of a bare number; strip anything but digits/minus/dot.
  const confidence = Math.round(Number(String(raw?.confidence ?? "").replace(/[^0-9.-]/g, "")));
  if (!Number.isFinite(confidence) || confidence < 1 || confidence > 100) throw new Error(`AI returned invalid confidence: ${JSON.stringify(raw?.confidence ?? null)}`);
  return {
    market_type: choice.market_type,
    pick_type: pickType,
    line_value: choice.line_value == null ? null : Number(choice.line_value),
    pick_label: choice.label,
    confidence,
    analysis: String(raw.analysis ?? "").slice(0, 400),
    odds_used: Number(choice.odds),
  };
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

async function getDeepSeekPick(game) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY is not configured");

  // DeepSeek exposes an OpenAI-compatible chat completions endpoint.
  // response_format forces pure JSON output (DeepSeek supports this the same way OpenAI does,
  // as long as the word "JSON" appears in the prompt — it does, in PICK_PROMPT_TEMPLATE).
  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "user", content: PICK_PROMPT_TEMPLATE(game) }],
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`DeepSeek request failed (${response.status}): ${details}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content ?? "";
  console.log(`[ai-picks] DeepSeek raw response for game=${game.id}:`, text);
  const parsed = extractJson(text);
  console.log(`[ai-picks] DeepSeek parsed pick for game=${game.id}:`, JSON.stringify(parsed));
  return parsed;
}

async function getGeminiPick(game) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
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

// 지원하는 AI 모델 목록 — 나중에 Claude/Grok 추가할 때 여기에만 추가하면 됨
const AI_MODELS = [
  { key: "gpt", fn: getGptPick },
  { key: "gemini", fn: getGeminiPick },
  { key: "deepseek", fn: getDeepSeekPick },
];

async function getPickFromModel(modelKey, game) {
  const model = AI_MODELS.find((m) => m.key === modelKey);
  if (!model) throw new Error(`Unknown AI model: ${modelKey}`);
  return normalizePick(await model.fn(game), game);
}

module.exports = { AI_MODELS, getPickFromModel };
