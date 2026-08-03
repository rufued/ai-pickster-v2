import { supabaseAdmin } from "@/lib/supabase";
export async function logCronRun(jobName, status, startedAt, details = {}) {
  if (!supabaseAdmin) return;
  const { error } = await supabaseAdmin.from("cron_runs").insert({ job_name: jobName, status, started_at: startedAt instanceof Date ? startedAt.toISOString() : startedAt, finished_at: new Date().toISOString(), details });
  if (error && !error.message?.includes("cron_runs")) console.error("Failed to log cron run", error);
}
