// TODO: Add Association Basics

import { Badge } from "@/components/ui/badge";
import { Account } from "@/types";

export default function CheckBooleanStatus({ account }: { account: Account }) {
  return (
    <section>
      <div className="flex flex-row gap-1">
        <Badge
          variant="outline"
          className={`${
            account?.attributes.isActive ? "bg-green-500" : "bg-red-500"
          } text-white`}>
          {account?.attributes.isActive ? "Is Active" : "Not Active"}
        </Badge>

        <Badge
          variant="outline"
          className={`${
            account?.attributes.isSetup ? "bg-green-500" : "bg-red-500"
          } text-white`}>
          {account?.attributes.isSetup ? "Is Setup" : "Not Setup"}
        </Badge>

        <Badge
          variant="outline"
          className={`${
            account?.attributes.isUpdating ? "bg-red-500" : "bg-green-500"
          } text-white`}>
          {account?.attributes.isUpdating
            ? "Currently Updating"
            : "Not Updating"}
        </Badge>

        <Badge
          variant="outline"
          className={`${
            account?.attributes.isRightsHolder ? "bg-green-500" : "bg-red-500"
          } text-white`}>
          {account?.attributes.isRightsHolder
            ? "Is Rights Holder"
            : "Not Rights Holder"}
        </Badge>

        <Badge
          variant="outline"
          className={`${
            account?.attributes.isPermissionGiven
              ? "bg-green-500"
              : "bg-red-500"
          } text-white`}>
          {account?.attributes.isPermissionGiven
            ? "Is Permission Given"
            : "Not Permission Given"}
        </Badge>

        <Badge
          variant="outline"
          className={`${
            account?.attributes.group_assets_by ? "bg-cyan-500" : "bg-blue-500"
          } text-white`}>
          {account?.attributes.group_assets_by
            ? "Group Assets By"
            : "Not Group Assets By"}
        </Badge>

        <Badge
          variant="outline"
          className={`${
            account?.attributes.include_junior_surnames
              ? "bg-cyan-500"
              : "bg-blue-500"
          } text-white`}>
          {account?.attributes.include_junior_surnames
            ? "Include Junior Surnames"
            : "Not Include Junior Surnames"}
        </Badge>
      </div>
    </section>
  );
}
