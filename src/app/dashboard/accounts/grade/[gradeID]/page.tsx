// /app/dashboard/accounts/club/[accountID]/render/[renderID]/[gradeID]/page.tsx
"use client";
import { useParams } from "next/navigation";

export default function DisplayGradeInRender() {
  const { gradeID } = useParams();
  return <div>Page {gradeID}</div>;
}
