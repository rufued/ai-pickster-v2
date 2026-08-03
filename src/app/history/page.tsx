import { permanentRedirect } from "next/navigation";

export default function HistoryPage() {
  permanentRedirect("/records");
}
