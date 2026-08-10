export type TableUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
};

export const sampleUsers: TableUser[] = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", status: "Active" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "User", status: "Inactive" },
  { id: 4, name: "Alice Williams", email: "alice@example.com", role: "Editor", status: "Active" },
  { id: 5, name: "Charlie Brown", email: "charlie@example.com", role: "User", status: "Active" },
  { id: 6, name: "Diana Prince", email: "diana@example.com", role: "Admin", status: "Active" },
  { id: 7, name: "Edward Norton", email: "edward@example.com", role: "User", status: "Pending" },
  { id: 8, name: "Fiona Apple", email: "fiona@example.com", role: "Editor", status: "Active" },
  { id: 9, name: "George Washington", email: "george@example.com", role: "User", status: "Active" },
  { id: 10, name: "Hannah Montana", email: "hannah@example.com", role: "User", status: "Inactive" },
  { id: 11, name: "Isaac Newton", email: "isaac@example.com", role: "Admin", status: "Active" },
  { id: 12, name: "Julia Roberts", email: "julia@example.com", role: "Editor", status: "Active" },
];

export function getStatusBadgeClass(status: string) {
  const statusMap: Record<string, string> = {
    Active: "bg-success-500 text-white border-0",
    Inactive: "bg-error-500 text-white border-0",
    Pending: "bg-warning-500 text-white border-0",
    Completed: "bg-success-500 text-white border-0",
  };
  return statusMap[status] || "bg-slate-500 text-white border-0";
}
