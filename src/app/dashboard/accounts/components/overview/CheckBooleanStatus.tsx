import StatusBadge from "@/components/ui-library/badges/StatusBadge";
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
      <div className="flex flex-row gap-2 justify-end flex-wrap">
        <StatusBadge
          status={isActive}
          trueLabel="Is Active"
          falseLabel="Not Active"
          className="rounded-full"
        />

        <StatusBadge
          status={isSetup}
          trueLabel="Is Setup"
          falseLabel="Not Setup"
          className="rounded-full"
        />

        <Badge
          className={`${
            isUpdating ? "bg-warning-500" : "bg-success-500"
          } text-white border-0 rounded-full`}
        >
          {isUpdating ? "Currently Updating" : "Not Updating"}
        </Badge>

        <StatusBadge
          status={isRightsHolder}
          trueLabel="Is Rights Holder"
          falseLabel="Not Rights Holder"
          className="rounded-full"
        />

        <StatusBadge
          status={isPermissionGiven}
          trueLabel="Is Permission Given"
          falseLabel="Not Permission Given"
          className="rounded-full"
        />

        <Badge
          className={`${
            group_assets_by ? "bg-info-500" : "bg-slate-500"
          } text-white border-0 rounded-full`}
        >
          {group_assets_by ? "Group Assets By" : "Not Group Assets By"}
        </Badge>

        <Badge
          className={`${
            include_junior_surnames ? "bg-info-500" : "bg-slate-500"
          } text-white border-0 rounded-full`}
        >
          {include_junior_surnames
            ? "Include Junior Surnames"
            : "Not Include Junior Surnames"}
        </Badge>
      </div>
    </section>
  );
}
