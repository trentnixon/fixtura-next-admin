"use client";
import DisplayRenderId from "@/app/dashboard/accounts/components/render";
import { useParams } from "next/navigation";

export default function RenderID() {
  const { renderID } = useParams();
  return renderID ? <DisplayRenderId renderID={renderID as string} /> : null;
}
