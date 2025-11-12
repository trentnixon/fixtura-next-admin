import { Badge } from "@/components/ui/badge";
import { CheckCircle, Loader2, Mail, RefreshCw } from "lucide-react";

interface StatusFlagsProps {
  flags: {
    Processing: boolean;
    Complete: boolean;
    forceRerender: boolean;
    EmailSent: boolean;
  };
}

export default function StatusFlags({ flags }: StatusFlagsProps) {
  // Conditional badge display logic
  const badges: Array<{
    label: string;
    variant: "default" | "destructive" | "outline" | "secondary";
    className: string;
    icon?: React.ReactNode;
  }> = [];

  // Complete status - always show as primary status
  if (flags.Complete) {
    badges.push({
      label: "Complete",
      variant: "outline",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: <CheckCircle className="h-3 w-3 mr-1" />,
    });
  } else {
    // Only show "Not Complete" if render exists but isn't complete
    badges.push({
      label: "Not Complete",
      variant: "outline",
      className: "bg-red-50 text-red-700 border-red-200",
    });
  }

  // Processing status - only show if processing AND not complete
  // (if complete, we don't need to show processing status)
  if (flags.Processing && !flags.Complete) {
    badges.push({
      label: "Processing",
      variant: "outline",
      className: "bg-yellow-50 text-yellow-700 border-yellow-200",
      icon: <Loader2 className="h-3 w-3 mr-1" />,
    });
  }

  // Force Rerender - only show if true (action flag)
  if (flags.forceRerender) {
    badges.push({
      label: "Force Rerender",
      variant: "outline",
      className: "bg-orange-50 text-orange-700 border-orange-200",
      icon: <RefreshCw className="h-3 w-3 mr-1" />,
    });
  }

  // Email Sent - only show if true (positive action)
  if (flags.EmailSent) {
    badges.push({
      label: "Email Sent",
      variant: "outline",
      className: "bg-blue-50 text-blue-700 border-blue-200",
      icon: <Mail className="h-3 w-3 mr-1" />,
    });
  }

  // Don't render if no badges to show
  if (badges.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 justify-start">
      {badges.map((badge, index) => (
        <Badge key={index} variant={badge.variant} className={badge.className}>
          {badge.icon}
          {badge.label}
        </Badge>
      ))}
    </div>
  );
}
