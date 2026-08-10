"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Badge } from "@/components/ui/badge";
import { SubsectionTitle } from "@/components/type/titles";
import { Clock } from "lucide-react";
import ComponentRef from "./ComponentRef";
import { LIST_TOKENS } from "./listTokens";
import {
  sampleDescriptionItems,
  sampleNotifications,
  sampleTimelineEvents,
} from "./listSampleData";

/**
 * Feed list showcase — timeline, description, and notification patterns
 */
export default function FeedListsShowcase() {
  return (
    <SectionContainer
      title="Feed & Meta Lists"
      description="Timeline activity, description lists, and notifications"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Timeline</SubsectionTitle>
            <span className="text-xs text-muted-foreground">vertical · connecting line</span>
          </div>
          <ul className="space-y-4 relative">
            {sampleTimelineEvents.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={item.label} className="relative flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`p-2 rounded-full bg-muted ${item.color}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    {index < sampleTimelineEvents.length - 1 ? (
                      <div className="w-0.5 h-full bg-slate-200 mt-2" />
                    ) : null}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="font-medium text-sm">{item.label}</div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.time}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <ComponentRef token={LIST_TOKENS.timeline} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Rich Description</SubsectionTitle>
            <span className="text-xs text-muted-foreground">dl · dt · dd · Badge</span>
          </div>
          <dl className="space-y-4">
            {sampleDescriptionItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.term}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <dt className="font-semibold text-sm w-32 flex-shrink-0 flex items-center gap-2">
                    {Icon ? (
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    ) : null}
                    {item.term}:
                  </dt>
                  <dd className="flex-1 flex items-center gap-2">
                    {item.badge ? (
                      <Badge
                        className={
                          item.badge === "success"
                            ? "bg-success-500 text-white border-0"
                            : "bg-brandPrimary-600 text-white border-0"
                        }
                      >
                        {item.value}
                      </Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">{item.value}</span>
                    )}
                  </dd>
                </div>
              );
            })}
          </dl>
          <ComponentRef token={LIST_TOKENS.description} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Notifications</SubsectionTitle>
            <span className="text-xs text-muted-foreground">read · unread states</span>
          </div>
          <ul className="space-y-2">
            {sampleNotifications.map((notif) => {
              const Icon = notif.icon;
              return (
                <li
                  key={notif.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                    notif.unread
                      ? "border-brandPrimary-200 bg-brandPrimary-50/50"
                      : "border-slate-200 hover:bg-muted/50"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      notif.unread
                        ? "bg-brandPrimary-100 text-brandPrimary-700"
                        : "bg-muted"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-sm ${notif.unread ? "font-semibold" : ""}`}
                      >
                        {notif.label}
                      </span>
                      {notif.unread ? (
                        <span className="h-2 w-2 rounded-full bg-brandPrimary-600 flex-shrink-0" />
                      ) : null}
                    </div>
                    <span className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {notif.time}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
          <ComponentRef token={LIST_TOKENS.notification} />
        </div>
      </div>
    </SectionContainer>
  );
}
