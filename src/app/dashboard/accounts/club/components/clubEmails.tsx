"use client";
import { useGetClubEmails } from "@/hooks/accounts/useGetClubEmails";
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

export default function ClubEmails() {
  const { data, isLoading, error } = useGetClubEmails();
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
          <p className="text-gray-600">Loading club contact information...</p>
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
            No Club Contacts Found
          </h3>
          <p className="text-gray-600">
            There are no club contact details available at this time.
          </p>
        </div>
      </div>
    );
  }

  // Filter clubs based on selected filter
  const filteredClubs = data.data.filter((club) => {
    switch (filter) {
      case "approved":
        return !isEmailUnsubscribed(club.email, unsubscribedEmails);
      case "unsubscribed":
        return isEmailUnsubscribed(club.email, unsubscribedEmails);
      default:
        return true; // 'all'
    }
  });

  // Calculate statistics
  const totalClubs = data.data.length;
  const clubsWithEmail = data.data.filter(
    (club) => club.email && club.email.trim() !== ""
  ).length;
  const clubsUnsubscribed = data.data.filter((club) =>
    isEmailUnsubscribed(club.email, unsubscribedEmails)
  ).length;

  // Function to download CSV for SendGrid
  const downloadCSV = () => {
    // Helper function to validate email format
    const isValidEmail = (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    // Filter clubs that have valid email addresses and are not unsubscribed
    const validClubs = filteredClubs.filter(
      (club) =>
        club.email &&
        club.email.trim() !== "" &&
        club.email !== "No email" &&
        club.email !== "No address" &&
        isValidEmail(club.email.trim()) &&
        !isEmailUnsubscribed(club.email, unsubscribedEmails)
    );

    // Create CSV content
    const csvContent = [
      "name,email", // Header row
      ...validClubs.map((club) => `"${club.name}","${club.email}"`),
    ].join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `club-contacts-${filter}-${new Date().toISOString().split("T")[0]}.csv`
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
                Club Contact Information
              </SectionTitle>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="space-y-4">
              {" "}
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
                        Total Clubs
                      </p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {totalClubs}
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
                        {clubsWithEmail}
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
                        {clubsUnsubscribed}
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
                    All ({totalClubs})
                  </Button>
                  <Button
                    variant={filter === "approved" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("approved")}
                  >
                    Approved ({totalClubs - clubsUnsubscribed})
                  </Button>
                  <Button
                    variant={filter === "unsubscribed" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("unsubscribed")}
                  >
                    Unsubscribed ({clubsUnsubscribed})
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
                      <TableHead className="w-[200px]">Club Name</TableHead>
                      <TableHead className="w-[250px]">Email</TableHead>
                      <TableHead className="w-[150px]">Phone</TableHead>
                      <TableHead className="w-[300px]">Address</TableHead>
                      <TableHead className="w-[200px]">Website</TableHead>
                      <TableHead className="w-[100px]">ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClubs.map((club) => (
                      <TableRow key={club.id}>
                        <TableCell className="text-center">
                          {isEmailUnsubscribed(
                            club.email,
                            unsubscribedEmails
                          ) ? (
                            <X className="h-5 w-5 text-red-600" />
                          ) : (
                            <Check className="h-5 w-5 text-green-600" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {club.name}
                        </TableCell>
                        <TableCell>
                          <a
                            href={`mailto:${club.email}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {club.email}
                          </a>
                        </TableCell>
                        <TableCell>{club.phone}</TableCell>
                        <TableCell>
                          {club.address && club.address !== "No address" ? (
                            <Button variant="outline" size="sm" asChild>
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                  club.address
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
                          {club.website !== "No website" ? (
                            <Button variant="outline" size="sm" asChild>
                              <a
                                href={club.website}
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
                              href={`http://localhost:1337/admin/content-manager/collection-types/api::club.club/${club.id}`}
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
