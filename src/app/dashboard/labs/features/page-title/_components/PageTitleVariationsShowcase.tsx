"use client";

import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { Button } from "@/components/ui/button";
import { ByLine, SectionTitle, Title } from "@/components/type/titles";
import ComponentRef from "@/app/dashboard/labs/_components/ComponentRef";
import { TYPE_TOKENS } from "@/app/dashboard/labs/components/type/_components/_elements/typeTokens";
import { FEATURE_TOKENS } from "./featureTokens";
import Link from "next/link";

/**
 * Page title variation prototypes built on type lab primitives.
 */
export default function PageTitleVariationsShowcase() {
  return (
    <>
      <SectionContainer
        title="CreatePageTitle"
        description="Production page header scaffold — composes type.title.byline and type.title.page"
      >
        <div className="space-y-8">
          <ElementContainer
            title="Standard"
            subtitle="Top byline, title, bottom byline — default dashboard pattern"
          >
            <CreatePageTitle
              title="Accounts"
              byLine="Sports Data"
              byLineBottom="Manage customer accounts and subscriptions"
            />
            <ComponentRef
              token={FEATURE_TOKENS.pageTitle.standard}
              note={`uses ${TYPE_TOKENS.title.byline}, ${TYPE_TOKENS.title.page}`}
            />
          </ElementContainer>

          <ElementContainer
            title="Minimal"
            subtitle="Title with a single top byline"
          >
            <CreatePageTitle title="Teams" byLine="All Teams" />
            <ComponentRef token={FEATURE_TOKENS.pageTitle.minimal} />
          </ElementContainer>

          <ElementContainer
            title="Title only"
            subtitle="Page name without bylines — use when context is obvious"
          >
            <CreatePageTitle title="Grades" byLine="" />
            <ComponentRef token={FEATURE_TOKENS.pageTitle.titleOnly} />
          </ElementContainer>

          <ElementContainer
            title="Top byline only"
            subtitle="Category or breadcrumb-style label above the title"
          >
            <CreatePageTitle
              title="Association Detail"
              byLine="Cricket • Association ID: 42"
            />
            <ComponentRef token={FEATURE_TOKENS.pageTitle.bylineTopOnly} />
          </ElementContainer>

          <ElementContainer
            title="With image"
            subtitle="Logo or avatar beside the title stack"
          >
            <CreatePageTitle
              title="Melbourne Cricket Club"
              byLine="Cricket"
              byLineBottom="Club profile"
              image="/file.svg"
            />
            <ComponentRef token={FEATURE_TOKENS.pageTitle.withImage} />
          </ElementContainer>

          <ElementContainer
            title="With actions"
            subtitle="Toolbar slot on the right — buttons, menus, triggers"
          >
            <CreatePageTitle
              title="Club Detail"
              byLine="Cricket"
              byLineBottom="Scrape and account actions"
            >
              <Button variant="secondary" size="sm">
                Refresh
              </Button>
              <Button variant="primary" size="sm">
                Run scrape
              </Button>
            </CreatePageTitle>
            <ComponentRef token={FEATURE_TOKENS.pageTitle.withActions} />
          </ElementContainer>

          <ElementContainer
            title="Loading / status"
            subtitle="Bottom byline for fetch or error state messaging"
          >
            <CreatePageTitle
              title="Association Detail"
              byLine="Loading association data..."
              byLineBottom="Please wait"
            />
            <ComponentRef token={FEATURE_TOKENS.pageTitle.loading} />
          </ElementContainer>
        </div>
      </SectionContainer>

      <SectionContainer
        title="Type primitives"
        description="Manual composition using the same tokens as CreatePageTitle"
      >
        <div className="space-y-8">
          <ElementContainer
            title="Composed stack"
            subtitle="ByLine + Title — mirrors CreatePageTitle without the scaffold wrapper"
          >
            <div className="border-b border-slate-200 pb-2 mb-2">
              <ByLine>Sports Data</ByLine>
              <Title>Accounts</Title>
              <ByLine>Manage customer accounts</ByLine>
            </div>
            <ComponentRef
              token={FEATURE_TOKENS.pageTitle.composed}
              note={`${TYPE_TOKENS.title.byline} + ${TYPE_TOKENS.title.page}`}
            />
          </ElementContainer>

          <ElementContainer
            title="Page title with section"
            subtitle="Header followed by type.title.section for in-page structure"
          >
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-2">
                <ByLine>Feature Lab</ByLine>
                <Title>Page Title Variations</Title>
              </div>
              <SectionTitle>Standard patterns</SectionTitle>
              <p className="text-sm text-muted-foreground">
                Section copy sits below the page header, matching production
                dashboard layouts.
              </p>
            </div>
            <ComponentRef
              token={FEATURE_TOKENS.pageTitle.withSection}
              note={`+ ${TYPE_TOKENS.title.section}`}
            />
          </ElementContainer>
        </div>
      </SectionContainer>

      <SectionContainer
        title="Reference"
        description="Canonical tokens live in the component and feature registries"
      >
        <p className="text-sm text-muted-foreground">
          Type primitives:{" "}
          <Link
            href="/dashboard/labs/components/type"
            className="font-medium text-slate-700 hover:underline"
          >
            Component Lab — Type
          </Link>
          . Feature tokens are defined in{" "}
          <code className="text-xs">featureTokens.ts</code> alongside this
          showcase.
        </p>
      </SectionContainer>
    </>
  );
}
