// TODO: Add Associations page

import DisplayAssociation from "./components/DisplayAssociation";

export default function AssociationPage({
  params,
}: {
  params: { associationsID: string };
}) {
  // Directly use `params.associationsID` as it's not a Promise
  console.log("resolvedParams", params);

  return <DisplayAssociation accountId={params.associationsID} />;
}
