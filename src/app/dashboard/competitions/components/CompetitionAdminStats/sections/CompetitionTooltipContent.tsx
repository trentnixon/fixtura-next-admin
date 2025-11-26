import { GanttFeature } from "@/components/ui/shadcn-io/gantt";
import { differenceInDays, differenceInWeeks, format } from "date-fns";

interface CompetitionTooltipContentProps {
    feature: GanttFeature;

}

export function CompetitionTooltipContent({ feature }: CompetitionTooltipContentProps) {
    // Calculate duration
    let durationText = "Ongoing";
    if (feature.endAt) {
        const durationDays = differenceInDays(feature.endAt, feature.startAt);
        const durationWeeks = differenceInWeeks(feature.endAt, feature.startAt);

        durationText = durationWeeks > 0
            ? `${durationWeeks} week${durationWeeks !== 1 ? 's' : ''}`
            : `${durationDays} day${durationDays !== 1 ? 's' : ''}`;
    }

    return (
        <div className="space-y-2">
            {/* Competition Name */}
            <div className="font-semibold text-foreground border-b pb-2">
                {feature.name}
            </div>

            {/* Dates */}
            <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">Start:</span>
                    <span className="font-medium">
                        {format(feature.startAt, "EEE, MMM d, yyyy")}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">End:</span>
                    <span className="font-medium">
                        {feature.endAt ? format(feature.endAt, "EEE, MMM d, yyyy") : "Ongoing"}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium text-primary">{durationText}</span>
                </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-1 border-t pt-2">
                {feature.group && typeof feature.group === 'string' && (
                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground">Association:</span>
                        <span>{feature.group}</span>
                    </div>
                )}

                {feature.gradeCount !== undefined && feature.gradeCount !== null && (
                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground">Grades:</span>
                        <span>{String(feature.gradeCount)}</span>
                    </div>
                )}

                {feature.sizeCategory !== undefined && feature.sizeCategory !== null && (
                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground">Size:</span>
                        <span className="capitalize">{String(feature.sizeCategory)}</span>
                    </div>
                )}

                {feature.season && typeof feature.season === 'string' && (
                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground">Season:</span>
                        <span>{feature.season}</span>
                    </div>
                )}

                {feature.weight !== undefined && feature.weight !== null && (
                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground">Priority:</span>
                        <span className="font-medium">{Number(feature.weight).toFixed(0)}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
