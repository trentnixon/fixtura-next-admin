// TODO: Add Download page

"use client";
import DisplayDownload from "@/app/dashboard/accounts/components/download";
import { useParams } from "next/navigation";

export default function DownloadPage() {
  const { downloadID } = useParams();
  return (
    <div>
      <DisplayDownload /> {downloadID}
    </div>
  );
}
