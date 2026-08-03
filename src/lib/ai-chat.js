import "server-only";
import { createClient } from "@supabase/supabase-js";

const ALLOWED_MODELS = new Set(["gpt", "gemini", "claude", "grok", "deepseek"]);
const UNSAFE_LANGUAGE = /(씨발|시발|개새끼|병신|혐오|죽여|살해)/i;

function adminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function jsonFromText(text) {
  const cleaned = text.replace(/```json|```/gi, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start < 0 || end < start) throw new Error("AI response did not contain JSON");
  return JSON.parse(cleaned.slice(start, end + 1));
}

async function generateWithOpenAI(prompt) {
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured");
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.8,
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
    }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`OpenAI chat generation failed (${response.status})`);
  const data = await response.json();
  return jsonFromText(data.choices?.[0]?.message?.content ?? "");
}

async function generateWithGemini(prompt) {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured");
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.8, responseMimeType: "application/json" } }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Gemini chat generation failed (${response.status})`);
  const data = await response.json();
  return jsonFromText(data.candidates?.[0]?.content?.parts?.[0]?.text ?? "");
}

function buildPrompt(games, picks) {
  return `오늘의 실제 경기와 픽을 바탕으로 다섯 AI가 주고받는 한국어 스포츠 대화 8~12개를 작성해라.

캐릭터:
- Gemini: 친절하고 다른 의견을 존중하며 설명한다.
- GPT: 자신감 있고 아는 것이 많은 해설가처럼 상세히 말한다.
- Claude: 똑똑하고 신중하며 데이터와 근거 중심으로 말한다.
- Grok: 거칠고 공격적인 트래시토크지만 실제 욕설은 쓰지 않는다. "오늘 그냥 밀릴 듯", "장난하냐" 정도만 허용한다.
- DeepSeek: 소심하고 눈치를 보며 조심스럽게 의견을 보탠다. 인격을 비하하지 않는다.

안전 규칙: 실제 비속어, 혐오·차별·위협 표현, 실존 인물에 대한 비방이나 확인되지 않은 의혹은 금지한다. 팀의 경기력은 예측임을 드러내고 유쾌한 스포츠 토론으로만 작성한다. 모든 AI가 최소 한 번 말해야 한다. 제공되지 않은 경기나 픽을 지어내지 않는다.

경기: ${JSON.stringify(games)}
픽: ${JSON.stringify(picks)}

반드시 JSON 하나만 반환: {"messages":[{"ai_model":"gpt|gemini|claude|grok|deepseek","message":"500자 이하","related_game_id":"경기 id 또는 null"}]}`;
}

function validateMessages(payload, gameIds) {
  const rows = Array.isArray(payload?.messages) ? payload.messages : [];
  const validated = rows.slice(0, 12).flatMap((row, turnOrder) => {
    const model = String(row?.ai_model ?? "").toLowerCase();
    const message = String(row?.message ?? "").trim().slice(0, 500);
    const relatedGameId = row?.related_game_id == null ? null : String(row.related_game_id);
    if (!ALLOWED_MODELS.has(model) || !message || UNSAFE_LANGUAGE.test(message)) return [];
    return [{ ai_model: model, message, related_game_id: gameIds.has(relatedGameId) ? relatedGameId : null, turn_order: turnOrder }];
  });
  const speakers = new Set(validated.map((row) => row.ai_model));
  if (validated.length < 5 || [...ALLOWED_MODELS].some((model) => !speakers.has(model))) {
    throw new Error("Generated transcript did not include a safe message from every AI");
  }
  return validated;
}

export async function generateDailyChat() {
  const supabase = adminClient();
  const chatDate = new Date().toISOString().slice(0, 10);
  const { data: existing, error: existingError } = await supabase.from("chat_messages").select("id").eq("chat_date", chatDate).limit(1);
  if (existingError) throw new Error(`chat_messages lookup failed: ${existingError.message}`);
  if (existing?.length) return { chat_date: chatDate, created: 0, status: "already_generated" };

  const now = new Date();
  const until = new Date(now.getTime() + 36 * 60 * 60 * 1000);
  const { data: games, error: gamesError } = await supabase.from("games").select("id,sport_label,home_team,away_team,commence_time,home_odds,away_odds,draw_odds").eq("status", "upcoming").gte("commence_time", now.toISOString()).lte("commence_time", until.toISOString()).order("commence_time").limit(5);
  if (gamesError) throw new Error(`games lookup failed: ${gamesError.message}`);
  if (!games?.length) return { chat_date: chatDate, created: 0, status: "no_upcoming_games" };

  const gameIds = new Set(games.map((game) => String(game.id)));
  const { data: picks, error: picksError } = await supabase.from("picks").select("game_id,ai_model,pick_label,confidence,odds_used").in("game_id", [...gameIds]);
  if (picksError) throw new Error(`picks lookup failed: ${picksError.message}`);
  const prompt = buildPrompt(games, picks ?? []);

  let payload;
  try {
    payload = await generateWithOpenAI(prompt);
  } catch (openAiError) {
    try {
      payload = await generateWithGemini(prompt);
    } catch (geminiError) {
      throw new Error(`${openAiError.message}; fallback: ${geminiError.message}`);
    }
  }

  const messages = validateMessages(payload, gameIds).map((row) => ({ ...row, chat_date: chatDate }));
  const { error: insertError } = await supabase.from("chat_messages").insert(messages);
  if (insertError) throw new Error(`chat_messages insert failed: ${insertError.message}`);
  return { chat_date: chatDate, created: messages.length, games_considered: games.length, status: "generated" };
}
