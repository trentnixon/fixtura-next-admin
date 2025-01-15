import { Badge } from "@/components/ui/badge";

interface StatusFlagsProps {
  flags: {
    Processing: boolean;
    Complete: boolean;
    forceRerender: boolean;
    EmailSent: boolean;
  };
}

export default function StatusFlags({ flags }: StatusFlagsProps) {
  return (
    <section>
      <div className="flex flex-row gap-2">
        <Badge
          variant="outline"
          className={`${
            flags.Processing ? "bg-yellow-500" : "bg-gray-300"
          } text-white`}>
          {flags.Processing ? "Processing" : "Not Processing"}
        </Badge>

        <Badge
          variant="outline"
          className={`${
            flags.Complete ? "bg-green-500" : "bg-red-500"
          } text-white`}>
          {flags.Complete ? "Complete" : "Not Complete"}
        </Badge>

        <Badge
          variant="outline"
          className={`${
            flags.forceRerender ? "bg-orange-500" : "bg-gray-300"
          } text-white`}>
          {flags.forceRerender ? "Force Rerender" : "No Rerender"}
        </Badge>

        <Badge
          variant="outline"
          className={`${
            flags.EmailSent ? "bg-blue-500" : "bg-gray-300"
          } text-white`}>
          {flags.EmailSent ? "Email Sent" : "Email Not Sent"}
        </Badge>
      </div>
    </section>
  );
}
