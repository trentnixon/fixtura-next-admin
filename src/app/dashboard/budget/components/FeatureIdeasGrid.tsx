"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Idea = {
  title: string;
  points: string[]; // 1–2 key items
};

type IdeaGroup = {
  groupTitle: string;
  ideas: Idea[];
};

const GROUPS: IdeaGroup[] = [
  {
    groupTitle: "Future Enhancements",
    ideas: [
      {
        title: "Advanced Filtering",
        points: ["Custom date ranges", "Multi-account filters"],
      },
      {
        title: "Export Functionality",
        points: ["CSV/PDF exports", "Chart image downloads"],
      },
      {
        title: "Real-time Updates",
        points: ["WebSocket integration", "Live data streaming"],
      },
    ],
  },
];

export default function FeatureIdeasGrid() {
  return (
    <div className="space-y-6">
      {GROUPS.map((group) => (
        <section key={group.groupTitle}>
          <h3 className="text-base font-semibold tracking-tight mb-3">
            {group.groupTitle}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {group.ideas.map((idea) => (
              <Card key={idea.title}>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">{idea.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-1">
                  {idea.points.slice(0, 2).map((p) => (
                    <div key={p}>• {p}</div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}


