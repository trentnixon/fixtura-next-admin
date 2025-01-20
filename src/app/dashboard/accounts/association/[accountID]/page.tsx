"use client";
// TODO: Add Associations page

import { useParams } from "next/navigation";
import DisplayAssociation from "./components/DisplayAssociation";

export default function AssociationPage() {
  // Directly use `params.associationsID` as it's not a Promise
  const { accountID } = useParams();

  return <DisplayAssociation accountId={accountID as string} />;
}
