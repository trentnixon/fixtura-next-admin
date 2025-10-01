"use client";
import { useGetAssociationEmails } from "@/hooks/accounts/useGetAssociationEmails";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ExternalLink, Check, X, MapPin, Download } from "lucide-react";
import {
  getUnsubscribedEmails,
  isEmailUnsubscribed,
} from "@/lib/utils/unsubscribedEmails";
import { useEffect, useState } from "react";
import { SectionTitle } from "@/components/type/titles";

export default function AssociationEmails() {
  const { data, isLoading, error } = useGetAssociationEmails();
  const [unsubscribedEmails, setUnsubscribedEmails] = useState<string[]>([]);
  const [unsubscribedLoading, setUnsubscribedLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "approved" | "unsubscribed">(
    "all"
  );

  // Fetch unsubscribed emails on component mount
  useEffect(() => {
    const fetchUnsubscribedEmails = async () => {
      try {
        const emails = await getUnsubscribedEmails();
        setUnsubscribedEmails(emails);
      } catch (error) {
        console.error("Failed to load unsubscribed emails:", error);
      } finally {
        setUnsubscribedLoading(false);
      }
    };

    fetchUnsubscribedEmails();
  }, []);

  if (isLoading || unsubscribedLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">
            Loading association contact information...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Data
          </h3>
          <p className="text-gray-600 mb-4">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📧</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Association Contacts Found
          </h3>
          <p className="text-gray-600">
            There are no association contact details available at this time.
          </p>
        </div>
      </div>
    );
  }

  // Filter associations based on selected filter
  const filteredAssociations = data.data.filter((association) => {
    switch (filter) {
      case "approved":
        return !isEmailUnsubscribed(association.email, unsubscribedEmails);
      case "unsubscribed":
        return isEmailUnsubscribed(association.email, unsubscribedEmails);
      default:
        return true; // 'all'
    }
  });

  // Calculate statistics
  const totalAssociations = data.data.length;
  const associationsWithEmail = data.data.filter(
    (association) => association.email && association.email.trim() !== ""
  ).length;
  const associationsUnsubscribed = data.data.filter((association) =>
    isEmailUnsubscribed(association.email, unsubscribedEmails)
  ).length;

  // Function to download CSV for SendGrid
  const downloadCSV = () => {
    // Helper function to validate email format
    const isValidEmail = (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    // Filter associations that have valid email addresses and are not unsubscribed
    const validAssociations = filteredAssociations.filter(
      (association) =>
        association.email &&
        association.email.trim() !== "" &&
        association.email !== "No email" &&
        association.email !== "No address" &&
        isValidEmail(association.email.trim()) &&
        !isEmailUnsubscribed(association.email, unsubscribedEmails)
    );

    // Create CSV content
    const csvContent = [
      "name,email", // Header row
      ...validAssociations.map(
        (association) => `"${association.name}","${association.email}"`
      ),
    ].join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `association-contacts-${filter}-${
        new Date().toISOString().split("T")[0]
      }.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="mt-8">
        <div className="bg-slate-200 rounded-lg px-4 py-2">
          <div className="flex justify-between items-center  py-2">
            {/* Input filter */}
            <div className="flex items-center w-1/2">
              <SectionTitle className="py-2 px-1">
                Association Contact Information
              </SectionTitle>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="space-y-4">
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          T
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">
                        Total Associations
                      </p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {totalAssociations}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-semibold text-sm">
                          E
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">
                        With Email Address
                      </p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {associationsWithEmail}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-red-600 font-semibold text-sm">
                          U
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">
                        Unsubscribed
                      </p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {associationsUnsubscribed}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter Buttons and Download */}
              <div className="flex gap-2 items-center justify-between">
                <div className="flex gap-2">
                  <Button
                    variant={filter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("all")}
                  >
                    All ({totalAssociations})
                  </Button>
                  <Button
                    variant={filter === "approved" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("approved")}
                  >
                    Approved ({totalAssociations - associationsUnsubscribed})
                  </Button>
                  <Button
                    variant={filter === "unsubscribed" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("unsubscribed")}
                  >
                    Unsubscribed ({associationsUnsubscribed})
                  </Button>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={downloadCSV}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download CSV for SendGrid
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Status</TableHead>
                      <TableHead className="w-[200px]">
                        Association Name
                      </TableHead>
                      <TableHead className="w-[250px]">Email</TableHead>
                      <TableHead className="w-[150px]">Phone</TableHead>
                      <TableHead className="w-[300px]">Address</TableHead>
                      <TableHead className="w-[200px]">Website</TableHead>
                      <TableHead className="w-[100px]">ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssociations.map((association) => (
                      <TableRow key={association.id}>
                        <TableCell className="text-center">
                          {isEmailUnsubscribed(
                            association.email,
                            unsubscribedEmails
                          ) ? (
                            <X className="h-5 w-5 text-red-600" />
                          ) : (
                            <Check className="h-5 w-5 text-green-600" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {association.name}
                        </TableCell>
                        <TableCell>
                          <a
                            href={`mailto:${association.email}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {association.email}
                          </a>
                        </TableCell>
                        <TableCell>{association.phone}</TableCell>
                        <TableCell>
                          {association.address &&
                          association.address !== "No address" ? (
                            <Button variant="outline" size="sm" asChild>
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                  association.address
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2"
                              >
                                <MapPin className="h-4 w-4" />
                                View
                              </a>
                            </Button>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {association.website !== "No website" ? (
                            <Button variant="outline" size="sm" asChild>
                              <a
                                href={association.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2"
                              >
                                <ExternalLink className="h-4 w-4" />
                                View
                              </a>
                            </Button>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={`http://localhost:1337/admin/content-manager/collection-types/api::association.association/${association.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 font-mono text-xs"
                            >
                              View on Strapi
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
