import { permanentRedirect } from "next/navigation";

export default function LegacyComboPage() {
  permanentRedirect("/records");
}
