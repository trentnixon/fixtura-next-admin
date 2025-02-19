// TODO: Add Download page

import DisplayDownload from "./components";
import CreatePage from "@/components/scaffolding/containers/createPage";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";

export default function DownloadPage() {
  return (
    <CreatePage>
      <CreatePageTitle title="Download Details" byLine="Single Download" />
      <DisplayDownload />
    </CreatePage>
  );
}
