import { redirect } from "next/navigation";

/** Legacy aggregate route — use type, colors, icons, and layouts categories instead. */
export default function FoundationPage() {
  redirect("/dashboard/labs/components/type");
}
