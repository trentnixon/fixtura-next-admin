import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ByLine, Title } from "@/components/type/titles";

export default function MetricCard({
  title,
  value,
  icon,
  description,
  lastUpdate,
}: {
  title: string;
  value: ReactNode;
  icon: ReactNode;
  description?: string;
  lastUpdate?: string;
}) {
  return (
    <Card className="w-full shadow-none bg-slate-50 border-l-4 border-l-slate-500">
      <CardContent className="p-2">
        <CardTitle className="flex items-center justify-between w-full">
          <div className="flex flex-col">
            <Title className="m-0 p-0">{value || "N/A"} </Title>
            <ByLine>{title}</ByLine>
          </div>
          {icon}
        </CardTitle>
      </CardContent>
      <CardHeader className="p-2">
        <ByLine>
          {lastUpdate ? `Last Update: ${lastUpdate}` : description}
        </ByLine>
      </CardHeader>
    </Card>
  );
}
