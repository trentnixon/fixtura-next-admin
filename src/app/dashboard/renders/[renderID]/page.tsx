"use client";

import { useParams } from "next/navigation";
import DisplayRenderId from "./components/DisplayRenderId";

export default function RenderID() {
  const { renderID } = useParams();
  return renderID ? <DisplayRenderId renderID={renderID as string} /> : null;
}
