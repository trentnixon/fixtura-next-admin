// TODO: Add Clubs page

import DisplayClub from "./components/DisplayClub";

export default async function ClubPage({
  params,
}: {
  params: { clubID: string };
}) {
  const resolvedParams = await params;
  console.log("resolvedParams", resolvedParams);
  return <DisplayClub accountId={resolvedParams.clubID} />;
}
