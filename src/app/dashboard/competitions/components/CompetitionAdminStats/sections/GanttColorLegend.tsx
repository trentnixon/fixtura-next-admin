export function GanttColorLegend() {
    return (
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="font-medium">Priority:</span>
            <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded border" style={{ backgroundColor: "rgba(34, 197, 94, 0.3)", borderColor: "rgba(34, 197, 94, 0.5)" }} />
                <span>High (Top 25%)</span>
            </div>
            <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded border" style={{ backgroundColor: "rgba(234, 179, 8, 0.3)", borderColor: "rgba(234, 179, 8, 0.5)" }} />
                <span>Med-High</span>
            </div>
            <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded border" style={{ backgroundColor: "rgba(249, 115, 22, 0.3)", borderColor: "rgba(249, 115, 22, 0.5)" }} />
                <span>Medium</span>
            </div>
            <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded border" style={{ backgroundColor: "rgba(148, 163, 184, 0.3)", borderColor: "rgba(148, 163, 184, 0.4)" }} />
                <span>Low (Bottom 25%)</span>
            </div>
        </div>
    );
}
