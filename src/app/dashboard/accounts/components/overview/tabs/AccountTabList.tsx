import { TabsList, TabsTrigger } from "@/components/ui/tabs";

// TODO: Add tabList component
export default function AccountTabList() {
  return (
    <TabsList className="grid w-full grid-cols-6">
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="renders">Renders</TabsTrigger>
      <TabsTrigger value="competitions">Competitions</TabsTrigger>
      <TabsTrigger value="grades">Grades</TabsTrigger>
      <TabsTrigger value="fixtures">Fixtures</TabsTrigger>
      <TabsTrigger value="data">Data</TabsTrigger>
    </TabsList>
  );
}
