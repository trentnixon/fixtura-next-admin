// TODO: Add Download page

"use client";
import { useParams } from "next/navigation";

export default function DownloadPage() {
  const { downloadID } = useParams();
  return <div>Download Page {downloadID}</div>;
}
