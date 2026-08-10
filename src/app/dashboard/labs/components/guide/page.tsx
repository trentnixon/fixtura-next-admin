import { readFileSync } from "fs";
import { join } from "path";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LAB_OVERVIEW_PATH } from "../_components/categories";
import { GuideMarkdown } from "./_components/GuideMarkdown";
import GuidePageToolbar from "./_components/GuidePageToolbar";

function loadGuideMarkdown(): string {
  const path = join(
    process.cwd(),
    "src/app/dashboard/labs/components/LLM_COMPONENT_GUIDE.md"
  );
  return readFileSync(path, "utf-8");
}

export default function LLMComponentGuidePage() {
  const content = loadGuideMarkdown();

  return (
    <>
      <CreatePageTitle
        title="LLM Component Guide"
        byLine="Pattern selection and page composition"
        byLineBottom="Source of truth for building Fixtura Admin pages from lab tokens"
      />
      <PageContainer padding="none" spacing="md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={LAB_OVERVIEW_PATH}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Component Lab
          </Link>
          <GuidePageToolbar />
        </div>
        <GuideMarkdown content={content} />
      </PageContainer>
    </>
  );
}
