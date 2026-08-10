import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { fixturaContentHubAccountDetails } from "@/types/fixturaContentHubAccountDetails";
import { Mail, MapPin } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function AccountBasics({
  account,
  holderName,
  embedded = false,
  fullHeight = false,
}: {
  account: fixturaContentHubAccountDetails;
  holderName?: string;
  embedded?: boolean;
  fullHeight?: boolean;
}) {
  const displayHolderName =
    holderName ||
    [account.FirstName, account.LastName].filter(Boolean).join(" ");

  const rows = (
    <div className="divide-y divide-slate-200">
      <DetailRow icon={<Mail className="h-4 w-4" />} label="Account holder">
        {displayHolderName || "Not provided"}
      </DetailRow>
      <DetailRow icon={<MapPin className="h-4 w-4" />} label="Delivery">
        {account.DeliveryAddress || "Not provided"}
      </DetailRow>
    </div>
  );

  if (embedded) {
    return (
      <div
        className={cn(
          "flex flex-col",
          fullHeight && "h-full min-h-full flex-1",
        )}
      >
        <div className={cn("flex flex-1 flex-col", fullHeight && "justify-center")}>
          {rows}
        </div>
      </div>
    );
  }

  return (
    <ElementContainer
      title="Account Details"
      border
      padding="none"
      className="h-full"
    >
      {rows}
    </ElementContainer>
  );
}

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-slate-50 text-slate-500">
          {icon}
        </div>
        <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
      </div>
      <div className="min-w-0 pl-11 text-sm font-medium text-slate-900 sm:max-w-[55%] sm:pl-0 sm:text-right">
        {children}
      </div>
    </div>
  );
}
