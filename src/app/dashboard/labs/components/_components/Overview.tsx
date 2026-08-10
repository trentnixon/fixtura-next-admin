"use client";

import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import SectionWrapper from "@/components/scaffolding/containers/SectionWrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, FileText } from "lucide-react";
import Link from "next/link";
import CopyPromptTemplateButton from "./CopyPromptTemplateButton";
import {
  LAB_CATEGORY_SECTIONS,
  LAB_CATEGORIES,
  LAB_GUIDE_NAV,
  LAB_GUIDE_PATH,
  LAB_PAGE_RECIPES,
  LAB_QUICK_TOKENS,
  getCategoriesBySection,
  getCategoryById,
} from "./categories";

/**
 * Component Lab overview — aligned with LLM_COMPONENT_GUIDE.md workflow.
 */
export default function UIOverviewPage() {
  const categoryCount = LAB_CATEGORIES.length;
  const withTokens = LAB_CATEGORIES.filter((c) => c.keyTokens?.length).length;

  return (
    <>
      <CreatePageTitle
        title="Component Lab"
        byLine="Pattern library for Fixtura Admin pages"
        byLineBottom="Select lab tokens first, then compose pages — do not invent a new visual system"
      />

      <SectionWrapper spacing="lg" title="Start here">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-3">
                <div className="rounded-md bg-primary/10 p-2">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">
                    {LAB_GUIDE_NAV.label}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    How to pick containers, navigation, cards, tables, forms,
                    feedback, and status patterns before building a page.
                  </CardDescription>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <Button asChild size="sm">
                  <Link href={LAB_GUIDE_PATH}>
                    Open guide
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <CopyPromptTemplateButton />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ol className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-3">
              {[
                "Identify the page job (overview, detail, form, queue, etc.)",
                "Pick structure: containers and layouts",
                "Add navigation only when movement is needed",
                "Add data display: cards, charts, tables, or lists",
                "Use token registries in each category showcase",
                "Include loading, empty, error, and success states",
              ].map((step, index) => (
                <li key={step} className="flex gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </SectionWrapper>

      <SectionWrapper spacing="lg" title="Library at a glance">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{categoryCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Token-backed showcases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">
                {withTokens}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Page recipes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{LAB_PAGE_RECIPES.length}</div>
            </CardContent>
          </Card>
        </div>
      </SectionWrapper>

      <SectionWrapper spacing="lg" title="Quick token map">
        <SectionContainer
          title="High-value starting tokens"
          description="Copy token names into prompts or page specs — full registries live in each category's *Tokens.ts file"
        >
          <div className="flex flex-wrap gap-2">
            {LAB_QUICK_TOKENS.map((token) => (
              <Badge
                key={token}
                variant="secondary"
                className="font-mono text-xs font-normal"
              >
                {token}
              </Badge>
            ))}
          </div>
        </SectionContainer>
      </SectionWrapper>

      {LAB_CATEGORY_SECTIONS.map((section) => {
        const categories = getCategoriesBySection(section.id);
        if (categories.length === 0) return null;

        return (
          <SectionWrapper
            key={section.id}
            spacing="lg"
            title={section.label}
            description={section.description}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => {
                const Icon = category.icon;

                return (
                  <Link key={category.path} href={category.path}>
                    <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="rounded-md bg-slate-100 p-2">
                              <Icon className="h-5 w-5 text-slate-700" />
                            </div>
                            <div className="min-w-0">
                              <CardTitle className="text-base">
                                {category.label}
                              </CardTitle>
                              <CardDescription className="mt-1 text-xs">
                                {category.description}
                              </CardDescription>
                            </div>
                          </div>
                          {category.showcaseCount != null && (
                            <Badge variant="outline" className="shrink-0 text-xs">
                              {category.showcaseCount} showcases
                            </Badge>
                          )}
                        </div>
                        {category.keyTokens && category.keyTokens.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {category.keyTokens.map((token) => (
                              <Badge
                                key={token}
                                variant="secondary"
                                className="font-mono text-[10px] font-normal"
                              >
                                {token}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardHeader>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </SectionWrapper>
        );
      })}

      <SectionWrapper spacing="lg" title="Page composition recipes">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {LAB_PAGE_RECIPES.map((recipe) => (
            <Card key={recipe.title}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{recipe.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="mb-1 text-xs font-medium text-muted-foreground">
                    Likely tokens
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {recipe.tokens.map((token) => (
                      <Badge
                        key={token}
                        variant="secondary"
                        className="font-mono text-[10px] font-normal"
                      >
                        {token}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-1 text-xs font-medium text-muted-foreground">
                    Browse categories
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {recipe.categories.map((id) => {
                      const cat = getCategoryById(id);
                      if (!cat) return null;
                      return (
                        <Button key={id} variant="outline" size="sm" asChild>
                          <Link href={cat.path}>{cat.label}</Link>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper spacing="lg" title="Implementation reminders">
        <SectionContainer
          title="When building real pages"
          description="From LLM_COMPONENT_GUIDE.md — implementation rules"
        >
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>
              Prefer components from{" "}
              <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">
                @/components/ui-library
              </code>
              ,{" "}
              <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">
                @/components/scaffolding
              </code>
              , and{" "}
              <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">
                @/components/type
              </code>
            </li>
            <li>
              Use title, byline, content, and footer zones consistently inside
              containers
            </li>
            <li>
              Do not nest decorative cards without reason; keep admin surfaces
              compact
            </li>
            <li>
              Copy token names from category showcases — inspect{" "}
              <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">
                *_components/_elements/*Tokens.ts
              </code>
            </li>
          </ul>
        </SectionContainer>
      </SectionWrapper>
    </>
  );
}
