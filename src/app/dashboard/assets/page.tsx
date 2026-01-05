import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { AssetTable } from "./components/AssetTable";
import { AssetTypeTable } from "./components/AssetTypeTable";
import { AssetCategoryTable } from "./components/AssetCategoryTable";
import { AudioOptionTable } from "./components/AudioOptionTable";

export default function AssetsPage() {
  return (
    <>
      <CreatePageTitle
        title="Assets"
        byLine="Manage content assets"
        byLineBottom="Track, create, edit and delete assets"
      />
      <PageContainer padding="md" spacing="lg">
        <SectionContainer
          title="Assets Management"
          description="View, create, edit, and delete content assets organized by sport."
        >
          <AssetTable />
        </SectionContainer>

        <SectionContainer
          title="Asset Meta Data"
          description="Manage types, categories, and audio configurations used across the platform."
        >
          <div className="space-y-12">
            <div>
              <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-brandPrimary-600">
                Asset Types
              </h4>
              <AssetTypeTable />
            </div>

            <div className="border-t pt-12">
              <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-brandPrimary-600">
                Asset Categories
              </h4>
              <AssetCategoryTable />
            </div>

            <div className="border-t pt-12">
              <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-brandPrimary-600">
                Audio Options
              </h4>
              <AudioOptionTable />
            </div>
          </div>
        </SectionContainer>
      </PageContainer>
    </>
  );
}
