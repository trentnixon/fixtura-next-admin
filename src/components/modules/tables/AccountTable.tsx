"use client";

import { useState } from "react";
import { SectionTitle } from "@/components/type/titles";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Account } from "@/types";
import { CheckIcon, XIcon } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";

interface AccountsTableProps {
  title: string;
  accounts: Account[];
  emptyMessage: string;
}

export function AccountTable({
  title,
  accounts,
  emptyMessage,
}: AccountsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const handleNavigate = (accountId: number, type: string) => {
    router.push(`/dashboard/accounts/${type}/${accountId}`);
  };

  const lastItemInPathname = pathname.split("/").pop();

  // State for search input and filtered accounts
  const [search, setSearch] = useState("");
  const filteredAccounts = accounts.filter(account => {
    const id = account.id.toString(); // Convert ID to string for comparison
    const firstName = account.attributes.FirstName?.toLowerCase() || "";
    const deliveryAddress =
      account.attributes.DeliveryAddress?.toLowerCase() || "";
    const sport = account.attributes.Sport?.toLowerCase() || "";

    return (
      id.includes(search.toLowerCase()) ||
      firstName.includes(search.toLowerCase()) ||
      deliveryAddress.includes(search.toLowerCase()) ||
      sport.includes(search.toLowerCase())
    );
  });

  return (
    <div className="mt-8">
      <div className="bg-slate-200 rounded-lg px-4 py-2">
        <div className="flex justify-between items-center  py-2">
          <SectionTitle className="py-2 px-1">{title}</SectionTitle>
          {/* Input filter */}
          <div className="flex items-center w-1/2">
            <Input
              type="text"
              placeholder="Search accounts by ID, Name, Address, or Sport..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-white w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
            <Button
              variant="ghost"
              onClick={() => setSearch("")}
              className="ml-2 px-4 py-2 rounded-md focus:outline-none">
              <XIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4">
          {/* Table */}
          {filteredAccounts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">First Name</TableHead>
                  <TableHead className="text-center">
                    Delivery Address
                  </TableHead>
                  <TableHead className="text-center">Sport</TableHead>
                  <TableHead className="text-center">Is Setup</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts.map(account => (
                  <TableRow key={account.id}>
                    <TableCell className="text-left">
                      {account.attributes.FirstName}
                    </TableCell>
                    <TableCell className="text-center">
                      {account.attributes.DeliveryAddress}
                    </TableCell>
                    <TableCell className="text-center">
                      {account.attributes.Sport}
                    </TableCell>
                    <TableCell className="text-center flex justify-center items-center">
                      {account.attributes.isSetup ? (
                        <CheckIcon className="w-4 h-4 text-green-500" />
                      ) : (
                        <XIcon className="w-4 h-4 text-red-500" />
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        onClick={() =>
                          handleNavigate(
                            account.id,
                            lastItemInPathname || "clubs"
                          )
                        }>
                        View Account
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-500">{emptyMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}
