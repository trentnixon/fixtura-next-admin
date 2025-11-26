"use client";

import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { SingleFixtureDetailResponse } from "@/types/fixtureDetail";
import { Badge } from "@/components/ui/badge";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { format } from "date-fns";

interface FixtureContentProps {
  data: SingleFixtureDetailResponse;
}

export default function FixtureContent({ data }: FixtureContentProps) {
  const { fixture } = data;
  const { content } = fixture;

  const hasContent =
    content.gameContext ||
    content.basePromptInformation ||
    content.upcomingFixturePrompt;

  if (!hasContent) {
    return null;
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    try {
      return format(new Date(dateString), "PPp");
    } catch {
      return dateString;
    }
  };

  return (
    <SectionContainer
      title="Content & Prompts"
      description="AI-generated content and prompt information"
    >
      <div className="space-y-6">
        {/* Game Context */}
        {content.gameContext && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Game Context
            </div>
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {content.gameContext}
            </div>
          </div>
        )}

        {/* Base Prompt Information */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Base Prompt Information
            </div>
            <Badge
              variant={content.hasBasePrompt ? "default" : "secondary"}
              className="flex items-center gap-1"
            >
              {content.hasBasePrompt ? (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Present</span>
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3" />
                  <span>Missing</span>
                </>
              )}
            </Badge>
          </div>
          {content.basePromptInformation ? (
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {content.basePromptInformation}
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border text-sm text-gray-500 dark:text-gray-500 italic">
              No base prompt information available
            </div>
          )}
        </div>

        {/* Upcoming Fixture Prompt */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Upcoming Fixture Prompt
            </div>
            <Badge
              variant={
                content.hasUpcomingFixturePrompt ? "default" : "secondary"
              }
              className="flex items-center gap-1"
            >
              {content.hasUpcomingFixturePrompt ? (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Present</span>
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3" />
                  <span>Missing</span>
                </>
              )}
            </Badge>
          </div>
          {content.upcomingFixturePrompt ? (
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {content.upcomingFixturePrompt}
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border text-sm text-gray-500 dark:text-gray-500 italic">
              No upcoming fixture prompt available
            </div>
          )}
        </div>

        {/* Last Prompt Update */}
        {content.lastPromptUpdate && (
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
            <Clock className="w-3 h-3" />
            <span>
              Last updated: {formatDate(content.lastPromptUpdate)}
            </span>
          </div>
        )}
      </div>
    </SectionContainer>
  );
}


