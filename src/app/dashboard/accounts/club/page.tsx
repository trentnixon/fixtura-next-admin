// TODO: Add Clubs page

import { ByLine } from "@/components/type/titles";
import { Title } from "@/components/type/titles";
import DisplayClubsTable from "./components/ClubsTable";
import RefreshButton from "./components/RefreshButton";

export default function ClubsPage() {
  return (
    <section className="container mx-auto px-6 py-8">
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-3 mb-2">
        <div className="border-b border-slate-200 pb-2 mb-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-0">
              <ByLine>A list of all clubs</ByLine>
              <Title>Clubs</Title>
            </div>
            <RefreshButton />
          </div>
        </div>
      </div>

      <DisplayClubsTable />
    </section>
  );
}
