import { permanentRedirect } from "next/navigation";

export default function BattlePage() {
  permanentRedirect("/games");
}
