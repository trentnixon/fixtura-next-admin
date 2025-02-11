import { Title } from "@/components/type/titles";
import { ByLine } from "@/components/type/titles";
import SearchForTeam from "./components/searchForTeam";

// TODO: Add teams page
export default function TeamsPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-3 mb-2">
        <div className="border-b border-slate-200 pb-2 mb-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-0">
              <ByLine>Teams</ByLine>
              <Title>All Teams</Title>
            </div>
          </div>
        </div>
        <SearchForTeam />
      </div>
    </div>
  );
}
