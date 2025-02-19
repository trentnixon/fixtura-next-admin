"use client";

import { useParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import { CheckIcon, DatabaseIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useDownloadsQuery } from "@/hooks/downloads/useDownloadsQuery";

// Helper to group data
function groupBy<T>(
  items: T[],
  keyFn: (item: T) => string
): Record<string, T[]> {
  return items.reduce((result, item) => {
    const key = keyFn(item);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

export default function TableDownloads() {
  const { renderID } = useParams();
  const { strapiLocation } = useGlobalContext();

  // Fetch data
  const { data, isLoading, isError, error } = useDownloadsQuery(
    renderID as string
  );

  // UI: Loading and Error States
  if (isLoading) return <p>Loading downloads...</p>;
  if (isError) {
    return (
      <div>
        <p>Error loading downloads: {error.message}</p>
      </div>
    );
  }

  // Group downloads by `grouping_category` and then by `Asset Name`
  const groupedByCategory = groupBy(
    data || [],
    download => download.attributes.grouping_category || "Uncategorized"
  );

  return (
    <div className="p-6">
      {Object.keys(groupedByCategory).length > 0 ? (
        Object.entries(groupedByCategory).map(([category, downloads]) => {
          const groupedByAssetName = groupBy(
            downloads,
            download =>
              download.attributes.asset?.data?.attributes?.Name ||
              "Unknown Asset"
          );

          return (
            <div key={category} className="mb-8">
              <h5 className="text-lg font-bold mb-4">{category}</h5>
              {Object.entries(groupedByAssetName).map(
                ([assetName, assetDownloads]) => (
                  <div key={assetName} className="mb-6">
                    <h6 className="text-md font-semibold mb-2">{assetName}</h6>
                    <div className="bg-slate-50 rounded-lg px-4 py-2 shadow-none border ">
                      <Table className="mt-2">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-left">Name</TableHead>
                            <TableHead className="text-center">Group</TableHead>
                            <TableHead className="text-center">
                              Processed
                            </TableHead>
                            <TableHead className="text-center">
                              Errors
                            </TableHead>
                            <TableHead className="text-center">Play</TableHead>
                            <TableHead className="text-center">
                              Strapi
                            </TableHead>
                            <TableHead className="text-center">View</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {assetDownloads.map(download => (
                            <TableRow key={download.id}>
                              <TableCell className="text-left">
                                {download.attributes.Name.length > 30
                                  ? `${download.attributes.Name.substring(
                                      0,
                                      30
                                    )}...`
                                  : download.attributes.Name}
                              </TableCell>
                              <TableCell className="text-center">
                                {download.attributes.grouping_category}
                              </TableCell>

                              <TableCell className="text-center">
                                {download.attributes.hasBeenProcessed ? (
                                  <div className="flex justify-center items-center">
                                    <CheckIcon className="text-green-500 w-4 h-4" />
                                  </div>
                                ) : (
                                  <div className="flex justify-center items-center">
                                    <XIcon className="text-red-500 w-4 h-4" />
                                  </div>
                                )}
                              </TableCell>

                              <TableCell className="text-center ">
                                {download.attributes.hasError ? (
                                  <div className="flex justify-center items-center">
                                    <XIcon className="text-red-500 w-4 h-4" />
                                  </div>
                                ) : (
                                  <div className="flex justify-center items-center">
                                    <CheckIcon className="text-green-500 w-4 h-4" />
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="text-center ">
                                {download?.attributes?.downloads &&
                                Array.isArray(download.attributes.downloads) &&
                                download.attributes.downloads.length > 0 ? (
                                  <a
                                    href={download.attributes.downloads[0].url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline">
                                    Download
                                  </a>
                                ) : (
                                  "N/A"
                                )}
                              </TableCell>
                              <TableCell className="text-center">
                                <Link
                                  href={`${strapiLocation.download}${download.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer">
                                  <Button variant="outline">
                                    <DatabaseIcon size="16" />
                                  </Button>
                                </Link>
                              </TableCell>
                              <TableCell className="text-center">
                                <Link
                                  href={`/dashboard/downloads/${download.id}`}>
                                  <Button variant="outline">View</Button>
                                </Link>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )
              )}
            </div>
          );
        })
      ) : (
        <p>No downloads available.</p>
      )}
    </div>
  );
}
