// TODO: Add Clubs page

"use client";
import { useParams } from "next/navigation";
import DisplayClub from "./components/DisplayClub";

export default function ClubPage() {
  const { accountID } = useParams();
  return <DisplayClub accountId={accountID as string} />;
}
