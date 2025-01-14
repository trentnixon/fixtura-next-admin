// TODO: Add Associations page

import DisplayAssociation from "./components/DisplayAssociation";

export default async function AssociationPage({
  params,
}: {
  params: { associationsID: string };
}) {
  const resolvedParams = await params;
  console.log("resolvedParams", resolvedParams);
  return <DisplayAssociation accountId={params.associationsID} />;
}
