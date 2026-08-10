import { redirect } from "next/navigation";

/**
 * Legacy layout route — redirects to containers.
 */
export default function LayoutPage() {
  redirect("/dashboard/labs/components/containers");
}
