// TODO: Add Association Basics

import { Badge } from "@/components/ui/badge";
import { fixturaContentHubAccountDetails } from "@/types/fixturaContentHubAccountDetails";

export default function CheckBooleanStatus({
  titleProps,
}: {
  titleProps: fixturaContentHubAccountDetails;
}) {
  const {
    isActive,
    isSetup,
    isRightsHolder,
    isPermissionGiven,
    group_assets_by,
    include_junior_surnames,
    isUpdating,
  } = titleProps;
  return (
    <section>
      <div className="flex flex-row gap-1 justify-end">
        <Badge
          variant="outline"
          className={`${isActive ? "bg-green-500" : "bg-red-500"} text-white`}>
          {isActive ? "Is Active" : "Not Active"}
        </Badge>

        <Badge
          variant="outline"
          className={`${isSetup ? "bg-green-500" : "bg-red-500"} text-white`}>
          {isSetup ? "Is Setup" : "Not Setup"}
        </Badge>

        <Badge
          variant="outline"
          className={`${
            isUpdating ? "bg-red-500" : "bg-green-500"
          } text-white`}>
          {isUpdating ? "Currently Updating" : "Not Updating"}
        </Badge>

        <Badge
          variant="outline"
          className={`${
            isRightsHolder ? "bg-green-500" : "bg-red-500"
          } text-white`}>
          {isRightsHolder ? "Is Rights Holder" : "Not Rights Holder"}
        </Badge>

        <Badge
          variant="outline"
          className={`${
            isPermissionGiven ? "bg-green-500" : "bg-red-500"
          } text-white`}>
          {isPermissionGiven ? "Is Permission Given" : "Not Permission Given"}
        </Badge>

        <Badge
          variant="outline"
          className={`${
            group_assets_by ? "bg-cyan-500" : "bg-blue-500"
          } text-white`}>
          {group_assets_by ? "Group Assets By" : "Not Group Assets By"}
        </Badge>

        <Badge
          variant="outline"
          className={`${
            include_junior_surnames ? "bg-cyan-500" : "bg-blue-500"
          } text-white`}>
          {include_junior_surnames
            ? "Include Junior Surnames"
            : "Not Include Junior Surnames"}
        </Badge>
      </div>
    </section>
  );
}
