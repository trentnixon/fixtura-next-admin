// TODO: Add Clubs page

"use client";
import { useParams } from "next/navigation";
import DisplayClub from "./components/DisplayClub";

export default function ClubPage() {
  const { clubID } = useParams();
  return <DisplayClub accountId={clubID as string} />;
}
