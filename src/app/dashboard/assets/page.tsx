import {
  AudioLines,
  Database,
  FileStack,
  Home,
  Library,
  Tags,
} from "lucide-react";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssetTable } from "./components/AssetTable";
import { AssetTypeTable } from "./components/AssetTypeTable";
import { AssetCategoryTable } from "./components/AssetCategoryTable";
import { AudioOptionTable } from "./components/AudioOptionTable";

const assetTabs = [
  {
    value: "library",
    label: "Library",
    icon: Library,
  },
  {
    value: "metadata",
    label: "Metadata",
    icon: Database,
  },
];

const metadataSections = [
  {
    title: "Asset Types",
    description: "Template-level groupings used to connect assets to renders.",
    icon: FileStack,
    content: <AssetTypeTable />,
  },
  {
    title: "Asset Categories",
    description:
      "Reusable category labels and identifiers for asset discovery.",
    icon: Tags,
    content: <AssetCategoryTable />,
  },
  {
    title: "Audio Options",
    description: "Audio records, composition ids, and playable source files.",
    icon: AudioLines,
    content: <AudioOptionTable />,
  },
];

export default function AssetsPage() {
  return (
    <>
      <CreatePageTitle
        title="Assets"
        byLine="Asset library and render metadata"
        byLineBottom="Manage sport-specific assets, categories, types, and audio options"
      />
      <PageContainer padding="xs" spacing="lg">
        <SectionContainer
          title="Asset Workspace"
          description="Route context and operational scope for asset management."
          variant="compact"
          contentClassName="space-y-4"
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      className="flex items-center gap-1"
                      href="/dashboard"
                    >
                      <Home className="h-3.5 w-3.5" />
                      Dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Assets</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <div>
                <h2 className="text-lg font-semibold leading-tight text-slate-950">
                  Asset operations workspace
                </h2>
                <p className="text-sm text-muted-foreground">
                  Review the media assets that feed renders and maintain the
                  metadata that keeps templates searchable.
                </p>
              </div>
            </div>
            <Badge variant="outline" className="w-fit bg-slate-50">
              Content assets
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-2 border-t border-slate-200 pt-3 text-sm sm:grid-cols-3">
            <WorkspaceStatus label="Primary view" value="Asset library" />
            <WorkspaceStatus label="Default sport" value="Cricket" />
            <WorkspaceStatus
              label="Metadata"
              value="Types, categories, audio"
            />
          </div>
        </SectionContainer>

        <Tabs defaultValue="library" className="w-full min-w-0 max-w-full">
          <TabsList className="h-auto w-full flex-wrap justify-start rounded-md bg-slate-100 p-1 lg:w-auto">
            {assetTabs.map((tab) => {
              const Icon = tab.icon;

              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="min-h-10 gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="library" className="mt-6">
            <SectionContainer
              title="Asset Library"
              description="Search, filter, create, edit, and remove render assets by sport."
            >
              <AssetTable />
            </SectionContainer>
          </TabsContent>

          <TabsContent value="metadata" className="mt-6 space-y-6">
            {metadataSections.map((section) => {
              const Icon = section.icon;

              return (
                <SectionContainer
                  key={section.title}
                  title={section.title}
                  description={section.description}
                  action={
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-100 text-slate-600">
                      <Icon className="h-4 w-4" />
                    </div>
                  }
                >
                  {section.content}
                </SectionContainer>
              );
            })}
          </TabsContent>
        </Tabs>
      </PageContainer>
    </>
  );
}

function WorkspaceStatus({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-slate-50 px-3 py-2">
      <div className="text-xs font-medium uppercase text-slate-500">
        {label}
      </div>
      <div className="mt-1 truncate font-semibold text-slate-900">{value}</div>
    </div>
  );
}
