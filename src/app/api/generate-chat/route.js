import { generateDailyChat } from "@/lib/ai-chat";
import { logCronRun } from "@/lib/cron-log";

export const dynamic = "force-dynamic";

export async function GET(request) {
  if (request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startedAt = new Date().toISOString();
  try {
    const result = await generateDailyChat();
    await logCronRun("chat", "success", startedAt, result);
    return Response.json({ success: true, ...result, started_at: startedAt, finished_at: new Date().toISOString() });
  } catch (error) {
    await logCronRun("chat", "error", startedAt, { error: error.message });
    return Response.json({ success: false, error: error.message, started_at: startedAt, finished_at: new Date().toISOString() }, { status: 500 });
  }
}
