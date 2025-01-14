// TODO: Add Associations page

import DisplayAssociation from "./components/DisplayAssociation";

export default function AssociationPage({
  params,
}: {
  params: { associationsID: string };
}) {
  return (
    <>
      <DisplayAssociation accountId={params.associationsID} />
    </>
  );
}
