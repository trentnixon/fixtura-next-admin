"use client";

import { useDownloadQuery } from "@/hooks/downloads/useDownloadsQuery";
import { useParams } from "next/navigation";
import { P } from "@/components/type/type";

export default function DisplayDownload() {
  const { downloadID } = useParams();
  const {
    data: downloadData,
    isLoading,
    isError,
    error,
  } = useDownloadQuery(downloadID as string);

  // Handle loading and error states
  if (isLoading) return <p>Loading download...</p>;
  if (isError) return <p>Error loading download: {error?.message}</p>;

  // Check if data exists and destructure safely
  if (!downloadData || !downloadData.attributes) {
    return <p>No data available for this download.</p>;
  }

  const {
    Name,
    grouping_category,
    CompletionTime,
    DisplayCost,
    downloads,
    asset,
    asset_category,
  } = downloadData.attributes;

  return (
    <div>
      <div className="mb-6">
        <h5 className="text-lg font-semibold">General Information</h5>
        <P>
          <strong>Name:</strong> {Name || "N/A"}
        </P>
        <P>
          <strong>Grouping Category:</strong> {grouping_category || "N/A"}
        </P>
        <P>
          <strong>Completion Time:</strong> {CompletionTime || "N/A"}
        </P>
        <P>
          <strong>Cost:</strong>{" "}
          {DisplayCost ? `$${DisplayCost.toFixed(2)}` : "N/A"}
        </P>
      </div>

      <div className="mb-6">
        <h5 className="text-lg font-semibold">Asset Information</h5>
        <P>
          <strong>Asset Name:</strong> {asset?.data?.attributes?.Name || "N/A"}
        </P>
        <P>
          <strong>Asset Category:</strong>{" "}
          {asset_category?.data?.attributes?.Identifier || "N/A"}
        </P>
      </div>

      <div className="mb-6">
        <h5 className="text-lg font-semibold">Links</h5>
        {Array.isArray(downloads) &&
        downloads.length > 0 &&
        downloads[0]?.url ? (
          <a
            href={downloads[0].url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline">
            Play Download
          </a>
        ) : (
          <P>No download link available.</P>
        )}
      </div>

      <div>
        <h5 className="text-lg font-semibold">Raw Data</h5>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(downloadData, null, 2)}
        </pre>
      </div>
    </div>
  );
}
