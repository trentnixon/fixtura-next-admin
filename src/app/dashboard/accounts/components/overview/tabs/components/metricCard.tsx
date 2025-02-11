import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ByLine, Title } from "@/components/type/titles";

interface MetricCardProps {
  title: string;
  value: ReactNode;
  icon: ReactNode;
  description?: string;
  lastUpdate?: string;
  action?: ReactNode; // Optional prop to render additional component, e.g., a button
}

export default function MetricCard({
  title,
  value,
  icon,
  description,
  lastUpdate,
  action,
}: MetricCardProps) {
  return (
    <Card className="w-full shadow-none bg-slate-50 border-b-4 border-b-slate-500 rounded-md">
      <CardContent className="p-2">
        <CardTitle className="flex items-center justify-between w-full">
          <div className="flex flex-col">
            <Title className="m-0 p-0">{value || "N/A"}</Title>
            <ByLine>{title}</ByLine>
          </div>
          {icon}
        </CardTitle>
        <ByLine>{lastUpdate ? `${lastUpdate}` : description}</ByLine>
        {/* Conditionally render the action component if provided */}
      </CardContent>
      <CardHeader className="p-2">
        {action && (
          <div className="align-right justify-end flex flex-row">{action}</div>
        )}
      </CardHeader>
    </Card>
  );
}
